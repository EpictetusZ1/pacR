import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

const SignInOut = async () => {
    const session = await auth()
    console.log("Session")
    console.log(session)
    return (
        <div>
            {session ? (
               <div>
                     <form action={async () => {
                          "use server"
                          await signOut()
                     }}>
                          <button>Sign Out</button>
                     </form>
               </div>
            ) : (
                <div>
                    <form action={async () => {
                        "use server"
                        await signIn()
                    }}>
                        <button>Sign In</button>
                    </form>
                </div>

            )}
            {/*    create a server action to sign in with net auth v5*/}

        </div>
    )
}

export default SignInOut

