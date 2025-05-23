import styles from "./entity.module.css";

import { GetListing } from '@/_lib/center/getdata';

export async function generateMetadata({ params }) {
    
    const item = await params;
    const center_id = parseInt(item.centre);

    if (!center_id) {
        return {
          title: "Centre de Soutien - Trouvez le Meilleur Accompagnement",
          description: "Découvrez des centres de soutien adaptés à vos besoins.",
        };
    }

    const listing = await GetListing(center_id);

    return {
        title: `${listing?.name} - Centre de Soutien a ${listing?.city}, ${listing?.hood}`,
        description: `Découvrez ${listing?.name}, un centre de soutien situeé à ${listing?.city}.`,
    };
}

export default function CenterLayout({ children }) {
    return (
        <main className={styles.EntityLayout}>
            {children}
        </main>
    );
}

