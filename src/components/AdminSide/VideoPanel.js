// import React, { useState, useEffect } from 'react';

// const VideoPanel = ({ videos, setVideos }) => {
//   const [videoForm, setVideoForm] = useState({
//     id: null,
//     title: '',
//     description: '',
//     genre: '',
//     file: null,
//     thumbnail: null
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [currentVideoUrl, setCurrentVideoUrl] = useState('');
//   const [thumbnailPreview, setThumbnailPreview] = useState('');

//   // Fetch all videos when component mounts
//   const fetchVideos = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/allVideos`, {
//         credentials: 'include'
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch videos');
//       }
//       const data = await response.json();
//       setVideos(data.videos || []);
//     } catch (err) {
//       console.error('Error fetching videos:', err);
//       setError(err.message);
//       setVideos([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, [setVideos]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setVideoForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
    
//     if (name === 'thumbnail' && files[0]) {
//       // Create thumbnail preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setThumbnailPreview(reader.result);
//       };
//       reader.readAsDataURL(files[0]);
//     }
    
//     setVideoForm(prev => ({ ...prev, [name]: files[0] }));
//   };

//   const handlePlayVideo = (videoUrl) => {
//     // Remove the host part if it's already in the URL
//     const path = videoUrl.startsWith('http') ?
//       new URL(videoUrl).pathname :
//       videoUrl;

//     // Ensure path starts with a slash and normalize it
//     const normalizedPath = path.startsWith('/') ?
//       path.replace(/\\/g, '/') :
//       `/${path.replace(/\\/g, '/')}`;

//     // Construct the full URL
//     const fullUrl = `${process.env.REACT_APP_BASE_URL}${normalizedPath}`;
//     console.log("Playing video from:", fullUrl);
//     setCurrentVideoUrl(fullUrl);
//     setShowVideoModal(true);
//   };

//   const handleCloseVideoModal = () => {
//     setShowVideoModal(false);
//     setCurrentVideoUrl('');
//   };

//   // Format URL for media display
//   const formatMediaUrl = (url) => {
//     // Remove the host part if it's already in the URL
//     const path = url.startsWith('http') ?
//       new URL(url).pathname :
//       url;

//     // Ensure path starts with a slash and normalize it
//     const normalizedPath = path.startsWith('/') ?
//       path.replace(/\\/g, '/') :
//       `/${path.replace(/\\/g, '/')}`;

//     // Construct the full URL
//     return `${process.env.REACT_APP_BASE_URL}${normalizedPath}`;
//   };

//   //upload videos
//   const handleUploadVideo = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     // Validate form fields
//     if (!videoForm.title || !videoForm.description || !videoForm.genre || !videoForm.file) {
//       alert('Please fill in all required fields');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Create FormData for file upload
//       const formData = new FormData();
//       formData.append('title', videoForm.title);
//       formData.append('description', videoForm.description);
//       formData.append('genre', videoForm.genre);
//       formData.append('video', videoForm.file);
      
//       // Append thumbnail if available
//       if (videoForm.thumbnail) {
//         formData.append('thumbnail', videoForm.thumbnail);
//       }

//       // Send upload request
//       const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/uploadVideo`, {
//         method: 'POST',
//         body: formData,
//         credentials: 'include'
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to upload video');
//       }

//       // Update videos list
//       fetchVideos();

//       // Reset form
//       setVideoForm({
//         id: null,
//         title: '',
//         description: '',
//         genre: '',
//         file: null,
//         thumbnail: null
//       });
//       setThumbnailPreview('');

//       // Clear file inputs
//       if (e.target.querySelector('input[type="file"]')) {
//         e.target.querySelectorAll('input[type="file"]').forEach(input => {
//           input.value = '';
//         });
//       }

//       // Show success message
//       alert('Video uploaded successfully!');
//     } catch (error) {
//       console.error('Error uploading video:', error);
//       setError(error.message);
//       alert(`Upload failed: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Simplified edit function that handles both metadata and file updates in one call
//   const handleEditVideo = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!videoForm.title || !videoForm.description || !videoForm.genre) {
//       alert('Please fill in all required fields');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Create FormData to handle both text fields and files
//       const formData = new FormData();
//       formData.append('title', videoForm.title);
//       formData.append('description', videoForm.description);
//       formData.append('genre', videoForm.genre);
      
//       // Only append files if new ones were selected
//       if (videoForm.file) {
//         formData.append('video', videoForm.file);
//       }
      
