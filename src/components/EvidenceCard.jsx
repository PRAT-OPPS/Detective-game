
function EvidenceCard({ item, collected, onCollect }) {
  return (
    <div className={`evidence-item ${collected ? "collected" : ""}`}>

      <div className="evidence-icon">
        {item.icon}
      </div>

      <div className="evidence-info">
        <h3>{item.name}</h3>

        <p>{item.description}</p>

        {collected && (
          <span className="collected-label">
            ✓ Evidence Collected
          </span>
        )}
      </div>

      <button
        className="collect-btn"
        disabled={collected}
        onClick={() => onCollect(item)}
      >
        {collected ? "Collected" : "Collect Evidence"}
      </button>

    </div>
  );
}

export default EvidenceCard;
