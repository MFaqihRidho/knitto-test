import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { loadServerTodos } from "@/lib/load-server-todos";
import {
    useCreateTodoMutation,
    useGetTodosQuery,
    Todo,
} from "@/api/todosApi.slice";
import { Inter } from "next/font/google";
import ToastWrapper from "@/components/ToastWrapper";
import FormAddTodo from "@/components/FormAddTodo";
import AddButton from "@/components/AddButton";
import InputText from "@/components/InputText";

const inter = Inter({ subsets: ["latin"] });

function Home({ serverTodos }: { serverTodos: Todo[] }) {
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [successToast, setSuccessToast] = useState<string[]>([]);
    const [errorToast, setErrorToast] = useState<string[]>([]);
    const {
        isLoading,
        error,
        data: apiTodos,
        isFetching,
    } = useGetTodosQuery({ page, limit });
    const [todoList, setTodoList] = useState<Todo[]>(
        apiTodos || serverTodos || []
    );

    useEffect(() => {
        if (apiTodos) {
            setIsClient(true);
            setTodoList(apiTodos);
        } else {
            setTodoList(serverTodos);
        }
    }, [apiTodos, serverTodos]);

    const handleSort = (arr: Todo[]) => {
        const sortedArr = arr?.slice();
        return sortedArr?.sort((a, b) => {
            // Sorting logic remains the same
            if (a.completed === b.completed) {
                return 0;
            }
            return a.completed ? 1 : -1;
        });
    };

    const sortedTodos = useMemo(() => {
        return handleSort(todoList);
    }, [todoList]);

    const handlePushSuccessToast = (message: string) => {
        if (successToast.includes(message)) {
            return;
        }
        setSuccessToast([...successToast, message]);
        setTimeout(() => {
            setSuccessToast(successToast.filter((t) => t !== message));
        }, 4000);
    };
    const handlePushErrorToast = (message: string) => {
        if (errorToast.includes(message)) {
            return;
        }
        setErrorToast([...errorToast, message]);
        setTimeout(() => {
            setErrorToast(errorToast.filter((t) => t !== message));
        }, 4000);
    };

    if (error) {
        return <p>{JSON.stringify(error)}</p>;
    }

    return (
        <main
            className={`w-screen h-screen flex flex-col gap-10 items-center justify-center bg-purple-950/20`}
        >
            <p className="text-5xl font-bold">Todo App</p>
            <div className="md:w-1/3 rounded-3xl h-3/4 flex flex-col gap-5 bg-[#1D1825] px-5 md:px-12 py-10">
                <FormAddTodo
                    successAddTodo={(data) => {
                        setTodoList([data, ...todoList]);
                        handlePushSuccessToast(`Added task ${data.title}`);
                    }}
                    errorAddTodo={() =>
                        handlePushErrorToast("Error adding task")
                    }
                />

                {isClient && isFetching ? (
                    <div
                        className="flex w-full h-full flex-col items-center justify-center gap-2"
                        role="status"
                    >
                        <svg
                            aria-hidden="true"
                            className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-purple-400"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    </div>
                ) : sortedTodos.length > 0 ? (
                    <div className="flex flex-col gap-3 max-h-full overflow-auto">
                        {sortedTodos.map((todo: Todo) => {
                            return (
                                <div
                                    className="bg-[#15101C] rounded-xl"
                                    key={todo.id}
                                >
                                    <p
                                        className={`${
                                            todo.completed
                                                ? "line-through text-emerald-300"
                                                : "text-purple-300 "
                                        } py-4 px-5`}
                                    >
                                        {todo.title}
                                    </p>
                                    <p>{todo.completed}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex w-full h-full flex-col items-center justify-center gap-2">
                        <p className="text-purple-400 text-xl">No Data</p>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <select
                            onChange={(e) => {
                                setPage(1);
                                setLimit(parseInt(e.target.value));
                            }}
                            value={limit}
                            className="rounded-xl bg-purple-400 px-1.5 py-1"
                            name="limit"
                            id="limit"
                        >
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                if (page > 1) {
                                    setPage(page - 1);
                                }
                            }}
                            className={`w-8 h-7 rounded-xl font-medium bg-purple-400 flex items-center justify-center ${
                                page <= 1 && "cursor-not-allowed opacity-50"
                            }`}
                        >
                            {"<"}
                        </button>
                        <p className="mx-5">{page}</p>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="w-8 h-7 rounded-xl font-medium bg-purple-400 flex items-center justify-center"
                        >
                            {">"}
                        </button>
                    </div>
                </div>
            </div>
            <ToastWrapper success={successToast} error={errorToast} />
        </main>
    );
}

export const getStaticProps = async () => {
    const serverTodos = await loadServerTodos();

    return {
        props: { serverTodos },
    };
};

export default Home;
