import { createClient } from '@supabase/supabase-js';
import type { MetadataRoute } from 'next';

export const revalidate = 86400; // Regenerate every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];

    const supabase = createClient(url, key);

    // Get all bowling centers
    const { data: centers } = await supabase
        .from('bowling_centers')
        .select('place_id, formatted_address');

    // Get unique cities
    const cities = new Set<string>();
    centers?.forEach((c) => {
        const parts = c.formatted_address.split(',');
        if (parts.length > 1) {
            const city = parts[parts.length - 2].trim().replace(/\d{4}\s*[A-Z]{2}\s*/g, '').trim();
            if (city) cities.add(city.toLowerCase().replace(/\s+/g, '-'));
        }
    });

    const baseUrl = 'https://bowlingplekken.nl';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/zoeken`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/steden`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/tips`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/tarieven`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ];

    // Dynamic bowling center pages
    const centerPages: MetadataRoute.Sitemap = (centers || []).map((center) => ({
        url: `${baseUrl}/bowlingbaan/${center.place_id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // City pages
    const cityPages: MetadataRoute.Sitemap = Array.from(cities).map((city) => ({
        url: `${baseUrl}/bowlen-in/${city}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...centerPages, ...cityPages];
}
