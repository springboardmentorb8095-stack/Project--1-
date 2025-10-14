import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import ProfileView from '../components/Profile/ProfileView';
import ProfileForm from '../components/Profile/ProfileForm';
import api, { endpoints } from '../services/api';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.profiles.me);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setActiveTab(0); // Switch back to view mode
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" py={4}>
          <Typography>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ mt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="View Profile" />
              <Tab label="Edit Profile" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <ProfileView profile={profile} user={user} />
            )}
            {activeTab === 1 && (
              <ProfileForm
                profile={profile}
                user={user}
                onUpdate={handleProfileUpdate}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
