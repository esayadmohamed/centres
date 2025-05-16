
import styles from '../blog.module.css'

import { singleArticle } from "@/_lib/blog/getdata";

export async function generateMetadata({ params }) {
    
    const item = await params;
    const article_id = parseInt(item.id);
    
    if (!article_id) {
        return {
          title: "Centre de Soutien - Trouvez le Meilleur Accompagnement",
          description: "Découvrez des centres de soutien adaptés à vos besoins.",
        };
    }

    const article = await singleArticle(article_id);

    return {
        title: `${article?.title}`,
        description: `${article?.content.slice(0, 100)}...`,
    };
}

export default function ArticleLayout({ children }) {
    return (
        <main className={styles.ArticlePage}>
            {children}
        </main>
    );
}

