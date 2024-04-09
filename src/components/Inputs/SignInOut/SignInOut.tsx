import { auth, signIn, signOut } from "@/auth";

const SignInOut = async () => {
    const session = await auth()
    return (
        <div>
            {session ? (
               <div>
                     <form action={async () => {
                          "use server"
                          await signOut()
                     }}>
                          <button className="bg-darkCyan-500 hover:bg-darkCyan-400 text-white font-bold py-2 px-4 rounded">Sign Out</button>
                     </form>
               </div>
            ) : (
                <div>
                    <form action={async () => {
                        "use server"
                        await signIn()
                    }}>
                        <button className="bg-darkCyan-500 hover:bg-darkCyan-400 text-white font-bold py-2 px-4 rounded">Sign In</button>
                    </form>
                </div>

            )}
        </div>
    )
}

export default SignInOut

