// const withSitemap = require('next-sitemap')

// module.exports = {
//   siteUrl: 'http://localhost:3000', //'https://www.centres.ma/', 
//   generateRobotsTxt: true, 
//   changefreq: 'daily', // Frequency of page updates
//   priority: 0.7,
//   sitemapSize: 7000,
// }

// module.exports = withSitemap({
//   reactStrictMode: true,
// })





// import getDB from "./_lib/db.js";

// async function getIds() {
//     try {
//         const db = getDB();
//         const [rows] = await db.execute(`SELECT id FROM listings`);
//         return rows; // Ensure this is an array of objects, e.g., [{ id: 1 }, { id: 2 }]
//     } catch (error) {
//         console.error("Database error:", error);
//         return []; // Return an empty array in case of error
//     }
// }

// module.exports = {
//     siteUrl: 'https://www.centres.ma/',
//     generateRobotsTxt: true,

//     additionalPaths: async (config) => {
//         const rowIds = await getIds();

//         const staticPaths = [
//             '/',
//             '/centres',
//             '/auth',
//             '/auth/signup',
//             '/auth/reset',
//             '/conditions',
//         ];

//         // Add static paths
//         let paths = await Promise.all(
//             staticPaths.map(async (path) => await config.transform(config, path))
//         );

//         // Add dynamic paths for listings
//         if (rowIds.length > 0) {
//             const listingPaths = await Promise.all(
//                 rowIds.map(async (listing) => await config.transform(config, `/centres/${listing.id}`))
//             );
//             paths = paths.concat(listingPaths);
//         }

//         return paths;
//     },
// };
