import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = process.env.ADMIN_USERNAME ?? "admin";
        const pass = process.env.ADMIN_PASSWORD;

        if (!pass) throw new Error("ADMIN_PASSWORD is not configured.");

        if (credentials?.username === user && credentials?.password === pass) {
          return { id: "1", name: "Admin", email: "admin@rusmas.local" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
