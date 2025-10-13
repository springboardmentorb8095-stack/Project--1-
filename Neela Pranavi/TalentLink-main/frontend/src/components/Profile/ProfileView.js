import React from 'react';
import {
  Typography,
  Box,
  Chip,
  Grid,
  Paper,
  Divider,
  Rating,
  Link
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  AttachMoney,
  Star,
  Work,
  Language
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';
import { USER_TYPES } from '../../utils/constants';

const ProfileView = ({ profile, user }) => {
  if (!profile) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          No profile information available
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please update your profile to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            @{user.username}
          </Typography>
          <Chip
            label={user.user_type === USER_TYPES.CLIENT ? 'Client' : 'Freelancer'}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Contact Information */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email fontSize="small" sx={{ mr: 1, color: 'grey.600' }} />
              <Typography variant="body2">{user.email}</Typography>
            </Box>

            {profile.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone fontSize="small" sx={{ mr: 1, color: 'grey.600' }} />
                <Typography variant="body2">{profile.phone}</Typography>
              </Box>
            )}

            {profile.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn fontSize="small" sx={{ mr: 1, color: 'grey.600' }} />
                <Typography variant="body2">{profile.location}</Typography>
              </Box>
            )}

            {profile.portfolio_url && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Language fontSize="small" sx={{ mr: 1, color: 'grey.600' }} />
                <Link href={profile.portfolio_url} target="_blank" rel="noopener">
                  Portfolio
                </Link>
              </Box>
            )}
          </Paper>
        </Grid>

        {user.user_type === USER_TYPES.FREELANCER && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Professional Stats
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star fontSize="small" sx={{ mr: 1, color: 'gold' }} />
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Rating: {profile.rating}/5.0
                </Typography>
                <Rating value={profile.rating} readOnly size="small" />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Work fontSize="small" sx={{ mr: 1, color: 'grey.600' }} />
                <Typography variant="body2">
                  Completed Projects: {profile.total_projects}
                </Typography>
              </Box>

              {profile.hourly_rate && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney fontSize="small" sx={{ mr: 1, color: 'grey.600' }} />
                  <Typography variant="body2">
                    Hourly Rate: {formatCurrency(profile.hourly_rate)}/hour
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person fontSize="small" sx={{ mr: 1, color: 'grey.600' }} />
                <Typography variant="body2">
                  Status: {profile.availability ? 'Available' : 'Unavailable'}
                </Typography>
                <Chip
                  label={profile.availability ? 'Available' : 'Unavailable'}
                  color={profile.availability ? 'success' : 'error'}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Bio Section */}
      {profile.bio && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {user.user_type === USER_TYPES.CLIENT ? 'About' : 'Professional Summary'}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {profile.bio}
          </Typography>
        </Paper>
      )}

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {user.user_type === USER_TYPES.CLIENT ? 'Interests' : 'Skills'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {profile.skills.map((skill) => (
              <Chip
                key={skill.id}
                label={skill.name}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Empty State */}
      {!profile.bio && (!profile.skills || profile.skills.length === 0) && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            Your profile is looking a bit empty. Add some information to make it more attractive!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProfileView;
