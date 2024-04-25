export interface SessionData {
  session: Session;
}

export interface Session {
  success: boolean;
  data?: {
    zelId: string;
    cookie: string;
    expiresAt: string;
  };
  error?: string;
}
