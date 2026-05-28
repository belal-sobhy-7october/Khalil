export default function CalligraphyWatermark({ character = 'خ', opacity = 0.06 }) {
  return (
    <div className="calligraphy-watermark">
      <svg viewBox="0 0 100 100" fill="currentColor" style={{ opacity }}>
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="72"
          fontFamily="Amiri, 'Noto Naskh Arabic', serif"
        >
          {character}
        </text>
      </svg>
    </div>
  );
}
