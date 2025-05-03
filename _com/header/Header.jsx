import styles from './style.module.css'
import { getSessionData } from '@/_lib/utils/session';

import NavLogo from "./NavLogo"
import NavSidebar from "./NavSidebar"

export default async function Header() {

    const session = await getSessionData();

    return (
        <main className={styles.Nav} >
            <div className={styles.Navbar}>
                <NavLogo />
                <NavSidebar isAuthenticated={session? true : false}/>
            </div>
        </main>
    )
}
