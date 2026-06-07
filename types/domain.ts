export type UserRole = "client" | "artisan" | "admin";

export type MissionStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "waiting_confirmation"
  | "completed"
  | "cancelled";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  emailVerified?: boolean;
  emailVerifiedAt?: string | null;
  phoneVerified?: boolean;
  isBanned?: boolean;
  authProvider?: string;
  hasPassword?: boolean;
  hasGoogle?: boolean;
  /** Photo Google ou URL avatar utilisateur */
  avatarUrl?: string;
  picture?: string;
  city?: string;
  availability?: string;
  settings?: UserSettings;
}

export interface UserSettings {
  emailAlerts?: boolean;
  smsAlerts?: boolean;
  availability?: string;
}

export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: UserRole;
  city?: string;
  address?: string;
  specialty?: string;
  is_verified?: boolean;
  avatar_url?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export interface Mission {
  id: string;
  title: string;
  status: MissionStatus;
  customer_id?: string;
  artisan_id?: string | null;
  customer_name?: string;
  customer_phone?: string;
  location?: string;
  description?: string;
  price?: number | string | null;
  price_estimate?: number | null;
  price_final?: number | null;
  platform_fee?: number | null;
  artisan_payout?: number | null;
  photo_url?: string;
  photo_before?: string;
  photo_after?: string;
  lat?: number;
  lng?: number;
  urgency?: string;
  scheduled_at?: string | null;
  created_at?: string;
  completed_at?: string;
  artisan?: Pick<Profile, "first_name" | "last_name">;
}

export interface Session {
  user: AuthUser;
  profile: Profile | null;
}

export interface ArtisanStats {
  totalRevenue: number;
  totalGmv?: number;
  monthlyRevenue: number;
  weeklyMissionsCount: number;
  activeClients: number;
  recentMissions: Mission[];
  confirmedMissions: Mission[];
  availableMissions: Mission[];
}

export type AccountingPeriod = "day" | "week" | "month" | "year";

export interface ArtisanAccountingItem {
  bucket: string;
  missions: number;
  revenue: number;
  gmv?: number;
}

export interface ArtisanAccounting {
  period: AccountingPeriod;
  items: ArtisanAccountingItem[];
  totalRevenue?: number;
  totalGmv?: number;
}

export interface ClientStats {
  totalSpent: number;
  missionsCount?: number;
  activeMissions?: number;
}

export interface AdminDashboard {
  users: {
    total: number;
    clients: number;
    artisans: number;
    admins: number;
    banned: number;
    newLast30Days: number;
  };
  missions: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    createdToday: number;
    createdThisMonth: number;
  };
  revenue: {
    totalGmv: number;
    thisMonth: number;
    today: number;
    platformCommissionTotal: number;
    platformCommissionThisMonth: number;
    platformCommissionToday: number;
    commissionRate: number;
  };
  artisans: { pendingVerification: number; pendingApplications?: number };
}

export type PartnerApplicationStatus =
  | "pending"
  | "contacted"
  | "approved"
  | "rejected";

export interface PartnerApplication {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  city: string;
  trade: string;
  status: PartnerApplicationStatus;
  adminNote?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePartnerApplicationInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  city: string;
}

export interface PartnerApplicationSubmitResult {
  application: PartnerApplication;
  message: string;
  accountCreated?: boolean;
  emailSent?: boolean;
  userId?: string;
}

/** Données publiques pour le simulateur revenus artisan (/devenir-partenaire). */
export interface ArtisanEarningsEstimate {
  trade: string;
  /** Panier moyen net artisan par mission (€) */
  averageBasket: number;
  medianBasket?: number;
  /** Taux commission Nova (0.2 = 20 %) */
  commissionRate: number;
  /** Valeur par défaut du slider (missions/semaine) */
  avgMissionsPerWeek: number;
  minMissionsPerWeek: number;
  maxMissionsPerWeek: number;
  /** Nombre de missions terminées utilisées pour le calcul */
  sampleSize: number;
  city?: string;
  dataSource: "live" | "default";
  periodLabel?: string;
  avgWeeklyMissionsPlatform?: number;
}

export interface ContactMessageInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
}

export interface AdminAccountingItem {
  bucket: string;
  missions: number;
  gmv: number;
  platformCommission: number;
  artisanPayout: number;
}

export interface AdminAccounting {
  commissionRate: number;
  items: AdminAccountingItem[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isBanned?: boolean;
  banReason?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
}

export interface CreateMissionInput {
  title: string;
  status?: MissionStatus;
  first_name: string;
  last_name: string;
  customer_name?: string;
  customer_email: string;
  customer_phone: string;
  location: string;
  description?: string;
  price?: number;
  photo_url?: string;
  lat?: number;
  lng?: number;
}

export type GuestMissionCreateResponse = {
  mission: Mission;
  accountCreated?: boolean;
  autoLogin?: boolean;
};

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SmsVerifyInput {
  phone: string;
  code: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  address?: string;
  specialty?: string;
  availability?: string;
  latitude?: number;
  longitude?: number;
  settings?: UserSettings;
  role?: UserRole;
}
