export interface User {
  id: string;
  email: string;
  role: "client" | "artisan" | "admin";
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface Artisan {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  specialty: "plomberie" | "electricite" | "chauffage" | "clim" | "serrurerie" | "vitrerie";
  phone: string;
  is_available: boolean;
  latitude?: number;
  longitude?: number;
  average_rating: number;
  acceptance_rate_30d: number;
}

export interface Intervention {
  id: string;
  client_id: string;
  artisan_id?: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  type: string;
  description: string;
  urgency_level: "urgent" | "standard" | "planifiable";
  estimated_price_min: number;
  estimated_price_max: number;
  final_price?: number;
  latitude: number;
  longitude: number;
  created_at: string;
  completed_at?: string;
}

export interface FicheIntervention {
  id: string;
  intervention_id: string;
  photos_after: string[];
  client_signature_url?: string;
  notes: string;
  generated_pdf_url?: string;
  created_at: string;
}
