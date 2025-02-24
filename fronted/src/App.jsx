import {useEffect} from "react";
import {useAuthStore} from "./store/useAuthStore";
import {Loader} from "lucide-react";
import { Toaster } from "react-hot-toast";
import {Routes, Route,Navigate} from "react-router-dom";

import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/profilePage";
import useThemeStore from "./store/useThemeStore";

function App() {
  const {authUser,authCheck,isCheckingAuth,onlineUsers} =useAuthStore();
  const {theme} =useThemeStore();


  useEffect(()=>{
    authCheck();

  },[authCheck])

  console.log("authUser "+{authUser});
  console.log("Online users "+onlineUsers);
  
  if(isCheckingAuth && authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-20 animate-spin'></Loader>
      </div>
    )
  }
  
  return (<div data-theme={theme}>
    <Navbar/>

    <Routes>
      <Route path="/" element={authUser? <HomePage/> : <Navigate to="/login"/>} />
      <Route path="/signup" element={!authUser? <SignupPage/> : <Navigate to="/"/>} />
      <Route path="/login" element={!authUser? <LoginPage/> : <Navigate to="/"/>} />
      <Route path="/settings" element={<SettingsPage/>} />
      <Route path="/profile" element={authUser? <ProfilePage/> : <Navigate to="/login"/>} />
    </Routes>
    <Toaster/>
    </div>
  )
}

export default App
