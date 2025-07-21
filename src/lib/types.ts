export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UrgencyLevel = 'Urgent' | 'High' | 'Medium' | 'Low';
export type AvailabilityStatus = 'Available' | 'Not Available' | 'Temporarily Unavailable';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bloodType: BloodType;
  availability: AvailabilityStatus;
  donations: number;
  lastDonationDate: string; // e.g., '2023-10-26'
  dateOfBirth: string;
  avatarUrl: string;
  badges: string[];
  role: 'donor' | 'recipient' | 'admin';
  weight?: number;
}

export interface DonationOffer {
  id: string;
  donorId: string;
  donorName: string;
  donorBloodType: BloodType;
  donorAvatarUrl: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Completed';
}

export interface BloodRequest {
  id: string;
  requesterName: string;
  bloodType: BloodType;
  quantity: number; // in units
  location: string;
  urgency: UrgencyLevel;
  date: string;
  status: 'Open' | 'Fulfilled' | 'Closed' | 'Completed';
  neededByDate: string;
  details?: string;
  offers?: DonationOffer[];
}

export interface DonationOpportunity {
    id: string;
    patientName: string;
    location: string; // General area like 'Mirpur, Dhaka'
    distance: string;
    bloodType: BloodType;
    urgency: UrgencyLevel;
    phone: string;
    lat?: number;
    lng?: number;
    quantity: number;
    hospitalName: string;
    hospitalAddress: string;
    neededByDate: string;
    details?: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodType: BloodType;
  location: string;
  availability: AvailabilityStatus;
  avatarUrl: string;
  reportUrl?: string;
  age: number;
  weight: number;
}

export interface ChatMessage {
    sender: 'me' | 'other';
    text: string;
    avatar: string;
    senderName: string;
    time: string;
}

export interface Conversation {
    id: string;
    partnerName:string;
    partnerAvatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: ChatMessage[];
}

export interface Notification {
  id: string;
  type: 'offer_accepted' | 'new_message' | 'request_fulfilled' | 'welcome';
  text: string;
  date: string;
  read: boolean;
  link?: string;
}
