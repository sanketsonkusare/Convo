import Navbar from "./Components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import {useAuthStore} from "./Store/useAuthStore";
import { useEffect } from "react";
import {Loader} from "lucide-react";


const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div> 
  )

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="login"/>} />
        <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to ="/" /> }/>
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to = "/login" />} />
      </Routes>
    </div>
  );
};

export default App;