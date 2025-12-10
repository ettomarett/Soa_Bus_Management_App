import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Paper,
  Alert,
} from '@mui/material';
import {
  Settings,
  Notifications,
  Language,
  Palette,
  Security,
  Storage,
  DataUsage,
  Delete,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    tripReminders: true,
    promotionalEmails: false,
    
    // Appearance
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    
    // Privacy & Security
    locationTracking: true,
    dataSharing: false,
    twoFactorAuth: false,
    
    // Data Management
    autoSync: true,
    cacheData: true,
  });

  const handleSettingChange = (setting) => (event) => {
    const value = event.target.checked !== undefined ? event.target.checked : event.target.value;
    setSettings({
      ...settings,
      [setting]: value,
    });
    
    // Simulate saving
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').trim()} updated`);
  };

  const handleSaveAll = () => {
    // Simulate saving all settings
    toast.success('All settings saved successfully!');
  };

  const handleClearCache = () => {
    toast.success('Cache cleared successfully!');
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      toast.error('Data deletion feature coming soon!');
    }
  };

  const SettingSection = ({ icon, title, children }) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 600, ml: 2 }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your app preferences and configuration
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Notifications */}
          <SettingSection
            icon={<Notifications sx={{ color: 'primary.main' }} />}
            title="Notifications"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleSettingChange('emailNotifications')}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={handleSettingChange('pushNotifications')}
                  />
                }
                label="Push Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={handleSettingChange('smsNotifications')}
                  />
                }
                label="SMS Notifications"
              />
              <Divider />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.tripReminders}
                    onChange={handleSettingChange('tripReminders')}
                  />
                }
                label="Trip Reminders"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.promotionalEmails}
                    onChange={handleSettingChange('promotionalEmails')}
                  />
                }
                label="Promotional Emails"
              />
            </Box>
          </SettingSection>

          {/* Appearance */}
          <SettingSection
            icon={<Palette sx={{ color: 'primary.main' }} />}
            title="Appearance"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.theme}
                    label="Theme"
                    onChange={handleSettingChange('theme')}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    label="Language"
                    onChange={handleSettingChange('language')}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Font Size</InputLabel>
                  <Select
                    value={settings.fontSize}
                    label="Font Size"
                    onChange={handleSettingChange('fontSize')}
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </SettingSection>

          {/* Privacy & Security */}
          <SettingSection
            icon={<Security sx={{ color: 'primary.main' }} />}
            title="Privacy & Security"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.locationTracking}
                    onChange={handleSettingChange('locationTracking')}
                  />
                }
                label="Location Tracking"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                Allow the app to track your location for better route recommendations
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataSharing}
                    onChange={handleSettingChange('dataSharing')}
                  />
                }
                label="Data Sharing"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                Share anonymous usage data to help improve the service
              </Typography>
              
              <Divider />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={handleSettingChange('twoFactorAuth')}
                  />
                }
                label="Two-Factor Authentication"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                Add an extra layer of security to your account
              </Typography>
            </Box>
          </SettingSection>

          {/* Data Management */}
          <SettingSection
            icon={<Storage sx={{ color: 'primary.main' }} />}
            title="Data Management"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoSync}
                    onChange={handleSettingChange('autoSync')}
                  />
                }
                label="Auto Sync"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                Automatically sync your data across devices
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.cacheData}
                    onChange={handleSettingChange('cacheData')}
                  />
                }
                label="Cache Data"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                Store data locally for faster access
              </Typography>
              
              <Divider />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<DataUsage />}
                  onClick={handleClearCache}
                >
                  Clear Cache
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDeleteData}
                >
                  Delete All Data
                </Button>
              </Box>
            </Box>
          </SettingSection>

          {/* Save Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSaveAll}
              sx={{ minWidth: 200 }}
            >
              Save All Settings
            </Button>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Settings sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Language />}
                  onClick={() => toast.info('Language settings')}
                >
                  Change Language
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Palette />}
                  onClick={() => toast.info('Theme settings')}
                >
                  Change Theme
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Security />}
                  onClick={() => toast.info('Security settings')}
                >
                  Security Options
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Changes to settings are saved automatically. Some changes may require a page refresh to take effect.
                </Typography>
              </Alert>

              <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  App Version
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Version 1.0.0
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Last updated: December 2024
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;

