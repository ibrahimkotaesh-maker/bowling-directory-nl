import { supabase } from "@/lib/supabaseClient";
import { Search, MapPin, Star, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600; // Refetch every hour

export default async function Home() {
  const { data: bowlingCenters } = await supabase
    .from("bowling_centers")
    .select("*")
    .order("rating", { ascending: false })
    .limit(16);

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center relative overflow-hidden mt-6">
        {/* Neon Glow Backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-color-brand-purple/20 blur-[100px] md:blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-color-brand-neon/15 blur-[80px] md:blur-[100px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-color-brand-pink/10 blur-[80px] rounded-full -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-color-brand-neon animate-pulse"></span>
          <span className="text-sm font-medium text-gray-200">250+ Bowlingbanen in Nederland</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 text-white drop-shadow-2xl">
          Vind De Perfecte <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-color-brand-neon via-blue-400 to-color-brand-purple animate-glow">
            Bowlingbaan
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-medium">
          Ontdek, vergelijk en vind het beste bowlingcentrum bij jou in de buurt. Echte reviews, openingstijden en meer.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative flex items-center group">
          <div className="absolute left-5 text-gray-400 group-focus-within:text-color-brand-neon transition-colors">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder="Zoek op stad (bijv. Amsterdam, Rotterdam)..."
            className="w-full h-16 md:h-20 pl-14 pr-4 rounded-full bg-color-surface/80 backdrop-blur-md border px-4 text-lg border-white/10 focus:border-color-brand-neon focus:ring-1 focus:ring-color-brand-neon outline-none transition-all placeholder:text-gray-500 text-white shadow-2xl"
          />
          <button className="absolute right-3 h-10 md:h-14 px-6 md:px-8 rounded-full bg-color-brand-neon text-black font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
            Zoeken
          </button>
        </div>
      </section>

      {/* Featured Bowling Centers */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Top Beoordeeld 🏆</h2>
            <p className="text-gray-400 text-lg">De best beoordeelde bowlingcentra door bezoekers in Nederland</p>
          </div>
          <Link href="#" className="text-color-brand-neon hover:text-white flex items-center gap-1 font-semibold transition-colors py-2 px-4 rounded-full bg-color-brand-neon/10 hover:bg-color-brand-neon/20 border border-color-brand-neon/20">
            Bekijk de top 100 <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {bowlingCenters?.map((center) => {
            const photos = center.local_photos ? center.local_photos.split(',') : [];
            const mainPhoto = photos.length > 0 ? `/${photos[0]}` : null;

            const addressParts = center.formatted_address.split(',');
            const city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : "Nederland";

            return (
              <Link href={`/bowlingbaan/${center.place_id}`} key={center.place_id} className="group flex flex-col bg-color-panel rounded-3xl border border-white/5 overflow-hidden hover:border-color-brand-neon/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)] hover:-translate-y-1">
                {/* Image Area */}
                <div className="w-full h-56 bg-color-surface relative overflow-hidden">
                  {mainPhoto ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={mainPhoto}
                        alt={`Bowling in ${center.name}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-gray-600">
                      Geen foto
                    </div>
                  )}
                  {center.rating && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold border border-white/10 shadow-lg">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white pt-0.5">{center.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {center.open_now && (
                    <div className="absolute top-4 left-4 bg-green-500/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border border-green-500/30 text-green-400 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      Nu Open
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1 relative">
                  <h3 className="font-extrabold text-xl mb-2 line-clamp-1 group-hover:text-color-brand-neon transition-colors text-white">{center.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="line-clamp-1">{center.formatted_address}</span>
                  </div>

                  <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                      <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-md">{center.total_reviews}</span> beoordelingen
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-color-brand-neon group-hover:text-black transition-colors">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
