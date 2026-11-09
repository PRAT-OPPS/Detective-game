
const getStorageKey = (caseId) => `detective-evidence-${caseId}`;

// Get saved evidence
export function getEvidence(caseId) {
  try {
    const saved = localStorage.getItem(getStorageKey(caseId));
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not load evidence:", error);
    return [];
  }
}

// Save evidence
export function saveEvidence(caseId, evidence) {
  try {
    localStorage.setItem(
      getStorageKey(caseId),
      JSON.stringify(evidence)
    );
  } catch (error) {
    console.error("Could not save evidence:", error);
  }
}

// Add evidence without duplicates
export function addEvidence(caseId, newEvidence) {
  const currentEvidence = getEvidence(caseId);

  const alreadyCollected = currentEvidence.some(
    (item) => item.id === newEvidence.id
  );

  if (alreadyCollected) {
    return currentEvidence;
  }

  const updatedEvidence = [...currentEvidence, newEvidence];

  saveEvidence(caseId, updatedEvidence);

  return updatedEvidence;
}