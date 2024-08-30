import React, {createContext, useState} from 'react';
import {storeData} from '../Utils/AsyncStorage';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState({mode: 'light'});

  const updateTheme = newTheme => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === 'dark' ? 'light' : 'dark';
      newTheme = {mode};
    }
    setTheme(newTheme);
    const themeStore = JSON.stringify(newTheme);
    storeData('theme', themeStore);
  };

  return (
    <ThemeContext.Provider value={{theme, updateTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
