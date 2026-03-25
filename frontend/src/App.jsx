import {Routes, Route, Navigate } from "react-router";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import HomePage from "./Pages/HomePage";

import {checkAuth} from "./authSlice"
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import ProblemPage from "./Pages/ProblemPage";
import Admin from "./Pages/Admin";
import AdminDelete from "./components/AdminDelete";
import AdminPanel from "./components/AdminPanel";
import SubmissionHistory from "./components/SubmissionHistory";
import AdminUpdate from "./components/AdminUpdate"



// function Editor() {
//   return (
//     <div style={{ height: '100vh' }}>
//       <editor />   {/*  This renders your editor */}

//     </div>
//   );
// }



function App(){
  const dispatch = useDispatch();
  const {isAuthenticated, user, loading}=useSelector((state)=>state.auth);
    
  console.log("isAuthenticated:", isAuthenticated);
console.log("user:", user);
console.log("role:", user?.role);

  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);

 if(loading){
  return <div className="min-h-screen flex items-center justify-center">
    <span className="loading loading-spinner loading-lg"></span>
  </div>;

  }

  return (
    <>
    <Routes>
      <Route path="/" element={isAuthenticated ? <HomePage></HomePage>:<Navigate to="/signup"/>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/"/>:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/"/>:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated && user?.role==='admin'?<Admin/>:<Navigate to="/"/>}/> 
     <Route path="/admin/create" element={isAuthenticated && user?.role==='admin' ? <AdminPanel/>:<Navigate to="/"/>}/>
      <Route path="/admin/delete" element={isAuthenticated && user?.role==='admin' ? <AdminDelete/>:<Navigate to="/"/>}/> 
      <Route path="/admin/update" element={isAuthenticated && user?.role==='admin' ? <AdminUpdate/>:<Navigate to="/"/>}/> 
      

      <Route path="/problem/:problemId" element={<ProblemPage />}></Route>  
     {/* <Route
  path="/admin"
  element={
   isAuthenticated && user?.role === "admin"
      ? <AdminPanel />
      : <Navigate to="/" />
  }
/> */}


      <Route path="/admin" element={<AdminPanel/>}></Route>
   

    </Routes>
    </>
  )
}
export default App;





