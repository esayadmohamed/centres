// import Centers from "./centres/page"

export default async function Home() {

    const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
    const data = await res.json();
    
    console.log(data);
    

    return <div>hello</div>
    
    // <Centers />

}


// git add .
// git commit -m "Made changes to my app"
// git push origin master