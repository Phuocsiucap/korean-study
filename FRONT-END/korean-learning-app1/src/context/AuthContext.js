import React, { useState, createContext, useContext, useEffect } from 'react';
import { login, logout, register, getMe, send_otp, getCsrfToken} from "../services/auth"
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    wordsLearned : 0,
    streak : 0,
    points : 0,
    studyTime: 0
  });
  const [loading, setLoading ]  = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const req = await getCsrfToken();
      if(req.status===200) {

      }
    }
    fetchToken();
  },[])

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () =>{
        try {
          const rep = await getMe();
          if(rep.status === 200) {
            setUser(rep.data);
            setIsAuthenticated(true);
            setLoading(false);
          }
        } catch(error) {
          console.error(error);
        }
      
    }
    fetchUser();
  },[])

  const Login = async (userData) => {
    const rep = await login(userData);
    if(rep.status === 200) {
      setUser(rep.data.user);
      setIsAuthenticated(true);
    }
    return rep;
  };

  const Register = async (userData) => {
    const rep = await register(userData);
    if(rep.status === 200) {
      setUser(rep.data.user);
      setIsAuthenticated(true);
    }
    return rep;
    
  };

  const Logout = async () => {
    const rep = await logout();
    // console.log(rep);
    if(rep.status === 200) {
      setUser({
        wordsLearned : 0,
        streak : 0,
        points : 0,
        studyTime: 0
      });
      setIsAuthenticated(false);
    }
    
  };

  const getInfo = async () => {
    const rep = await getMe();
    if (rep.status === 200) {
      setUser(rep.data.user);
      setIsAuthenticated(true);
    }
    if (rep.status ===403) {
      alert("Welcome to language study app.Please login to study")
    }
  };

  const sendOtp = async (email) => {
    const rep = await send_otp(email);
    console.log("log of send otp",rep);
    return rep;
  }
  

  return (
    <AuthContext.Provider value={{ loading, user, isAuthenticated,setIsAuthenticated, Login, Register, Logout,getInfo, sendOtp }}>
      {children}
    </AuthContext.Provider>
  );
};
