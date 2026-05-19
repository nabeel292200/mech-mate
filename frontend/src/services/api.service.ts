const BASE_URL = "http://localhost:4000/api";

class ApiService {
  private getHeaders(contentType = "application/json"): HeadersInit {
    const headers: HeadersInit = {};
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    
    // Check if we have localStorage available (Next.js SSR guard)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("assist_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "An error occurred while calling the API");
    }
    return data;
  }
}

export const api = new ApiService();
