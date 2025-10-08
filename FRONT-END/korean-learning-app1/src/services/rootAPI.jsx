import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("🔍 API Base URL:", API_BASE_URL);

// const API_BASE_URL = "https://korean-study-yo4g.onrender.com/api";

export const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    const csrfToken = Cookies.get("csrftoken");
    const sessionid = Cookies.get("sessionid");
    console.log("csrftoken: ",csrfToken);
    console.log("sessionid: ",sessionid);
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      withCredentials: true,
      headers: {
        "X-CSRFToken": csrfToken,
        "Content-Type": "application/json",
        ...config.headers,
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
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      withCredentials: true,
      ...config,
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
};
