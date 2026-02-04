// src/App.tsx

/**
 * 블로그 앱 메인 컴포넌트
 *
 * React Router를 사용하여 페이지 라우팅을 설정합니다.
 * 인증 상태 감지를 통해 로그인 상태를 관리합니다.
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { subscribeToAuthState } from "./lib/auth";

// 레이아웃
import MainLayout from "@/layout/MainLayout";

// 공통 컴포넌트
import ProtectedRoute from './components/ProtectedRoute';

// 페이지
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import { useAuthStore } from "./store/authStore";
import PostWritePage from './pages/PostWritePage';


function App() {
    // Zustand 스토어에서 상태와 액션 가져오기
    const { isLoading, setUser, setIsLoading } = useAuthStore();
    
    /**
     * 인증 상태 감지
     *
     * Day 1 요구사항: AUTH-005 (로그인 상태 유지)
     *
     * onAuthStateChanged를 통해:
     * - 앱 시작 시 기존 로그인 상태 복원
     * - 로그인/로그아웃 시 상태 업데이트
     */
    useEffect(() => {
        const unsubscribe = subscribeToAuthState((user) => {
            setUser(user);
            setIsLoading(false);
        });

        // 클린업: 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe();
    }, [setUser, setIsLoading]);

    // 인증 상태 로딩 중
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className="w-8 h-8 border-4 border-blue-600 border-t-transparent 
                        rounded-full animate-spin mx-auto"
                    ></div>
                    <p className="mt-4 text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* 레이아웃이 적용되는 라우트 */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    {/* 보호된 라우트 - 로그인 필요 */}
                    <Route
                        path="/write"
                        element={
                        <ProtectedRoute>
                            <PostWritePage />
                        </ProtectedRoute>
                        }
                    />
                </Route>

                {/* 레이아웃 없이 표시되는 인증 페이지 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
