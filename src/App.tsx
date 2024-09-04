import Login from "./pages/Login/login"
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useIsLogin } from "./hooks/userLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
import Category from "./pages/Category/Category";
import FormCategory from "./pages/Forms/formCategory";
import Register from "./pages/Register/Register";
import Budget from "./pages/Budget/budget";
import Transaction from "./pages/Transaction/Transaction";
import FormBudget from "./pages/Forms/formBudget";
import FormTransaction from "./pages/Forms/formTransaction";

export default function App() {
  const isLogin = useIsLogin();

  return (
    <BrowserRouter>
      <Routes>
        {isLogin ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/add" element={<FormCategory />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/budget/add" element={<FormBudget />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/transaction/add" element={<FormTransaction />} />
        <Route path="/register" element={<Register />}></Route>

      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}