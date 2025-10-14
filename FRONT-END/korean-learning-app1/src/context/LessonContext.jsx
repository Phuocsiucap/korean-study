import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLessons, getLessonById, createLesson, updateLesson, deleteLesson } from "../services/lesson";

//tao context
const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
    const [lessonsMap, setLessonsMap] = useState(() => {
        // Khôi phục data từ localStorage nếu có
        const cached = localStorage.getItem('lessonsMap');
        return cached ? JSON.parse(cached) : {};
    });
    const [loading, setLoading] = useState(false);
    const [activeCategories, setActiveCategories] = useState(new Set());

    const fetchLessonsForCategory = useCallback(async (categoryId) => {
        if (!categoryId) return;

        // Kiểm tra nếu category đang được fetch
        if (activeCategories.has(categoryId)) {
            return;
        }

        // Kiểm tra cache
        if (lessonsMap[categoryId]) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setActiveCategories(prev => new Set(prev).add(categoryId));
            
            const response = await getLessons(categoryId);
            if(response.status ===200) {
                const lessonsData = Array.isArray(response.data) ? response.data : (response.data || []);
                setLessonsMap(prev => {
                    const newMap = {
                        ...prev,
                        [categoryId]: lessonsData
                    };
                    // Lưu vào localStorage
                    localStorage.setItem('lessonsMap', JSON.stringify(newMap));
                    return newMap;
                });
                console.log("Fetched lessons for category", categoryId, ":", lessonsData);
            }
        } catch (error) {
            console.error("Failed to fetch lessons:", error);
        } finally {
            setLoading(false);
            setActiveCategories(prev => {
                const next = new Set(prev);
                next.delete(categoryId);
                return next;
            });
        }
    }, []); // Remove all dependencies since we're using closure values

    const getLessonsByCategory = (categoryId) => {
        if (!categoryId) return [];
        return lessonsMap[categoryId] || [];
    };

    const addLesson = async (categoryId, newLesson) => {
        try {
            const response = await createLesson(categoryId, newLesson);
            if(response.status ===201) {
                setLessonsMap(prevMap => ({
                    ...prevMap,
                    [categoryId]: [...(prevMap[categoryId] || []), response.data]
                }));
            }
            
        } catch (error) {
            console.error("Failed to add lesson:", error);
        }
    };

    const editLesson = async (categoryId, lessonId, updatedLesson) => {
        console.log("call edit");   
        try {
            const response = await updateLesson(categoryId, lessonId, updatedLesson);
            if(response.status === 200) {
                setLessonsMap(prevMap => ({
                    ...prevMap,
                    [categoryId]: prevMap[categoryId].map(lesson => 
                        lesson.id === lessonId ? response.data : lesson
                    )
                }));
            }
        } catch (error) {
            console.error("Failed to update lesson:", error);
        }
    };

    const removeLesson = async (categoryId, lessonId) => {
        try {
            const response = await deleteLesson(categoryId, lessonId);
            if(response.status === 204) {
                setLessonsMap(prevMap => ({
                    ...prevMap,
                    [categoryId]: prevMap[categoryId].filter(lesson => lesson.id !== lessonId)
                }));
            }
            
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

    // Chỉ fetch khi không có data trong cache
    useEffect(() => {
        if (categoryId && !context.lessons[categoryId]) {
            context.fetchLessonsForCategory(categoryId);
        }
    }, [categoryId]); // Chỉ phụ thuộc vào categoryId

    return {
        lessons: context.getLessonsByCategory(categoryId),
        loading: context.loading,
        addLesson: context.addLesson,
        editLesson: context.editLesson,
        removeLesson: context.removeLesson
    };
};