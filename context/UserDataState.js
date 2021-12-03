import react, { useState, useContext, createContext, useEffect } from 'react'


const UserDataContext = createContext();


export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const userData = localStorage.getItem('userData');

    //    console.log('ff' ,JSON.parse(userData).profile_photo_url)
    if (localStorage.getItem('userData')) {
    }
    setUserData(JSON.parse(userData))


  }, [])

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      {children}
    </UserDataContext.Provider>
  )
}


export const useUserData = () => useContext(UserDataContext)