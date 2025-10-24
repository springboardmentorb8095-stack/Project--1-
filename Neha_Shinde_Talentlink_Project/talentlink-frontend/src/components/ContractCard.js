import React from 'react';

const ContractCard = ({ contract }) => {
  if (!contract) return null;

  const {
    freelancer_name,
    status,
    start_date,
    end_date,
    terms,
    project_title,
  } = contract;

  return (
    <div className="contract-card border rounded p-3 mb-3 shadow-sm bg-light">
      <h5 className="text-primary mb-2">Contract: {project_title || 'Untitled Project'}</h5>
      <p><strong>Freelancer:</strong> {freelancer_name || 'N/A'}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Start Date:</strong> {start_date}</p>
      {end_date && <p><strong>End Date:</strong> {end_date}</p>}
      <p><strong>Terms:</strong> {terms || 'No terms provided.'}</p>
    </div>
  );
};

export default ContractCard;