//       if (videoForm.thumbnail) {
//         formData.append('thumbnail', videoForm.thumbnail);
//       }

//       // Send a single request to update everything
//       const updateResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/editVideo/${videoForm.id}`, {
//         method: 'PUT',
//         body: formData,
//         credentials: 'include'
//       });

//       if (!updateResponse.ok) {
//         const errorData = await updateResponse.json();
//         throw new Error(errorData.message || 'Failed to update video');
//       }

//       const updatedData = await updateResponse.json();
      
//       // Update the local videos state
//       setVideos(prevVideos => 
//         prevVideos.map(v => v.id === videoForm.id ? updatedData.video : v)
//       );
      
//       alert('Video updated successfully!');
//       fetchVideos();
//       setShowEditModal(false);
//       setThumbnailPreview('');
      
//     } catch (error) {
//       console.error('Error updating video:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEditClick = (video) => {
//     setVideoForm({
//       id: video.id,
//       title: video.title,
//       description: video.description,
//       genre: video.genre,
//       file: null,
//       thumbnail: null
//     });
    
//     // Set thumbnail preview if available
//     if (video.thumbnailUrl) {
//       setThumbnailPreview(formatMediaUrl(video.thumbnailUrl));
//     } else {
//       setThumbnailPreview('');
//     }
    
//     setIsEditing(true);
//     setShowEditModal(true);
//   };

//   const handleDeleteVideo = async (id) => {
//     if (window.confirm('Are you sure you want to delete this video?')) {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/videos/${id}`, {
//           method: 'DELETE',
//           credentials: 'include'
//         });

//         if (!response.ok) throw new Error('Failed to delete video');

//         setVideos(videos.filter(video => video.id !== id));
//         alert('Video deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting video:', error);
//         alert('Failed to delete video. Please try again.');
//       }
//     }
//   };

//   const clearThumbnail = () => {
//     setVideoForm(prev => ({ ...prev, thumbnail: null }));
//     setThumbnailPreview('');
//     // Clear the file input if it exists
//     const thumbnailInput = document.querySelector('input[name="thumbnail"]');
//     if (thumbnailInput) thumbnailInput.value = '';
//   };

//   return (
//     <div className="panel">
//       <div className="panel-header">
//         <h2>Manage Videos</h2>
//         <button
//           className="btn-primary"
//           onClick={() => {
//             setVideoForm({
//               id: null,
//               title: '',
//               description: '',
//               genre: '',
//               file: null,
//               thumbnail: null
//             });
//             setThumbnailPreview('');
//             setIsEditing(false);
//           }}
//         >
//           Add New Video
//         </button>
//       </div>

//       {/* Upload Video Form */}
//       {!isEditing && (
//         <form onSubmit={handleUploadVideo} className="form-section">
//           <h3>Upload New Video</h3>

//           <div className="form-grid">
//             <div className="form-group">
//               <label>Video Title*</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={videoForm.title}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Genre*</label>
//               <input
//                 type="text"
//                 name="genre"
//                 value={videoForm.genre}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Description*</label>
//             <textarea
//               name="description"
//               value={videoForm.description}
//               onChange={handleInputChange}
//               rows="3"
//               required
//             ></textarea>
//           </div>

//           <div className="form-grid">
//             <div className="form-group">
//               <label>Video File*</label>
//               <input
//                 type="file"
//                 name="file"
//                 accept="video/*"
//                 onChange={handleFileChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Thumbnail Image</label>
//               <div className="thumbnail-input-container">
//                 <input
//                   type="file"
//                   name="thumbnail"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                 />
//                 {thumbnailPreview && (
//                   <div className="thumbnail-preview-container">
//                     <img src={thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />
//                     <button type="button" onClick={clearThumbnail} className="btn-clear-thumbnail">✕</button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="button-group">
//             <button
//               type="submit"
//               className="btn-success"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Uploading...' : 'Upload Video'}
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Edit Video Modal */}
//       {showEditModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Edit Video</h3>
//               <button
//                 className="modal-close"
//                 onClick={() => setShowEditModal(false)}
//               >
//                 &times;
//               </button>
//             </div>

//             <form onSubmit={handleEditVideo}>
//               <div className="form-grid">
//                 <div className="form-group">
//                   <label>Video Title*</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={videoForm.title}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Genre*</label>
//                   <input
//                     type="text"
//                     name="genre"
//                     value={videoForm.genre}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Description*</label>
//                 <textarea
//                   name="description"
//                   value={videoForm.description}
//                   onChange={handleInputChange}
//                   rows="3"
//                   required
//                 ></textarea>
//               </div>

