import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import BlogContent from "./Content";

import { AllArticles } from "@/_lib/blog/getdata";

export default async function Blog() {

    const articles = await AllArticles();

    return (
        <main className="content">
            <Header />
            <BlogContent articlesData={articles}/>
            <Footer /> 
        </main>
    )
}


// Next.js App Router (with Server Components) tries to pre-render pages (SSG) where possible. But when it detects dynamic features like headers() or database queries that depend on request headers (like getting the user's session), it falls back to dynamic rendering, which breaks static optimization.
// If userListings() is using authentication (e.g., sessions, headers, cookies), it's normal that it needs to be dynamic. Alternatively, if your data isn't user-specific, consider refactoring the logic to make the page static.

// git add .
// git commit -m "Made changes to my app"
// git push origin master