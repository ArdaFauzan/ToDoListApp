import React, {createContext, useState, useEffect} from 'react';
import {getDataAsync} from '../Utils/AsyncStorage';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState({
    user_id: null,
    token: null,
  });

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user_id = await getDataAsync('user_id');
        const token = await getDataAsync('token');
        setUser({user_id: user_id, token: token});
      } catch (error) {
        console.error('Failed to initialize user data:', error);
      }
    };

    initializeUser();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
