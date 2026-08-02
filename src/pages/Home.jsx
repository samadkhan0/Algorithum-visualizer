import { Link } from "react-router-dom";
import { categories, algorithmsByCategory } from "../algorithms";

export default function Home() {
  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow">Design &amp; Analysis of Algorithms</div>
        <h1>Watch an algorithm think,<br />one line at a time.</h1>
        <p>
          Every animation here is driven by the exact pseudocode line executing at that
          instant — press play and the code panel lights up in sync with the array, graph,
          or table on screen. It's built to make the <em>analysis</em> half of the course
          as visible as the algorithm itself: live comparison and swap counters next to
          each run, and best/average/worst-case complexity for every entry in the sidebar.
        </p>
        <p>
          Want to see the analysis in action? <Link to="/compare" style={{ color: "var(--signal)" }}>Run two algorithms side by side</Link> on
          the same input and watch their step counts diverge in real time.
        </p>
      </div>

      <div className="hero-cards">
        {categories.map((cat) => {
          const first = algorithmsByCategory[cat.id][0];
          return (
            <Link className="hero-card" to={`/algo/${first.id}`} key={cat.id}>
              <div className="hero-card-count">{algorithmsByCategory[cat.id].length} algorithms</div>
              <h3>{cat.label}</h3>
              <p>{cat.blurb}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
