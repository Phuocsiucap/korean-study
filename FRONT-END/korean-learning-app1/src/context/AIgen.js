import React, {createContext, useContext, useState, useEffect} from "react";
import {generate_quiz} from "../services/apigen";
//tao context
const AIgenContext = createContext();

//provider
export const AIgenContextProvider = ({children}) => {
   
    const [loading, setLoading] = useState(false);

    
    const Gen_cloze = async (words, numOfquestion) => {
        try {
            setLoading(true);
            const request = {words: words, numOfquestion: numOfquestion};
            const data = await generate_quiz(request);
            return data; 
        } catch(error) {
            console.error("Failed to gen questions:", error);
        } finally{
            setLoading(false);
        }
    }

    return (
        <AIgenContext.Provider value={{ loading, Gen_cloze}}>
            {children}
        </AIgenContext.Provider>
    )
}

export const useAIgen = () => useContext(AIgenContext);
