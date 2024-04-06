import { auth } from "@/auth";
import Link from "next/link";

const SignInOut = async () => {
    const session = await auth()

    console.log("Session")
    console.log(session)
    return (
        <div>
            <Link href="/api/auth/signin">
                <button >Sign in</button>
            </Link>        </div>
    )
}

export default SignInOut

