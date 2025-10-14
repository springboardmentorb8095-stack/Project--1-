export const USER_TYPES = {
  CLIENT: 'client',
  FREELANCER: 'freelancer',
};

export const PROJECT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PROPOSAL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

export const BUDGET_TYPES = {
  FIXED: 'fixed',
  HOURLY: 'hourly',
};

export const DURATION_CHOICES = [
  { value: 'less_than_1_month', label: 'Less than 1 month' },
  { value: '1_3_months', label: '1-3 months' },
  { value: '3_6_months', label: '3-6 months' },
  { value: 'more_than_6_months', label: 'More than 6 months' },
];
