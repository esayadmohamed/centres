import getDB from "./_lib/db";

async function getIds() {
    try {
        const db = getDB();
        const [rows] = await db.execute(`
            SELECT id FROM listings
        `);

        return rows; // Ensure this is an array of objects, e.g., [{ id: 1 }, { id: 2 }]
    } catch (error) {
        console.error("Database error:", error);
        return []; // Return an empty array in case of error
    }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.centres.ma/', // Use the correct domain format
    generateRobotsTxt: true,

    additionalPaths: async (config) => {
        // Fetch the listing IDs from the database
        const rowIds = await getIds();

        // If no rows found, return just the static paths
        if (rowIds.length === 0) {
        return [
            await config.transform(config, '/'),
            await config.transform(config, '/centres'),
            await config.transform(config, '/auth'),
            await config.transform(config, '/auth/signup'),
            await config.transform(config, '/auth/reset'),
            await config.transform(config, '/conditions'),
        ];
        }

        // Map the IDs into paths
        const paths = [
        await config.transform(config, '/'),
        await config.transform(config, '/centres'),
        await config.transform(config, '/auth'),
        await config.transform(config, '/auth/signup'),
        await config.transform(config, '/auth/reset'),
        await config.transform(config, '/conditions'),
        ];

        for (const index of rowIds) {
        // Ensure each object in rowIds has an `id` field
        if (index.id) {
            paths.push(await config.transform(config, `/centres/${index.id}`));
        }
        }

        return paths;
    },
};




// /** @type {import('next-sitemap').IConfig} */
// module.exports = {
//   siteUrl: 'https://www.yourdomain.com', // replace with your domain
//   generateRobotsTxt: true, // (optional) generate robots.txt
//   sitemapSize: 5000, // split into multiple if more pages
// };

