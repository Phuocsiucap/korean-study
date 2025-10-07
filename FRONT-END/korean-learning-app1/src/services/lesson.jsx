import { apiCall } from "./rootAPI";

export const getLessons = async(categoryId) => apiCall('get', `/categories/${categoryId}/lessons`);

export const getLessonById = async (categoryId, lessonId) => apiCall('get', `/categories/${categoryId}/lessons/${lessonId}`);

export const createLesson = async (categoryId, lessonData) => apiCall('post', `/categories/${categoryId}/lessons`, lessonData);

export const updateLesson = async (categoryId, lessonId, lessonData) => apiCall('put', `/categories/${categoryId}/lessons/${lessonId}`, lessonData);

export const deleteLesson = async (categoryId, lessonId) => apiCall('delete', `/categories/${categoryId}/lessons/${lessonId}`);