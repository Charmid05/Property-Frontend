"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LoginResponse,
  DecodedToken,
  User,
  RegisterRequest,
  RegisterResponse,
} from "@/types/user";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

const setCookie = (
  name: string,
  value: string,
  seconds: number,
  secure = true
) => {
  if (typeof document !== "undefined") {
    const expires = new Date(Date.now() + seconds * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; ${secure ? "secure; samesite=strict;" : ""
      }`;
  }
};

const getCookie = (name: string): string | null => {
  if (typeof document !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(";").shift() || "");
    }
  }
  return null;
};

const removeCookie = (name: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  }
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const getAccessToken = (): string | null => {
  if (memoryAccessToken && isTokenValid(memoryAccessToken)) {
    return memoryAccessToken;
  }
  const cookieToken = getCookie("access_token");
  if (cookieToken && isTokenValid(cookieToken)) {
    memoryAccessToken = cookieToken;
    return cookieToken;
  }
  return null;
};

const getRefreshToken = (): string | null => {
  if (memoryRefreshToken && isTokenValid(memoryRefreshToken)) {
    return memoryRefreshToken;
  }
  const cookieToken = getCookie("refresh_token");
  if (cookieToken && isTokenValid(cookieToken)) {
    memoryRefreshToken = cookieToken;
    return cookieToken;
  }
  return null;
};

const setTokens = (accessToken: string, refreshToken: string) => {
  memoryAccessToken = accessToken;
  memoryRefreshToken = refreshToken;
  setCookie("access_token", accessToken, 2 * 60 * 60); // 2 hours
  setCookie("refresh_token", refreshToken, 7 * 24 * 60 * 60); // 7 days
};

const clearTokens = () => {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  removeCookie("access_token");
  removeCookie("refresh_token");
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken || !isTokenValid(refreshToken)) {
    clearTokens();
    return null;
  }

  try {
    const response = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });
    if (response.data.tokens?.access) {
      setTokens(response.data.tokens.access, refreshToken);
      return response.data.tokens.access;
    }
    return null;
  } catch (error) {
    clearTokens();
    return null;
  }
};

const getRoleBasedRedirectUrl = (role: string): string => {
  switch (role.toLowerCase()) {
    case "admin":
      return "/admin";
    case "tenant":
      return "/tenant";
    case "property_manager":
      return "/property-manager";
    default:
      return "/test";
  }
};

export const registerUser = async (
  payload: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>(
      "api/auth/register/",
      payload
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      // Handle specific field errors
      const fieldErrors = error.response.data;
      const errors: string[] = [];

      // Map through possible field errors
      Object.keys(fieldErrors).forEach((key) => {
        if (Array.isArray(fieldErrors[key])) {
          errors.push(`${key}: ${fieldErrors[key].join(", ")}`);
        } else {
          errors.push(fieldErrors[key]);
        }
      });

      return {
        message:
          errors.length > 0
            ? errors.join("; ")
            : "Registration failed. Please check your input.",
        fieldErrors,
      };
    }
    return {
      message: "Registration failed. Please try again.",
    };
  }
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getAccessToken();
    if (!token) return null;
    const response = await api.get("/api/auth/users/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const login = async (
  identifier: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post("/api/auth/login/", {
      identifier,
      password,
    });
    const data = response.data as LoginResponse;

    if (data.message === "Login successful" && data.tokens) {
      setTokens(data.tokens.access, data.tokens.refresh);
    }

    return data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Login failed",
      isAuthenticated: false,
    };
  }
};

export const logout = async () => {
  try {
    const token = getAccessToken();
    const refreshToken = getRefreshToken();
    if (token) {
      await api.post(
        "api/auth/logout/",
        { refresh_token: refreshToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    // Silent cleanup
  } finally {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token && isTokenValid(token);
};

export const checkAndRefreshAuth = async (): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) return false;
  if (isTokenValid(token)) return true;
  const newToken = await refreshAccessToken();
  return !!newToken;
};

api.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    if (token && !isTokenValid(token)) {
      token = await refreshAccessToken();
      if (!token) {
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(new Error("Authentication failed"));
      }
    }
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshToken()
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const syncTokensToState = () => {
    setAccessToken(getAccessToken());
    setRefreshToken(getRefreshToken());
  };

  const reactLogin = async (email: string, password: string) => {
    const data = await login(email, password);
    syncTokensToState();

    if (data.message === "Login successful") {
      const userData = await fetchCurrentUser();
      setUser(userData);

      if (userData?.role) {
        const redirectUrl = getRoleBasedRedirectUrl(userData.role);
        router.push(redirectUrl);
      }
    }
    return data;
  };

  const reactLogout = async () => {
    await logout();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      if (isAuthenticated()) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (error) {
          clearTokens();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [accessToken]);

  useEffect(() => {
    const checkTokens = () => {
      const currentAccessToken = getAccessToken();
      if (currentAccessToken !== accessToken) {
        setAccessToken(currentAccessToken);
      }
    };
    const interval = setInterval(checkTokens, 60000);
    return () => clearInterval(interval);
  }, [accessToken]);

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken && isTokenValid(accessToken),
    isLoading,
    login: reactLogin,
    logout: reactLogout,
    refreshAuth: async () => {
      const newToken = await refreshAccessToken();
      syncTokensToState();
      return !!newToken;
    },
    fetchUser: async () => {
      const userData = await fetchCurrentUser();
      setUser(userData);
      return userData;
    },
    getRoleBasedRedirectUrl,
  };
};

export default api;
