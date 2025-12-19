import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Badge,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle,
    Cancel,
    Warning,
    Info,
    Delete,
    MarkEmailRead,
    Send,
    Close,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import notificationService from '../../services/notificationService';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sendDialogOpen, setSendDialogOpen] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [sendForm, setSendForm] = useState({
        recipientId: '',
        title: '',
        message: '',
        type: 'CONTROLLER_WARNING',
    });

    useEffect(() => {
        if (user?.id) {
            loadNotifications();
            loadUnreadCount();
        }
    }, [user, page]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications(user.id, page, 20);
            if (page === 0) {
                setNotifications(response.content || []);
            } else {
                setNotifications(prev => [...prev, ...(response.content || [])]);
            }
            setHasMore(!response.last);
        } catch (err) {
            setError(err.message || 'Failed to load notifications');
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const count = await notificationService.getUnreadCount(user.id);
            setUnreadCount(count);
        } catch (err) {
            console.error('Failed to load unread count:', err);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId, user.id);
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId
                        ? { ...n, status: 'READ', readAt: new Date().toISOString() }
                        : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            toast.success('Notification marked as read');
        } catch (err) {
            toast.error('Failed to mark notification as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(user.id);
            setNotifications(prev =>
                prev.map(n => ({ ...n, status: 'READ', readAt: new Date().toISOString() }))
            );
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (err) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await notificationService.deleteNotification(notificationId, user.id);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            toast.success('Notification deleted');
        } catch (err) {
            toast.error('Failed to delete notification');
        }
    };

    const handleSendNotification = async () => {
        if (!sendForm.recipientId || !sendForm.title || !sendForm.message) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setSendLoading(true);
            await notificationService.createNotification({
                recipientId: parseInt(sendForm.recipientId),
                senderId: user.id,
                title: sendForm.title,
                message: sendForm.message,
                type: sendForm.type,
            });
            toast.success('Notification sent successfully');
            setSendDialogOpen(false);
            setSendForm({ recipientId: '', title: '', message: '', type: 'CONTROLLER_WARNING' });
        } catch (err) {
            toast.error('Failed to send notification');
        } finally {
            setSendLoading(false);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'TICKET_VALIDATION_SUCCESS':
            case 'TICKET_PURCHASED':
            case 'SUBSCRIPTION_ACTIVATED':
                return <CheckCircle color="success" />;
            case 'TICKET_VALIDATION_FAILED':
            case 'TICKET_VIOLATION':
                return <Cancel color="error" />;
            case 'CONTROLLER_WARNING':
                return <Warning color="warning" />;
            default:
                return <Info color="info" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'TICKET_VALIDATION_SUCCESS':
            case 'TICKET_PURCHASED':
            case 'SUBSCRIPTION_ACTIVATED':
                return 'success';
            case 'TICKET_VALIDATION_FAILED':
            case 'TICKET_VIOLATION':
                return 'error';
            case 'CONTROLLER_WARNING':
                return 'warning';
            default:
                return 'info';
        }
    };

    if (loading && notifications.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon sx={{ fontSize: 40 }} />
                        </Badge>
                        <Box>
                            <Typography variant="h4">Notifications</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {user?.role === 'CONTROLLER' && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Send />}
                                onClick={() => setSendDialogOpen(true)}
                            >
                                Send Notification
                            </Button>
                        )}
                        {unreadCount > 0 && (
                            <Button
                                variant="outlined"
                                startIcon={<MarkEmailRead />}
                                onClick={handleMarkAllAsRead}
                            >
                                Mark All Read
                            </Button>
                        )}
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Notifications List */}
                {notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No notifications
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You don't have any notifications yet.
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    sx={{
                                        bgcolor: notification.status === 'UNREAD' ? 'action.hover' : 'transparent',
                                        borderRadius: 1,
                                        mb: 1,
                                    }}
                                >
                                    <ListItemIcon>
                                        {getNotificationIcon(notification.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {notification.title}
                                                </Typography>
                                                {notification.status === 'UNREAD' && (
                                                    <Chip label="New" size="small" color="error" />
                                                )}
                                                <Chip
                                                    label={notification.type.replace(/_/g, ' ')}
                                                    size="small"
                                                    color={getNotificationColor(notification.type)}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {notification.status === 'UNREAD' && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                title="Mark as read"
                                            >
                                                <MarkEmailRead />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(notification.id)}
                                            title="Delete"
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                {index < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}

                {/* Load More */}
                {hasMore && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Load More'}
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Send Notification Dialog (for Controllers) */}
            <Dialog open={sendDialogOpen} onClose={() => setSendDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Send Notification to Passenger
                    <IconButton
                        onClick={() => setSendDialogOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Recipient ID (Passenger ID)"
                            type="number"
                            value={sendForm.recipientId}
                            onChange={(e) => setSendForm({ ...sendForm, recipientId: e.target.value })}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Notification Type</InputLabel>
                            <Select
                                value={sendForm.type}
                                onChange={(e) => setSendForm({ ...sendForm, type: e.target.value })}
                                label="Notification Type"
                            >
                                <MenuItem value="CONTROLLER_WARNING">Controller Warning</MenuItem>
                                <MenuItem value="TICKET_VIOLATION">Ticket Violation</MenuItem>
                                <MenuItem value="SYSTEM_ALERT">System Alert</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Title"
                            value={sendForm.title}
                            onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Message"
                            value={sendForm.message}
                            onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                            fullWidth
                            multiline
                            rows={4}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSendDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSendNotification}
                        disabled={sendLoading}
                        startIcon={sendLoading ? <CircularProgress size={20} /> : <Send />}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default NotificationsPage;

