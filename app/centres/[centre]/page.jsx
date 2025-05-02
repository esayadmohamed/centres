import styles from './entity.module.css'
import { getBaseUrl } from "@/_lib/utils/getBaseUrl";
import { notFound } from 'next/navigation';

import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";
import DisplayBanner from '@/_com/center/Banner';
import DisplayContent from '@/_com/center/Content';

export default async function DisplayCenter ({params}){

    const baseurl = getBaseUrl();

    const item = await params;
    const center_id = parseInt(item.centre);

    const res = await fetch(`${baseurl}/api/centre?center_id=${center_id}`, { cache: 'no-store' });
    const data = await res.json();

    if(data.error) return notFound();

    return (    
        <div className="content">
            <Header session={data?.session} /> 
            
            <div className={styles.DisplayPage}>
                <DisplayBanner listing={data?.listing}/>
                <DisplayContent 
                    listing={data?.listing} 
                    suggested={data?.suggested} 
                    ReviewsList={data?.ReviewsList} 
                    isAuthenticated={data?.session? true : false}
                    isReviewed={data?.isReviewed? true : false}
                /> 
            </div>    

            <Footer />
        </div>            
    )
}

// 
// import { UserAuthenticated } from '@/_lib/utils/userauth';


// const listing = await GetListing(center_id);
// if(!listing) return notFound(); 

// const suggested = await GetSuggested(listing.city);

// const isReviewed = await getUserReview(center_id);

// const ReviewsList = await getReviewsList();

// const isAuthenticated = await UserAuthenticated();












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