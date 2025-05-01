import { AllHoods } from "@/_lib/centers/getdata";

export default async function Home() {

    const hoodsList = await AllHoods();
    const hoods = hoodsList?.map(item => item.name);

    console.log('log data:', hoods);
    console.log('DB_HOST:', process.env.DB_HOST);
    
    return (
        <ul>
            <li>Hoods...</li>
            {hoods?.map((item, id)=>
                <li key={id}> {item} </li>
            )}
        </ul>
    )
    
}




// import { getBaseUrl } from "@/_lib/utils/getBaseUrl";
// const baseurl = getBaseUrl();
// const res = await fetch(`${baseurl}/api/centres`, { cache: 'no-store' });
// const data = await res.json();
// const hoods = data?.hoods?.map(item => item.name);

// git add .
// git commit -m "Made changes to my app"
// git push origin master



// const local  = 'http://localhost:3000'
// const vercel = 'https://centres.vercel.app'

// import Centers from "./centres/page"
// <Centers />

// const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
// const data = await res.json();

// git add .
// git commit -m "Made changes to my app"
// git push origin master