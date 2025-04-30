// import Centers from "./centres/page"

export default async function Home() {

    const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
    const data = await res.json();

    return (
        <div>
            hello
            hlleo
            howhow
        </div>
    )
    // <Centers />

}


// git add .
// git commit -m "Made changes to my app"
// git push origin master