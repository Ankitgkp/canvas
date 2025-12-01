import React, { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { AuthService } from "./auth";

interface AuthContainerProps {
    onAuthenticated: () => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
    onAuthenticated,
}) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = AuthService.getToken();
            if (token) {
                try {
                    const result = await AuthService.verifyToken(token);
                    if (result.valid) {
                        onAuthenticated();
                        return;
                    }
                } catch (error) {
                    console.log("Token verification failed:", error);
                }
                AuthService.removeToken();
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [onAuthenticated]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Drawing App
                    </h1>
                    <p className="text-gray-600">
                        Express your creativity on digital canvas
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-3 px-4 text-center font-medium rounded-tl-lg transition-colors ${
                                isLoginMode
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setIsLoginMode(true)}
                        >
                            Sign In
                        </button>
                        <button
                            className={`flex-1 py-3 px-4 text-center font-medium rounded-tr-lg transition-colors ${
                                !isLoginMode
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setIsLoginMode(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="p-6">
                        {isLoginMode ? (
                            <LoginForm
                                onSuccess={onAuthenticated}
                                onSwitchToRegister={() => setIsLoginMode(false)}
                            />
                        ) : (
                            <RegisterForm
                                onSuccess={onAuthenticated}
                                onSwitchToLogin={() => setIsLoginMode(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
