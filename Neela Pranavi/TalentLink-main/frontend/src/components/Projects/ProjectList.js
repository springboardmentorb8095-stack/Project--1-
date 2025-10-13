import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Alert
} from '@mui/material';
import ProjectDetails from './ProjectDetails';
import ProposalForm from '../Proposals/ProposalForm';
import { formatCurrency, formatDate, truncateText } from '../../utils/helpers';
import { USER_TYPES, DURATION_CHOICES } from '../../utils/constants';
import { LocationOn, AttachMoney, Schedule } from '@mui/icons-material';

const ProjectList = ({
  projects,
  user,
  onProposalSubmitted,
  isOwner = false,
  showFilters = false,
  title = 'Available Projects'
}) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [openProposalForm, setOpenProposalForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    duration: '',
    skills: '',
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDetails = () => {
    setSelectedProject(null);
  };

  const handleSubmitProposal = (project) => {
    setSelectedProject(project);
    setOpenProposalForm(true);
  };

  const handleProposalSuccess = () => {
    setOpenProposalForm(false);
    setSelectedProject(null);
    if (onProposalSubmitted) {
      onProposalSubmitted();
    }
  };

  // Filter projects based on search criteria
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !filters.search || 
      project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesDuration = !filters.duration || project.duration === filters.duration;

    const matchesSkills = !filters.skills || 
      project.skills_required.some(skill => 
        skill.name.toLowerCase().includes(filters.skills.toLowerCase())
      );

    return matchesSearch && matchesDuration && matchesSkills;
  });

  return (
    <Box>
      {showFilters && (
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filter Projects
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search projects..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  label="Duration"
                >
                  <MenuItem value="">All</MenuItem>
                  {DURATION_CHOICES.map(choice => (
                    <MenuItem key={choice.value} value={choice.value}>
                      {choice.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Skills"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                placeholder="e.g. React, Python"
              />
            </Grid>
          </Grid>
        </Card>
      )}

      <Typography variant="h5" gutterBottom>
        {title} ({filteredProjects.length})
      </Typography>

      {filteredProjects.length === 0 ? (
        <Alert severity="info">
          {projects.length === 0 
            ? 'No projects available at the moment.' 
            : 'No projects match your search criteria.'
          }
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card className="project-card" onClick={() => handleProjectClick(project)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {project.title}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" paragraph>
                    {truncateText(project.description, 100)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney fontSize="small" color="primary" />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {project.budget_type === 'fixed' 
                        ? `${formatCurrency(project.budget_min)} - ${formatCurrency(project.budget_max)}`
                        : `${formatCurrency(project.budget_min)}/hr`
                      }
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Schedule fontSize="small" color="primary" />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {DURATION_CHOICES.find(d => d.value === project.duration)?.label || project.duration}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {project.skills_required.slice(0, 3).map((skill) => (
                      <Chip
                        key={skill.id}
                        label={skill.name}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                    {project.skills_required.length > 3 && (
                      <Chip
                        label={`+${project.skills_required.length - 3} more`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(project.created_at)}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {project.proposal_count || 0} proposals
                    </Typography>
                  </Box>

                  {!isOwner && user?.user_type === USER_TYPES.FREELANCER && (
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmitProposal(project);
                      }}
                    >
                      Submit Proposal
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Project Details Dialog */}
      <Dialog
        open={!!selectedProject}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Project Details
            </Typography>
            <Button onClick={handleCloseDetails}>Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProject && (
            <ProjectDetails 
              project={selectedProject}
              user={user}
              isOwner={isOwner}
              onSubmitProposal={() => setOpenProposalForm(true)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Proposal Form Dialog */}
      <Dialog
        open={openProposalForm}
        onClose={() => setOpenProposalForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submit Proposal</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <ProposalForm
              project={selectedProject}
              onSuccess={handleProposalSuccess}
              onCancel={() => setOpenProposalForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProjectList;
