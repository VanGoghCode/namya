import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Simple hardcoded check since this is a personal portfolio
        const adminUser = process.env.ADMIN_USER;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (
          credentials?.username === adminUser &&
          credentials?.password === adminPass
        ) {
          return { id: "1", name: "Admin", email: "admin@namya.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Default is fine, but we can customize later if needed
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
