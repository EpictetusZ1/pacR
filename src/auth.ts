import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../prisma";


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: { strategy: "jwt" },
    adapter: PrismaAdapter(prisma),
    providers: [GitHub],
        callbacks: {
        async session({ session, user }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                },
            }
        }
    },
})
