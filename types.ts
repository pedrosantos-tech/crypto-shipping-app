export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  balance: number;
  role: UserRole;
}

export interface Address {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email?: string;
}

export interface ShippingLabel {
  id: string;
  userId: string;
  from: Address;
  to: Address;
  weight: number;
  service: 'ground' | 'priority' | 'express';
  cost: number;
  trackingNumber: string;
  status: 'created' | 'shipped' | 'delivered';
  createdAt: string; // ISO date
  pdfUrl?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: 'USDT' | 'LTC' | 'ETH' | 'DAI';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  type: 'deposit' | 'deduction';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}