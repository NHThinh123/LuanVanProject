import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import "./styles/global.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import PostPage from "./pages/PostPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import InformationPage from "./pages/InformationPage.jsx";
import TestPage from "./pages/TestPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Search from "antd/es/transfer/search.js";
import SearchingPage from "./pages/SearchingPage.jsx";
import { AuthProvider } from "./contexts/auth.context.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
// import { AuthWrapper } from "./contexts/auth.context.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/posts",
        children: [
          {
            index: true,
            element: <PostPage />,
          },
          {
            path: ":id",
            element: <PostDetailPage />,
          },
        ],
      },
      {
        path: "/profile",
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: "edit",
            element: <EditProfilePage />,
          },
        ],
      },
      {
        path: "/searching",
        element: <SearchingPage />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/information",
    element: <InformationPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemColor: "#6b6b6b",
          },
          Input: {
            activeShadow: "none",
            borderRadiusLG: 20,
            borderRadius: 20,
          },

          Select: {
            activeOutlineColor: "none",
            borderRadiusLG: 20,
            borderRadius: 20,
          },
          Radio: {
            dotSize: 0,
            radioSize: 0,
          },
          Menu: {
            itemSelectedBg: "#222831",
            itemSelectedColor: "#ffffff",
          },
          Card: {
            bodyPadding: "16px 0px",
            colorBorderSecondary: "#fff",
          },
          Button: {
            defaultShadow: "none",
            primaryShadow: "none",
            borderRadiusLG: 20,
            borderRadius: 20,
          },
        },
        token: {
          colorPrimary: "#222831",
          fontFamily: "Roboto, serif",
        },
      }}
    >
      <AntdApp>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
