import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Snackbar, Alert, Card, CardContent, Chip, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import getBaseURL from '../apiConfig';
import { openDB } from 'idb';

const initDB = async () => {
  return openDB('FormSyncDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
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
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
  
    // Validate that 'consent' is checked (should be boolean true)
    if (!formData.consent) {
      setSnackbar({ open: true, message: 'Please click on the checkbox to continue.', severity: 'warning' });
    }
  
    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const savePendingRequest = async (data) => {
    const db = await initDB();
    const id = new Date().getTime(); // Use a unique ID for the request
    await db.add('requests', { id, ...data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const { name, email, mobile, product, date } = formData;

    if (!navigator.onLine) {
      await savePendingRequest({ name, email, mobile, product, date });
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('sync-form').catch((error) => {
          console.error('Sync registration failed:', error);
        });
      });

      setSnackbar({ open: true, message: 'Form saved! It will be submitted once online.', severity: 'info' });
      setFormData({ name: '', email: '', mobile: '', product: '', date: new Date().toISOString().split('T')[0], consent: false });
    } else {
      try {
        const response = await fetch(`${getBaseURL()}/form/submissions/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, mobile, product, date }),
        });

        if (response.ok) {
          setSnackbar({ open: true, message: 'Form submitted successfully!', severity: 'success' });
          setFormData({ name: '', email: '', mobile: '', product: '', date: new Date().toISOString().split('T')[0], consent: false });
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
                  <a href="https://babystop.uk" target="_blank" style={{ textDecoration: 'underline', color: '#1976d2' }}>
                    Privacy Policy
                  </a>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Form;
