import styles from './style.module.css'

import NavLogo from "./NavLogo"
import NavSidebar from "./NavSidebar"

export default async function Header() {

    // const session = await getServerSession(authOptions);

    // console.log(session);

    return (
        <main className={styles.Nav} >
            <div className={styles.Navbar}>
                <NavLogo />
                <NavSidebar isAuthenticated={false}/>
            </div>
        </main>
    )
}
