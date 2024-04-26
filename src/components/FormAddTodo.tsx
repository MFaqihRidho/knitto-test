import { useState } from "react";
import InputText from "./InputText";
import AddButton from "./AddButton";
import { useCreateTodoMutation, Todo } from "@/api/todosApi.slice";

export default function FormAddTodo({
    successAddTodo,
    errorAddTodo,
}: {
    successAddTodo: (data: Todo) => void;
    errorAddTodo: () => void;
}) {
    const [title, setTitle] = useState<string>("");

    const [addNewTodo, { isLoading, isError }] = useCreateTodoMutation();

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            const { data } = (await addNewTodo({
                title,
                completed: false,
            })) as { data: Todo };
            successAddTodo(data);
            setTitle("");
        } catch (error) {
            errorAddTodo();
        }
    };

    const isTitleEmpty = title.trim() === "";

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex items-center gap-3"
        >
            <InputText
                changeValue={(newValue) => setTitle(newValue)}
                value={title}
            ></InputText>
            <AddButton isLoading={isLoading} />
        </form>
    );
}
