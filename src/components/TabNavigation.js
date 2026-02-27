import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TabNavigation = ({ isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabIndex = location.pathname === '/submissions' && isAdmin ? 1 : 0;
  const [value, setValue] = useState(tabIndex);

  useEffect(() => {
    setValue(tabIndex);
  }, [tabIndex]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate('/');
    } else if (isAdmin && newValue === 1) {
      navigate('/submissions');
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 1 }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Form" />
        {isAdmin && <Tab label="Submissions" />}
      </Tabs>
    </Box>
  );
};

export default TabNavigation;
