import { NavLink } from "react-router-dom";
import { categories, algorithmsByCategory } from "../algorithms";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">// DAA.viz</div>
        <div className="brand-title">Algorithm<br />Visualizer</div>
        <div className="brand-sub">Design &amp; Analysis of Algorithms — semester project</div>
      </div>

      <div className="nav-group">
        <NavLink to="/compare" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          <span>⇄ Compare algorithms</span>
        </NavLink>
      </div>

      {categories.map((cat) => (
        <div className="nav-group" key={cat.id}>
          <div className="nav-group-label">{cat.label}</div>
          {algorithmsByCategory[cat.id].map((algo) => (
            <NavLink
              key={algo.id}
              to={`/algo/${algo.id}`}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              <span>{algo.name}</span>
              <span className="nav-link-complexity">{algo.complexity.avg}</span>
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
}
