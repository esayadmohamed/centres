import styles from './style.module.css'

import NavLogo from "./NavLogo"
import NavSidebar from "./NavSidebar"

export default async function Header({session}) {

    return (
        <main className={styles.Nav} >
            <div className={styles.Navbar}>
                <NavLogo />
                <NavSidebar isAuthenticated={session? true : false}/>
            </div>
        </main>
    )
}
