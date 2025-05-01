import { getBaseUrl } from "@/_lib/utils/getBaseUrl";

// import Header from "@/_com/header/Header";
import Footer from "@/_com/footer/Footer";

export default async function Centers() {

    const baseurl = getBaseUrl();

    const res = await fetch(`${baseurl}/api/centres`, { cache: 'no-store' });
    const data = await res.json();

    const cities = data?.cities?.map(item => item.name);
    
    return (         
        <main className="content">
            {/* <Header /> */}
            <ul>
                {cities.map((item, id)=> 
                    <li key={id}> {item} </li>
                )}
            </ul>

            <Footer />
        </main>
    )
}


// git add .
// git commit -m "Made changes to my app"
// git push origin master





{/* <Listings 
    listings_list={data?.listings}
    cities_list={data?.cities}
    hoods_list={data?.hoods}
/> */}

// import Listings from "./Listings";


// 
{/*  */}
{/*  */}
{/*   */}




// import { AllListings, AllCities, AllHoods } from "@/_lib/centers/getdata";

// listings_list={listings_list}
// cities_list={cities_list}
// hoods_list={hoods_list}

// const listings_list = await AllListings(); 
// const cities_list = await AllCities();
// const hoods_list  = await AllHoods();