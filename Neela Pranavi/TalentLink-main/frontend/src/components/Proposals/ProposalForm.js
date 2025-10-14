import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
  Divider
} from '@mui/material';
import api, { endpoints } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const ProposalForm = ({ project, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_budget: '',
    proposed_timeline: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const proposalData = {
        ...formData,
        project: project.id
      };

      await api.post(endpoints.proposals.list, proposalData);
      onSuccess();
    } catch (error) {
      setErrors(error.response?.data || { error: 'Failed to submit proposal' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Project Summary */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Budget: {project.budget_type === 'fixed' 
            ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
            : `${formatCurrency(project.budget_min)}/hour`
          }
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Client: {project.client_info.first_name} {project.client_info.last_name}
        </Typography>
      </Paper>

      <form onSubmit={handleSubmit}>
        {errors.non_field_errors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.non_field_errors[0]}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Cover Letter"
          name="cover_letter"
          value={formData.cover_letter}
          onChange={handleChange}
          error={!!errors.cover_letter}
          helperText={errors.cover_letter?.[0] || "Explain why you're the best fit for this project"}
          margin="normal"
          multiline
          rows={6}
          required
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Proposed ${project.budget_type === 'fixed' ? 'Budget' : 'Hourly Rate'}`}
              name="proposed_budget"
              type="number"
              value={formData.proposed_budget}
              onChange={handleChange}
              error={!!errors.proposed_budget}
              helperText={errors.proposed_budget?.[0]}
              margin="normal"
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Timeline"
              name="proposed_timeline"
              value={formData.proposed_timeline}
              onChange={handleChange}
              error={!!errors.proposed_timeline}
              helperText={errors.proposed_timeline?.[0] || "e.g., '2 weeks', '1 month'"}
              margin="normal"
              required
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
            {loading ? 'Submitting...' : 'Submit Proposal'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProposalForm;
