import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Context/theme-provider";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardEmployee from "./pages/DashboardEmployee";
import PageHR from "./pages/PageHR";
import { DashboardHR } from "./components/Dashboard/DashboardHR";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    // HR Layout (parent route)
    {
      path: "/human-resources/dashboard",
      element: (
        <ProtectedRoute allowedRoles={[1]}>
          <PageHR />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true, // default child
          element: <DashboardHR />,
        },
        {
          path: "employee-management",
          element: <h1 className="title">Employee Management</h1>,
        },
        {
          path: "time-keeping",
          element: <h1 className="title">Daily Time Records</h1>,
        },
        {
          path: "leave-requests",
          element: <h1 className="title">Leave Requests</h1>,
        },
        {
          path: "payroll-processing",
          element: <h1 className="title">Payroll Processing</h1>,
        },
        {
          path: "account-settings",
          element: <h1 className="title">Account Settings</h1>,
        },
      ],
    },
    // Employee dashboard (separate layout)
    {
      path: "/dashboard-employee",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <DashboardEmployee />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
