import Link from "next/link";

const cardStyle: React.CSSProperties = {
	background: "#1a1d27",
	border: "1px solid #2a2d3a",
	borderRadius: 12,
	padding: "1.1rem 1.2rem",
};

export default function HomeLandingPage() {
	return (
		<main
			style={{
				minHeight: "100vh",
				background: "radial-gradient(1200px 500px at 20% -10%, #202842 0%, #0f1117 55%)",
				color: "#e0e0e0",
				fontFamily: "'Segoe UI', system-ui, sans-serif",
				padding: "2.2rem 1rem",
			}}
		>
			<div style={{ maxWidth: 980, margin: "0 auto" }}>
				<section
					style={{
						...cardStyle,
						padding: "1.6rem 1.5rem",
						marginBottom: "1rem",
					}}
				>
					<p
						style={{
							fontSize: "0.72rem",
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							color: "#7da6ff",
							marginBottom: "0.6rem",
							fontWeight: 700,
						}}
					>
						First UI Landing
					</p>
					<h1
						style={{
							fontSize: "clamp(1.7rem, 4vw, 2.35rem)",
							lineHeight: 1.2,
							fontWeight: 700,
							color: "#fff",
							marginBottom: "0.7rem",
						}}
					>
						Monte Carlo Prop Firm Simulator
					</h1>
					<p
						style={{
							fontSize: "0.95rem",
							color: "#8f98ad",
							maxWidth: 760,
							lineHeight: 1.6,
							marginBottom: "1.1rem",
						}}
					>
						This is the standalone home landing route. Use it as your entry point, then jump into the
						simulator engine or the specialized pass-challenge flow.
					</p>

					<div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
						<Link
							href="/simulator"
							style={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								padding: "0.72rem 1rem",
								borderRadius: 8,
								fontSize: "0.9rem",
								fontWeight: 700,
								color: "#fff",
								textDecoration: "none",
								background: "linear-gradient(135deg, #2545b8 0%, #4a7eff 100%)",
								border: "1px solid #3f69ff",
								boxShadow: "0 0 24px rgba(74,126,255,0.25)",
							}}
						>
							Open Simulator
						</Link>

						<Link
							href="/pass"
							style={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								padding: "0.72rem 1rem",
								borderRadius: 8,
								fontSize: "0.9rem",
								fontWeight: 600,
								color: "#b6c4e8",
								textDecoration: "none",
								background: "#111523",
								border: "1px solid #2a365f",
							}}
						>
							Open Pass Challenge
						</Link>
					</div>
				</section>

				<section
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
						gap: "0.9rem",
					}}
				>
					<article style={cardStyle}>
						<p style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555" }}>
							Simulator
						</p>
						<h2 style={{ fontSize: "1.02rem", color: "#fff", marginTop: "0.45rem", marginBottom: "0.45rem" }}>
							Multi-endpoint testing
						</h2>
						<p style={{ fontSize: "0.84rem", color: "#8993a9", lineHeight: 1.55 }}>
							Run Until Payout, Full Period, Batch, Correlation, Multi-Account and Optimizer workflows from a
							single interface.
						</p>
					</article>

					<article style={cardStyle}>
						<p style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555" }}>
							Pass Flow
						</p>
						<h2 style={{ fontSize: "1.02rem", color: "#fff", marginTop: "0.45rem", marginBottom: "0.45rem" }}>
							Challenge-focused page
						</h2>
						<p style={{ fontSize: "0.84rem", color: "#8993a9", lineHeight: 1.55 }}>
							`/pass` stays dedicated to pass-challenge strategy and account-acquisition analysis, separated from
							generic simulator upload tooling.
						</p>
					</article>

					<article style={cardStyle}>
						<p style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555" }}>
							Deployment
						</p>
						<h2 style={{ fontSize: "1.02rem", color: "#fff", marginTop: "0.45rem", marginBottom: "0.45rem" }}>
							Vercel-ready routes
						</h2>
						<p style={{ fontSize: "0.84rem", color: "#8993a9", lineHeight: 1.55 }}>
							Home is now a real Next.js page at `/home`, not an alias redirect, so it can safely be your
							standalone public entry path.
						</p>
					</article>
				</section>
			</div>
		</main>
	);
}
