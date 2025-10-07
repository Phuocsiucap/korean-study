import { apiCall,apiCall2 } from "./rootAPI"

export const login = async (username_password) => apiCall2('post', '/users/login/',username_password);
export const register = async (email_username_password) => apiCall2('post', '/users/register/',email_username_password);
export const getMe = async () => apiCall2('get', '/users/me/');
export const logout = async () => apiCall('post', '/users/logout/');
export const send_otp = async (email) => apiCall2('post', '/users/send-otp/', email);