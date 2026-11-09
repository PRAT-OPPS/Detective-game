
import { useNavigate } from "react-router-dom";
import { FolderSearch, MapPin, User, ArrowUpRight } from "lucide-react";

function CaseCard({ item }) {
  const navigate = useNavigate();

  return (
    <div className="case-card">

      <div className="case-card-top">
        <span className="case-number">
          CASE FILE / 00{item.id}
        </span>

        <span className="case-status">
          UNSOLVED
        </span>
      </div>

      <div className="case-card-icon">
        <FolderSearch size={30} />
      </div>

      <h3>{item.title}</h3>

      <p className="case-description">
        {item.description}
      </p>

      <div className="case-info">
        <div>
          <User size={16} />
          <span>{item.victim}</span>
        </div>

        <div>
          <MapPin size={16} />
          <span>{item.location}</span>
        </div>
      </div>

      <div className="case-card-footer">
        <span>CONFIDENTIAL INVESTIGATION</span>

        <button
          onClick={() => navigate(`/case/${item.id}`)}
        >
          Investigate
          <ArrowUpRight size={16} />
        </button>
      </div>

    </div>
  );
}

export default CaseCard;
