import styles from './style.module.css'

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import NavLogo from "./NavLogo"
import NavSidebar from "./NavSidebar"

export default async function Header() {

    // const session = await getServerSession(authOptions);

    // console.log(session);

    return (
        <main className={styles.Nav} >
            <div className={styles.Navbar}>
                <NavLogo />
                <NavSidebar isAuthenticated={true}/>
            </div>
        </main>
    )
}
