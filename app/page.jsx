import { getBaseUrl } from "@/_lib/utils/getBaseUrl";

export default async function Home() {
    const baseurl = getBaseUrl();

    const res = await fetch(`${baseurl}/api/centres`, { cache: 'no-store' });
    const data = await res.json();

    const cities = data?.hoods?.map(item => item.name);

    console.log('log data:', cities);
    
    return (
        <ul>
            <li>cities</li>
            {cities?.map((item, id)=>
                <li key={id}> {item} </li>
            )}
        </ul>
    )
    
}

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