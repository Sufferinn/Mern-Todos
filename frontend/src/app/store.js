import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import { todoApi } from '../features/todo/todoApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Добавим сгенерированный редюсер в качестве определенного фрагмента верхнего уровня.
    [todoApi.reducerPath]: todoApi.reducer
  },
  // Добавление промежуточного программного обеспечения API обеспечивает кэширование, аннулирование, опрос,
  // и другие полезные функции `rtk-query`.
  // middleware - логика, которая выполняется в момент запуска action и до их выполнения
  // Функция которая принимает getDefaultMiddleware (Middleware по умолчанию), в свою очередь возвращает массив эти Middleware куда мы и будем добавлять(concat) наш todoApi.middleware
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todoApi.middleware)
});
