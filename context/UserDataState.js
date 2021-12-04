import react, { useState, useContext, createContext, useEffect } from 'react'


const UserDataContext = createContext();


 const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (localStorage.getItem('userData')) {
      setUserData(JSON.parse(userData))
    }


  }, [])

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      {children}
    </UserDataContext.Provider>
  )
}


export const useUserData = () => useContext(UserDataContext)
export default UserDataProvider