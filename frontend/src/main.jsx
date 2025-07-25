import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AntdApp, notification } from "antd";
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
import SearchingPage from "./pages/SearchingPage.jsx";
import { AuthProvider } from "./contexts/auth.context.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import PostCreatePage from "./pages/PostCreatePage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import MessagePage from "./pages/MessagePage.jsx";
import PostFilterByTagPage from "./pages/PostFilterByTagPage.jsx";
import FollowerPage from "./pages/FollowerPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminUserPage from "./pages/AdminUserPage.jsx";
import AdminPostPage from "./pages/AdminPostPage.jsx";
import AdminModerationPage from "./pages/AdminModerationPage.jsx";
import CategorySearchingPage from "./pages/CategorySearchingPage.jsx";
import PostFilterByCoursePage from "./pages/PostFilterByCoursePage.jsx";
import AdminChartPage from "./pages/AdminChartPage.jsx";
import AdminCategoryPage from "./pages/AdminCategoryPage.jsx";
import AdminCoursePage from "./pages/AdminCoursePage.jsx";
import AdminTagPage from "./pages/AdminTagPage.jsx";
// import { AuthWrapper } from "./contexts/auth.context.jsx";

notification.config({
  duration: 3,
  showProgress: true,
  pauseOnHover: true,
});
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
          {
            path: "create",
            element: <PostCreatePage />,
          },
          {
            path: "tag/:tag_id",
            element: <PostFilterByTagPage />,
          },
          {
            path: "course/:course_id",
            element: <PostFilterByCoursePage />,
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
        path: "categories",
        element: <CategorySearchingPage />,
      },
      {
        path: "followers",
        element: <FollowerPage />,
      },
      {
        path: "/messages",
        element: <MessagePage />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "/user/:id",
        element: <UserProfilePage />,
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
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      {
        index: true,

        element: <AdminPostPage />,
      },
      {
        path: "users",
        element: <AdminUserPage />,
      },
      {
        path: "moderation",
        element: <AdminModerationPage />,
      },
      {
        path: "charts",
        element: <AdminChartPage />,
      },
      {
        path: "categories",
        element: <AdminCategoryPage />,
      },
      {
        path: "courses",
        element: <AdminCoursePage />,
      },
      {
        path: "tags",
        element: <AdminTagPage />,
      },
    ],
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
            optionSelectedColor: "#ffffff",
            optionSelectedBg: "#7d7d7dff",
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
            borderRadiusSM: 20,
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
