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
        async session({ session, user }) {
            console.log("Session")
            console.log("user")
            console.log(user)
            console.log(session)
            // return {
            //     ...session,
            //     user: {
            //         ...session.user,
            //         id: user.id,
            //     },
            // }
            return session
        },
        async signIn({ user, account, profile }) {
            const { email } = user;
            if (email) {
                let userRecord = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

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

                // Optional: Attach additional data to the user object
                // This is useful if you want to access it in other callbacks
                if (userRecord) {
                    user.id = userRecord.id.toString()
                }

                return !!userRecord;
            }
            return false; // Deny sign in if email is not provided
        },
    },
})
