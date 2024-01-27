import React, { createContext, useContext, useState } from 'react';
const MyContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [myState, setMyState] = useState();  // example state

  const value = {
    myState,setMyState
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