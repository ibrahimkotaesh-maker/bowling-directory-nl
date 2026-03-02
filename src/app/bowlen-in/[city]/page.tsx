import { supabase } from "@/lib/supabaseClient";
import { MapPin, Star, Navigation, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

// Major city → nearby suburbs/municipalities mapping
const AREA_MAPPING: Record<string, string[]> = {
    'amsterdam': ['amsterdam', 'amstelveen', 'zaandam', 'zwanenburg', 'diemen', 'hoofddorp', 'weesp', 'ouderkerk'],
    'rotterdam': ['rotterdam', 'schiedam', 'vlaardingen', 'capelle', 'spijkenisse', 'ridderkerk', 'barendrecht'],
    'den haag': ['den haag', 'the hague', 'rijswijk', 'leidschendam', 'voorburg', 'zoetermeer', 'delft', 'westland'],
    'utrecht': ['utrecht', 'nieuwegein', 'maarssen', 'zeist', 'houten', 'woerden', 'de bilt'],
    'eindhoven': ['eindhoven', 'veldhoven', 'helmond', 'best', 'geldrop'],
    'groningen': ['groningen', 'haren', 'hoogezand', 'eelde'],
    'tilburg': ['tilburg', 'breda', 'dongen', 'waalwijk'],
    'arnhem': ['arnhem', 'nijmegen', 'zevenaar', 'doesburg'],
    'haarlem': ['haarlem', 'haarlemmermeer', 'beverwijk', 'ijmuiden'],
};

function getCitySearchTerms(citySlug: string): string[] {
    const key = citySlug.replace(/-/g, ' ').toLowerCase();
    return AREA_MAPPING[key] || [key];
}

export async function generateMetadata({ params }: { params: { city: string } }) {
    const { city } = await params;
    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const searchTerms = getCitySearchTerms(city);
    const isMetroArea = searchTerms.length > 1;

    return {
        title: `Bowlen in ${cityName}${isMetroArea ? ' en omgeving' : ''} | Vind de beste bowlingbanen`,
        description: `Op zoek naar een bowlingbaan in ${cityName}${isMetroArea ? ' en omgeving' : ''}? Bekijk alle locaties, lees reviews en reserveer direct de beste baan voor je volgende uitje.`,
    };
}

export default async function CityPage({ params }: { params: { city: string } }) {
    const { city } = await params;
    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const searchTerms = getCitySearchTerms(city);
    const isMetroArea = searchTerms.length > 1;

    // Build OR filter for all nearby cities
    const orFilter = searchTerms.map(t => `formatted_address.ilike.%${t}%`).join(',');

    const { data, error } = await supabase
        .from('bowling_centers')
        .select('*')
        .or(orFilter)
        .order('rating', { ascending: false });

    if (error) {
        console.error(`Error fetching bowling centers for ${cityName}:`, error);
    }

    const cityCenters = data || [];

    if (cityCenters.length === 0) {
        return <div className="p-8 text-white min-h-screen bg-black">Geen bowlingbanen gevonden in {cityName}.</div>;
    }

    const bestCenterPhotos = cityCenters[0] && cityCenters[0].local_photos ? cityCenters[0].local_photos.split(',') : [];
    const heroImage = bestCenterPhotos.length > 0 ? `/${bestCenterPhotos[0]}` : null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: cityCenters.map((center, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'BowlingAlley',
                name: center?.name || 'Onbekende bowlingbaan',
                url: `https://bowlingplekken.nl/bowlingbaan/${center?.place_id || ''}`
            }
        }))
    };

    return (
        <main className="flex-1 w-full bg-black min-h-screen pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Header */}
            <div className="w-full h-[30vh] md:h-[40vh] relative bg-color-surface overflow-hidden">
                {heroImage && (
                    <Image
                        src={heroImage}
                        alt={`Bowlingbanen in ${cityName}`}
                        fill
                        className="object-cover opacity-60 mix-blend-overlay"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                        Bowlen in <span className="text-color-brand-neon">{cityName}</span>
                        {isMetroArea && <span className="text-gray-300 text-2xl md:text-3xl block mt-1">en omgeving</span>}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl">
                        Vind de perfecte locatie voor je volgende uitje. Wij vonden <strong className="text-white">{cityCenters.length}</strong> top rated bowlingbanen in de regio {cityName}.
                    </p>
                </div>
            </div>

            {/* Centers Grid */}
            <div className="w-full max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cityCenters.map((center) => {
                        const photo = (center && typeof center.local_photos === 'string') ? center.local_photos.split(',')[0] : null;

                        return (
                            <Link href={`/bowlingbaan/${center?.place_id}`} key={center?.place_id} className="group flex flex-col bg-color-panel rounded-3xl border border-white/5 overflow-hidden hover:border-color-brand-neon/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)] hover:-translate-y-1">
                                <div className="w-full h-48 bg-color-surface relative overflow-hidden">
                                    {photo ? (
                                        <Image
                                            src={`/${photo}`}
                                            alt={center.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-gray-700 font-medium">
                                            Geen foto
                                        </div>
                                    )}
                                    {center.open_now && (
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-green-500/50 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                            Nu Open
                                        </div>
                                    )}
                                    {center.rating && (
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-bold border border-white/10">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-white">{center.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-color-brand-neon transition-colors line-clamp-1">{center.name}</h3>
                                        <div className="flex items-start gap-2 text-gray-400">
                                            <MapPin size={14} className="shrink-0 mt-0.5" />
                                            <p className="text-sm line-clamp-1">{center.formatted_address}</p>
                                        </div>
                                    </div>

                                    {/* Activity Tags */}
                                    {center.activities && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {center.activities.split(', ').slice(0, 3).map((act: string, idx: number) => (
                                                <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400">
                                                    {act}
                                                </span>
                                            ))}
                                            {center.activities.split(', ').length > 3 && (
                                                <span className="text-xs px-2 py-0.5 rounded-md bg-color-brand-neon/10 border border-color-brand-neon/20 text-color-brand-neon">
                                                    +{center.activities.split(', ').length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <span className="text-gray-500 text-xs">{center.total_reviews} reviews</span>
                                        <span className="text-color-brand-neon text-sm font-bold group-hover:underline">Bekijk ›</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
