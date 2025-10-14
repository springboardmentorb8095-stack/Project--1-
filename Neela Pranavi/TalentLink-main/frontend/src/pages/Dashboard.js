import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ProjectList from '../components/Projects/ProjectList';
import ProjectForm from '../components/Projects/ProjectForm';
import ProposalList from '../components/Proposals/ProposalList';
import api, { endpoints } from '../services/api';
import { USER_TYPES } from '../utils/constants';

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all projects for browsing
      const projectsResponse = await api.get(endpoints.projects.list);
      setProjects(projectsResponse.data.results || projectsResponse.data);

      if (user.user_type === USER_TYPES.CLIENT) {
        // Fetch client's own projects
        const myProjectsResponse = await api.get(endpoints.projects.myProjects);
        setMyProjects(myProjectsResponse.data.results || myProjectsResponse.data);
      } else {
        // Fetch freelancer's proposals
        const proposalsResponse = await api.get(endpoints.proposals.list);
        setProposals(proposalsResponse.data.results || proposalsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProjectCreated = (newProject) => {
    setMyProjects(prev => [newProject, ...prev]);
    setProjects(prev => [newProject, ...prev]);
    setOpenProjectForm(false);
  };

  const handleProposalSubmitted = () => {
    fetchData(); // Refresh data after proposal submission
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" py={4}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          {user.user_type === USER_TYPES.CLIENT && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenProjectForm(true)}
            >
              Post Project
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={user.user_type === USER_TYPES.CLIENT ? 'Browse Freelancers' : 'Browse Projects'} />
            <Tab label={user.user_type === USER_TYPES.CLIENT ? 'My Projects' : 'My Proposals'} />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <ProjectList
            projects={projects}
            user={user}
            onProposalSubmitted={handleProposalSubmitted}
            showFilters={true}
          />
        )}

        {activeTab === 1 && (
          <>
            {user.user_type === USER_TYPES.CLIENT ? (
              <ProjectList
                projects={myProjects}
                user={user}
                isOwner={true}
                title="My Posted Projects"
              />
            ) : (
              <ProposalList proposals={proposals} />
            )}
          </>
        )}

        {/* Project Form Dialog */}
        <Dialog
          open={openProjectForm}
          onClose={() => setOpenProjectForm(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Post New Project</DialogTitle>
          <DialogContent>
            <ProjectForm
              onSubmit={handleProjectCreated}
              onCancel={() => setOpenProjectForm(false)}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Dashboard;
