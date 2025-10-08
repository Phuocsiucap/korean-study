import React, {createContext, useContext, useState, useEffect} from "react";
import {getCategories , createCategory} from "../services/category";
import { useAuth } from "./AuthContext";
//tao context
const CategoryContext = createContext();

//provider
export const CategoryProvider = ({children}) => {
    const {isAuthenticated } = useAuth()
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    //goi api khi load app
    useEffect(() => {
        const fetchCategories = async () => {
            if(isAuthenticated) {
                try {
                    const data = await getCategories();
                    if(data.status === 200) {
                        setCategories(data.data);
                    }
                } catch(error) {
                    console.error("Failed to fetch categories:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setCategories([]);
            }
        }
        fetchCategories();
    }, [isAuthenticated]);// chay 1 lan khi component mount
    
    const addCategory = async (newCategory) => {
        try {
            const data = await createCategory(newCategory);
            if(data.status===200) {
                setCategories((prevCategories) => [...prevCategories, data.data]);
                console.log("Categories after added:",categories);
            }
            
        } catch(error) {
            console.error("Failed to add category:", error);
        }
    }

    
    return (
        <CategoryContext.Provider value={{categories, setCategories, addCategory, loading}}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useCategories = () => useContext(CategoryContext);
