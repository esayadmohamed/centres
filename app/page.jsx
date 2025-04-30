

export default async function Home() {

    const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
    const data = await res.json();
    
    if (!res.ok) {
        console.error("API request failed", res.status, res.statusText);
    }

    console.log(data || 'no data');
    
    return <div>hello</div>
    
}






// import Centers from "./centres/page"
// <Centers />

// const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
// const data = await res.json();

// git add .
// git commit -m "Made changes to my app"
// git push origin master