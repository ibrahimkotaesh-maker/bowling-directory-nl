import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";

export const metadata = {
    title: "Wat kost bowlen? | Tarieven & Prijzen 2026 | BowloNL",
    description: "Ontdek de gemiddelde kosten voor een uurtje bowlen in Nederland. Bekijk tarieven voor daluren, weekenden, discobowlen en kinderfeestjes.",
};

export default function TarievenPage() {
    return (
        <main className="flex-1 w-full bg-black min-h-screen text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        Tarieven & <span className="text-color-brand-neon">Prijzen</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Wat kost een uurtje bowlen in Nederland? Wij hebben de gemiddelde tarieven voor je op een rij gezet.
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-color-panel rounded-3xl border border-white/5 p-8 md:p-12 space-y-8">

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Gemiddelde Baanhuur (per uur)</h2>
                        <p className="text-gray-300 leading-relaxed">
                            De prijzen voor het huren van een bowlingbaan variëren sterk afhankelijk van de dag, het tijdstip en de locatie. Je huurt bij vrijwel alle centra een baan per uur, waar je maximaal met 6 personen op kunt spelen.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="text-6xl font-black">€</span>
                                </div>
                                <h3 className="font-bold text-xl text-white mb-2">Daluren (Ma - Do)</h3>
                                <p className="text-3xl font-black text-color-brand-neon mb-4">€ 22,50 - € 29,50</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-green-500" /> Vaak goedkoper voor 18:00</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-green-500" /> Rustiger op de banen</li>
                                </ul>
                            </div>

                            <div className="bg-[#111] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="text-6xl font-black">€€</span>
                                </div>
                                <h3 className="font-bold text-xl text-white mb-2">Piekuren (Vr - Zo)</h3>
                                <p className="text-3xl font-black text-color-brand-pink mb-4">€ 32,50 - € 45,00</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-green-500" /> Incl. Discobowlen in de avond</li>
                                    <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-green-500" /> Tijdig reserveren aangeraden</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-white/5">
                        <h2 className="text-2xl font-bold text-white">Bijkomende Kosten</h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <div className="flex gap-4">
                                <Info className="shrink-0 text-color-brand-neon mt-1" size={20} />
                                <div>
                                    <strong className="text-white">Schoenhuur:</strong> Vaak is de huur van speciale bowlingschoenen inbegrepen in de baanhuur, maar sommige centra rekenen hier apart rond de € 2,00 tot € 3,50 per persoon voor.
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Info className="shrink-0 text-color-brand-neon mt-1" size={20} />
                                <div>
                                    <strong className="text-white">Arrangementen:</strong> Wil je bowlen combineren met eten? Kies dan voor een arrangement (bijv. steengrillen of bittergarnituur). Reken op € 35,- tot € 55,- per persoon voor 1 uur bowlen + diner.
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Call to Action */}
                <div className="text-center space-y-6 pt-8">
                    <h3 className="text-2xl font-bold">Klaar om te gooien?</h3>
                    <p className="text-gray-400">Ontdek de exacte tarieven van een bowlingbaan bij jou in de buurt.</p>
                    <Link href="/zoeken" className="inline-block bg-color-brand-neon text-black px-8 py-4 rounded-xl font-bold hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                        Vind een Bowlingbaan
                    </Link>
                </div>

            </div>
        </main>
    );
}
