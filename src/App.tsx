import Login from "./pages/Login/login";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Category from "./pages/Category/Category";
import FormCategory from "./pages/Forms/formCategory";
import Register from "./pages/Register/Register";
import Budget from "./pages/Budget/budget";
import DetailBudget from "./pages/Detil/Budget";
import Transaction from "./pages/Transaction/Transaction";
import FormBudget from "./pages/Forms/formBudget";
import FormTransaction from "./pages/Forms/formTransaction";
import DetailCategory from "./pages/Detil/Category";
import DetailTransaction from "./pages/Detil/Transaction";

export default function App() {

  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.exp < Date.now() / 1000) {
        localStorage.clear();
        return false
      }
      return true;
    }
    return false
  }
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/register"
        element={isAuthenticated() ? <Navigate to="/" /> : <Register />}
      ></Route>
      <Route
        path="/category"
        element={isAuthenticated() ? (
          <Routes>
            <Route index element={<Category />} />
            <Route path="add" element={<FormCategory />} />
            <Route path=":id" element={<DetailCategory />} />
          </Routes>
        ) : <Navigate to="/login" />}
      />
      
      <Route
       path="/budget"
       element={isAuthenticated() ? (
         <Routes>
           <Route index element={<Budget />} />
           <Route path="add" element={<FormBudget />} />
           <Route path=":id" element={<DetailBudget />} />
         </Routes>
       ) : <Navigate to="/login" />}
     />
       <Route
       path="/transaction"
       element={isAuthenticated() ? (
         <Routes>
           <Route index element={<Transaction />} />
           <Route path="add" element={<FormTransaction />} />
           <Route path=":id" element={<DetailTransaction />} />
         </Routes>
       ) : <Navigate to="/login" />}
     />
  
    
    </Routes>
  );
}

