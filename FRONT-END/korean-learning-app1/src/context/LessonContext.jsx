import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLessons, getLessonById, createLesson, updateLesson, deleteLesson } from "../services/lesson";

//tao context
const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
    const [lessonsMap, setLessonsMap] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchLessonsForCategory = useCallback(async (categoryId) => {
        if (!categoryId) return;
        
        try {
            setLoading(true);
            const response = await getLessons(categoryId);
            const lessonsData = Array.isArray(response) ? response : (response || []);
            setLessonsMap(prev => ({
                ...prev,
                [categoryId]: lessonsData
            }));
            console.log("Fetched lessons for category", categoryId, ":", lessonsData);
        } catch (error) {
            console.error("Failed to fetch lessons:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getLessonsByCategory = (categoryId) => {
        if (!categoryId) return [];
        return lessonsMap[categoryId] || [];
    };

    const addLesson = async (categoryId, newLesson) => {
        try {
            const response = await createLesson(categoryId, newLesson);
            setLessonsMap(prevMap => ({
                ...prevMap,
                [categoryId]: [...(prevMap[categoryId] || []), response]
            }));
        } catch (error) {
            console.error("Failed to add lesson:", error);
        }
    };

    const editLesson = async (categoryId, lessonId, updatedLesson) => {
        console.log("call edit");   
        try {
            const response = await updateLesson(categoryId, lessonId, updatedLesson);
            setLessonsMap(prevMap => ({
                ...prevMap,
                [categoryId]: prevMap[categoryId].map(lesson => 
                    lesson.id === lessonId ? response : lesson
                )
            }));
        } catch (error) {
            console.error("Failed to update lesson:", error);
        }
    };

    const removeLesson = async (categoryId, lessonId) => {
        try {
            await deleteLesson(categoryId, lessonId);
            setLessonsMap(prevMap => ({
                ...prevMap,
                [categoryId]: prevMap[categoryId].filter(lesson => lesson.id !== lessonId)
            }));
        } catch (error) {
            console.error("Failed to delete lesson:", error);
        }
    };

    return (
        <LessonContext.Provider value={{ 
            lessons: lessonsMap,
            getLessonsByCategory,
            fetchLessonsForCategory,
            addLesson,
            editLesson,
            removeLesson,
            loading 
        }}>
            {children}
        </LessonContext.Provider>
    )
}
export const useLessons = (categoryId) => {
    const context = useContext(LessonContext);
    if (!context) {
        throw new Error('useLessons must be used within a LessonProvider');
    }

    useEffect(() => {
        if (categoryId) {
            context.fetchLessonsForCategory(categoryId);
        }
    }, [categoryId, context?.fetchLessonsForCategory]);

    return {
        lessons: context.getLessonsByCategory(categoryId),
        loading: context.loading,
        addLesson: context.addLesson,
        editLesson: context.editLesson,
        removeLesson: context.removeLesson
    };
};