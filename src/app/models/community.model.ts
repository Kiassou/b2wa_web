export interface Community {

  id: string;

  name: string;

  category: string;

  description: string;

  longDescription?: string;

  icon: string;

  cover: string;

  admin: string;

  members: number;

  posts: number;

  products: number;

  verified: boolean;

  isMember: boolean;

  isAdmin: boolean;

  avatars: string[];

  /* =========================
     SETTINGS
  ========================== */

  isPublic?: boolean;

  allowMembers?: boolean;

  allowComments?: boolean;

  allowLives?: boolean;

  /* =========================
     B2WA LIVE
  ========================== */

  liveCapacity?: number;

  liveDuration?: number;

  /* =========================
     RULES
  ========================== */

  rules?: string;

  /* =========================
     DATE
  ========================== */

  createdAt?: string;
}