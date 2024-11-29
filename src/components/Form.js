import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Snackbar, Alert, Card, CardContent, Chip } from '@mui/material';
import getBaseURL from '../apiConfig';

const Form = () => {
  // State declarations
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    product: '',
    date: new Date().toISOString().split('T')[0], // default to today's date
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for online/offline events
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    });
    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, email, mobile, product, date } = formData;

    if (!navigator.onLine) {
      // Save form data locally when offline
      savePendingRequest({ name, email, mobile, product, date });
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('sync-form');
      });
      setSnackbar({
        open: true,
        message: 'Form saved! It will be submitted once online.',
        severity: 'info',
      });
    } else {
      try {
        const response = await fetch(`${getBaseURL()}/form/submissions/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, mobile, product, date }),
        });
        if (response.ok) {
          setSnackbar({
            open: true,
            message: 'Form submitted successfully!',
            severity: 'success',
          });
          setFormData({ name: '', email: '', mobile: '', product: '', date: new Date().toISOString().split('T')[0] });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to submit the form.',
          severity: 'error',
        });
      }
    }
  };

  // Save pending requests locally
  const savePendingRequest = (data) => {
    const requests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
    requests.push(data);
    localStorage.setItem('pendingRequests', JSON.stringify(requests));
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      {/* Online/Offline Status Indicator */}
      <Chip
        label={isOnline ? 'Online' : 'Offline'}
        color={isOnline ? 'success' : 'error'}
        sx={{
          position: 'fixed',
          top: 10,
          right: 16,
          zIndex: 999,
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '8px 16px',
        }}
      />
      
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Preloved Equipment Disclaimer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
            <img src="/babystoplogo.png" alt="Logo" style={{ width: 160, marginRight: 16, marginTop: 5 }} />
            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 1.6 }}>
              Thank you for helping us in reusing preloved equipment. By completing the form below, you confirm 
              that you understand this item was donated to Babystop and has not undergone any quality 
              or safety inspection. You agree it is your responsibility to examine this product 
              before use and accept full responsibility and liability for its safety. Babystop holds 
              no liability for this product. If found unfit, please dispose of it at your local 
              recycling depot. Please note your personal information will only be used for our internal records
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {['name', 'email', 'mobile', 'product', 'date'].map((field) => (
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
                type={field === 'date' ? 'date' : 'text'}
                InputLabelProps={field === 'date' ? { shrink: true } : {}}
              />
            ))}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                padding: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Form;
