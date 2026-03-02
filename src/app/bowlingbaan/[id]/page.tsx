import { supabase } from "@/lib/supabaseClient";
import { MapPin, Star, Phone, Globe, Clock, Navigation, Tag, Ticket, ParkingCircle, Wifi, Heart, ExternalLink, Euro, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];
    const client = createClient(url, key);
    const { data: centers } = await client.from("bowling_centers").select("place_id");
    if (!centers) return [];
    return centers.map((center) => ({
        id: center.place_id,
    }));
}


export default async function BowlingCenterPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const { data: center } = await supabase
        .from("bowling_centers")
        .select("*")
        .eq("place_id", id)
        .single();

    if (!center) notFound();

    const photos = center.local_photos ? center.local_photos.split(',') : [];
    const topReviews = center.top_reviews ? JSON.parse(center.top_reviews) : [];

    // Generate LocalBusiness Schema Markup for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BowlingAlley',
        name: center.name,
        image: photos.length > 0 ? `https://bowlingplekken.nl/${photos[0]}` : undefined,
        url: center.website || `https://bowlingplekken.nl/bowlingbaan/${center.place_id}`,
        telephone: center.phone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: center.formatted_address,
            addressCountry: 'NL'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: center.lat,
            longitude: center.lng
        },
        aggregateRating: center.rating ? {
            '@type': 'AggregateRating',
            ratingValue: center.rating,
            reviewCount: center.total_reviews
        } : undefined
    };

    return (
        <main className="flex-1 w-full flex flex-col items-center bg-black min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Image Header */}
            <div className="w-full h-[40vh] md:h-[50vh] relative bg-color-surface overflow-hidden">
                {photos.length > 0 ? (
                    <Image
                        src={`/${photos[0]}`}
                        alt={center.name}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-gray-500">
                        Geen foto beschikbaar
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Title area overlaid on image */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="z-10">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-md">
                            {center.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-300 font-medium">
                            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                <MapPin size={18} className="text-color-brand-neon" />
                                <span>{center.formatted_address}</span>
                            </div>
                            {center.rating && (
                                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-bold">{center.rating}</span>
                                    <span className="text-gray-400 text-sm">({center.total_reviews} reviews)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="z-10 flex gap-3 flex-wrap">
                        {center.reservation_url && (
                            <a href={center.reservation_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-color-brand-neon text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                                <Ticket size={20} />
                                Reserveer Nu
                            </a>
                        )}
                        {center.google_maps_url && (
                            <a href={center.google_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20">
                                <Navigation size={20} />
                                Route
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details & Photos */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Description */}
                    {center.scraped_description && (
                        <section className="bg-color-panel p-8 rounded-3xl border border-white/5 space-y-4">
                            <h2 className="text-2xl font-bold text-white">Over {center.name.split('|')[0].trim()}</h2>
                            <p className="text-gray-300 leading-relaxed text-lg">{center.scraped_description}</p>
                        </section>
                    )}

                    {/* Activities */}
                    {center.activities && (
                        <section className="bg-color-panel p-8 rounded-3xl border border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Activiteiten</h2>
                                {center.num_lanes && (
                                    <div className="flex items-center gap-2 bg-color-brand-purple/15 text-color-brand-purple px-4 py-2 rounded-full border border-color-brand-purple/20 font-bold text-sm">
                                        <Layers size={16} />
                                        {center.num_lanes} Bowlingbanen
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {center.activities.split(', ').map((activity: string, idx: number) => (
                                    <span key={idx} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-medium hover:border-color-brand-neon/40 hover:bg-color-brand-neon/5 transition-colors text-sm">
                                        <Tag size={14} className="text-color-brand-neon" />
                                        {activity}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Quick Info */}
                    <section className="bg-color-panel p-8 rounded-3xl border border-white/5 space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/5 pb-4">Informatie</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {center.phone && (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-color-brand-purple/20 text-color-brand-purple flex items-center justify-center">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Telefoon</p>
                                        <a href={`tel:${center.phone.replace(/\s+/g, '')}`} className="text-lg text-white hover:text-color-brand-neon transition-colors font-medium">
                                            {center.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {center.website && (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-color-brand-pink/20 text-color-brand-pink flex items-center justify-center">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Website</p>
                                        <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-lg text-white hover:text-color-brand-neon transition-colors font-medium line-clamp-1">
                                            Bezoek website
                                        </a>
                                    </div>
                                </div>
                            )}
                            {center.pricing && (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                                        <Euro size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Prijsindicatie</p>
                                        <span className="text-lg text-white font-medium">{center.pricing}</span>
                                    </div>
                                </div>
                            )}
                            {center.reservation_url && (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-color-brand-neon/20 text-color-brand-neon flex items-center justify-center">
                                        <Ticket size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Online Reserveren</p>
                                        <a href={center.reservation_url} target="_blank" rel="noopener noreferrer" className="text-lg text-color-brand-neon hover:text-white transition-colors font-medium flex items-center gap-1">
                                            Reserveer direct <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Amenities */}
                    {center.amenities && (
                        <section className="bg-color-panel p-8 rounded-3xl border border-white/5 space-y-6">
                            <h2 className="text-2xl font-bold text-white">Faciliteiten</h2>
                            <div className="flex flex-wrap gap-3">
                                {center.amenities.split(', ').map((amenity: string, idx: number) => (
                                    <span key={idx} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/5 border border-green-500/15 text-green-300 font-medium text-sm">
                                        <Heart size={14} className="text-green-400" />
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Photos Gallery */}
                    {photos.length > 1 && (
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Foto&apos;s</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {photos.slice(1).map((photo: string, idx: number) => (
                                    <div key={idx} className="aspect-video relative rounded-2xl overflow-hidden border border-white/10">
                                        <Image
                                            src={`/${photo}`}
                                            alt={`${center.name} photo ${idx + 2}`}
                                            fill
                                            className="object-cover hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Reviews */}
                    {topReviews.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Beoordelingen</h2>
                                <span className="text-sm text-gray-500">Bron: Google</span>
                            </div>
                            <div className="grid gap-6">
                                {topReviews.map((review: any, idx: number) => (
                                    <div key={idx} className="p-6 rounded-2xl bg-[#111] border border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-gray-200">{review.author}</span>
                                            <span className="text-sm text-gray-500">{review.time}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
                                            ))}
                                        </div>
                                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                            &quot;{review.text}&quot;
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>

                {/* Right Column: Sidebar (Opening Hours) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">

                        <div className="bg-color-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-color-brand-neon" size={24} />
                                <h2 className="text-xl font-bold text-white">Openingstijden</h2>
                            </div>

                            {center.open_now && (
                                <div className="w-full py-3 bg-green-500/10 border border-green-500/20 rounded-xl mb-6 flex justify-center items-center gap-2 text-green-400 font-bold">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    Nu Geopend
                                </div>
                            )}

                            {center.weekday_text ? (
                                <ul className="space-y-4">
                                    {center.weekday_text.split('\n').map((day: string, idx: number) => {
                                        const [dayName, ...hoursParts] = day.split(': ');
                                        const hours = hoursParts.join(': ');
                                        const isZeroHours = hours.includes("Gesloten") || hours.includes("Closed");

                                        return (
                                            <li key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                <span className="text-gray-400 capitalize">{dayName}</span>
                                                <span className={`font-medium ${isZeroHours ? "text-red-400" : "text-white"}`}>
                                                    {hours}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm italic text-center">Openingstijden niet beschikbaar.</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
