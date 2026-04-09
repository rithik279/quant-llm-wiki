import Link from "next/link";

const features = [
    {
        title: "Challenge-accurate simulation",
        body: "Run thousands of account paths against drawdown and target rules before you pay another evaluation fee.",
    },
    {
        title: "Data-driven confidence",
        body: "Upload your own trade history to estimate realistic pass probability instead of relying on gut feel.",
    },
    {
        title: "Designed for prop traders",
        body: "Focused on the one question that matters: can your strategy survive challenge conditions consistently?",
    },
];

export default function HomeLandingPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-[34rem] w-[72rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,122,24,0.22)_0%,rgba(255,122,24,0.04)_45%,transparent_72%)]" />
                <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:52px_52px]" />
            </div>

            <section className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-24 sm:pt-28">
                <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
                    Built for prop firm challenges
                </p>

                <h1 className="mx-auto mb-6 max-w-5xl text-center text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                    Don&apos;t spend more money on challenge fees without knowing your{" "}
                    <span className="text-gradient">pass probability.</span>
                </h1>

                <p className="mx-auto mb-10 max-w-3xl text-center text-base leading-relaxed text-white/55 sm:text-lg">
                    Upload your trade history, simulate challenge outcomes at scale, and decide with confidence before risking
                    another paid attempt.
                </p>

                <div className="mb-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/simulator"
                        className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#ff7a18] to-[#ffb347] px-8 py-3.5 text-base font-semibold text-white transition-transform duration-200 hover:scale-[1.03]"
                    >
                        Try the simulator
                    </Link>
                    <Link
                        href="/pass"
                        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-white/80 transition-colors duration-200 hover:border-white/30 hover:text-white"
                    >
                        View pass challenge flow
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {features.map((item) => (
                        <article
                            key={item.title}
                            className="card-hover rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-200"
                        >
                            <h2 className="mb-3 text-lg font-semibold text-white">{item.title}</h2>
                            <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
