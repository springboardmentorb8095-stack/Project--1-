import React from 'react';
import {
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Button
} from '@mui/material';
import { AttachMoney, Schedule, Person, DateRange } from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { USER_TYPES, DURATION_CHOICES } from '../../utils/constants';

const ProjectDetails = ({ project, user, isOwner, onSubmitProposal }) => {
  const getDurationLabel = (duration) => {
    return DURATION_CHOICES.find(d => d.value === duration)?.label || duration;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {project.title}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Chip
          icon={<AttachMoney />}
          label={
            project.budget_type === 'fixed'
              ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
              : `${formatCurrency(project.budget_min)}/hour`
          }
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<Schedule />}
          label={getDurationLabel(project.duration)}
          color="secondary"
          variant="outlined"
        />
        <Chip
          icon={<Person />}
          label={`${project.proposal_count || 0} proposals`}
          variant="outlined"
        />
        <Chip
          icon={<DateRange />}
          label={`Posted ${formatDate(project.created_at)}`}
          variant="outlined"
        />
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Project Description
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {project.description}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Client Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              Client Name
            </Typography>
            <Typography variant="body1">
              {project.client_info.first_name} {project.client_info.last_name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              Username
            </Typography>
            <Typography variant="body1">
              @{project.client_info.username}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {project.skills_required && project.skills_required.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Required Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {project.skills_required.map((skill) => (
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

      {project.deadline && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Project Deadline
          </Typography>
          <Typography variant="body1">
            {formatDate(project.deadline)}
          </Typography>
        </Paper>
      )}

      {!isOwner && user?.user_type === USER_TYPES.FREELANCER && onSubmitProposal && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onSubmitProposal}
          >
            Submit Proposal
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProjectDetails;
