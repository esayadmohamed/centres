import styles from "./entity.module.css";

// import { Listing } from "@/lib/listings/getdata";

// export async function generateMetadata({ params }) {
    
//     const item = await params;
//     const center_id = parseInt(item?.entity);

//     if (!center_id) {
//         return {
//           title: "Centre de Soutien - Trouvez le Meilleur Accompagnement",
//           description: "Découvrez des centres de soutien adaptés à vos besoins.",
//         };
//     }

//     const listing  = await Listing(center_id);
  
//     return {
//       title: `${listing?.name} - Centre de Soutien`,
//       description: `Découvrez ${listing?.name}, un centre de soutien situeé à ${listing?.city}.`,
//     };
// }

export default function CenterLayout({ children }) {
    return (
        <main className={styles.EntityLayout}>
            {children}
        </main>
    );
}

