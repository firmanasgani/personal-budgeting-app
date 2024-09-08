import Login from "./pages/Login/login";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Category from "./pages/Category/Category";
import FormCategory from "./pages/Forms/formCategory";
import Register from "./pages/Register/Register";
import Budget from "./pages/Budget/budget";
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
        path="/category"
        element={isAuthenticated() ? <Category /> : <Navigate to="/login" />}
      />
      <Route
        path="/category/add"
        element={isAuthenticated() ? <FormCategory /> : <Navigate to="/login" />}
      />
      <Route
        path="/category/:id"
        element={isAuthenticated() ? <DetailCategory /> : <Navigate to="/login" />}
      />
      <Route
        path="/budget"
        element={isAuthenticated() ? <Budget /> : <Navigate to="/" />}
      />
      <Route
        path="/budget/add"
        element={isAuthenticated() ? <FormBudget /> : <Navigate to="/" />}
      />
      <Route
        path="/transaction"
        element={isAuthenticated() ? <Transaction /> : <Navigate to="/" />}
      />
      <Route
        path="/transaction/add"
        element={isAuthenticated() ? <FormTransaction /> : <Navigate to="/" />}
      />
        <Route
        path="/transaction/:id"
        element={isAuthenticated() ? <DetailTransaction /> : <Navigate to="/login" />}
      />
      <Route
        path="/register"
        element={isAuthenticated() ? <Navigate to="/" /> : <Register />}
      ></Route>
    </Routes>
  );
}

