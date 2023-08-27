import NextAuth, { DefaultSession, JWT } from "next-auth";
import { DefaultJWT } from 'next-auth/jwt';

declare module "next-auth" {
  
  interface User {
    id: number;
    email: string;
    username: string;
  }
  
  interface Session {
    user: User;
  }

  interface DefaultUser {
    id: number;
    email: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: number;
    username: string;
  }
}