import Centers from "./centres/page"


export default async function Home() {
    
    return <Centers />

}



// git add .
// git commit -m "Made changes to my app"
// git push origin master





// rm -rf .next
// npm run build
// npm run postbuild



// import Centers from "./centres/page";


// import { AllHoods } from "@/_lib/centers/getdata";
    // console.log(hoods);
    // const hoodsList = await AllHoods();
    // const hoods = hoodsList?.map(item => item.name);

    // console.log('log data:', hoods);
    // console.log('-----------');
    // console.log('DB_HOST:', process.env.DB_HOST);
// import { getBaseUrl } from "@/_lib/utils/getBaseUrl";
// const baseurl = getBaseUrl();
// const res = await fetch(`${baseurl}/api/centres`, { cache: 'no-store' });
// const data = await res.json();
// const hoods = data?.hoods?.map(item => item.name);


// const local  = 'http://localhost:3000'
// const vercel = 'https://centres.vercel.app'

// import Centers from "./centres/page"
// <Centers />

// const res = await fetch(`${'https://centres.vercel.app'}/api/centres`, { cache: 'no-store' });
// const data = await res.json();

// git add .
// git commit -m "Made changes to my app"
// git push origin master



// const sendNotification = async () => {
//     const res = await fetch("/api/notify", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ message:'12345' }),
//     });
    
//     const result = await res.json();

//     console.log(result.success ? "✅ Notification sent!" : "❌ Failed to send.");
// };


// CREATE TABLE tokens (
//     id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each record
//     email VARCHAR(255) NOT NULL,
//     token VARCHAR(255) NOT NULL,
//     expiration_time INT NOT NULL,
//     send INT DEFAULT 0,
//     FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
// )

// CREATE TABLE blog (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     content TEXT NOT NULL,
//     image VARCHAR(255) DEFAULT NULL,
//     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     view INT DEFAULT 1
// )

// CREATE TABLE centers (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     city VARCHAR(255) NOT NULL,
//     UNIQUE (name, city)
// )

// CREATE TABLE emails (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     email VARCHAR(255) NOT NULL,
//     center_id INT NOT NULL,
//     status INT NOT NULL DEFAULT 1,
//     UNIQUE (email),
//     FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
// )

// CREATE TABLE numbers (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     number VARCHAR(255) NOT NULL,
//     center_id INT NOT NULL,
//     UNIQUE (number),
//     FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
// )