import React, { createContext, useContext, useState } from 'react';
const MyContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [myState, setMyState] = useState();  // example state
  const [courses,setCourses] = useState([])
  const value = {
    myState,setMyState,
    courses,setCourses
  };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(MyContext);
};