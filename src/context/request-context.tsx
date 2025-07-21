'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { DonationOpportunity } from '@/lib/types';

export type AppMode = 'donor' | 'recipient';

const initialOpportunities: DonationOpportunity[] = [
    { id: 'opp_1', patientName: 'Jahanara Begum', location: 'Mirpur, Dhaka', distance: '5 km', bloodType: 'O+', urgency: 'Urgent', phone: '+8801987654321', lat: 23.8223, lng: 90.3653, quantity: 2, hospitalName: 'Dhaka Medical College', hospitalAddress: 'Dhaka Medical College Hospital, Dhaka 1000', neededByDate: '2024-07-28', details: 'Patient is critical and needs blood urgently for surgery.' },
    { id: 'opp_2', patientName: 'Kamal Hossain', location: 'Uttara, Dhaka', distance: '12 km', bloodType: 'A+', urgency: 'Medium', phone: '+8801555444333', lat: 23.8759, lng: 90.3795, quantity: 1, hospitalName: 'Kurmitola General Hospital', hospitalAddress: 'New Airport Rd, Dhaka 1206', neededByDate: '2024-07-30', details: 'Scheduled transfusion.' },
];


interface RequestContextType {
  opportunities: DonationOpportunity[];
  addOpportunity: (opportunity: Omit<DonationOpportunity, 'id' | 'distance' | 'hospitalName' | 'hospitalAddress'>) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<DonationOpportunity[]>(initialOpportunities);
  const [mode, setMode] = useState<AppMode>('donor');

  const addOpportunity = (opportunityData: Omit<DonationOpportunity, 'id' | 'distance' | 'hospitalName' | 'hospitalAddress'>) => {
    const newOpportunity: DonationOpportunity = {
        ...opportunityData,
        id: `opp_${Date.now()}`,
        distance: `${Math.floor(Math.random() * 15) + 1} km`, // Mock distance
        hospitalName: 'User-specified location',
        hospitalAddress: opportunityData.location,
    };
    setOpportunities(prev => [newOpportunity, ...prev]);
  };

  return (
    <RequestContext.Provider value={{ opportunities, addOpportunity, mode, setMode }}>
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
}
