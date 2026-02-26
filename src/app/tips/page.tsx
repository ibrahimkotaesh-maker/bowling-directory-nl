import Link from "next/link";
import { Info, HelpCircle } from "lucide-react";

export const metadata = {
    title: "Bowling Tips & Spelregels | Verbeter je score | BowloNL",
    description: "Lees de belangrijkste bowling spelregels, leer hoe de puntentelling werkt (strikes en spares) en ontdek handige tips om meer te gooien.",
};

export default function TipsPage() {
    return (
        <main className="flex-1 w-full bg-black min-h-screen text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        Spelregels & <span className="text-color-brand-neon">Tips</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Alles wat je moet weten voor je eerste (of volgende) potje bowlen!
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-color-panel rounded-3xl border border-white/5 p-8 md:p-12 space-y-12">

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                            <span className="w-8 h-8 rounded-full bg-color-brand-neon/20 text-color-brand-neon flex items-center justify-center">
                                <HelpCircle size={18} />
                            </span>
                            Hoe werkt de puntentelling?
                        </h2>
                        <div className="grid gap-4">
                            <div className="p-6 bg-[#111] rounded-2xl border border-white/5">
                                <h3 className="font-bold text-lg text-color-brand-neon mb-2">De basis</h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                    Een regulier spel (game) bestaat uit 10 beurten (frames). In elke beurt mag je maximaal twee keer gooien om alle 10 de pins om te krijgen. Elke omgegooide pin is 1 punt waard. Grote bonussen verdien je door Strikes of Spares te gooien.
                                </p>
                            </div>
                            <div className="p-6 bg-[#111] rounded-2xl border border-white/5">
                                <h3 className="font-bold text-lg text-white mb-2 line-through decoration-color-brand-pink/50">Strike ( X )</h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                    Gooi je in de eerste worp van een frame álle 10 de pins om? Dan heb je een Strike! Je krijgt 10 punten + de punten van je <strong>volgende 2 worpen</strong> als bonus bij deze beurt opgeteld.
                                </p>
                            </div>
                            <div className="p-6 bg-[#111] rounded-2xl border border-white/5">
                                <h3 className="font-bold text-lg text-white mb-2">Spare ( / )</h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                    Heb je na twee worpen in één frame toch alle 10 de pins omgegooid? Dan heb je een Spare. Dit levert 10 punten op + de punten van je <strong>eerstvolgende ene worp</strong>.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 pt-8 border-t border-white/5">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-color-brand-pink/20 text-color-brand-pink flex items-center justify-center">
                                <Info size={18} />
                            </span>
                            Top 3 Tips voor Beginners
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full flex items-center justify-center font-bold text-color-brand-neon">1</div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Kies de juiste bal</h4>
                                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                        Kies een bal die niet te zwaar en niet te licht is. Een vuistregel: de bal zou ongeveer 10% van je lichaamsgewicht moeten zijn (tot een max van 16 pond). Zorg ook dat je vingers goed passen zonder te klemmen.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full flex items-center justify-center font-bold text-color-brand-neon">2</div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Kijk naar de pijlen, niet de pins</h4>
                                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                        Mikken op de pins aan het einde is erg lastig. Focus in plaats daarvan op de pijlen (arrows) die halverwege de baan op de vloer staan. Mik de bal recht over de tweede pijl vanaf rechts (voor rechtshandigen).
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full flex items-center justify-center font-bold text-color-brand-neon">3</div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Gooi rustig en gecontroleerd</h4>
                                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                        Snelheid is minder belangrijk dan richting. Neem een rustige aanloop (meestal 4 passen), zwaai je arm ontspannen recht naar achter en weer naar voor in een vloeiende beweging.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Call to Action */}
                <div className="text-center space-y-6 pt-8">
                    <h3 className="text-2xl font-bold">Klaar om de theorie in de praktijk te brengen?</h3>
                    <Link href="/zoeken" className="inline-block bg-color-brand-neon text-black px-8 py-4 rounded-xl font-bold hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                        Vind een Bowlingbaan in de buurt
                    </Link>
                </div>

            </div>
        </main>
    );
}
