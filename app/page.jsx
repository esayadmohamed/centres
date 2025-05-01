export default async function Home() {

    const local  = 'http://localhost:3000'
    const vercel = 'https://centres.vercel.app'

    const res = await fetch(`${vercel}/api/centres`, { cache: 'no-store' });
    const data = await res.json();

    console.log('log data:', data);
    
    return <div>hiho</div>
    
}

// git add .
// git commit -m "Made changes to my app"
// git push origin master





// import Centers from "./centres/page"
// <Centers />

// const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
// const data = await res.json();

// git add .
// git commit -m "Made changes to my app"
// git push origin master