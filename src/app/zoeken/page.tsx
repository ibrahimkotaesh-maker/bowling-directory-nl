"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, MapPin, Star, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [minRating, setMinRating] = useState<number>(0);

    useEffect(() => {
        fetchResults();
    }, [query, minRating]);

    async function fetchResults() {
        setLoading(true);
        try {
            let supabaseQuery = supabase
                .from("bowling_centers")
                .select("*")
                .gte("rating", minRating)
                .order("rating", { ascending: false });

            if (query.trim()) {
                supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,formatted_address.ilike.%${query}%`);
            }

            const { data, error } = await supabaseQuery;
            if (error) throw error;
            setResults(data || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex-1 w-full bg-black min-h-screen text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header & Search Bar */}
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        Vind een Bowlingbaan
                    </h1>

                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Zoek op naam of stad (bijv. Amsterdam)..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-color-panel text-white px-6 py-4 rounded-2xl border-2 border-white/10 outline-none focus:border-color-brand-neon hover:border-white/30 transition-all font-medium placeholder-gray-500 pl-14"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
                        </div>

                        <div className="flex items-center gap-3 bg-color-panel px-6 py-4 rounded-2xl border border-white/10">
                            <Filter className="text-color-brand-neon" size={20} />
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(Number(e.target.value))}
                                className="bg-transparent text-white font-bold outline-none cursor-pointer"
                            >
                                <option value={0} className="bg-[#111]">Alle waarderingen</option>
                                <option value={4.5} className="bg-[#111]">4.5+ Sterren</option>
                                <option value={4.0} className="bg-[#111]">4.0+ Sterren</option>
                                <option value={3.5} className="bg-[#111]">3.5+ Sterren</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="text-gray-400 font-medium">
                    {loading ? (
                        <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Zoeken...</span>
                    ) : (
                        <span>{results.length} resultaten gevonden {query && `voor "${query}"`}</span>
                    )}
                </div>

                {/* Results Grid */}
                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.map((center) => {
                            const photo = center.local_photos ? center.local_photos.split(',')[0] : null;

                            return (
                                <Link href={`/bowlingbaan/${center.place_id}`} key={center.place_id} className="group flex flex-col bg-color-panel rounded-3xl border border-white/5 overflow-hidden hover:border-color-brand-neon/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)] hover:-translate-y-1">
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
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-color-brand-neon transition-colors line-clamp-1">{center.name}</h3>
                                            <div className="flex items-start gap-2 text-gray-400">
                                                <MapPin size={16} className="shrink-0 mt-0.5" />
                                                <p className="text-sm line-clamp-2">{center.formatted_address}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-1.5">
                                                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-white font-bold">{center.rating || "N/A"}</span>
                                                <span className="text-gray-500 text-xs">({center.total_reviews})</span>
                                            </div>
                                            <span className="text-color-brand-neon text-sm font-bold group-hover:underline">Bekijk ›</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!loading && results.length === 0 && (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/10 rounded-3xl bg-color-panel/50">
                        <div className="w-16 h-16 rounded-full bg-color-brand-pink/10 text-color-brand-pink flex items-center justify-center mb-2">
                            <Search size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Geen bowlingbanen gevonden</h3>
                        <p className="text-gray-400 max-w-md">Pas je zoekopdracht of filter aan om meer resultaten te zien in Nederland.</p>
                    </div>
                )}

            </div>
        </main>
    );
}
