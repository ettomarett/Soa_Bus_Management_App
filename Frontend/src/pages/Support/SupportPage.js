import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Support,
  ExpandMore,
  Email,
  Phone,
  Chat,
  Help,
  Article,
  BugReport,
  QuestionAnswer,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const SupportPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    toast.success('Support request submitted successfully! We will get back to you soon.');
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const faqs = [
    {
      question: 'How do I purchase a ticket?',
      answer: 'You can purchase tickets through the Tickets page. Select your route, choose the number of tickets, and complete the payment. You will receive a QR code ticket via email.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, debit cards, and PayPal. All payments are processed securely through our payment gateway.',
    },
    {
      question: 'How do I activate my subscription?',
      answer: 'Once you purchase a subscription, it will be automatically activated. You can view your active subscriptions on the Subscriptions page.',
    },
    {
      question: 'Can I get a refund for unused tickets?',
      answer: 'Refunds are available for unused tickets within 30 days of purchase. Please contact our support team for assistance with refunds.',
    },
    {
      question: 'How do I track a bus in real-time?',
      answer: 'Use the Live Map page to see all active buses in real-time. You can click on any bus to see its current location and route information.',
    },
    {
      question: 'What should I do if I lose my ticket?',
      answer: 'If you lose your ticket, you can access it again from the Tickets page. All tickets are stored in your account and can be downloaded again.',
    },
  ];

  const supportOptions = [
    {
      icon: <Email />,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      action: 'support@bustransport.com',
      color: 'primary',
    },
    {
      icon: <Phone />,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      action: '+1 (555) 123-4567',
      color: 'success',
    },
    {
      icon: <Chat />,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      color: 'info',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Support
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get help and find answers to your questions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Support Options */}
        <Grid item xs={12} md={4}>
          {supportOptions.map((option, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: `${option.color}.light`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: `${option.color}.main`,
                      mr: 2,
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {option.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color={option.color}
                  fullWidth
                  onClick={() => {
                    if (option.title === 'Live Chat') {
                      toast.info('Live chat feature coming soon!');
                    } else {
                      toast.info(`Contact: ${option.action}`);
                    }
                  }}
                >
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Support sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Contact Support
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                Fill out the form below and our support team will get back to you as soon as possible.
              </Alert>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={6}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ mt: 2 }}
                      disabled={!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* FAQ Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <QuestionAnswer sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Frequently Asked Questions
                </Typography>
              </Box>

              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls={`panel${index}bh-content`}
                    id={`panel${index}bh-header`}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Help sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography sx={{ fontWeight: 500 }}>{faq.question}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: 'background.default' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                icon={<Article />}
                label="User Guide"
                clickable
                onClick={() => toast.info('User guide coming soon!')}
              />
              <Chip
                icon={<BugReport />}
                label="Report a Bug"
                clickable
                color="error"
                onClick={() => toast.info('Bug report feature coming soon!')}
              />
              <Chip
                icon={<Help />}
                label="Help Center"
                clickable
                onClick={() => toast.info('Help center coming soon!')}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupportPage;

