import styles from './style.module.css'
import { getSessionData } from '@/_lib/utils/session';

import NavLogo from './logo';
import NavLinks from './links';
import NavAction from './action';

export default async function Header() {

    const session = await getSessionData();

    return (
        <main className={styles.Nav} >
            <div className={styles.Navbar}>
                <NavLogo isAuthenticated={session? true : false}/>
                <NavLinks auth={session? true : false}/> 
                <NavAction auth={session? true : false}/>
            </div>
        </main>
    )
}
