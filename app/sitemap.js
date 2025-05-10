// app/sitemap.js

export default function sitemap() {
    const dynamicUrls = [
        'https://centres.ma/centres/123',
        'https://centres.ma/centres/124',
        'https://centres.ma/centres/125',
    ]; // Add your dynamic URLs here

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
        url: 'https://centres.ma/conditions',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
        },
    ];

    // Combine static and dynamic URLs
    const allUrls = [
        ...staticUrls,
        ...dynamicUrls.map((url) => ({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        })),
    ];

    // Ensure it returns a valid format for metadata route (Next.js specific)
    return allUrls.map((item) => ({
        url: item.url,
        lastModified: item.lastModified,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
    }));
}

