import axios from 'axios';
import Cookies from "js-cookie";

// const API_BASE_URL = import.meta.env.VITE_API_URL;

const API_BASE_URL ="https://korean-study-yo4g.onrender.com/api"
export const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    // Lấy CSRF token tại thời điểm gọi request (luôn mới nhất)
    const csrfToken = Cookies.get("csrftoken");
    // console.log("csrftoken", csrfToken);
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      withCredentials: true, // Gửi kèm cookie session + csrf
      headers: {
        "X-CSRFToken": csrfToken,
        "Content-Type": "application/json",
        ...config.headers, // merge thêm headers tùy chọn
      },
      ...config,
    });

    return response.data;
  } catch (error) {
    console.error(`API error [${method.toUpperCase()} ${endpoint}]:`, error);
    throw error;
  }
};

export const apiCall2 = async (method, endpoint, data = null, config = {}) => {
    try{
        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data,
            withCredentials: true,
            ...config,// hoaders, params....
        });
        console.log(response.data);
        return response;
    } catch (error) {
        console.error(
        `API error [${method.toUpperCase()} ${endpoint}]:`,
        error.response?.data || error.message
        );
        throw error; 
    }
}