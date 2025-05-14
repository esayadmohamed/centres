import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import BlogContent from "./Content";

export default async function Blog() {

    const articles = [
        { 
            title: 'Where does it come from?', 
            content:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'
        }, 
        { 
            title: 'Where does it come from?', 
            content:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'
        }, 
        { 
            title: 'Where does it come from?', 
            content:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'
        }, 
    ]
        
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