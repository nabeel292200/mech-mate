export interface IUser {
  _id?: string;
  id: string;
  phone?: string;
  email?: string;
  name: string;
  role: "user" | "admin" | "mechanic";
  isProfileComplete: boolean;
  mechanic?: {
    _id?: string;
    id?: string;
    experience: number;
    workshopAddress: string;
    vehicleSkills: string[];
    brandExpertise: string[];
    specialistSkills: string[];
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
    role: "user" | "admin" | "mechanic";
    isProfileComplete: boolean;
    user: IUser;
  };
}
