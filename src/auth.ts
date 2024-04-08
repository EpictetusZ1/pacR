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
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    ],
    callbacks: {
        async session({ session, user }): Promise<any> {
            if (session.user.email) {
                let userRecord = await prisma.user.findUnique({
                    where: {
                        email: session.user.email,
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                    }
                })
                if (userRecord) {
                    session.user.id = userRecord.id.toString()
                }
            }
            return session
        },
        async signIn({ user, account, profile }) {
            const { email } = user;
            if (email) {
                let userRecord = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                })

                if (!userRecord) {
                    // User not found, create a new user
                    userRecord = await prisma.user.create({
                        data: {
                            email,
                            name: user.name,
                            image: user.image,
                        },
                    })
                }

                // Attach additional data to the user object
                if (userRecord) {
                    user.id = userRecord.id.toString()
                }

                return !!userRecord
            }
            return false
        },
    },
})
