import { singleArticle, SuggestedArticles } from '@/_lib/blog/getdata';
import { notFound } from 'next/navigation';

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import ArticlesContent from './Content';

export default async function Articles ({params}){

    const item = await params;
    const article_id = parseInt(item.id);

    const article = await singleArticle(article_id);
    if(!article) return notFound();

    const articles = await SuggestedArticles();
    
    return (    
        <div className="content">
            <Header /> 
                <ArticlesContent article={article} articles={articles}/>
            <Footer />
        </div>            
    )
}













// const [listings, listing, reviews_list, user_review] = await Promise.all([
//     allListings(),
//     Listing(center_id),
//     getReviewsList(),
//     getUserReview(center_id),
// ]);

// import { Listing } from "@/lib/listings/getdata";
// import { getReviewsList } from '@/lib/listings/getdata';
// import { allListings } from '@/lib/listings/getdata';
// import { getUserReview } from '@/lib/listings/getdata';



// import DisplayRoot from '@/app/components/center/Root';
// import DisplayBanner from './Banner';
// import DisplayContent from './Content';


{/* <Header session={session? true : false}/>

<div className={styles.DisplayPage}>
    <DisplayBanner listing={listing}/>

</div>

<div className={styles.EntityFooter}>

</div> */}