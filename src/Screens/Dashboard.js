


// import React, { useState, useEffect } from "react";
// import "../CSS/Dashboard.css";
// import Cardt from "../components/CardComponent";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { History, WatchLater, Favorite } from '@mui/icons-material';
// import PrimarySearchAppBar from '../components/Navbar';
// import ChatBot from "../components/Chatbot";
// import LaterWatch from '../components/LaterWatch';
// import Favorites from '../components/Favorites';

// const Dashboard = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [showLaterWatch, setShowLaterWatch] = useState(false);
//   const [showFavorite, setShowFavorite] = useState(false);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch videos from API when component mounts
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         // Get JWT token from localStorage
//         const token = localStorage.getItem('authToken');

//         if (!token) {
//           // Redirect to login if no token is found
//           window.location.href = '/login';
//           return;
//         }

//         // Make API request with authorization header using fetch
//         const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/mainVideos`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
// console.log(response);
//         // Check if response is successful
//         if (!response.ok) {
//           // If status is 401, handle authentication error
//           if (response.status === 401) {
//             localStorage.removeItem('authToken');
//             window.location.href = '/login';
//             return;
//           }
//           throw new Error(`Error: ${response.status}`);
//         }

//         // Parse JSON response
//         const data = await response.json();

//         // Set videos from API response
//         setVideos(data.videos);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching videos:", err);
//         setError("Failed to load videos. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   return (
//     <>
//       <PrimarySearchAppBar toggleSidebar={toggleSidebar} />
//       <div className={`Dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
//         {/* Sidebar */}
//         <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
//           <ul>
//             <li onClick={() => setShowLaterWatch(true)}>
//               <WatchLater style={{ marginRight: '10px' }} /> Later Watch
//             </li >
//             <li onClick={() => setShowFavorite(true)}>
//               <Favorite style={{ marginRight: '10px' }} /> Favourites</li>
//           </ul>
//         </div>

//         {/* Content */}
//         <div className="content" onClick={closeSidebar}>
//           <div className="trailors-portion">
//             {loading ? (
//               <div className="text-center p-5">
//                 <div className="spinner-border" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             ) : error ? (
//               <div className="alert alert-danger" role="alert">
//                 {error}
//               </div>
//             ) : videos.length === 0 ? (
//               <div className="alert alert-info" role="alert">
//                 No videos available.
//               </div>
//             ) : (
//               <div className="row">
//                 {videos.map((video) => (
//                   <div key={video.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4">
//                     <Cardt
//                       thumbnail={video.thumbnailUrl}
//                       videoUrl={video.videoUrl}

//                       title={video.title}
//                       description={video.description}
//                       genre={video.genre}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <ChatBot />

//       {/* Components for sidebar items */}
//       <LaterWatch
//         isVisible={showLaterWatch}
//         onClose={() => setShowLaterWatch(false)}
//       />
//       <Favorites
//         isVisible={showFavorite}
//         onClose={() => setShowFavorite(false)}
//       />
//     </>
//   );
// };

// export default Dashboard;




"use client"

import { useState, useEffect } from "react"
import "../CSS/Dashboard.css"
import Cardt from "../components/CardComponent"
import "bootstrap/dist/css/bootstrap.min.css"
import { WatchLater, Favorite } from "@mui/icons-material"
import PrimarySearchAppBar from "../components/Navbar"
import ChatBot from "../components/Chatbot"
import LaterWatch from "../components/LaterWatch"
import Favorites from "../components/Favorites"
import { EmotionProvider } from "../contexts/EmotionContext"

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [showLaterWatch, setShowLaterWatch] = useState(false)
  const [showFavorite, setShowFavorite] = useState(false)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch videos from API when component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem("authToken")

        if (!token) {
          // Redirect to login if no token is found
          window.location.href = "/login"
          return
        }

        // Make API request with authorization header using fetch
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/mainVideos`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        console.log(response)

        // Check if response is successful
        if (!response.ok) {
          // If status is 401, handle authentication error
          if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.href = "/login"
            return
          }
          throw new Error(`Error: ${response.status}`)
        }

        // Parse JSON response
        const data = await response.json()

        // Set videos from API response
        setVideos(data.videos)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError("Failed to load videos. Please try again later.")
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <EmotionProvider>
      <PrimarySearchAppBar toggleSidebar={toggleSidebar} />
      <div className={`Dashboard-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => setShowLaterWatch(true)}>
              <WatchLater style={{ marginRight: "10px" }} /> Later Watch
            </li>
            <li onClick={() => setShowFavorite(true)}>
              <Favorite style={{ marginRight: "10px" }} /> Favourites
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="content" onClick={closeSidebar}>
          <div className="trailors-portion">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : videos.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No videos available.
              </div>
            ) : (
              <div className="row">
                {videos.map((video) => (
                  <div key={video.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4">
                    <Cardt
                      thumbnail={video.thumbnailUrl}
                      videoUrl={video.videoUrl}
                      title={video.title}
                      description={video.description}
                      genre={video.genre}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatBot />

      {/* Components for sidebar items */}
      <LaterWatch isVisible={showLaterWatch} onClose={() => setShowLaterWatch(false)} />
      <Favorites isVisible={showFavorite} onClose={() => setShowFavorite(false)} />
    </EmotionProvider>
  )
}

export default Dashboard