//               <div className="form-grid">
//                 <div className="form-group">
//                   <label>Video File (Leave empty to keep current)</label>
//                   <input
//                     type="file"
//                     name="file"
//                     accept="video/*"
//                     onChange={handleFileChange}
//                   />
//                   {videoForm.file && (
//                     <p className="file-info">Selected file: {videoForm.file.name}</p>
//                   )}
//                 </div>

//                 <div className="form-group">
//                   <label>Thumbnail Image (Leave empty to keep current)</label>
//                   <div className="thumbnail-input-container">
//                     <input
//                       type="file"
//                       name="thumbnail"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                     />
//                     {thumbnailPreview && (
//                       <div className="thumbnail-preview-container">
//                         <img src={thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />
//                         <button type="button" onClick={clearThumbnail} className="btn-clear-thumbnail">✕</button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="button-group">
//                 <button
//                   type="submit"
//                   className="btn-success"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Saving...' : 'Save Changes'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showVideoModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Video Player</h3>
//               <button
//                 className="modal-close"
//                 onClick={handleCloseVideoModal}
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="video-container">
//               <video controls autoPlay style={{ width: '100%' }}>
//                 <source src={currentVideoUrl} type="video/mp4" />
//                 <source src={currentVideoUrl} type="video/webm" />
//                 <source src={currentVideoUrl} type="video/ogg" />
//                 Your browser does not support the video tag.
//               </video>
//               {/* For debugging */}
//               <div className="video-debug">
//                 <small>Video URL: {currentVideoUrl}</small>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div>
//         <h3>Uploaded Videos</h3>
//         {isLoading && !videos.length ? (
//           <p>Loading videos...</p>
//         ) : error ? (
//           <p className="error-message">Error: {error}</p>
//         ) : videos && videos.length > 0 ? (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Thumbnail</th>
//                   <th>Title</th>
//                   <th>Genre</th>
//                   <th>Description</th>
//                   <th>File</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {videos.map(video => (
//                   <tr key={video.id}>
//                     <td>{video.id}</td>
//                     <td>
//                       {video.thumbnailUrl ? (
//                         <img 
//                           src={formatMediaUrl(video.thumbnailUrl)} 
//                           alt={`Thumbnail for ${video.title}`} 
//                           className="table-thumbnail"
//                         />
//                       ) : (
//                         <span className="no-thumbnail">No thumbnail</span>
//                       )}
//                     </td>
//                     <td>{video.title}</td>
//                     <td>{video.genre}</td>
//                     <td className="description-cell">
//                       {video.description && video.description.length > 50
//                         ? `${video.description.substring(0, 50)}...`
//                         : video.description}
//                     </td>
//                     <td>
//                       {video.videoUrl ? (
//                         <button
//                           onClick={() => handlePlayVideo(video.videoUrl)}
//                           className="btn-play"
//                         >
//                           Play
//                         </button>
//                       ) : (
//                         'No file'
//                       )}
//                     </td>
//                     <td>
//                       <button
//                         onClick={() => handleEditClick(video)}
//                         className="btn-warning"
//                         disabled={isLoading}
//                       >
//                         Edit
//                       </button>
//                       {' '}
//                       <button
//                         onClick={() => handleDeleteVideo(video.id)}
//                         className="btn-danger"
//                         disabled={isLoading}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p>No videos found.</p>
//         )}
//       </div>

//       <style jsx>{`
//         .panel {
//           padding: 20px;
//           background: #fff;
//           border-radius: 8px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//         }
//         .panel-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//         }
//         .btn-primary {
//           background: #007bff;
//           color: white;
//           border: none;
//           padding: 8px 16px;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .btn-primary:hover {
//           background: #0069d9;
//         }
//         .form-section {
//           margin-bottom: 30px;
//           padding: 20px;
//           background: #f8f9fa;
//           border-radius: 4px;
//         }
//         .form-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 20px;
//           margin-bottom: 20px;
//         }
//         .form-group {
//           margin-bottom: 15px;
//         }
//         .form-group label {
//           display: block;
//           margin-bottom: 5px;
//           font-weight: 600;
//         }
//         .form-group input,
//         .form-group textarea,
//         .form-group select {
//           width: 100%;
//           padding: 8px;
//           border: 1px solid #ced4da;
//           border-radius: 4px;
//         }
//         .form-group textarea {
//           min-height: 80px;
//         }
//         .button-group {
//           display: flex;
//           gap: 10px;
//         }
//         .btn-success {
//           background: #28a745;
//           color: white;
//           border: none;
//           padding: 8px 16px;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .btn-success:hover {
//           background: #218838;
//         }
//         .btn-secondary {
//           background: #6c757d;
//           color: white;
//           border: none;
//           padding: 8px 16px;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .btn-secondary:hover {
//           background: #5a6268;
//         }
//         .table-container {
//           overflow-x: auto;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 20px;
//         }
//         th, td {
//           padding: 12px 15px;
//           text-align: left;
//           border-bottom: 1px solid #ddd;
//         }
//         th {
//           background-color: #f8f9fa;
//           font-weight: 600;
//         }
//         tr:hover {
//           background-color: #f5f5f5;
//         }
//         .btn-warning {
//           background: #ffc107;
//           color: #212529;
//           border: none;
//           padding: 5px 10px;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .btn-warning:hover {
//           background: #e0a800;
//         }
//         .btn-danger {
//           background: #dc3545;
//           color: white;
//           border: none;
//           padding: 5px 10px;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .btn-danger:hover {
//           background: #c82333;
//         }
//         .error-message {
//           color: #dc3545;
//           padding: 10px;
//           background: #f8d7da;
//           border-radius: 4px;
//         }
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0,0,0,0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }
//         .modal-content {
//           background: white;
//           padding: 2rem;
//           border-radius: 8px;
//           width: 90%;
//           max-width: 800px;
//           max-height: 90vh;
//           overflow-y: auto;
//           box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//         }
//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1.5rem;
//         }
//         .modal-close {
//           background: none;
//           border: none;
//           font-size: 1.5rem;
//           cursor: pointer;
//           color: #666;
//         }
//         .modal-close:hover {
//           color: #333;
//         }
//         .file-info {
//           font-size: 0.8rem;
//           color: #666;
//           margin-top: 0.5rem;
//         }
//         .description-cell {
//           max-width: 200px;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }
//         .btn-play {
//           background-color: #4CAF50;
//           color: white;
//           border: none;
//           padding: 5px 10px;
//           border-radius: 4px;
//           cursor: pointer;
//           font-size: 0.8rem;
//         }
//         .btn-play:hover {
//           background-color: #45a049;
//         }
//         .video-container {
//           width: 100%;
//           max-height: 400px;
//           overflow: hidden;
//           margin-top: 1rem;
//         }
//         .video-container video {
//           width: 100%;
//           height: auto;
//           max-height: 400px;
//           object-fit: contain;
//           border-radius: 8px;
//         }
//         .thumbnail-preview-container {
//           position: relative;
//           margin-top: 10px;
//           display: inline-block;
//         }
//         .thumbnail-preview {
//           max-width: 150px;
//           max-height: 100px;
//           border-radius: 4px;
//           border: 1px solid #ddd;
//         }
//         .btn-clear-thumbnail {
//           position: absolute;
//           top: -8px;
//           right: -8px;
//           background: #dc3545;
//           color: white;
//           border: none;
//           border-radius: 50%;
//           width: 20px;
//           height: 20px;
//           font-size: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//         }
//         .table-thumbnail {
//           width: 60px;
//           height: 40px;
//           object-fit: cover;
//           border-radius: 2px;
//           border: 1px solid #ddd;
//         }
//         .no-thumbnail {
//           font-size: 0.8rem;
//           color: #888;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default VideoPanel;






import React, { useState, useEffect } from 'react';

