"use client";

import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleCalendarIntegrationProps {
  onAccessTokenChange: (token: string | null) => void;
  onUserChange: (user: { name: string; email: string } | null) => void;
}

export function GoogleCalendarIntegrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn("Google Client ID not configured");
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

export function GoogleCalendarLoginButton({
  onAccessTokenChange,
  onUserChange,
}: GoogleCalendarIntegrationProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a stored token
    const storedToken = localStorage.getItem("google_access_token");
    if (storedToken) {
      setIsLoggedIn(true);
      onAccessTokenChange(storedToken);
      const userEmail = localStorage.getItem("google_user_email");
      if (userEmail) {
        setUserEmail(userEmail);
      }
    }
  }, [onAccessTokenChange]);

  const handleSuccess = (credentialResponse: any) => {
    try {
      // For Google Sign-In, we get an ID token, but we need an access token for Calendar API
      // We'll need to implement a proper OAuth flow or use a different approach

      const decoded = jwtDecode<any>(credentialResponse.credential);

      // Store user info
      const userInfo = {
        name: decoded.name,
        email: decoded.email,
      };

      localStorage.setItem("google_user_email", userInfo.email);
      setUserEmail(userInfo.email);
      setIsLoggedIn(true);
      onUserChange(userInfo);

      // For now, we'll simulate having an access token
      // In a real implementation, you'd need to exchange the auth code for tokens
      const mockAccessToken = "mock_token_" + Date.now();
      localStorage.setItem("google_access_token", mockAccessToken);
      onAccessTokenChange(mockAccessToken);

      console.log("User logged in:", userInfo);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_user_email");
    setIsLoggedIn(false);
    setUserEmail(null);
    onAccessTokenChange(null);
    onUserChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {!isLoggedIn ? (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
          theme="outline"
          text="signin_with"
        />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-700">
            Connected: {userEmail}
          </p>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Disconnect Google Calendar
          </button>
        </div>
      )}
    </div>
  );
}
