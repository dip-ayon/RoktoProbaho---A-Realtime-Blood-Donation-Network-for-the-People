
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
    [key: string]: string | undefined;
  };
};

const base = process.env.NEXT_PUBLIC_API_URL ?? "";
const res = await fetch(`${base}/api/whatever`);


interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  location?: {
    coordinates?: [number, number];
  };
  isDonor: boolean;
  isAvailable: boolean;
  totalDonations: number;
  lastDonationDate?: string;
  profilePicture?: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  
}

// Blood Request types
export interface BloodRequest {
  _id: string;
  requester: User;
  patientName: string;
  bloodGroup: string;
  units: number;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  hospital: {
    name: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    phone?: string;
  };
  location?: {
    coordinates?: [number, number];
  };
  requiredDate: string;
  description?: string;
  contactPerson: {
    name: string;
    phone: string;
    relationship?: string;
  };
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled' | 'expired';
  acceptedBy: Array<{
    donor: User;
    acceptedAt: string;
    status: 'accepted' | 'donated' | 'cancelled';
  }>;
  isUrgent: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  location?: {
    coordinates?: [number, number];
  };
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // Set token for authenticated requests
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async toggleDonorStatus(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/toggle-donor', {
      method: 'PUT',
    });
  }

  async toggleAvailability(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/toggle-availability', {
      method: 'PUT',
    });
  }

  // Blood Request endpoints
  async createBloodRequest(data: Omit<BloodRequest, '_id' | 'requester' | 'status' | 'acceptedBy' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ request: BloodRequest }>> {
    return this.request<{ request: BloodRequest }>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBloodRequests(params?: {
    status?: string;
    bloodGroup?: string;
    urgency?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ requests: BloodRequest[]; pagination: any }>> {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<{ requests: BloodRequest[]; pagination: any }>(`/requests${queryParams ? `?${queryParams}` : ''}`);
  }

  async getNearbyRequests(latitude: number, longitude: number, maxDistance?: number): Promise<ApiResponse<{ requests: BloodRequest[] }>> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      ...(maxDistance && { maxDistance: maxDistance.toString() }),
    });
    return this.request<{ requests: BloodRequest[] }>(`/requests/nearby?${params}`);
  }

  async acceptBloodRequest(requestId: string): Promise<ApiResponse<{ request: BloodRequest }>> {
    return this.request<{ request: BloodRequest }>(`/requests/${requestId}/accept`, {
      method: 'POST',
    });
  }

  async completeDonation(requestId: string): Promise<ApiResponse<{ request: BloodRequest }>> {
    return this.request<{ request: BloodRequest }>(`/requests/${requestId}/complete`, {
      method: 'POST',
    });
  }

  // Donor endpoints
  async getDonors(params?: {
    bloodGroup?: string;
    city?: string;
    state?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ donors: User[]; pagination: any }>> {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<{ donors: User[]; pagination: any }>(`/donors${queryParams ? `?${queryParams}` : ''}`);
  }

  async getNearbyDonors(latitude: number, longitude: number, maxDistance?: number, bloodGroup?: string): Promise<ApiResponse<{ donors: User[] }>> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      ...(maxDistance && { maxDistance: maxDistance.toString() }),
      ...(bloodGroup && { bloodGroup }),
    });
    return this.request<{ donors: User[] }>(`/donors/nearby?${params}`);
  }

  async getDonorStats(): Promise<ApiResponse<{
    totalDonors: number;
    availableDonors: number;
    bloodGroupStats: Array<{ _id: string; count: number }>;
    topDonors: User[];
    recentDonors: User[];
  }>> {
    return this.request('/donors/stats');
  }

  async getDonorLeaderboard(period?: string, limit?: number): Promise<ApiResponse<{ leaderboard: User[] }>> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (limit) params.append('limit', limit.toString());
    return this.request<{ leaderboard: User[] }>(`/donors/leaderboard?${params}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; message: string; timestamp: string }>> {
    return this.request('/health');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse };
