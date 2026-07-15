export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  bloodGroup?: string;
  emergencyInfo?: string;
  address?: string;
  medicalNotes?: string;
  photoURL?: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Journey {
  id: string;
  userId: string;
  source: string;
  destination: string;
  expectedArrivalTime: string;
  notes?: string;
  status: "active" | "completed" | "delayed" | "cancelled";
  createdAt: string;
}

export interface Incident {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  imageURL?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: string;
}

export interface SOSEvent {
  id: string;
  userId: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
    address?: string;
  };
  status: "active" | "resolved";
  createdAt: string;
}

export interface SafeNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "journey" | "sos" | "incident" | "alert";
  read: boolean;
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  theme: "light" | "dark";
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}
