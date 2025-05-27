import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              client: true,
              seller: true,
            },
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          console.log("User from DB:", user) // Debug
          console.log("User created_at:", user.created_at) // Debug

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,
            role: user.role,
            createdAt: user.created_at.toISOString(), // Convertir en string ISO
            client: user.client,
            seller: user.seller,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log("JWT callback - user:", user) // Debug
      console.log("JWT callback - token before:", token) // Debug

      if (user) {
        token.role = user.role
        token.createdAt = user.createdAt // Doit être la string ISO
        token.client = user.client
        token.seller = user.seller

        console.log("JWT callback - token after:", token) // Debug
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token) // Debug

      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as "CLIENT" | "SELLER"
        session.user.createdAt = token.createdAt as string
        session.user.client = token.client
        session.user.seller = token.seller

        console.log("Session callback - session.user:", session.user) // Debug
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                username: user.email!.split("@")[0],
                role: "CLIENT",
                emailVerified: new Date(),
                image: user.image,
              },
            })

            await prisma.client.create({
              data: {
                userId: newUser.id,
                firstname: user.name?.split(" ")[0] || "",
                lastname: user.name?.split(" ").slice(1).join(" ") || "",
              },
            })
          }
        } catch (error) {
          console.error("Google sign in error:", error)
          return false
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}
