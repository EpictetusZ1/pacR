import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import {signIn, signOut} from "next-auth/react";

const SignInOut = async () => {
    const session = await getServerSession(authOptions);
    console.log(session)
    if (session) {
        return (
            <div>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        );
    } else {
        return (
            <div>
                <button onClick={() => signIn()}>Sign In</button>
            </div>
        );
    }
};

export default SignInOut;