import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Sécurité Kapex : Autoriser uniquement le domaine du cabinet
      const allowedDomain = "@nomducabinet.fr"; // À adapter
      if (user.email?.endsWith(allowedDomain)) {
        return true;
      }
      return false;
    },
    async session({ session, token, user }: any) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
