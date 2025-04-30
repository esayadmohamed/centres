import { Geist, Geist_Mono } from "next/font/google";
import styles from './auth.module.css'


export const metadata = {
  title: "Centre de Soutien",
  description: "Trouvez un centre qui vous convient.",
};


export default function RootLayout({ children }) {
    return (
        <main className={styles.layout}>
            {children}
        </main>
    );
}
