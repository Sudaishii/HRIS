import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardEmployee from "./pages/DashboardEmployee";
import PageHR from "./pages/PageHR";
import { DashboardHR } from "./components/Dashboard/DashboardHR";
import EmployeeManagement from "./components/EmployeeManagement/EmployeeManagement";
import DailyTimeRecords from "./components/DailyTimeRecords/DailyTimeRecords";
import LeaveRequests from "./components/LeaveRequests/LeaveRequests";
import PayrollProcessing from "./components/PayrollProcessing/PayrollProcessing";
import AccountSettings from "./components/AccountSettings/AccountSettings";

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
      path: "/human-resources",
      element: (
        <ProtectedRoute allowedRoles={[1]}>
          <PageHR />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true, // default child - redirect to dashboard
          element: <DashboardHR />,
        },
        {
          path: "dashboard",
          element: <DashboardHR />,
        },
        {
          path: "employee-management",
          element: <EmployeeManagement />,
        },
        {
          path: "time-keeping",
          element: <DailyTimeRecords />,
        },
        {
          path: "leave-requests",
          element: <LeaveRequests />,
        },
        {
          path: "payroll-processing",
          element: <PayrollProcessing />,
        },
        {
          path: "account-settings",
          element: <AccountSettings />,
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

  return <RouterProvider router={router} />;
}

export default App;
