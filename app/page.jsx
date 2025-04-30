import { getBaseUrl } from "@/_lib/utils/getBaseUrl";

export default async function Home() {

    const baseurl = getBaseUrl();

    const res = await fetch(`${baseurl}/api/centres`, { cache: 'no-store' });
    const data = await res.json();

    console.log('baseurl__:', baseurl);
    console.log('log data:', data);
    
    return (
        <div>hello</div>
    )
    
}






// import Centers from "./centres/page"
// <Centers />

// const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
// const data = await res.json();

// git add .
// git commit -m "Made changes to my app"
// git push origin master