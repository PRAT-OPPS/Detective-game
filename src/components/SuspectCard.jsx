
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  MapPin,
  MessageSquare,
  ArrowRight,
  Fingerprint
} from "lucide-react";

function SuspectCard({ suspect, caseId }) {
  const navigate = useNavigate();

  return (
    <div className="suspect-card">

      <div className="suspect-top">
        <span className="suspect-label">
          <Fingerprint size={15} />
          PERSON OF INTEREST
        </span>

        <span className="suspect-id">
          ID #{suspect.id}
        </span>
      </div>

      <div className="suspect-avatar">
        <UserRound size={42} />
      </div>

      <h2>{suspect.name}</h2>

      <p className="suspect-role">
        {suspect.role}
      </p>

      <div className="suspect-divider"></div>

      <div className="suspect-details">

        <div>
          <MapPin size={16} />
          <span>Alibi: {suspect.alibi}</span>
        </div>

        <div>
          <MessageSquare size={16} />
          <span>{suspect.statement}</span>
        </div>

      </div>

      <button
        className="interrogate-btn"
        onClick={() =>
          navigate(
            `/interrogation/${caseId}?suspect=${suspect.id}`
          )
        }
      >
        Interrogate Suspect
        <ArrowRight size={17} />
      </button>

    </div>
  );
}

export default SuspectCard;
