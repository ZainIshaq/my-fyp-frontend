import React, { useState } from 'react';
import '../CSS/Admin.css';
import VideoPanel from '../components/AdminSide/VideoPanel';
import NotificationPanel from '../components/AdminSide/NotificationPanel';

const AdminPanel = () => {
  // State for active tab (Videos or Notifications)
  const [activeTab, setActiveTab] = useState('videos');
  
  // Videos section state
  const [videos, setVideos] = useState([]);
  
  // Notifications section state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New features released!', date: '2025-03-15' },
    { id: 2, text: 'Scheduled maintenance on March 20', date: '2025-03-16' }
  ]);

  return (
    <div className="admin-container">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </div>
        
        {/* Videos Section */}
        {activeTab === 'videos' && (
          <VideoPanel videos={videos} setVideos={setVideos} />
        )}
        
        {/* Notifications Section */}
        {activeTab === 'notifications' && (
          <NotificationPanel 
            notifications={notifications} 
            setNotifications={setNotifications} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;