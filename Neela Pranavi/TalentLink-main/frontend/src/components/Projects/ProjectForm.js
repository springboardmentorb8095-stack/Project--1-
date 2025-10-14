import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Grid,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import api, { endpoints } from '../../services/api';
import { BUDGET_TYPES, DURATION_CHOICES } from '../../utils/constants';

const ProjectForm = ({ onSubmit, onCancel, project = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_type: 'fixed',
    budget_min: '',
    budget_max: '',
    duration: '',
    deadline: '',
    skill_ids: []
  });
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSkills();
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        budget_type: project.budget_type || 'fixed',
        budget_min: project.budget_min || '',
        budget_max: project.budget_max || '',
        duration: project.duration || '',
        deadline: project.deadline || '',
        skill_ids: project.skills_required?.map(s => s.id) || []
      });
      setSelectedSkills(project.skills_required || []);
    }
  }, [project]);

  const fetchSkills = async () => {
    try {
      const response = await api.get(endpoints.profiles.skills);
      setSkills(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillsChange = (event, newValue) => {
    setSelectedSkills(newValue);
    setFormData(prev => ({
      ...prev,
      skill_ids: newValue.map(skill => skill.id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const url = project 
        ? endpoints.projects.detail(project.id)
        : endpoints.projects.list;
      const method = project ? 'put' : 'post';

      const response = await api[method](url, formData);
      onSubmit(response.data);
    } catch (error) {
      setErrors(error.response?.data || { error: 'Failed to save project' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {errors.non_field_errors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.non_field_errors[0]}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Project Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title?.[0]}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Project Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description?.[0]}
        margin="normal"
        multiline
        rows={4}
        required
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth margin="normal" error={!!errors.budget_type} required>
            <InputLabel>Budget Type</InputLabel>
            <Select
              name="budget_type"
              value={formData.budget_type}
              onChange={handleChange}
              label="Budget Type"
            >
              <MenuItem value={BUDGET_TYPES.FIXED}>Fixed Price</MenuItem>
              <MenuItem value={BUDGET_TYPES.HOURLY}>Hourly Rate</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label={formData.budget_type === 'fixed' ? 'Minimum Budget' : 'Hourly Rate'}
            name="budget_min"
            type="number"
            value={formData.budget_min}
            onChange={handleChange}
            error={!!errors.budget_min}
            helperText={errors.budget_min?.[0]}
            margin="normal"
            required
          />
        </Grid>
        {formData.budget_type === 'fixed' && (
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Maximum Budget"
              name="budget_max"
              type="number"
              value={formData.budget_max}
              onChange={handleChange}
              error={!!errors.budget_max}
              helperText={errors.budget_max?.[0]}
              margin="normal"
              required
            />
          </Grid>
        )}
      </Grid>

      <FormControl fullWidth margin="normal" error={!!errors.duration} required>
        <InputLabel>Project Duration</InputLabel>
        <Select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          label="Project Duration"
        >
          {DURATION_CHOICES.map(choice => (
            <MenuItem key={choice.value} value={choice.value}>
              {choice.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Project Deadline"
        name="deadline"
        type="date"
        value={formData.deadline}
        onChange={handleChange}
        error={!!errors.deadline}
        helperText={errors.deadline?.[0]}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Autocomplete
        multiple
        options={skills}
        value={selectedSkills}
        onChange={handleSkillsChange}
        getOptionLabel={(option) => option.name}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.name}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Required Skills"
            margin="normal"
            error={!!errors.skill_ids}
            helperText={errors.skill_ids?.[0]}
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : (project ? 'Update Project' : 'Post Project')}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectForm;
