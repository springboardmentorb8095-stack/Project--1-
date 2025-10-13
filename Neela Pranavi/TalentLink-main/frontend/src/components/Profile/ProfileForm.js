import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip,
  Grid,
  Typography,
  Alert,
  InputAdornment
} from '@mui/material';
import api, { endpoints } from '../../services/api';
import { USER_TYPES } from '../../utils/constants';

const ProfileForm = ({ profile, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    bio: '',
    hourly_rate: '',
    location: '',
    portfolio_url: '',
    phone: '',
    availability: true,
    skill_ids: []
  });
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSkills();
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        hourly_rate: profile.hourly_rate || '',
        location: profile.location || '',
        portfolio_url: profile.portfolio_url || '',
        phone: profile.phone || '',
        availability: profile.availability ?? true,
        skill_ids: profile.skills?.map(s => s.id) || []
      });
      setSelectedSkills(profile.skills || []);
    }
  }, [profile]);

  const fetchSkills = async () => {
    try {
      const response = await api.get(endpoints.profiles.skills);
      setSkills(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      const response = await api.put(endpoints.profiles.me, formData);
      onUpdate(response.data);
    } catch (error) {
      setErrors(error.response?.data || { error: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Edit Profile Information
      </Typography>

      {errors.non_field_errors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.non_field_errors[0]}
        </Alert>
      )}

      <TextField
        fullWidth
        label={user.user_type === USER_TYPES.CLIENT ? 'About Your Company' : 'Professional Bio'}
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        error={!!errors.bio}
        helperText={errors.bio?.[0] || 'Tell others about yourself and your experience'}
        margin="normal"
        multiline
        rows={4}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location?.[0]}
            margin="normal"
            placeholder="e.g., New York, NY"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone?.[0]}
            margin="normal"
            placeholder="e.g., +1 (555) 123-4567"
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        label={user.user_type === USER_TYPES.CLIENT ? 'Website URL' : 'Portfolio URL'}
        name="portfolio_url"
        type="url"
        value={formData.portfolio_url}
        onChange={handleChange}
        error={!!errors.portfolio_url}
        helperText={errors.portfolio_url?.[0]}
        margin="normal"
        placeholder="https://your-website.com"
      />

      {user.user_type === USER_TYPES.FREELANCER && (
        <>
          <TextField
            fullWidth
            label="Hourly Rate"
            name="hourly_rate"
            type="number"
            value={formData.hourly_rate}
            onChange={handleChange}
            error={!!errors.hourly_rate}
            helperText={errors.hourly_rate?.[0]}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">/hour</InputAdornment>,
            }}
          />

          <FormControlLabel
            control={
              <Switch
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Available for new projects"
            sx={{ mt: 2, mb: 1 }}
          />
        </>
      )}

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
              key={option.id}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={user.user_type === USER_TYPES.CLIENT ? 'Areas of Interest' : 'Skills'}
            margin="normal"
            error={!!errors.skill_ids}
            helperText={errors.skill_ids?.[0] || 'Add skills that represent your expertise or interests'}
          />
        )}
        sx={{ mt: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          size="large"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileForm;
