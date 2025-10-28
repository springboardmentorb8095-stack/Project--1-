import React, { useState } from 'react';

function FilterBar({ onFilter }) {
  const [skill, setSkill] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [durationMax, setDurationMax] = useState('');

  const handleClick = () => {
    const filters = {};
    if (skill.trim()) filters.skill = skill.trim();
    if (budgetMin) filters.budget_min = parseFloat(budgetMin);
    if (budgetMax) filters.budget_max = parseFloat(budgetMax);
    if (durationMax) filters.duration_max = parseInt(durationMax);

    console.log("Applying filters:", filters);
    onFilter(filters);
  };

  return (
    <div className="filter-bar" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <input
        type="text"
        name="skill"
        placeholder="Skill"
        value={skill}
        onChange={e => setSkill(e.target.value)}
        aria-label="Filter by skill"
      />
      <input
        type="number"
        name="budgetMin"
        placeholder="Min Budget"
        value={budgetMin}
        onChange={e => setBudgetMin(e.target.value)}
        aria-label="Minimum budget"
      />
      <input
        type="number"
        name="budgetMax"
        placeholder="Max Budget"
        value={budgetMax}
        onChange={e => setBudgetMax(e.target.value)}
        aria-label="Maximum budget"
      />
      <input
        type="number"
        name="durationMax"
        placeholder="Max Duration (weeks)"
        value={durationMax}
        onChange={e => setDurationMax(e.target.value)}
        aria-label="Maximum duration"
      />
      <button onClick={handleClick}>Apply Filters</button>
    </div>
  );
}

export default FilterBar;
