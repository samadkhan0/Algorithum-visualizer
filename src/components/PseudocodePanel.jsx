export default function PseudocodePanel({ pseudocode, activeLine }) {
  return (
    <div className="pseudocode">
      {pseudocode.map((line, i) => (
        <div key={i} className={`line${i === activeLine ? " active" : ""}`}>
          {String(i + 1).padStart(2, "0")}  {line}
        </div>
      ))}
    </div>
  );
}
