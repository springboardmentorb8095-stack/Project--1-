// components/FilterBar.js
import React, { useState } from 'react';

function FilterBar({ onFilter }) {
  const [skill, setSkill] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [durationMax, setDurationMax] = useState('');

  const handleClick = () => {
    const filters = {};
    if (skill) filters.skill = skill;
    if (budgetMin) filters.budget_min = budgetMin;
    if (budgetMax) filters.budget_max = budgetMax;
    if (durationMax) filters.duration_max = durationMax;

    console.log("Applying filters:", filters); // ✅ Debug log
    onFilter(filters); // ✅ Trigger fetchProjects with filters
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Skill"
        value={skill}
        onChange={e => setSkill(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min Budget"
        value={budgetMin}
        onChange={e => setBudgetMin(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Budget"
        value={budgetMax}
        onChange={e => setBudgetMax(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Duration (weeks)"
        value={durationMax}
        onChange={e => setDurationMax(e.target.value)}
      />
      <button onClick={handleClick}>Filter</button>
    </div>
  );
}

export default FilterBar;
