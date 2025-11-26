"use client"

import React, { useState, useEffect } from "react"
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Paper,
} from "@mui/material"
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Circle as CircleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"

const StyledPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: 360,
    maxHeight: 500,
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    border: "1px solid rgba(0, 0, 0, 0.08)",
  },
}))

const NotificationHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f8f9fa",
}))

const NotificationList = styled(List)(({ theme }) => ({
  padding: 0,
  maxHeight: 350,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: 3,
  },
}))

const NotificationItem = styled(ListItem)(({ theme, unread }) => ({
  padding: theme.spacing(1.5, 2),
  cursor: "pointer",
  backgroundColor: unread ? "#e3f2fd" : "transparent",
  borderLeft: unread ? "4px solid #2196f3" : "4px solid transparent",
  "&:hover": {
    backgroundColor: unread ? "#e1f5fe" : "#f5f5f5",
  },
  transition: "background-color 0.2s ease",
}))

const PriorityChip = styled(Chip)(({ priority }) => ({
  height: 20,
  fontSize: "0.7rem",
  fontWeight: 600,
  ...(priority === "high" && {
    backgroundColor: "#ffebee",
    color: "#c62828",
  }),
  ...(priority === "medium" && {
    backgroundColor: "#fff3e0",
    color: "#ef6c00",
  }),
  ...(priority === "low" && {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
  }),
}))

const NotificationDropdown = ({ anchorEl, open, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api`

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/notifications/all?limit=20`)
      const data = await response.json()

      if (response.ok) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/count/unread`)
      const data = await response.json()

      if (response.ok) {
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read/${notificationId}`, {
        method: "PATCH",
      })

      if (response.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification,
          ),
        )
        fetchUnreadCount()
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  // Get priority icon
  const getPriorityIcon = (priority) => {
    const color = priority === "high" ? "#f44336" : priority === "medium" ? "#ff9800" : "#4caf50"
    return <CircleIcon sx={{ fontSize: 8, color, mr: 0.5 }} />
  }

  useEffect(() => {
    if (open) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [open])

  return (
    <StyledPopover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Paper elevation={0}>
        {/* Header */}
        <NotificationHeader>
          <Box display="flex" alignItems="center">
            <NotificationsIcon sx={{ mr: 1, color: "#1976d2" }} />
            <Typography variant="h6" fontWeight="bold">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip label={unreadCount} size="small" color="error" sx={{ ml: 1, height: 20, fontSize: "0.7rem" }} />
            )}
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton size="small" sx={{ mr: 1 }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </NotificationHeader>

        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <Box p={1} borderBottom="1px solid rgba(0, 0, 0, 0.08)">
            <Button size="small" onClick={markAllAsRead} sx={{ textTransform: "none", fontSize: "0.8rem" }}>
              Mark all as read
            </Button>
          </Box>
        )}

        {/* Notifications List */}
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box p={3} textAlign="center">
            <NotificationsIcon sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <NotificationList>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <NotificationItem
                  unread={!notification.isRead}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: notification.isRead ? "#e0e0e0" : "#2196f3",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <NotificationsIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" mb={0.5}>
                        {getPriorityIcon(notification.priority)}
                        <PriorityChip label={notification.priority} priority={notification.priority} size="small" />
                        <Typography variant="caption" color="textSecondary" sx={{ ml: "auto" }}>
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notification.isRead ? "normal" : "bold",
                          color: notification.isRead ? "text.secondary" : "text.primary",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {notification.text}
                      </Typography>
                    }
                  />
                  {!notification.isRead && (
                    <CircleIcon
                      sx={{
                        fontSize: 12,
                        color: "#2196f3",
                        ml: 1,
                      }}
                    />
                  )}
                </NotificationItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </NotificationList>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <Box p={1} borderTop="1px solid rgba(0, 0, 0, 0.08)" textAlign="center">
            <Button
              size="small"
              sx={{ textTransform: "none", fontSize: "0.8rem" }}
              onClick={() => {
                onClose()
                // Navigate to full notifications page if needed
                // window.location.href = '/admin/notifications';
              }}
            >
              See all notifications
            </Button>
          </Box>
        )}
      </Paper>
    </StyledPopover>
  )
}

export default NotificationDropdown
