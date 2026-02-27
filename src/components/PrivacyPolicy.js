import React from 'react';
import { Container, Typography, Box, Link, List, ListItem, ListItemText } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Privacy Policy
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        This privacy policy explains how <strong>BabyStop</strong> collects, uses and protects your personal information
        when you use this form to request or receive preloved baby equipment.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        For more information about Baby Stop and our wider activities, please also see our main website:{' '}
        <Link href="https://babystop.uk" target="_blank" rel="noopener noreferrer">
          https://babystop.uk
        </Link>
        .
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Who we are
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Baby Stop is a project of The Severn Community Charitable Trust (TSCCT), a registered charity in
          England and Wales). You can contact us at:
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Email: <Link href="mailto:team@babystop.uk">team@babystop.uk</Link>
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Website:{' '}
          <Link href="https://babystop.uk" target="_blank" rel="noopener noreferrer">
            https://babystop.uk
          </Link>
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          2. What information we collect
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          When you complete this form, we typically collect:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Your name (first and last name)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Your email address" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Your mobile or contact telephone number" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Details of the product requested or received" />
          </ListItem>
          <ListItem>
            <ListItemText primary="The date of the form submission" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Your consent to our privacy policy" />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We do not intentionally collect special category data (such as health information) through this
          form. Please avoid including sensitive personal details in any free-text fields.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          3. How we use your information
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          We use the information you provide to:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Record the items we have shared or provided to you" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Contact you if we have questions about your request or collection" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Monitor demand and improve how we run our baby shares" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Produce anonymous statistics and internal reports for our charity" />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We do <strong>not</strong> sell your personal information or use it for unrelated marketing.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          4. Legal basis for processing
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Under UK data protection law (including UK GDPR), we rely on the following legal bases:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Consent"
              secondary="You agree to this privacy policy before submitting the form."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Legitimate interests"
              secondary="We have a legitimate interest in keeping basic records of the equipment we share and the families we support, to run Baby Stop safely and effectively."
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          5. How we store and protect your data
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your data is stored securely in our systems and is only accessed by authorised volunteers and staff
          who need it to run our services. We take reasonable technical and organisational measures to protect
          your information from loss, misuse or unauthorised access.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Some data may be temporarily stored on your device (for example, if you complete the form while
          offline). This is used only to ensure your submission can be sent when you are back online and is
          not shared with other apps on your device.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          6. How long we keep your information
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We keep your information only for as long as is reasonably necessary for the purposes described in
          this policy, and to meet any legal, accounting or reporting requirements. In practice, this usually
          means retaining records of form submissions for a limited number of years so we can understand and
          evidence the support we have provided.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          7. Sharing your information
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We may share your information with:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Authorised volunteers and staff within Baby Stop / TSCCT" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Trusted service providers who host or process data on our behalf (for example, secure hosting providers)" />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We require any third parties who process your data on our behalf to keep it secure and to use it
          only in accordance with our instructions. We do not permit them to use your data for their own
          marketing.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          8. Your rights
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          You have certain rights over your personal information, including:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="The right to access a copy of your personal data" />
          </ListItem>
          <ListItem>
            <ListItemText primary="The right to ask us to correct inaccurate or incomplete information" />
          </ListItem>
          <ListItem>
            <ListItemText primary="In some cases, the right to ask us to delete your information" />
          </ListItem>
          <ListItem>
            <ListItemText primary="The right to object to or restrict certain types of processing" />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mb: 2 }}>
          To exercise any of these rights, please contact us at{' '}
          <Link href="mailto:team@babystop.uk">team@babystop.uk</Link>.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          9. Cookies and analytics
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This form-based app is primarily used to collect submission details. We do not use it to run
          extensive tracking or targeted advertising. Any limited technical logs or analytics we use are only
          to ensure the app is working properly and to help us understand usage in an anonymous or aggregated
          way.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          10. Changes to this policy
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We may update this privacy policy from time to time to reflect changes in how we work or in the law.
          The most recent version will always be available within this app. If the changes are significant, we
          may also highlight them when you next use the form.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;

