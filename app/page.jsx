

export default async function Home() {


    const [cities] = await db.query("SELECT * FROM cities");
    
    console.log(cities || 'no cities');
    
    return <div>hello</div>
    

}






// import Centers from "./centres/page"
// <Centers />

// const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
// const data = await res.json();

// git add .
// git commit -m "Made changes to my app"
// git push origin master