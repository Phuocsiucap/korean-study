import { apiCall,apiCall2 } from "./rootAPI"

export const generate_quiz = async (words_numOfQuestion) => apiCall('post', '/aigen/generate_quiz/', words_numOfQuestion);

