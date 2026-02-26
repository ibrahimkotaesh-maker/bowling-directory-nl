import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

export const revalidate = 86400; // Refetch daily

const POPULAR_CITIES = [
    "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
    "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen",
    "Apeldoorn", "Haarlem", "Arnhem", "Enschede", "Amersfoort"
];

export const metadata = {
    title: "Bowlingbanen per Stad in Nederland | BowloNL",
    description: "Vind de leukste en beste bowlingbanen in jouw stad. Selecteer een stad uit het overzicht en reserveer direct!",
};

export default async function CitiesIndexPage() {
    const { data: centers } = await supabase.from("bowling_centers").select("formatted_address");

    // Count centers per city roughly
    const cityCounts: Record<string, number> = {};
    const allCities = new Set<string>();

    if (centers) {
        centers.forEach(center => {
            const addressParts = center.formatted_address.split(',');
            if (addressParts.length > 1) {
                const possibleCityPart = addressParts[addressParts.length - 2].trim();
                const cityMatch = possibleCityPart.match(/\d{4}\s*[A-Z]{2}\s+(.*)/i);
                const city = cityMatch ? cityMatch[1] : possibleCityPart;
                const normalizedCity = city.trim();

                allCities.add(normalizedCity);
                cityCounts[normalizedCity] = (cityCounts[normalizedCity] || 0) + 1;
            }
        });
    }

    // Sort popular cities by whether we actually have them, then alphabetically
    const availablePopularCities = POPULAR_CITIES.filter(city =>
        Array.from(allCities).some(c => c.toLowerCase() === city.toLowerCase())
    ).sort();

    // Sort all other cities
    const otherCities = Array.from(allCities)
        .filter(city => !POPULAR_CITIES.some(p => p.toLowerCase() === city.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));

    return (
        <main className="flex-1 w-full bg-black min-h-screen text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        Vind Bowlingbanen <span className="text-color-brand-neon">per Stad</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Kies jouw stad en ontdek de beste locaties voor een gezellig avondje uit bowlen.
                    </p>
                </div>

                {/* Popular Cities Grid */}
                <section className="space-y-8">
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                        <span className="w-8 h-8 rounded-full bg-color-brand-pink/20 text-color-brand-pink flex items-center justify-center">
                            <Star size={16} />
                        </span>
                        Populaire Steden
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {availablePopularCities.map((city) => {
                            const slug = city.toLowerCase().replace(/\s+/g, '-');
                            // Find proper casing from the actual data
                            const actualDataCity = Array.from(allCities).find(c => c.toLowerCase() === city.toLowerCase()) || city;
                            const count = cityCounts[actualDataCity] || 0;

                            return (
                                <Link
                                    href={`/bowlen-in/${slug}`}
                                    key={slug}
                                    className="bg-color-panel hover:bg-[#1a1a1a] border border-white/5 hover:border-color-brand-neon/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] group flex flex-col items-center text-center gap-3"
                                >
                                    <MapPin size={28} className="text-color-brand-neon group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="font-bold text-lg text-white group-hover:text-color-brand-neon transition-colors">{city}</h3>
                                        <p className="text-sm text-gray-500">{count} {count === 1 ? 'locatie' : 'locaties'}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* All Other Cities List */}
                <section className="space-y-8 pt-8">
                    <h2 className="text-2xl md:text-3xl font-bold border-b border-white/10 pb-4">
                        Alle Steden (A-Z)
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-8">
                        {otherCities.map((city) => {
                            const slug = city.toLowerCase().replace(/\s+/g, '-');
                            const count = cityCounts[city] || 0;
                            return (
                                <Link
                                    href={`/bowlen-in/${slug}`}
                                    key={slug}
                                    className="flex items-center justify-between group py-2 border-b border-white/5 hover:border-color-brand-neon/30 transition-colors"
                                >
                                    <span className="text-gray-300 group-hover:text-white transition-colors capitalize">{city}</span>
                                    <span className="text-xs text-gray-600 font-mono bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
                                </Link>
                            );
                        })}
                    </div>
                </section>

            </div>
        </main>
    );
}
