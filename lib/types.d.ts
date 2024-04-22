export type SessionData = {
  session: {
    success: boolean;
    data?: {
      zelId: string;
      cookie: string;
      expiresAt: string;
    };
    error?: string;
  };
};
