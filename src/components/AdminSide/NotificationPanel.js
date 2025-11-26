// import React, { useState } from 'react';

// const NotificationPanel = ({ notifications, setNotifications }) => {
//   const [notificationText, setNotificationText] = useState('');

//   const handleSendNotification = (e) => {
//     e.preventDefault();
//     if (!notificationText.trim()) return;
    
//     const newNotification = {
//       id: notifications.length ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
//       text: notificationText,
//       date: new Date().toISOString().split('T')[0]
//     };
    
//     setNotifications([...notifications, newNotification]);
//     setNotificationText('');
//   };

//   const handleDeleteNotification = (id) => {
//     setNotifications(notifications.filter(notification => notification.id !== id));
//   };

//   return (
//     <div className="panel">
//       <h2>Manage Notifications</h2>
      
//       {/* Send Notification Form */}
//       <form onSubmit={handleSendNotification} className="form-section">
//         <h3>Send New Notification</h3>
//         <div className="form-group">
//           <label>Notification Text</label>
//           <textarea
//             value={notificationText}
//             onChange={(e) => setNotificationText(e.target.value)}
//             rows="3"
//             required
//           ></textarea>
//         </div>
//         <div className="button-group">
//           <button
//             type="submit"
//             className="btn-success"
//           >
//             Send Notification
//           </button>
//         </div>
//       </form>
      
//       {/* Notifications List */}
//       <div>
//         <h3>Sent Notifications</h3>
//         <div className="notifications-list">
//           {notifications.map(notification => (
//             <div key={notification.id} className="notification-item">
//               <div>
//                 <p className="notification-text">{notification.text}</p>
//                 <p className="notification-date">Sent on: {notification.date}</p>
//               </div>
//               <button
//                 onClick={() => handleDeleteNotification(notification.id)}
//                 className="btn-danger"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationPanel;




"use client"

import { useState, useEffect } from "react"
import "./NotificationPanel.css" // You'll need to create this CSS file

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([])
  const [notificationText, setNotificationText] = useState("")
  const [priority, setPriority] = useState("medium")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [filter, setFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [unreadCount, setUnreadCount] = useState(0)

  const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api`
  // Fetch notifications
  const fetchNotifications = async (page = 1, filterType = "all") => {
    try {
      setLoading(true)
      let url = `${API_BASE_URL}/notifications/all?page=${page}&limit=10`

      if (filterType === "unread") {
        url += "&isRead=false"
      } else if (filterType === "read") {
        url += "&isRead=true"
      }

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setNotifications(data.notifications)
        setTotalPages(data.totalPages)
        setCurrentPage(data.currentPage)
      } else {
        setError(data.message || "Failed to fetch notifications")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error fetching notifications:", err)
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
    } catch (err) {
      console.error("Error fetching unread count:", err)
    }
  }

  // Create notification
  const handleSendNotification = async (e) => {
    e.preventDefault()

    if (!notificationText.trim()) {
      setError("Notification text is required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await fetch(`${API_BASE_URL}/notifications/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: notificationText,
          priority: priority,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Notification sent successfully!")
        setNotificationText("")
        setPriority("medium")
        fetchNotifications(currentPage, filter)
        fetchUnreadCount()

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.message || "Failed to send notification")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error sending notification:", err)
    } finally {
      setLoading(false)
    }
  }

  // Delete notification
  const handleDeleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/notifications/delete/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Notification deleted successfully!")
        fetchNotifications(currentPage, filter)
        fetchUnreadCount()

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.message || "Failed to delete notification")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error deleting notification:", err)
    } finally {
      setLoading(false)
    }
  }

  // Mark as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read/${id}`, {
        method: "PATCH",
      })

      if (response.ok) {
        fetchNotifications(currentPage, filter)
        fetchUnreadCount()
      }
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
      })

      if (response.ok) {
        setSuccess("All notifications marked as read!")
        fetchNotifications(currentPage, filter)
        fetchUnreadCount()

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (err) {
      setError("Failed to mark all as read")
      console.error("Error marking all as read:", err)
    }
  }

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
    fetchNotifications(1, newFilter)
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchNotifications(page, filter)
  }

  // Clear messages
  const clearMessages = () => {
    setError("")
    setSuccess("")
  }

  // Load data on component mount
  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [])

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h2>Manage Notifications</h2>
        {unreadCount > 0 && <div className="unread-badge">{unreadCount} unread</div>}
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={clearMessages} className="alert-close">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={clearMessages} className="alert-close">
            ×
          </button>
        </div>
      )}

      {/* Send Notification Form */}
      <form onSubmit={handleSendNotification} className="form-section">
        <h3>Send New Notification</h3>

        <div className="form-group">
          <label htmlFor="notificationText">Notification Text</label>
          <textarea
            id="notificationText"
            value={notificationText}
            onChange={(e) => setNotificationText(e.target.value)}
            rows="3"
            placeholder="Enter your notification message..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>

      {/* Notifications List */}
      <div className="notifications-section">
        <div className="section-header">
          <h3>Sent Notifications</h3>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "unread" ? "active" : ""}`}
              onClick={() => handleFilterChange("unread")}
            >
              Unread
            </button>
            <button
              className={`filter-btn ${filter === "read" ? "active" : ""}`}
              onClick={() => handleFilterChange("read")}
            >
              Read
            </button>
          </div>

          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : (
          <>
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">No notifications found.</div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className={`notification-item ${!notification.isRead ? "unread" : ""}`}>
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className={`priority-badge priority-${notification.priority}`}>
                          {notification.priority}
                        </span>
                        <span className="notification-date">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="notification-text">{notification.text}</p>
                    </div>

                    <div className="notification-actions">
                      {!notification.isRead && (
                        <button onClick={() => handleMarkAsRead(notification.id)} className="btn btn-sm btn-secondary">
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="btn btn-sm btn-danger"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>

                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
