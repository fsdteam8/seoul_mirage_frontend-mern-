import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { JWT } from "next-auth/jwt";

// Extend the User and Profile types to include custom fields
declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
    token?: string;
  }
  interface Profile {
    email_verified?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 36 * 60 * 60, // 36 hours
  },
  providers: [
    // ✅ Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ✅ Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),

    // ✅ Custom Credentials Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data?.token || !data?.data) {
            throw new Error(data.message || "Invalid credentials");
          }

          const user = data.data;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            phone: user.phone,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            token: data.token,
          };
        } catch (error) {
          console.error("Credentials login error:", error);
          throw new Error("Login failed. Please try again.");
        }
      },
    }),
  ],

  callbacks: {
    // Handle social provider login
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        // const endpoint =
        //   account.provider === "google"
        //     ? "/api/google/auth/jwt-process"
        //     : "/api/facebook/auth/jwt-process";
        try {
          if (account.provider === "google") {

            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/third-party/jwt-process`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: profile?.name,
                  email: profile?.email,
                  googleAuthentication: profile?.email_verified,
                  // facebookAuthentication: account.provider === "facebook",
                }),
              }
            );

            const data = await res.json();

            console.log(data)
            if (!data?.token || !data?.user) {

              return false;
            }

            user.id = data.user.id;
            user.name = data.user.name;
            user.email = data.user.email;
            user.image = data.user.image;
            user.role = data.user.role;
            user.phone = data.user.phone;
            user.createdAt = data.user.created_at;
            user.updatedAt = data.user.updated_at;
            user.token = data.token;
          } else if (account.provider === "facebook") {
            console.log(profile)
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/third-party/jwt-process`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: profile?.name,
                  email: profile?.email,
                  googleAuthentication: true,
                  // facebookAuthentication: account.provider === "facebook",
                }),
              }
            );

            const data = await res.json();


            if (!data?.token || !data?.user) {
              console.error(`${account.provider} login failed:`, data);
              return false;
            }

            user.id = data.user.id;
            user.name = data.user.name;
            user.email = data.user.email;
            user.image = data.user.image;
            user.role = data.user.role;
            user.phone = data.user.phone;
            user.createdAt = data.user.created_at;
            user.updatedAt = data.user.updated_at;
            user.token = data.token;
          }
        } catch (err) {
          console.error(`${account.provider} signIn error:`, err);
          return false;
        }
      }

      return true;
    },

    // Add user to JWT token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
        token.phone = user.phone;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        token.accessToken = user.token;
      }
      return token;
    },

    // Add JWT token to session object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.image,
        role: token.role,
        phone: token.phone,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
        token: token.accessToken,
      };
      return session;
    },
  },
};
