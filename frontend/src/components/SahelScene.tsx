// Paysage du Sahel animé (SVG + CSS) : soleil couchant, dunes, acacia, baobab,
// caravane, oiseaux et sable porté par le vent. Les animations s'arrêtent si
// l'utilisateur a demandé à réduire les mouvements.

function Camel({ x, y, scale = 1, delay = 0 }: { x: number; y: number; scale?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="sahel-bob" style={{ animationDelay: `${delay}s` }}>
        <path d="M14 46 Q4 50 6 64" className="sahel-stroke" />
        <ellipse cx="50" cy="45" rx="34" ry="16" />
        <ellipse cx="46" cy="31" rx="17" ry="14" />
        <path d="M76 38 Q92 30 91 10 L101 9 L101 17 Q99 38 84 52 Z" />
        <ellipse cx="104" cy="12" rx="10" ry="5.5" />
        <rect x="24" y="52" width="5" height="40" rx="2" className="sahel-leg-a" />
        <rect x="34" y="54" width="5" height="38" rx="2" className="sahel-leg-b" />
        <rect x="64" y="54" width="5" height="38" rx="2" className="sahel-leg-b" />
        <rect x="73" y="52" width="5" height="40" rx="2" className="sahel-leg-a" />
        {/* Tapis de selle aux couleurs de la maison */}
        <path d="M30 26 Q46 12 62 26 L60 36 Q46 30 32 36 Z" className="sahel-saddle" />
      </g>
    </g>
  )
}

function Walker({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  // Silhouette en boubou et turban qui mène la caravane.
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="sahel-bob">
        <path d="M2 92 L12 30 Q16 24 20 30 L32 92 Z" />
        <circle cx="17" cy="20" r="7" />
        <path d="M9 18 Q17 8 25 18 L24 14 Q17 4 10 14 Z" className="sahel-saddle" />
        <path d="M24 44 L44 26" className="sahel-stroke" />
      </g>
    </g>
  )
}

export default function SahelScene({ quote, author }: { quote: string; author: string }) {
  return (
    <section className="sahel" aria-label="Paysage du Sahel">
      <svg className="sahel-svg" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sahel-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbf3e8" />
            <stop offset="0.55" stopColor="#f5dcbc" />
            <stop offset="1" stopColor="#eab98a" />
          </linearGradient>
          <radialGradient id="sahel-glow">
            <stop offset="0" stopColor="#f7b267" stopOpacity="0.8" />
            <stop offset="1" stopColor="#f7b267" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="640" fill="url(#sahel-sky)" />

        {/* Soleil */}
        <g className="sahel-sun">
          <circle cx="820" cy="330" r="190" fill="url(#sahel-glow)" />
          <circle cx="820" cy="330" r="78" fill="#d9772f" />
        </g>

        {/* Oiseaux */}
        <g className="sahel-birds" fill="none" stroke="#3b2a20" strokeWidth="2" strokeLinecap="round">
          <path d="M0 0 Q7 -6 14 0 Q21 -6 28 0" transform="translate(200 150)" />
          <path d="M0 0 Q5 -4 10 0 Q15 -4 20 0" transform="translate(245 132)" />
          <path d="M0 0 Q6 -5 12 0 Q18 -5 24 0" transform="translate(280 160)" />
        </g>

        {/* Dunes lointaines */}
        <path className="sahel-far" d="M0 420 Q180 360 380 400 T760 390 T1120 380 T1440 400 V640 H0 Z" fill="#e8c29a" />
        <path d="M0 460 Q240 400 520 450 T1000 430 T1440 450 V640 H0 Z" fill="#d9a673" />

        {/* Acacia */}
        <g fill="#3b2a20">
          <path d="M318 452 L322 390 Q300 372 280 368 L284 364 Q306 366 324 380 L330 350 L336 350 L334 384 Q350 368 372 362 L374 368 Q352 378 338 396 L336 452 Z" />
          <ellipse cx="330" cy="352" rx="92" ry="16" />
          <ellipse cx="300" cy="360" rx="46" ry="10" />
          <ellipse cx="366" cy="358" rx="50" ry="10" />
        </g>

        {/* Baobab */}
        <g fill="#3b2a20">
          <path d="M1250 470 Q1236 420 1244 360 Q1230 330 1206 318 L1210 310 Q1232 320 1246 338 Q1248 316 1238 296 L1246 292 Q1258 314 1256 336 Q1268 312 1292 302 L1296 310 Q1274 322 1264 350 Q1276 334 1300 332 L1300 340 Q1278 346 1266 368 Q1272 420 1262 470 Z" />
        </g>

        {/* Dune du milieu et caravane */}
        <path d="M0 520 Q300 450 640 500 T1440 480 V640 H0 Z" fill="#c4854f" />
        <g className="sahel-caravan" fill="#2f2019">
          <Walker x={250} y={404} scale={0.78} />
          <Camel x={120} y={410} scale={0.78} />
          <Camel x={0} y={412} scale={0.72} delay={0.4} />
          <Camel x={-118} y={414} scale={0.66} delay={0.8} />
        </g>

        {/* Premier plan */}
        <path d="M0 580 Q360 520 760 570 T1440 560 V640 H0 Z" fill="#9c5a2e" />
        <path d="M0 620 Q420 585 900 612 T1440 604 V640 H0 Z" fill="#7a4424" />

        {/* Sable porté par le vent */}
        <g className="sahel-sand" fill="#fff4e4">
          {Array.from({ length: 22 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 137) % 1440}
              cy={430 + ((i * 53) % 170)}
              r={1 + (i % 3) * 0.6}
              style={{ animationDelay: `${-(i % 7) * 1.3}s`, animationDuration: `${7 + (i % 5)}s` }}
            />
          ))}
        </g>
      </svg>

      <figure className="container sahel-quote">
        <blockquote>{quote}</blockquote>
        <figcaption>{author}</figcaption>
      </figure>
    </section>
  )
}
