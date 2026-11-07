import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { PublicRoute } from "../components/PublicRoute";
import { AppLayout } from "../components/layout/AppLayout";

// Code Splitting with React.lazy
const Login = React.lazy(() => import("../pages/Login").then((m) => ({ default: m.Login })));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword").then((m) => ({ default: m.ForgotPassword })));

const Dashboard = React.lazy(() => import("../pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Customers = React.lazy(() => import("../pages/Customers").then((m) => ({ default: m.Customers })));
const AddCustomer = React.lazy(() => import("../pages/AddCustomer").then((m) => ({ default: m.AddCustomer })));
const CustomerDetails = React.lazy(() => import("../pages/CustomerDetails").then((m) => ({ default: m.CustomerDetails })));
const ExpiringSoon = React.lazy(() => import("../pages/ExpiringSoon").then((m) => ({ default: m.ExpiringSoon })));
const Expired = React.lazy(() => import("../pages/Expired").then((m) => ({ default: m.Expired })));
const Settings = React.lazy(() => import("../pages/Settings").then((m) => ({ default: m.Settings })));

// Accessible Page Loading Fallback Skeleton
const PageSkeleton = () => (
  <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
    <div className="h-8 bg-slate-200 rounded-md w-48 mb-2" />
    <div className="h-4 bg-slate-100 rounded-md w-72 mb-8" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 bg-slate-100 rounded-xl border border-slate-200" />
      ))}
    </div>
    <div className="h-64 bg-slate-100 rounded-xl border border-slate-200" />
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: withSuspense(Login),
      },
      {
        path: "/forgot-password",
        element: withSuspense(ForgotPassword),
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: withSuspense(Dashboard),
          },
          {
            path: "customers",
            element: withSuspense(Customers),
          },
          {
            path: "customers/new",
            element: withSuspense(AddCustomer),
          },
          {
            path: "customers/:id",
            element: withSuspense(CustomerDetails),
          },
          {
            path: "expiring",
            element: withSuspense(ExpiringSoon),
          },
          {
            path: "expired",
            element: withSuspense(Expired),
          },
          {
            path: "settings",
            element: withSuspense(Settings),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
