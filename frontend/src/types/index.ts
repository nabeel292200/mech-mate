export interface IUser {
  id: string;
  phone: string;
  name: string;
  role: "user" | "mechanic";
  isProfileComplete: boolean;
  mechanic?: {
    experience: number;
    workshopAddress: string;
    vehicleSkills: string[];
    brandExpertise: string[];
    isAvailable: boolean;
    liveLocation: boolean;
    rating: number;
    totalJobs: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    role: "user" | "mechanic";
    isProfileComplete: boolean;
    user: IUser;
  };
}
