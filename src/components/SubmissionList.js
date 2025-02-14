import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import getBaseURL from '../apiConfig';
import { getPendingRequests, removeSyncedRequest, addOrUpdatePendingRequest } from '../db';

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [offlineSubmissions, setOfflineSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fetch initial unsynced record count
    updateUnsyncedCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  const handleDuplicate = () => {
    if (!selectedSubmission) return;
  
    const duplicatedData = { ...selectedSubmission };
    delete duplicatedData.id; // Remove ID to ensure a new entry
  
    setFormData(duplicatedData);
    setEditMode(true); // Open edit form with duplicated data
  };

  const handleEdit = () => {
    if (selectedSubmission) {
      setFormData({ ...selectedSubmission });
      setEditMode(true);
      setOpen(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const isDuplicating = !formData.id; // If there's no ID, it's a duplication or new entry
      const method = isDuplicating ? "POST" : "PATCH"; // PATCH updates, POST duplicates/new
      const url = isDuplicating
        ? `${getBaseURL()}/form/submissions/`
        : `${getBaseURL()}/form/submissions/${formData.id}/`;


      if (!isOnline) {
        await addOrUpdatePendingRequest({ ...formData, id: isDuplicating ? Date.now() : formData.id });
        setSnackbar({ open: true, message: "Submission saved offline!", severity: "info" });
        updateUnsyncedCount();
        setOpen(false);
        fetchSubmissions();
        setEditMode(false);
        setSelectedSubmission(null);
        return;
      }
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        fetchSubmissions(); 
        setSelectedSubmission(null);
        setEditMode(false);
        setSnackbar({
          open: true,
          message: isDuplicating ? "Submission duplicated!" : "Submission saved!",
          severity: "success",
        });
      } else {
        setSnackbar({ open: true, message: "Error saving submission", severity: "error" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbar({ open: true, message: "Submission failed", severity: "error" });
    }
  };

  const updateUnsyncedCount = async () => {
    const requests = await getPendingRequests();
    setUnsyncedCount(requests.length);
  };

  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart = localPart.slice(0, 2) + "***" + localPart.slice(-1);
    return `${maskedLocalPart}@${domain}`;
  };
  
  const maskMobile = (mobile) => {
    if (!mobile) return "";
    return mobile.slice(0, 2) + "****" + mobile.slice(-2);
  };

  const fetchOfflineSubmissions = useCallback(async () => {
    const data = await getPendingRequests();
    return data.map((submission) => ({
      ...submission,
      date_submitted: submission.date_submitted || new Date().toISOString(),
    }));
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchSubmissions = useCallback(async () => {
    if (isOnline) {
      try {
        const response = await fetch(`${getBaseURL()}/form/submissions/`);
        const data = await response.json();
        setSubmissions(data);
      
        const offlineData = await fetchOfflineSubmissions();
        setOfflineSubmissions(offlineData)

      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    } else {
      setTimeout(async () => {
        const offlineData = await fetchOfflineSubmissions();
        setOfflineSubmissions(offlineData);
      }, 500);
    }
  }, [isOnline, fetchOfflineSubmissions]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSubmission(null);
  };

  const handleSync = async () => {
    if (isOnline) {
    setIsSyncing(true);
    const unsyncedSubmissions = await getPendingRequests();

    for (const submission of unsyncedSubmissions) {
      try {
        const response = await fetch(`${getBaseURL()}/form/submissions/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission),
        });

        if (response.ok) {
          await removeSyncedRequest(submission.id);
        } else {
          console.error(`Failed to sync submission ID ${submission.id}`);
        }
      } catch (error) {
        console.error('Error during sync:', error);
      }
    }

    setSnackbar({ open: true, message: `${unsyncedSubmissions.length} submissions synced online`, severity: 'success' });
    setIsSyncing(false);
    await updateUnsyncedCount();
    fetchSubmissions();
  }
  else {
    setSnackbar({ open: true, message: 'Form will be submitted once online!', severity: 'error' });
  };
}

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);

    const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
                   (day % 10 === 2 && day !== 12) ? 'nd' :
                   (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: 'auto', mt: 3 }}>
        <Typography variant="h5" align="center" sx={{ padding: 2 }}>
          Submitted Forms
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSync}
          disabled={!isOnline || isSyncing || unsyncedCount === 0}
          sx={{ display: 'block', margin: '10px auto' }}
        >
          {isSyncing ? <CircularProgress size={20} color="inherit" /> : `Sync (${unsyncedCount})`}
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Mobile</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {offlineSubmissions.map((submission) => (
              <TableRow 
                key={submission.id} 
                onClick={() => handleRowClick(submission)}
                sx={{ cursor: 'pointer', backgroundColor: '#fff7e6', '&:hover': { backgroundColor: '#ffe8cc' } }}
              >
                <TableCell>{submission.id}</TableCell>
                <TableCell>{submission.name}</TableCell>
                <TableCell>{maskEmail(submission.email)}</TableCell>
                <TableCell>{submission.product}</TableCell>
                <TableCell>{maskMobile(submission.mobile)}</TableCell>
                <TableCell>{formatDate(submission.date_submitted)}</TableCell>
                <TableCell>
                  <Chip label="Pending Sync" color="warning" size="small" />
                </TableCell>
              </TableRow>
            ))}
            {submissions.map((submission, index ) => (
              <TableRow 
                key={submission.id} 
                onClick={() => handleRowClick(submission)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{index +1}</TableCell>
                <TableCell>{submission.name}</TableCell>
              <TableCell>{maskEmail(submission.email)}</TableCell>
              <TableCell>{submission.product}</TableCell>
              <TableCell>{maskMobile(submission.mobile)}</TableCell>
                <TableCell>{formatDate(submission.date_submitted)}</TableCell>
                <TableCell>
                  <Chip label="Synced" color="success" size="small" />
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

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

      {editMode && (
        <Dialog open={editMode} onClose={() => setEditMode(false)} fullWidth maxWidth="sm">
          <DialogTitle>{formData?.id ? "Edit Submission" : "Duplicate Submission"}</DialogTitle>
          <DialogContent>
            <TextField label="Name" name="name" fullWidth value={formData.name} onChange={handleChange} sx={{ mt: 2 }} />
            <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleChange} sx={{ mt: 2 }} />
            <TextField label="Product" name="product" fullWidth value={formData.product} onChange={handleChange} sx={{ mt: 2 }} />
            <TextField label="Mobile" name="mobile" fullWidth value={formData.mobile} onChange={handleChange} sx={{ mt: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditMode(false)} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedSubmission && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Submission Details</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              <strong>ID:</strong> {selectedSubmission.id}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Name:</strong> {selectedSubmission.name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Email:</strong> {maskEmail(selectedSubmission.email)} 
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Product:</strong> {selectedSubmission.product}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Mobile:</strong> {maskMobile(selectedSubmission.mobile)}
            </Typography>
            {offlineSubmissions.some(s => s.id === selectedSubmission.id) && (
              <Typography variant="body2" sx={{ mt: 2, color: 'orange' }}>
                This submission is pending synchronization.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEdit} variant="contained" color="primary">
              Edit
            </Button>
            <Button onClick={handleDuplicate} variant="contained" color="secondary">
              Duplicate
            </Button>
            <Button onClick={handleClose} variant="outlined">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default SubmissionList;
