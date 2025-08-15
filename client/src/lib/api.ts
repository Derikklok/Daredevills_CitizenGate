import { useUserContext } from "./contexts/UserContext";
import { useAuth } from "@clerk/clerk-react";

/**
 * Custom hook for making authenticated API requests
 */
export function useApi() {
  const { userId } = useUserContext();
  const { getToken } = useAuth();

  /**
   * Makes an authenticated request to the API
   */
  const fetchWithAuth = async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    // Get the JWT token from Clerk
    const token = await getToken();
    
    // Prepare headers with authentication
    const headers = new Headers(options.headers || {});
    
    // Add authentication header if token exists
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    // Add user ID to the headers if available
    if (userId) {
      headers.set("X-User-ID", userId);
    }

    // Add standard content type if not specified
    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    // Return fetch with auth headers
    return fetch(url, {
      ...options,
      headers,
    });
  };

  /**
   * Makes an authenticated GET request and returns JSON
   */
  const get = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
      ...options,
      method: "GET",
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  };

  /**
   * Makes an authenticated POST request with JSON body
   */
  const post = async <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  };

  /**
   * Makes an authenticated PUT request with JSON body
   */
  const put = async <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  };

  /**
   * Makes an authenticated DELETE request
   */
  const del = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
      ...options,
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  };

  return {
    get,
    post,
    put,
    delete: del,
    fetchWithAuth,
  };
}
