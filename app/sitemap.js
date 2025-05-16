// to create sitemap
// remove sitemap.xml
// go to http://localhost:3000/sitemap.xml 

export default function sitemap() {
  const dynamicUrls = [
    'https://centres.ma/centres/210023',
    'https://centres.ma/centres/240023',
    'https://centres.ma/centres/240024',
    'https://centres.ma/centres/240025',
    'https://centres.ma/blog/90001',
    'https://centres.ma/blog/90002',
    'https://centres.ma/blog/90003',
    'https://centres.ma/blog/90004',
    'https://centres.ma/blog/120001',
    'https://centres.ma/blog/120003',
    'https://centres.ma/blog/120004',
    'https://centres.ma/blog/150001',
  ];

  const staticUrls = [
    {
      url: 'https://centres.ma/',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://centres.ma/centres',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://centres.ma/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  const allUrls = [
    ...staticUrls,
    ...dynamicUrls.map((url) => ({
      url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];

  return allUrls;
}



// export default function sitemap() {
//     const dynamicUrls = [
//         'https://centres.ma/centres/210023',
//         'https://centres.ma/centres/240023',
//         'https://centres.ma/centres/240024',
//         'https://centres.ma/centres/240025',
//         // ---------------------------
//         'https://centres.ma/blog/90001',
//         'https://centres.ma/blog/90002',
//         'https://centres.ma/blog/90003',
//         'https://centres.ma/blog/90004',
//         'https://centres.ma/blog/120001',
//         'https://centres.ma/blog/120003',
//         'https://centres.ma/blog/120004',
//         'https://centres.ma/blog/150001',
//     ]; 

//     const staticUrls = [
//         {
//         url: 'https://centres.ma/',
//         lastModified: new Date(),
//         changeFrequency: 'yearly',
//         priority: 1,
//         },
//         {
//         url: 'https://centres.ma/centres',
//         lastModified: new Date(),
//         changeFrequency: 'monthly',
//         priority: 0.8,
//         },
//         {
//         url: 'https://centres.ma/blog',
//         lastModified: new Date(),
//         changeFrequency: 'weekly',
//         priority: 0.5,
//         }
//     ];

//     // Combine static and dynamic URLs
//     const allUrls = [
//         ...staticUrls,
//         ...dynamicUrls.map((url) => ({
//         url,
//         lastModified: new Date(),
//         changeFrequency: 'monthly',
//         priority: 0.7,
//         })),
//     ];

//     // Ensure it returns a valid format for metadata route (Next.js specific)
//     return allUrls.map((item) => ({
//         url: item.url,
//         lastModified: item.lastModified,
//         changeFrequency: item.changeFrequency,
//         priority: item.priority,
//     }));
// }

