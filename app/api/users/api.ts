import {
  User,
  UserListResponse,
  UserCreateRequest,
  UserUpdateRequest,
  ApiError,
} from "@/types/user";
import { AxiosError } from "axios";
import api from "../auth/api";
import { API_BASE_URL } from "../config";
const API_URL = `${API_BASE_URL}/api/auth/users/`;
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<UserListResponse>(API_URL);
    return response.data.results || response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch users.",
      );
    }
    throw new Error("Failed to fetch users.");
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch user.");
    }
    throw new Error("Failed to fetch user.");
  }
};

// Create new user (any role) — uses create_user/
export const createUser = async (
  userData: UserCreateRequest,
): Promise<User> => {
  try {
    const response = await api.post(`${API_URL}create_user/`, userData);
    return response.data.user; // Backend returns { user, message }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create user.",
      );
    }
    throw new Error("Failed to create user.");
  }
};

// Update user
export const updateUser = async (
  id: number,
  userData: UserUpdateRequest,
): Promise<User> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, userData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update user.",
      );
    }
    throw new Error("Failed to update user.");
  }
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete user.",
      );
    }
    throw new Error("Failed to delete user.");
  }
};

// Toggle user active status → now uses deactivate/reactivate
export const toggleUserStatus = async (id: number): Promise<User> => {
  try {
    const user = await getUserById(id);
    const endpoint = user.is_active ? "deactivate" : "reactivate";
    const response = await api.post(`${API_URL}${id}/${endpoint}/`);
    return response.data.user || user; // Some endpoints return message only
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to toggle user status.",
      );
    }
    throw new Error("Failed to toggle user status.");
  }
};