const VideoPanel = ({ videos, setVideos }) => {
  const [videoForm, setVideoForm] = useState({
    id: null,
    title: '',
    description: '',
    genre: '',
    file: null,
    thumbnail: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  // Fetch all videos when component mounts
  const fetchVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/allVideos`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [setVideos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'thumbnail' && files[0]) {
      // Create thumbnail preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
    
    setVideoForm(prev => ({ ...prev, [name]: files[0] }));
  };

  // FIXED: Handle both Cloudinary URLs and local server URLs
  const handlePlayVideo = (videoUrl) => {
    // If it's already a complete URL (Cloudinary or other CDN), use it directly
    if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
      console.log("Playing video from:", videoUrl);
      setCurrentVideoUrl(videoUrl);
      setShowVideoModal(true);
      return;
    }

    // For local server files, construct the URL
    const normalizedPath = videoUrl.startsWith('/') ? 
      videoUrl.replace(/\\/g, '/') : 
      `/${videoUrl.replace(/\\/g, '/')}`;
    
    const fullUrl = `${process.env.REACT_APP_BASE_URL}${normalizedPath}`;
    console.log("Playing video from:", fullUrl);
    setCurrentVideoUrl(fullUrl);
    setShowVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideoUrl('');
  };

  // FIXED: Handle both Cloudinary URLs and local server URLs
  const formatMediaUrl = (url) => {
    // If it's already a complete URL (Cloudinary or other CDN), return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // For local server files, construct the URL
    const normalizedPath = url.startsWith('/') ? 
      url.replace(/\\/g, '/') : 
      `/${url.replace(/\\/g, '/')}`;
    
    return `${process.env.REACT_APP_BASE_URL}${normalizedPath}`;
  };

  //upload videos
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate form fields
    if (!videoForm.title || !videoForm.description || !videoForm.genre || !videoForm.file) {
      alert('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', videoForm.title);
      formData.append('description', videoForm.description);
      formData.append('genre', videoForm.genre);
      formData.append('video', videoForm.file);
      
      // Append thumbnail if available
      if (videoForm.thumbnail) {
        formData.append('thumbnail', videoForm.thumbnail);
      }

      // Send upload request
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/uploadVideo`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload video');
      }

      // Update videos list
      fetchVideos();

      // Reset form
      setVideoForm({
        id: null,
        title: '',
        description: '',
        genre: '',
        file: null,
        thumbnail: null
      });
      setThumbnailPreview('');

      // Clear file inputs
      if (e.target.querySelector('input[type="file"]')) {
        e.target.querySelectorAll('input[type="file"]').forEach(input => {
          input.value = '';
        });
      }

      // Show success message
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.message);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified edit function that handles both metadata and file updates in one call
  const handleEditVideo = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!videoForm.title || !videoForm.description || !videoForm.genre) {
      alert('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData to handle both text fields and files
      const formData = new FormData();
      formData.append('title', videoForm.title);
      formData.append('description', videoForm.description);
      formData.append('genre', videoForm.genre);
      
      // Only append files if new ones were selected
      if (videoForm.file) {
        formData.append('video', videoForm.file);
      }
      
      if (videoForm.thumbnail) {
        formData.append('thumbnail', videoForm.thumbnail);
      }

      // Send a single request to update everything
      const updateResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/editVideo/${videoForm.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update video');
      }

      const updatedData = await updateResponse.json();
      
      // Update the local videos state
      setVideos(prevVideos => 
        prevVideos.map(v => v.id === videoForm.id ? updatedData.video : v)
      );
      
      alert('Video updated successfully!');
      fetchVideos();
      setShowEditModal(false);
      setThumbnailPreview('');
      
    } catch (error) {
      console.error('Error updating video:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (video) => {
    setVideoForm({
      id: video.id,
      title: video.title,
      description: video.description,
      genre: video.genre,
      file: null,
      thumbnail: null
    });
    
    // Set thumbnail preview if available - FIXED to handle Cloudinary URLs
    if (video.thumbnailUrl) {
      setThumbnailPreview(formatMediaUrl(video.thumbnailUrl));
    } else {
      setThumbnailPreview('');
    }
    
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/videos/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to delete video');

        setVideos(videos.filter(video => video.id !== id));
        alert('Video deleted successfully!');
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video. Please try again.');
      }
    }
  };

  const clearThumbnail = () => {
    setVideoForm(prev => ({ ...prev, thumbnail: null }));
    setThumbnailPreview('');
    // Clear the file input if it exists
    const thumbnailInput = document.querySelector('input[name="thumbnail"]');
    if (thumbnailInput) thumbnailInput.value = '';
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Manage Videos</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setVideoForm({
              id: null,
              title: '',
              description: '',
              genre: '',
              file: null,
              thumbnail: null
            });
            setThumbnailPreview('');
            setIsEditing(false);
          }}
        >
          Add New Video
        </button>
      </div>

      {/* Upload Video Form */}
      {!isEditing && (
        <form onSubmit={handleUploadVideo} className="form-section">
          <h3>Upload New Video</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Video Title*</label>
              <input
                type="text"
                name="title"
                value={videoForm.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Genre*</label>
              <input
                type="text"
                name="genre"
                value={videoForm.genre}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              value={videoForm.description}
              onChange={handleInputChange}
              rows="3"
              required
            ></textarea>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Video File*</label>
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Thumbnail Image</label>
              <div className="thumbnail-input-container">
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {thumbnailPreview && (
                  <div className="thumbnail-preview-container">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />
                    <button type="button" onClick={clearThumbnail} className="btn-clear-thumbnail">✕</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="btn-success"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      )}

      {/* Edit Video Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Video</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditVideo}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Video Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={videoForm.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Genre*</label>
                  <input
                    type="text"
                    name="genre"
                    value={videoForm.genre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description*</label>
                <textarea
                  name="description"
                  value={videoForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Video File (Leave empty to keep current)</label>
                  <input
                    type="file"
                    name="file"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  {videoForm.file && (
                    <p className="file-info">Selected file: {videoForm.file.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Thumbnail Image (Leave empty to keep current)</label>
                  <div className="thumbnail-input-container">
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {thumbnailPreview && (
                      <div className="thumbnail-preview-container">
                        <img src={thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />
                        <button type="button" onClick={clearThumbnail} className="btn-clear-thumbnail">✕</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="button-group">
                <button
                  type="submit"
                  className="btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVideoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Video Player</h3>
              <button
                className="modal-close"
                onClick={handleCloseVideoModal}
              >
                &times;
              </button>
            </div>
            <div className="video-container">
              <video controls autoPlay style={{ width: '100%' }}>
                <source src={currentVideoUrl} type="video/mp4" />
                <source src={currentVideoUrl} type="video/webm" />
                <source src={currentVideoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
              {/* For debugging */}
              <div className="video-debug">
                <small>Video URL: {currentVideoUrl}</small>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3>Uploaded Videos</h3>
        {isLoading && !videos.length ? (
          <p>Loading videos...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : videos && videos.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Description</th>
                  <th>File</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(video => (
                  <tr key={video.id}>
                    <td>{video.id}</td>
                    <td>
                      {video.thumbnailUrl ? (
                        <img 
                          src={formatMediaUrl(video.thumbnailUrl)} 
                          alt={`Thumbnail for ${video.title}`} 
                          className="table-thumbnail"
                          onError={(e) => {
                            console.error('Thumbnail failed to load:', video.thumbnailUrl);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="no-thumbnail">No thumbnail</span>
                      )}
                    </td>
                    <td>{video.title}</td>
                    <td>{video.genre}</td>
                    <td className="description-cell">
                      {video.description && video.description.length > 50
                        ? `${video.description.substring(0, 50)}...`
                        : video.description}
                    </td>
                    <td>
                      {video.videoUrl ? (
                        <button
                          onClick={() => handlePlayVideo(video.videoUrl)}
                          className="btn-play"
                        >
                          Play
                        </button>
                      ) : (
                        'No file'
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEditClick(video)}
                        className="btn-warning"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      {' '}
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="btn-danger"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No videos found.</p>
        )}
      </div>

      <style jsx>{`
        .panel {
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .btn-primary {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-primary:hover {
          background: #0069d9;
        }
        .form-section {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
        .form-group textarea {
          min-height: 80px;
        }
        .button-group {
          display: flex;
          gap: 10px;
        }
        .btn-success {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-success:hover {
          background: #218838;
        }
        .btn-secondary {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-secondary:hover {
          background: #5a6268;
        }
        .table-container {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .btn-warning {
          background: #ffc107;
          color: #212529;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-warning:hover {
          background: #e0a800;
        }
        .btn-danger {
          background: #dc3545;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-danger:hover {
          background: #c82333;
        }
        .error-message {
          color: #dc3545;
          padding: 10px;
          background: #f8d7da;
          border-radius: 4px;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        .modal-close:hover {
          color: #333;
        }
        .file-info {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.5rem;
        }
        .description-cell {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .btn-play {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .btn-play:hover {
          background-color: #45a049;
        }
        .video-container {
          width: 100%;
          max-height: 400px;
          overflow: hidden;
          margin-top: 1rem;
        }
        .video-container video {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
          border-radius: 8px;
        }
        .thumbnail-preview-container {
          position: relative;
          margin-top: 10px;
          display: inline-block;
        }
        .thumbnail-preview {
          max-width: 150px;
          max-height: 100px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        .btn-clear-thumbnail {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .table-thumbnail {
          width: 60px;
          height: 40px;
          object-fit: cover;
          border-radius: 2px;
          border: 1px solid #ddd;
        }
        .no-thumbnail {
          font-size: 0.8rem;
          color: #888;
        }
      `}</style>
    </div>
  );
};

export default VideoPanel;