export interface IUser {
  _id?: string;
  id: string;
  phone: string;
  name: string;
  role: "user" | "mechanic";
  isProfileComplete: boolean;
  mechanic?: {
    _id?: string;
    id?: string;
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
