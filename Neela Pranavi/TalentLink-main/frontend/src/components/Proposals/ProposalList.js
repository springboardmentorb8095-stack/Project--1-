import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider
} from '@mui/material';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getStatusColor } from '../../utils/helpers';

const ProposalList = ({ proposals }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleViewProposal = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCloseDialog = () => {
    setSelectedProposal(null);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (proposals.length === 0) {
    return (
      <Alert severity="info">
        You haven't submitted any proposals yet. Browse projects and submit your first proposal!
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Proposals ({proposals.length})
      </Typography>

      <Grid container spacing={3}>
        {proposals.map((proposal) => (
          <Grid item xs={12} md={6} key={proposal.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {proposal.project_info.title}
                  </Typography>
                  <Chip
                    label={proposal.status.toUpperCase()}
                    color={getStatusVariant(proposal.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Proposed Budget: {formatCurrency(proposal.proposed_budget)}
                  {proposal.project_info.budget_type === 'hourly' && '/hour'}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Timeline: {proposal.proposed_timeline}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Project Budget: {proposal.project_info.budget_type === 'fixed' 
                    ? `${formatCurrency(proposal.project_info.budget_min)} - ${formatCurrency(proposal.project_info.budget_max)}`
                    : `${formatCurrency(proposal.project_info.budget_min)}/hour`
                  }
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Submitted {formatDate(proposal.created_at)}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleViewProposal(proposal)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Proposal Details Dialog */}
      <Dialog
        open={!!selectedProposal}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Proposal Details
        </DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedProposal.project_info.title}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedProposal.status.toUpperCase()}
                    color={getStatusVariant(selectedProposal.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Submitted
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedProposal.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Proposed Budget
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(selectedProposal.proposed_budget)}
                    {selectedProposal.project_info.budget_type === 'hourly' && '/hour'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Timeline
                  </Typography>
                  <Typography variant="body1">
                    {selectedProposal.proposed_timeline}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Cover Letter
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-line',
                  bgcolor: 'grey.50',
                  p: 2,
                  borderRadius: 1
                }}
              >
                {selectedProposal.cover_letter}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProposalList;
