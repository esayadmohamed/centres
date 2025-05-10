// next-sitemap.js

module.exports = {
  siteUrl: 'https://www.centres.ma', // Replace with your site's domain
  generateRobotsTxt: true, // Optional: Generate robots.txt file as well
  sitemapSize: 7000, // Optional: Max number of URLs per sitemap
  changefreq: 'daily', // Optional: You can adjust this frequency as per your needs
  priority: 0.7, // Optional: You can adjust this priority as per your needs
  transform: async (config, path) => {
    // Example transformation for the dynamic route: `/centres/[]`
    if (path === '/centres/[]') {
      return {
        loc: '/centres', // Assuming `/centres/[]` is just a placeholder for `/centres`
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      lastmod: new Date().toISOString(),
    };
  },
};




// /** @type {import('next-sitemap').IConfig} */
// module.exports = {
//   siteUrl: 'http://localhost:3000/',
//   generateRobotsTxt: true, // (optional)
//   sitemapSize: 7000,
//   // ...other options
// }

// '/'
// '/centres'
// '/centres/[]' 
// '/auth'
// '/signup'
// '/conditions'

