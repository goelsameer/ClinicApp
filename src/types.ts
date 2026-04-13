export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  address: string;
  phone: string;
  weight: string;
  height: string;
  bp: string;
  created_at: string;
}

export interface Prescription {
  id?: number;
  visit_id?: number;
  brand_name: string;
  dosage: string;
  frequency: string;
  days: string;
  route: string;
}

export interface Visit {
  id: number;
  patient_id: number;
  patient_name?: string;
  age?: number;
  gender?: string;
  address?: string;
  phone?: string;
  weight?: string;
  height?: string;
  bp?: string;
  status: 'checked_in' | 'consulting' | 'completed';
  chief_complaint: string;
  diagnosis?: string;
  past_history: string;
  personal_history: string;
  family_history: string;
  treatment_history: string;
  allergies: string;
  advice: string;
  follow_up_date: string;
  created_at: string;
  prescriptions: Prescription[];
}
