import React, { createContext, useContext } from 'react';
const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [myState,setMyState] = useState();

  const value = {
    myState,setMyState
  }

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

export const globalContext = () => {
  return useContext(MyContext);
};