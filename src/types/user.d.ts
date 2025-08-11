interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  otpVerified: boolean;
  role: ROLE;
  bio: string | null;
  expectationFromStreple: string | null;
  howFamiliarWithTrading: string | null;
  hasAnswer: boolean;
  stats: Record<string, unknown> | null;
  performanceHistory: Record<string, unknown> | null;
  followerCount: number;
  demoFundingBalance: string;
}

type ROLE =
  | "FOLLOWER"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "PRO_TRADER"
  | "PUBLISHER"
  | "MARKETER";
