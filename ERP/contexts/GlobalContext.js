import React, { createContext, useContext, useState } from 'react';
const MyContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [myState, setMyState] = useState();  // example state
  const [courses,setCourses] = useState([])
  const [selectedCourse,setSelectedCourse] = useState(null)
  const value = {
    myState,setMyState,
    courses,setCourses,
    selectedCourse,setSelectedCourse
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