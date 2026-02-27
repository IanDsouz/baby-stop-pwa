import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Alert, Card, CardContent, Chip, CircularProgress, Checkbox, FormControlLabel, Link, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import getBaseURL from '../apiConfig';
import { addOrUpdatePendingRequest } from '../db';

const Form = ({ isAdmin, onAdminLoginClick }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    product: '',
    date: new Date().toISOString().split('T')[0], 
    consent: false,
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = () => {
    const errors = {};
  
    // Validate that all fields except 'consent' are filled
    Object.keys(formData).forEach((key) => {
      if (key !== 'consent' && !formData[key]) {
        if (key === 'firstName') {
          errors[key] = 'First name is required';
        } else if (key === 'lastName') {
          errors[key] = 'Last name is required';
        } else {
          errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        }
      }
    });

    // Basic email format validation
    if (formData.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
  
    // Validate that 'consent' is checked (should be boolean true)
    if (!formData.consent) {
      setSnackbar({ open: true, message: 'Please click on the checkbox to continue.', severity: 'warning' });
    }
  
    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const savePendingRequest = async (data) => {
    const id = new Date().getTime();
    await addOrUpdatePendingRequest({ id, ...data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const { firstName, lastName, email, mobile, product, date } = formData;
    const name = `${firstName} ${lastName}`.trim();

    if (!navigator.onLine) {
      await savePendingRequest({ name, email, mobile, product, date });
      setSnackbar({ open: true, message: 'Form saved! It will be submitted once online.', severity: 'success' });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        product: '',
        date: new Date().toISOString().split('T')[0],
        consent: false,
      });
    } else {
      try {
        const response = await fetch(`${getBaseURL()}/form/submissions/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, mobile, product, date }),
        });

        if (response.ok) {
          setSnackbar({ open: true, message: 'Form submitted successfully!', severity: 'success' });
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            product: '',
            date: new Date().toISOString().split('T')[0],
            consent: false,
          });
        }
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to submit the form.', severity: 'error' });
      }
    }

    setIsSubmitting(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      {/* Online/Offline Status Indicator + Admin Login */}
      <Box
        sx={{
          position: 'fixed',
          top: 10,
          right: 16,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Chip
          label={isOnline ? 'Online' : 'Offline'}
          color={isOnline ? 'success' : 'error'}
          sx={{
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '8px 16px',
          }}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onAdminLoginClick}
          disabled={isAdmin}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {isAdmin ? 'Active' : 'Login'}
        </Button>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'primary.main' }}>
            Preloved Equipment Disclaimer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
            <img src="/babystoplogo.png" alt="Logo" style={{ width: 160, marginRight: 16, marginTop: 5 }} />
            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 1.6, color: 'text.primary' }}>
              Thank you for helping us in reusing preloved equipment. By completing the form below, you confirm
              that you understand this item was donated to Babystop and has not undergone any quality
              or safety inspection. You agree it is your responsibility to examine this product
              before use and accept full responsibility and liability for its safety. Babystop holds
              no liability for this product. If found unfit, please dispose of it at your local
              recycling depot. Please note your personal information will only be used for our internal records.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* First and Last Name on the same line */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="First name"
                name="firstName"
                fullWidth
                variant="outlined"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errorMessages.firstName}
                helperText={errorMessages.firstName}
              />
              <TextField
                label="Last name"
                name="lastName"
                fullWidth
                variant="outlined"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errorMessages.lastName}
                helperText={errorMessages.lastName}
              />
            </Box>

            {['email', 'mobile', 'product', 'date'].map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                fullWidth
                variant="outlined"
                value={formData[field]}
                onChange={handleChange}
                error={!!errorMessages[field]}
                helperText={errorMessages[field]}
                sx={{ marginBottom: 2 }}
                type={field === 'date' ? 'date' : field === 'email' ? 'email' : 'text'}
                InputLabelProps={field === 'date' ? { shrink: true } : {}}
              />
            ))}

            {/* GDPR Consent Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" component="span">
                  By submitting this form, you agree to our{' '}
                  <Link
                    component={RouterLink}
                    to="/privacy-policy"
                    sx={{ textDecoration: 'underline', color: '#1976d2' }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ marginBottom: 2 }}
            />

            <Box sx={{ position: 'relative', textAlign: 'center', marginTop: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  padding: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  position: 'relative',
                  ':hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {snackbar.severity === 'success'
            ? 'Thank you!'
            : snackbar.severity === 'warning'
            ? 'Please check'
            : 'Something went wrong'}
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSnackbar} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Form;
