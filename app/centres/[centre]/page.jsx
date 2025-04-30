'use server'
import styles from './entity.module.css'
import { notFound } from 'next/navigation';

import { GetListing, GetSuggested, getUserReview, getReviewsList } from '@/_lib/center/getdata';
import { UserAuthenticated } from '@/_lib/utils/userauth';

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import DisplayBanner from '@/_com/center/Banner';
import DisplayContent from '@/_com/center/Content';

export default async function DisplayCenter ({params}){

    const item = await params;
    const center_id = parseInt(item.centre);
   

    const listing = await GetListing(center_id);
    if(!listing) return notFound(); //stops all below
    
    const suggested = await GetSuggested(listing.city);

    const isReviewed = await getUserReview(center_id);

    const ReviewsList = await getReviewsList();

    const isAuthenticated = await UserAuthenticated();

    // console.log(listing.name);
    // return
    return (    
        <div className="content">
            <Header />
            
            <div className={styles.DisplayPage}>
                <DisplayBanner listing={listing}/>
                <DisplayContent 
                    listing={listing} 
                    suggested={suggested} 
                    ReviewsList={ReviewsList} 
                    isAuthenticated={isAuthenticated? true : false}
                    isReviewed={isReviewed? true : false}
                />
            </div>    

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