import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { subscribeToAuthState } from "./lib/auth";
import { useAuthStore } from "@/store/authStore";
import MainLayout from "@/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import { useTheme } from "@/hooks/useTheme";
import { Toaster } from "@/components/ui/sonner";
import PageLoading from "./components/PageLoading";
import NotFoundPage from "./pages/NotFoundPage";

import { ROUTES } from "@/constants"; // [수정] 라우트 상수 import 추가

function App() {
  const { isLoading, setUser, setIsLoading } = useAuthStore();
  useTheme();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  if (isLoading) {
    return <PageLoading message="사용자 정보를 불러오는 중입니다..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 수정 : 상수 적용 */}
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.POST_DETAIL} element={<PostDetailPage />} />
            <Route
              path={ROUTES.WRITE}
              element={
                <ProtectedRoute>
                  <PostWritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.POST_EDIT}
              element={
                <ProtectedRoute>
                  <PostEditPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />

          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      {/* Toast 알림 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
