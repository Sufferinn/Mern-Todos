import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    // Если у нас есть токен, установленный в состоянии, мы должны передавать его.
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// @reducerPath - то как будет отображаться в общем store
export const todoApi = createApi({
  reducerPath: 'todos',
  tagTypes: 'Todo', // с какими сущностями мы работаем
  baseQuery,
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => 'todos',
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ _id: id }) => ({ type: 'Todo', id })),
              { type: 'Todo', id: 'LIST' },
            ]
          : [{ type: 'Todo', id: 'LIST' }],
    }),
    addTodo: builder.mutation({
      query: (body) => ({
        url: 'todos',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
    editTodo: builder.mutation({
      query: (body) => ({
        url: `todos/${body._id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg._id }],
    }),
    removeTodo: builder.mutation({
      query: (body) => ({
        url: `todos/${body._id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg._id }],
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation, useEditTodoMutation, useRemoveTodoMutation } = todoApi;
