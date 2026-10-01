import { Navigate,Route,Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastHost from "./components/ToastHost";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Payments from "./pages/Payments";
import Students from "./pages/Students";
import Schools from "./pages/Schools";
import Courses from "./pages/Courses";
import Products from "./pages/Products";

export default function App(){
  return <><Routes><Route path="/login" element={<Login/>}/><Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route index element={<Dashboard/>}/><Route path="/employees" element={<Employees/>}/><Route path="/payments" element={<Payments/>}/><Route path="/students" element={<Students/>}/><Route path="/schools" element={<Schools/>}/><Route path="/courses" element={<Courses/>}/><Route path="/products" element={<Products/>}/></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes><ToastHost/></>
}
