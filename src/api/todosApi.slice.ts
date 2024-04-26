import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}
export interface NewTodo {
    title: string;
    completed: boolean;
}
interface Parameters {
    page?: number;
    limit?: number;
}

const todosApi = createApi({
    reducerPath: "todosApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://jsonplaceholder.typicode.com/todos",
    }),
    endpoints: (builder) => ({
        getTodos: builder.query<Todo[], Parameters>({
            query: ({ page = 1, limit = 10 }) =>
                `?_limit=${limit}&_page=${page}`, // Empty string for root endpoint
        }),
        createTodo: builder.mutation<Todo, NewTodo>({
            query: (newTodo) => ({
                url: "", // Replace with your create todo endpoint
                method: "POST",
                body: newTodo,
            }),
        }),
    }),
});

export const { useGetTodosQuery, useCreateTodoMutation } = todosApi;

export default todosApi;
