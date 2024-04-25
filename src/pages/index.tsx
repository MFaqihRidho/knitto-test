import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { loadServerTodos } from "@/lib/load-server-todos";
import {
    useCreateTodoMutation,
    useGetTodosQuery,
    Todo,
} from "@/api/todosApi.slice";
import { Inter } from "next/font/google";
import AddButton from "@/components/AddButton";
import InputText from "@/components/InputText";

const inter = Inter({ subsets: ["latin"] });

function Home({ serverTodos }: { serverTodos: Todo[] }) {
    const [newTodo, setNewTodo] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const {
        isLoading,
        error,
        data: apiTodos,
    } = useGetTodosQuery({ page, limit });
    const [todoList, setTodoList] = useState<Todo[]>(
        apiTodos || serverTodos || []
    );

    useEffect(() => {
        if (apiTodos) {
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

    if (error) {
        return <p>{error.data}</p>;
    }

    return (
        <main
            className={`w-screen h-screen flex flex-col gap-10 items-center justify-center bg-purple-950/20`}
        >
            <p className="text-5xl font-bold">Todo App</p>
            <div className="w-1/3 rounded-3xl h-3/4 flex flex-col gap-5 bg-[#1D1825] px-12 py-10">
                <div className="w-full flex items-center gap-3">
                    <InputText
                        changeValue={(newValue) => setNewTodo(newValue)}
                        value={newTodo}
                    ></InputText>
                    <AddButton
                        onClick={() => {
                            handleAddNewTask();
                        }}
                    />
                </div>
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
            </div>
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
