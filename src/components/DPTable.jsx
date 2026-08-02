export default function DPTable({ step }) {
  if (!step?.table) return null;
  const { table, current, deps = [], rowLabels, colLabels } = step;
  const isCurrent = (r, c) => current && current[0] === r && current[1] === c;
  const isDep = (r, c) => deps.some(([dr, dc]) => dr === r && dc === c);

  return (
    <div className="dp-wrap">
      <table className="dp-table">
        <thead>
          <tr>
            <th></th>
            {table[0].map((_, c) => (
              <th key={c}>{colLabels ? colLabels[c] : c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, r) => (
            <tr key={r}>
              <th>{rowLabels ? rowLabels[r] : r}</th>
              {row.map((val, c) => (
                <td
                  key={c}
                  className={[
                    val !== null ? "filled" : "",
                    isDep(r, c) ? "dep" : "",
                    isCurrent(r, c) ? "current" : "",
                  ].join(" ")}
                >
                  {val === null || val === undefined ? "\u00b7" : val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
