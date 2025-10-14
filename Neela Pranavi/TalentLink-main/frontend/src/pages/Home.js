import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  const features = [
    {
      icon: <WorkIcon fontSize="large" />,
      title: 'Find Projects',
      description: 'Discover amazing projects that match your skills and interests.',
    },
    {
      icon: <PersonIcon fontSize="large" />,
      title: 'Hire Talent',
      description: 'Connect with skilled freelancers for your business needs.',
    },
    {
      icon: <SearchIcon fontSize="large" />,
      title: 'Smart Matching',
      description: 'Our platform intelligently matches clients with freelancers.',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white',
          borderRadius: 2,
          mb: 6,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Connect. Create. Collaborate.
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          The professional matchmaking platform for freelancers and clients
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/register"
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            component={Link}
            to="/login"
          >
            Sign In
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
        Why Choose TalentLink?
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          bgcolor: 'grey.100',
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Join thousands of freelancers and clients already using TalentLink
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/register"
        >
          Create Account
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
