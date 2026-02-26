// Dynamic sitemap — generates all routes for Google Search Console indexing
import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://bowlonl.nl';
    const lastModified = new Date();

    // Static routes
    const staticRoutes = [
        '',
        '/zoeken',
        '/steden',
        '/tarieven',
        '/tips',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Guard: if env vars are missing, return only static routes
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
        return staticRoutes;
    }

    // Create supabase client inline (avoids module-level instantiation crash)
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all bowling centers for dynamic routes
    const { data: centers } = await supabase
        .from("bowling_centers")
        .select("place_id, formatted_address");

    // Centers routes
    const centerRoutes = (centers || []).map((center: { place_id: string }) => ({
        url: `${baseUrl}/bowlingbaan/${center.place_id}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // City routes
    const allCities = new Set<string>();
    if (centers) {
        centers.forEach((center: { formatted_address: string }) => {
            if (!center.formatted_address) return;
            const addressParts = center.formatted_address.split(',');
            if (addressParts.length > 1) {
                const possibleCityPart = addressParts[addressParts.length - 2].trim();
                const cityMatch = possibleCityPart.match(/\d{4}\s*[A-Z]{2}\s+(.*)/i);
                const city = cityMatch ? cityMatch[1] : possibleCityPart;
                allCities.add(city.toLowerCase().replace(/\s+/g, '-'));
            }
        });
    }

    const cityRoutes = Array.from(allCities).map((citySlug) => ({
        url: `${baseUrl}/bowlen-in/${citySlug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...staticRoutes, ...cityRoutes, ...centerRoutes];
}
