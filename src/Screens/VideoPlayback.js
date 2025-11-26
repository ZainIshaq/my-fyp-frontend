// "use client"

// import PlayArrowIcon from "@mui/icons-material/PlayArrow"
// import {
//   Alert,
//   Badge,
//   Box,
//   Button,
//   Chip,
//   CircularProgress,
//   createTheme,
//   Dialog,
//   Fade,
//   IconButton,
//   Snackbar,
//   ThemeProvider,
//   Typography,
//   useMediaQuery,
// } from "@mui/material"
// import { styled } from "@mui/system"
// import { useEffect, useRef, useState, useCallback } from "react"
// import { FiBell, FiCamera, FiFastForward, FiFilm, FiPause, FiPlay, FiRefreshCw, FiRewind, FiX } from "react-icons/fi"
// import Chatbot from "../components/Chatbot"
// import { useEmotionDetection } from "../components/EmotionDetection"
// import EmotionGraph from "../components/EmotionGraph"
// import RecommendedMovies from "../components/RecommendMovies"
// import "../CSS/Dashboard.css"

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//     background: {
//       default: "#121212",
//     },
//   },
// })

// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     margin: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#121212",
//   },
// }))

// const VideoContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   width: "100%",
//   height: "60%",
//   position: "relative",
//   [theme.breakpoints.down("sm")]: {
//     height: "50%",
//   },
// }))

// const ControlsContainer = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   bottom: 20,
//   left: "50%",
//   transform: "translateX(-50%)",
//   display: "flex",
//   gap: "1rem",
//   zIndex: 1000,
//   [theme.breakpoints.down("sm")]: {
//     gap: "0.5rem",
//     bottom: 10,
//     "& .MuiIconButton-root": {
//       padding: "8px",
//     },
//   },
// }))

// const EmotionGraphContainer = styled(Box)(({ theme }) => ({
//   width: "100%",
//   height: "35%",
//   padding: "1rem",
//   [theme.breakpoints.down("sm")]: {
//     height: "45%",
//     padding: "0.5rem",
//   },
// }))

// const CameraContainer = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   bottom: 20,
//   right: 20,
//   width: 250,
//   height: 180,
//   border: "3px solid #fff",
//   borderRadius: "12px",
//   overflow: "hidden",
//   zIndex: 999,
//   backgroundColor: "#000",
//   boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//   [theme.breakpoints.down("sm")]: {
//     width: 120,
//     height: 90,
//     right: 10,
//     bottom: 60,
//     border: "2px solid #fff",
//     "& .face-status": {
//       display: "none",
//     },
//   },
// }))

// const RecommendationNotification = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   top: 80,
//   left: 20,
//   display: "flex",
//   alignItems: "center",
//   gap: "12px",
//   padding: "12px 20px",
//   backgroundColor: "rgba(103, 58, 183, 0.95)",
//   backdropFilter: "blur(10px)",
//   color: "white",
//   borderRadius: "25px",
//   fontWeight: "bold",
//   fontSize: "0.9rem",
//   zIndex: 1001,
//   boxShadow: "0 8px 24px rgba(103, 58, 183, 0.4)",
//   border: "2px solid rgba(255, 255, 255, 0.2)",
//   maxWidth: "350px",
//   cursor: "pointer",
//   transition: "all 0.3s ease",
//   "&:hover": {
//     backgroundColor: "rgba(103, 58, 183, 1)",
//     transform: "scale(1.02)",
//   },
//   [theme.breakpoints.down("sm")]: {
//     maxWidth: "280px",
//     fontSize: "0.8rem",
//     padding: "8px 16px",
//     top: 70,
//     left: "50%",
//     transform: "translateX(-50%)",
//   },
// }))

// const EmotionTrackingIndicator = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   top: 20,
//   left: 20,
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
//   padding: "8px 16px",
//   backgroundColor: "rgba(0, 0, 0, 0.8)",
//   borderRadius: "20px",
//   color: "white",
//   fontSize: "0.9rem",
//   fontWeight: "bold",
//   zIndex: 1001,
//   [theme.breakpoints.down("sm")]: {
//     fontSize: "0.7rem",
//     padding: "4px 8px",
//     top: 10,
//     left: "50%",
//     transform: "translateX(-50%)",
//     width: "90%",
//     justifyContent: "center",
//   },
// }))

// const VideoPlayback = ({ videoSrc }) => {
//   const [open, setOpen] = useState(false)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [showCameraAlert, setShowCameraAlert] = useState(false)
//   const [showRecommendations, setShowRecommendations] = useState(false)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [showNotificationMessage, setShowNotificationMessage] = useState(false)
//   const [previousRecommendationCount, setPreviousRecommendationCount] = useState(0)
//   const [lastNotificationId, setLastNotificationId] = useState(null)
//   const [autoClickTimer, setAutoClickTimer] = useState(null)
//   const [hasAutoClicked, setHasAutoClicked] = useState(false)

//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const isMobile = useMediaQuery("(max-width:600px)")

//   const {
//     hasCamera,
//     emotionHistory,
//     currentEmotions,
//     faceDetected,
//     faceApiReady,
//     loadingProgress,
//     recommendedMovies,
//     loadingRecommendations,
//     dominantEmotion,
//     recommendationError,
//     emotionConfidence,
//     isVideoPlaying,
//     emotionBuffer,
//     recommendationTriggerCount,
//     cameraVideoRef,
//     startEmotionDetection,
//     stopEmotionDetection,
//     requestCamera,
//     stopCamera,
//     handleRefreshRecommendations,
//     addDebugLog,
//     startVideoWatching,
//     stopVideoWatching,
//   } = useEmotionDetection()

//   // FIXED: Memoize the auto-click logic to prevent infinite loops
//   const handleAutoRefresh = useCallback(() => {
//     console.log("Auto-clicking refresh button after 5 seconds")
//     addDebugLog("🤖 Auto-refresh triggered after 5 seconds")
//     handleRefreshRecommendations()
//     setHasAutoClicked(true)
//   }, [addDebugLog, handleRefreshRecommendations])

//   // FIXED: Remove function dependencies from useEffect
//   useEffect(() => {
//     if (showRecommendations && !loadingRecommendations && !hasAutoClicked) {
//       console.log("Starting 5-second auto-click timer for refresh button")
//       const timer = setTimeout(handleAutoRefresh, 5000)

//       setAutoClickTimer(timer)

//       return () => {
//         if (timer) {
//           clearTimeout(timer)
//         }
//       }
//     }

//     if (!showRecommendations) {
//       if (autoClickTimer) {
//         clearTimeout(autoClickTimer)
//         setAutoClickTimer(null)
//       }
//       setHasAutoClicked(false)
//     }
//   }, [showRecommendations, loadingRecommendations, hasAutoClicked, handleAutoRefresh])

//   // FIXED: Memoize notification logic
//   const showNotificationCallback = useCallback(() => {
//     addDebugLog(
//       `🔔 New emotion-based recommendations available - showing notification message (trigger: ${recommendationTriggerCount})`,
//     )
//     setShowNotificationMessage(true)
//     setLastNotificationId(recommendationTriggerCount)
//   }, [addDebugLog, recommendationTriggerCount])

//   // FIXED: Remove function dependencies from useEffect
//   useEffect(() => {
//     const hasNewRecommendations = recommendedMovies && recommendedMovies.length > 0
//     const isNewRecommendationSet = recommendationTriggerCount > 0 && recommendationTriggerCount !== lastNotificationId

//     if (
//       hasNewRecommendations &&
//       isNewRecommendationSet &&
//       dominantEmotion &&
//       dominantEmotion !== "trending" &&
//       isVideoPlaying &&
//       !loadingRecommendations
//     ) {
//       showNotificationCallback()

//       const timer = setTimeout(() => {
//         setShowNotificationMessage(false)
//       }, 8000)

//       return () => clearTimeout(timer)
//     }
//   }, [
//     recommendedMovies,
//     recommendationTriggerCount,
//     dominantEmotion,
//     isVideoPlaying,
//     loadingRecommendations,
//     lastNotificationId,
//     showNotificationCallback,
//   ])

//   useEffect(() => {
//     if (!isVideoPlaying) {
//       setShowNotificationMessage(false)
//       setLastNotificationId(null)
//     }
//   }, [isVideoPlaying])

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       videoRef.current
//         ?.requestFullscreen()
//         .then(() => {
//           setIsFullscreen(true)
//           addDebugLog("📺 Entered fullscreen mode")
//         })
//         .catch((err) => {
//           addDebugLog(`❌ Fullscreen error: ${err.message}`)
//         })
//     } else {
//       document
//         .exitFullscreen()
//         .then(() => {
//           setIsFullscreen(false)
//           addDebugLog("📺 Exited fullscreen mode")
//         })
//         .catch((err) => {
//           addDebugLog(`❌ Exit fullscreen error: ${err.message}`)
//         })
//     }
//   }

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement)
//     }

//     document.addEventListener("fullscreenchange", handleFullscreenChange)
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange)
//     }
//   }, [])

//   const handlePlayPause = () => {
//     addDebugLog(`🎬 Play/Pause clicked. hasCamera: ${hasCamera}, faceApiReady: ${faceApiReady}`)

//     if (!hasCamera) {
//       setShowCameraAlert(true)
//       addDebugLog("❌ Play blocked - no camera access")
//       return
//     }

//     if (!faceApiReady) {
//       setShowCameraAlert(true)
//       addDebugLog("❌ Play blocked - Face-API.js not ready")
//       return
//     }

//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause()
//         stopEmotionDetection()
//         stopVideoWatching()
//         addDebugLog("⏸️ Video paused")
//       } else {
//         videoRef.current
//           .play()
//           .then(() => {
//             addDebugLog("▶️ Video playing")
//             startEmotionDetection()
//             startVideoWatching()
//           })
//           .catch((error) => {
//             addDebugLog(`❌ Video play failed: ${error.message}`)
//           })
//       }
//       setIsPlaying(!isPlaying)
//     }
//   }

//   const handleCameraRequest = async () => {
//     try {
//       await requestCamera()
//       setShowCameraAlert(false)
//     } catch (error) {
//       setShowCameraAlert(true)
//     }
//   }

//   const handleForward = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime += 10
//     }
//   }

//   const handleBackward = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime -= 10
//     }
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setIsPlaying(false)
//     stopCamera()
//     stopVideoWatching()
//     setShowNotificationMessage(false)
//     setShowRecommendations(false)
//     setLastNotificationId(null)
//     if (autoClickTimer) {
//       clearTimeout(autoClickTimer)
//       setAutoClickTimer(null)
//     }
//     setHasAutoClicked(false)
//     if (videoRef.current) {
//       videoRef.current.pause()
//     }
//   }

//   const handleNotificationClick = () => {
//     setShowNotificationMessage(false)
//     setShowRecommendations(true)
//     addDebugLog("🔔 Notification message clicked - showing recommendations")
//   }

//   const handleRefreshAndShow = () => {
//     if (autoClickTimer) {
//       clearTimeout(autoClickTimer)
//       setAutoClickTimer(null)
//       console.log("Manual refresh clicked - clearing auto-click timer")
//     }

//     addDebugLog("🔄 Manual refresh clicked - refreshing recommendations")
//     handleRefreshRecommendations()
//     setShowRecommendations(true)
//     setHasAutoClicked(true)
//   }

//   const getCurrentEmotionDisplay = () => {
//     const nonNeutralEmotions = Object.entries(currentEmotions)
//       .filter(([emotion]) => emotion !== "neutral")
//       .sort(([, a], [, b]) => b - a)

//     if (nonNeutralEmotions.length > 0) {
//       const [emotion, confidence] = nonNeutralEmotions[0]
//       return `${emotion} (${(confidence * 100).toFixed(1)}%)`
//     }
//     return "analyzing..."
//   }

//   const getTrackingProgress = () => {
//     if (!isVideoPlaying || emotionBuffer.length === 0) return 0
//     return Math.min((emotionBuffer.length / 30) * 100, 100)
//   }

//   const getNotificationMessage = () => {
//     const emotionText =
//       dominantEmotion && dominantEmotion !== "trending"
//         ? dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)
//         : "Mixed"

//     return `🎬 ${recommendedMovies?.length || 0} ${emotionText} movies recommended!`
//   }

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => setOpen(true)}
//         startIcon={<PlayArrowIcon />}
//         sx={{
//           textTransform: "none",
//           fontWeight: "bold",
//           px: 3,
//           py: 1,
//           borderRadius: 2,
//           [darkTheme.breakpoints.down("sm")]: {
//             px: 2,
//             fontSize: "0.875rem",
//           },
//         }}
//       >
//         Watch
//       </Button>

//       <StyledDialog
//         fullScreen
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="video-dialog-title"
//         keepMounted={false}
//       >
//         <Box
//           sx={{
//             p: 3,
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <IconButton
//             onClick={handleClose}
//             sx={{
//               position: "absolute",
//               right: 16,
//               top: 16,
//               zIndex: 2000,
//               backgroundColor: "rgba(0,0,0,0.5)",
//               color: "white",
//               "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
//             }}
//           >
//             <FiX />
//           </IconButton>

//           {showNotificationMessage && recommendedMovies && recommendedMovies.length > 0 && (
//             <Fade in={showNotificationMessage} timeout={500}>
//               <RecommendationNotification onClick={handleNotificationClick}>
//                 <FiBell style={{ fontSize: "18px" }} />
//                 <span>{getNotificationMessage()}</span>
//                 <FiX
//                   style={{
//                     fontSize: "16px",
//                     cursor: "pointer",
//                     marginLeft: "8px",
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     setShowNotificationMessage(false)
//                   }}
//                 />
//               </RecommendationNotification>
//             </Fade>
//           )}

//           {isVideoPlaying && hasCamera && (
//             <EmotionTrackingIndicator>
//               <Box
//                 sx={{
//                   width: 8,
//                   height: 8,
//                   borderRadius: "50%",
//                   backgroundColor: faceDetected ? "#4caf50" : "#f44336",
//                   animation: faceDetected ? "pulse 2s infinite" : "none",
//                   "@keyframes pulse": {
//                     "0%": { opacity: 1 },
//                     "50%": { opacity: 0.5 },
//                     "100%": { opacity: 1 },
//                   },
//                 }}
//               />
//               <span>Tracking: {getCurrentEmotionDisplay()}</span>
//               <Box
//                 sx={{
//                   width: 60,
//                   height: 4,
//                   backgroundColor: "rgba(255,255,255,0.3)",
//                   borderRadius: 2,
//                   overflow: "hidden",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: `${getTrackingProgress()}%`,
//                     height: "100%",
//                     backgroundColor: "#4caf50",
//                     transition: "width 0.3s ease",
//                   }}
//                 />
//               </Box>
//               <Typography variant="caption">#{recommendationTriggerCount}</Typography>
//             </EmotionTrackingIndicator>
//           )}

//           <VideoContainer>
//             {videoSrc ? (
//               <video
//                 ref={videoRef}
//                 width="100%"
//                 height="100%"
//                 style={{ maxHeight: "70vh", borderRadius: "8px" }}
//                 src={videoSrc}
//                 controls={false}
//                 onEnded={() => {
//                   setIsPlaying(false)
//                   stopEmotionDetection()
//                   stopVideoWatching()
//                 }}
//               />
//             ) : (
//               <Typography variant="h6" color="textPrimary">
//                 Video source not available
//               </Typography>
//             )}

//             {hasCamera && (
//               <CameraContainer>
//                 <video
//                   ref={cameraVideoRef}
//                   width="100%"
//                   height="100%"
//                   style={{ objectFit: "cover" }}
//                   autoPlay
//                   muted
//                   playsInline
//                 />
//                 <canvas
//                   ref={canvasRef}
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     opacity: 0,
//                     pointerEvents: "none",
//                   }}
//                 />

//                 <Box
//                   className="face-status"
//                   sx={{
//                     position: "absolute",
//                     top: 8,
//                     left: 8,
//                     px: 2,
//                     py: 1,
//                     backgroundColor: faceDetected ? "success.main" : "error.main",
//                     color: "white",
//                     borderRadius: 2,
//                     fontSize: "0.8rem",
//                     fontWeight: "bold",
//                     boxShadow: 2,
//                   }}
//                 >
//                   {faceDetected ? "😊 Face Detected" : "❌ No Face"}
//                 </Box>

//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 8,
//                     right: 8,
//                     px: 2,
//                     py: 1,
//                     backgroundColor: faceApiReady ? "info.main" : "warning.main",
//                     color: "white",
//                     borderRadius: 2,
//                     fontSize: "0.7rem",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {faceApiReady ? "🎭 API Ready" : "⏳ Loading..."}
//                 </Box>

//                 {loadingProgress && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       bottom: 8,
//                       left: 8,
//                       right: 8,
//                       px: 2,
//                       py: 1,
//                       backgroundColor: "rgba(0,0,0,0.8)",
//                       color: "white",
//                       borderRadius: 2,
//                       fontSize: "0.7rem",
//                       textAlign: "center",
//                     }}
//                   >
//                     {loadingProgress}
//                   </Box>
//                 )}

//                 {isVideoPlaying && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       bottom: 8,
//                       right: 8,
//                       px: 1,
//                       py: 0.5,
//                       backgroundColor: "rgba(76, 175, 80, 0.8)",
//                       color: "white",
//                       borderRadius: 1,
//                       fontSize: "0.6rem",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     📊 {emotionBuffer.length}/30
//                   </Box>
//                 )}
//               </CameraContainer>
//             )}

//             <ControlsContainer>
//               {isMobile && (
//                 <IconButton
//                   onClick={handlePlayPause}
//                   color="primary"
//                   size="large"
//                   sx={{
//                     position: "absolute",
//                     left: 10,
//                     bottom: "100%",
//                     marginBottom: "10px",
//                     backgroundColor: "rgba(0,0,0,0.7)",
//                   }}
//                 >
//                   {isPlaying ? <FiPause /> : <FiPlay />}
//                 </IconButton>
//               )}

//               {!isMobile && (
//                 <IconButton onClick={handlePlayPause} color="primary" size="large">
//                   {isPlaying ? <FiPause /> : <FiPlay />}
//                 </IconButton>
//               )}

//               <IconButton
//                 onClick={handleCameraRequest}
//                 color="primary"
//                 disabled={hasCamera}
//                 size="large"
//                 sx={{
//                   opacity: hasCamera ? 0.5 : 1,
//                   position: "relative",
//                 }}
//               >
//                 <FiCamera />
//                 {hasCamera && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: -2,
//                       right: -2,
//                       width: 12,
//                       height: 12,
//                       borderRadius: "50%",
//                       backgroundColor: faceApiReady ? "success.main" : "warning.main",
//                       border: "2px solid white",
//                     }}
//                   />
//                 )}
//               </IconButton>

//               <IconButton onClick={() => setShowRecommendations(!showRecommendations)} color="primary" size="large">
//                 <Badge badgeContent={recommendedMovies?.length > 0 ? recommendedMovies.length : null} color="error">
//                   <FiFilm />
//                 </Badge>
//               </IconButton>

//               <IconButton
//                 onClick={handleRefreshAndShow}
//                 color="primary"
//                 size="large"
//                 disabled={loadingRecommendations}
//                 sx={{
//                   position: "relative",
//                 }}
//               >
//                 {loadingRecommendations ? <CircularProgress size={20} color="inherit" /> : <FiRefreshCw />}

//                 {showRecommendations && !hasAutoClicked && !loadingRecommendations && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: -2,
//                       right: -2,
//                       width: 12,
//                       height: 12,
//                       borderRadius: "50%",
//                       backgroundColor: "#ff9800",
//                       animation: "pulse 1s infinite",
//                       "@keyframes pulse": {
//                         "0%": {
//                           transform: "scale(1)",
//                           opacity: 1,
//                         },
//                         "50%": {
//                           transform: "scale(1.2)",
//                           opacity: 0.7,
//                         },
//                         "100%": {
//                           transform: "scale(1)",
//                           opacity: 1,
//                         },
//                       },
//                     }}
//                   />
//                 )}
//               </IconButton>

//               <IconButton onClick={handleBackward} color="primary" size="large">
//                 <FiRewind />
//               </IconButton>

//               <IconButton onClick={handleForward} color="primary" size="large">
//                 <FiFastForward />
//               </IconButton>

//               <IconButton
//                 onClick={toggleFullscreen}
//                 color="primary"
//                 size="large"
//                 title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//               >
//                 {isFullscreen ? "🔽" : "🔳"}
//               </IconButton>
//             </ControlsContainer>
//           </VideoContainer>

//           {showRecommendations && recommendedMovies && recommendedMovies.length > 0 && (
//             <Box sx={{ mb: 2 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   mb: 2,
//                 }}
//               >
//                 <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
//                   🎬 AI-Powered Movie Recommendations
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   {dominantEmotion && (
//                     <Chip
//                       label={`${dominantEmotion.toUpperCase()} (${(emotionConfidence * 100).toFixed(1)}%)`}
//                       color="primary"
//                       variant="outlined"
//                       size="small"
//                       sx={{
//                         color: "white",
//                         borderColor: "white",
//                         textTransform: "capitalize",
//                         fontWeight: "bold",
//                       }}
//                     />
//                   )}
//                   <IconButton
//                     onClick={handleRefreshAndShow}
//                     disabled={loadingRecommendations}
//                     size="small"
//                     sx={{
//                       color: "white",
//                       position: "relative",
//                     }}
//                   >
//                     {loadingRecommendations ? <CircularProgress size={16} color="inherit" /> : <FiRefreshCw />}

//                     {showRecommendations && !hasAutoClicked && !loadingRecommendations && (
//                       <Box
//                         sx={{
//                           position: "absolute",
//                           top: -2,
//                           right: -2,
//                           width: 8,
//                           height: 8,
//                           borderRadius: "50%",
//                           backgroundColor: "#ff9800",
//                           animation: "pulse 1s infinite",
//                           "@keyframes pulse": {
//                             "0%": {
//                               transform: "scale(1)",
//                               opacity: 1,
//                             },
//                             "50%": {
//                               transform: "scale(1.2)",
//                               opacity: 0.7,
//                             },
//                             "100%": {
//                               transform: "scale(1)",
//                               opacity: 1,
//                             },
//                           },
//                         }}
//                       />
//                     )}
//                   </IconButton>
//                   <IconButton onClick={() => setShowRecommendations(false)} size="small" sx={{ color: "white" }}>
//                     <FiX />
//                   </IconButton>
//                 </Box>
//               </Box>

//               {recommendationError && (
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                   {recommendationError}
//                 </Alert>
//               )}

//               {loadingRecommendations ? (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     minHeight: 200,
//                   }}
//                 >
//                   <CircularProgress size={40} />
//                   <Typography variant="body1" sx={{ ml: 2, color: "white" }}>
//                     Analyzing your emotions and finding perfect movies...
//                   </Typography>
//                 </Box>
//               ) : (
//                 <RecommendedMovies recommendedMovies={recommendedMovies} />
//               )}
//             </Box>
//           )}

//           <EmotionGraphContainer>
//             <EmotionGraph
//               emotionHistory={emotionHistory}
//               currentEmotions={currentEmotions}
//               hasCamera={hasCamera}
//               faceApiReady={faceApiReady}
//               loadingProgress={loadingProgress}
//               faceDetected={faceDetected}
//             />
//           </EmotionGraphContainer>

//           <Snackbar open={showCameraAlert} autoHideDuration={8000} onClose={() => setShowCameraAlert(false)}>
//             <Alert onClose={() => setShowCameraAlert(false)} severity="warning" sx={{ width: "100%" }}>
//               {!hasCamera
//                 ? "🎥 Please click the camera button and allow access to enable emotion-based recommendations during video playback"
//                 : !faceApiReady
//                   ? "🎭 Face-API.js is loading... Please wait for the AI models to download (~30 seconds)"
//                   : "⏳ Please wait for Face-API.js to fully initialize before starting video playback"}
//             </Alert>
//           </Snackbar>

//           <Chatbot
//             emotionData={{
//               dominantEmotion: dominantEmotion,
//               confidence: emotionConfidence,
//             }}
//             hasCamera={hasCamera}
//             currentEmotions={currentEmotions}
//           />
//         </Box>
//       </StyledDialog>
//     </ThemeProvider>
//   )
// }

// export default VideoPlayback

"use client"

import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  createTheme,
  Dialog,
  Fade,
  IconButton,
  Snackbar,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { styled } from "@mui/system"
import { useEffect, useRef, useState, useCallback } from "react"
import {
  FiBell,
  FiCamera,
  FiCameraOff,
  FiFastForward,
  FiFilm,
  FiPause,
  FiPlay,
  FiRefreshCw,
  FiRewind,
  FiX,
} from "react-icons/fi"
import Chatbot from "../components/Chatbot"
import { useEmotionContext } from "../contexts/EmotionContext"
import EmotionGraph from "../components/EmotionGraph"
import RecommendedMovies from "../components/RecommendMovies"
import "../CSS/Dashboard.css"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
    },
  },
})

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#121212",
  },
}))

const VideoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "60%",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    height: "50%",
  },
}))

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "1rem",
  zIndex: 1000,
  [theme.breakpoints.down("sm")]: {
    gap: "0.5rem",
    bottom: 10,
    "& .MuiIconButton-root": {
      padding: "8px",
    },
  },
}))

const EmotionGraphContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "35%",
  padding: "1rem",
  [theme.breakpoints.down("sm")]: {
    height: "45%",
    padding: "0.5rem",
  },
}))

const CameraContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 20,
  right: 20,
  width: 250,
  height: 180,
  border: "3px solid #fff",
  borderRadius: "12px",
  overflow: "hidden",
  zIndex: 999,
  backgroundColor: "#000",
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  [theme.breakpoints.down("sm")]: {
    width: 120,
    height: 90,
    right: 10,
    bottom: 60,
    border: "2px solid #fff",
    "& .face-status": {
      display: "none",
    },
  },
}))

const RecommendationNotification = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 80,
  left: 20,
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 20px",
  backgroundColor: "rgba(103, 58, 183, 0.95)",
  backdropFilter: "blur(10px)",
  color: "white",
  borderRadius: "25px",
  fontWeight: "bold",
  fontSize: "0.9rem",
  zIndex: 1001,
  boxShadow: "0 8px 24px rgba(103, 58, 183, 0.4)",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  maxWidth: "350px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(103, 58, 183, 1)",
    transform: "scale(1.02)",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "280px",
    fontSize: "0.8rem",
    padding: "8px 16px",
    top: 70,
    left: "50%",
    transform: "translateX(-50%)",
  },
}))

const EmotionTrackingIndicator = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 20,
  left: 20,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  borderRadius: "20px",
  color: "white",
  fontSize: "0.9rem",
  fontWeight: "bold",
  zIndex: 1001,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    padding: "4px 8px",
    top: 10,
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    justifyContent: "center",
  },
}))

const VideoPlayback = ({ videoSrc }) => {
  const [open, setOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCameraAlert, setShowCameraAlert] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNotificationMessage, setShowNotificationMessage] = useState(false)
  const [lastNotificationId, setLastNotificationId] = useState(null)
  const [autoClickTimer, setAutoClickTimer] = useState(null)
  const [hasAutoClicked, setHasAutoClicked] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const isMobile = useMediaQuery("(max-width:600px)")

  // FIXED: Use shared emotion context instead of creating new instance
  const {
    hasCamera,
    emotionHistory,
    currentEmotions,
    faceDetected,
    faceApiReady,
    loadingProgress,
    recommendedMovies,
    loadingRecommendations,
    dominantEmotion,
    recommendationError,
    emotionConfidence,
    isVideoPlaying,
    emotionBuffer,
    recommendationTriggerCount,
    cameraVideoRef,
    startEmotionDetection,
    stopEmotionDetection,
    requestCamera,
    stopCamera,
    handleRefreshRecommendations,
    addDebugLog,
    startVideoWatching,
    stopVideoWatching,
  } = useEmotionContext()

  // FIXED: Memoize the auto-click logic to prevent infinite loops
  const handleAutoRefresh = useCallback(() => {
    console.log("Auto-clicking refresh button after 5 seconds")
    addDebugLog("🤖 Auto-refresh triggered after 5 seconds")
    handleRefreshRecommendations()
    setHasAutoClicked(true)
  }, [addDebugLog, handleRefreshRecommendations])

  // FIXED: Remove function dependencies from useEffect
  useEffect(() => {
    if (showRecommendations && !loadingRecommendations && !hasAutoClicked) {
      console.log("Starting 5-second auto-click timer for refresh button")
      const timer = setTimeout(handleAutoRefresh, 5000)

      setAutoClickTimer(timer)

      return () => {
        if (timer) {
          clearTimeout(timer)
        }
      }
    }

    if (!showRecommendations) {
      if (autoClickTimer) {
        clearTimeout(autoClickTimer)
        setAutoClickTimer(null)
      }
      setHasAutoClicked(false)
    }
  }, [showRecommendations, loadingRecommendations, hasAutoClicked, handleAutoRefresh])

  // FIXED: Memoize notification logic
  const showNotificationCallback = useCallback(() => {
    addDebugLog(
      `🔔 New emotion-based recommendations available - showing notification message (trigger: ${recommendationTriggerCount})`,
    )
    setShowNotificationMessage(true)
    setLastNotificationId(recommendationTriggerCount)
  }, [addDebugLog, recommendationTriggerCount])

  // FIXED: Remove function dependencies from useEffect
  useEffect(() => {
    const hasNewRecommendations = recommendedMovies && recommendedMovies.length > 0
    const isNewRecommendationSet = recommendationTriggerCount > 0 && recommendationTriggerCount !== lastNotificationId

    if (
      hasNewRecommendations &&
      isNewRecommendationSet &&
      dominantEmotion &&
      dominantEmotion !== "trending" &&
      isVideoPlaying &&
      !loadingRecommendations
    ) {
      showNotificationCallback()

      const timer = setTimeout(() => {
        setShowNotificationMessage(false)
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [
    recommendedMovies,
    recommendationTriggerCount,
    dominantEmotion,
    isVideoPlaying,
    loadingRecommendations,
    lastNotificationId,
    showNotificationCallback,
  ])

  useEffect(() => {
    if (!isVideoPlaying) {
      setShowNotificationMessage(false)
      setLastNotificationId(null)
    }
  }, [isVideoPlaying])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current
        ?.requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
          addDebugLog("📺 Entered fullscreen mode")
        })
        .catch((err) => {
          addDebugLog(`❌ Fullscreen error: ${err.message}`)
        })
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false)
          addDebugLog("📺 Exited fullscreen mode")
        })
        .catch((err) => {
          addDebugLog(`❌ Exit fullscreen error: ${err.message}`)
        })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const handlePlayPause = () => {
    addDebugLog(`🎬 Play/Pause clicked. hasCamera: ${hasCamera}, faceApiReady: ${faceApiReady}`)

    if (!hasCamera) {
      setShowCameraAlert(true)
      addDebugLog("❌ Play blocked - no camera access")
      return
    }

    if (!faceApiReady) {
      setShowCameraAlert(true)
      addDebugLog("❌ Play blocked - Face-API.js not ready")
      return
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        stopEmotionDetection()
        stopVideoWatching()
        addDebugLog("⏸️ Video paused")
      } else {
        videoRef.current
          .play()
          .then(() => {
            addDebugLog("▶️ Video playing")
            startEmotionDetection()
            startVideoWatching()
          })
          .catch((error) => {
            addDebugLog(`❌ Video play failed: ${error.message}`)
          })
      }
      setIsPlaying(!isPlaying)
    }
  }

  // NEW: Enhanced camera toggle function
  const handleCameraToggle = async () => {
    try {
      if (hasCamera) {
        // Turn off camera
        addDebugLog("📹 User requested to turn off camera")
        stopCamera()
        setShowCameraAlert(false)

        // If video is playing, pause it since camera is required
        if (isPlaying && videoRef.current) {
          videoRef.current.pause()
          stopEmotionDetection()
          stopVideoWatching()
          setIsPlaying(false)
          addDebugLog("⏸️ Video paused due to camera being turned off")
        }
      } else {
        // Turn on camera
        addDebugLog("📹 User requested to turn on camera")
        await requestCamera()
        setShowCameraAlert(false)
      }
    } catch (error) {
      addDebugLog(`❌ Camera toggle error: ${error.message}`)
      setShowCameraAlert(true)
    }
  }

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10
    }
  }

  const handleBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10
    }
  }

  // FIXED: Don't stop camera when closing video - keep it for other videos
  const handleClose = () => {
    setOpen(false)
    setIsPlaying(false)
    // DON'T stop camera - keep it running for other videos
    // stopCamera()
    stopVideoWatching()
    setShowNotificationMessage(false)
    setShowRecommendations(false)
    setLastNotificationId(null)
    if (autoClickTimer) {
      clearTimeout(autoClickTimer)
      setAutoClickTimer(null)
    }
    setHasAutoClicked(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const handleNotificationClick = () => {
    setShowNotificationMessage(false)
    setShowRecommendations(true)
    addDebugLog("🔔 Notification message clicked - showing recommendations")
  }

  const handleRefreshAndShow = () => {
    if (autoClickTimer) {
      clearTimeout(autoClickTimer)
      setAutoClickTimer(null)
      console.log("Manual refresh clicked - clearing auto-click timer")
    }

    addDebugLog("🔄 Manual refresh clicked - refreshing recommendations")
    handleRefreshRecommendations()
    setShowRecommendations(true)
    setHasAutoClicked(true)
  }

  const getCurrentEmotionDisplay = () => {
    const nonNeutralEmotions = Object.entries(currentEmotions)
      .filter(([emotion]) => emotion !== "neutral")
      .sort(([, a], [, b]) => b - a)

    if (nonNeutralEmotions.length > 0) {
      const [emotion, confidence] = nonNeutralEmotions[0]
      return `${emotion} (${(confidence * 100).toFixed(1)}%)`
    }
    return "analyzing..."
  }

  const getTrackingProgress = () => {
    if (!isVideoPlaying || emotionBuffer.length === 0) return 0
    return Math.min((emotionBuffer.length / 30) * 100, 100)
  }

  const getNotificationMessage = () => {
    const emotionText =
      dominantEmotion && dominantEmotion !== "trending"
        ? dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)
        : "Mixed"

    return `🎬 ${recommendedMovies?.length || 0} ${emotionText} movies recommended!`
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        startIcon={<PlayArrowIcon />}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          px: 3,
          py: 1,
          borderRadius: 2,
          [darkTheme.breakpoints.down("sm")]: {
            px: 2,
            fontSize: "0.875rem",
          },
        }}
      >
        Watch
      </Button>

      <StyledDialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="video-dialog-title"
        keepMounted={false}
      >
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              zIndex: 2000,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          >
            <FiX />
          </IconButton>

          {showNotificationMessage && recommendedMovies && recommendedMovies.length > 0 && (
            <Fade in={showNotificationMessage} timeout={500}>
              <RecommendationNotification onClick={handleNotificationClick}>
                <FiBell style={{ fontSize: "18px" }} />
                <span>{getNotificationMessage()}</span>
                <FiX
                  style={{
                    fontSize: "16px",
                    cursor: "pointer",
                    marginLeft: "8px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowNotificationMessage(false)
                  }}
                />
              </RecommendationNotification>
            </Fade>
          )}

          {isVideoPlaying && hasCamera && (
            <EmotionTrackingIndicator>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: faceDetected ? "#4caf50" : "#f44336",
                  animation: faceDetected ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <span>Tracking: {getCurrentEmotionDisplay()}</span>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${getTrackingProgress()}%`,
                    height: "100%",
                    backgroundColor: "#4caf50",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
              <Typography variant="caption">#{recommendationTriggerCount}</Typography>
            </EmotionTrackingIndicator>
          )}

          <VideoContainer>
            {videoSrc ? (
              <video
                ref={videoRef}
                width="100%"
                height="100%"
                style={{ maxHeight: "70vh", borderRadius: "8px" }}
                src={videoSrc}
                controls={false}
                onEnded={() => {
                  setIsPlaying(false)
                  stopEmotionDetection()
                  stopVideoWatching()
                }}
              />
            ) : (
              <Typography variant="h6" color="textPrimary">
                Video source not available
              </Typography>
            )}

            {hasCamera && (
              <CameraContainer>
                <video
                  ref={cameraVideoRef}
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                  autoPlay
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />

                <Box
                  className="face-status"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    px: 2,
                    py: 1,
                    backgroundColor: faceDetected ? "success.main" : "error.main",
                    color: "white",
                    borderRadius: 2,
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    boxShadow: 2,
                  }}
                >
                  {faceDetected ? "😊 Face Detected" : "❌ No Face"}
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    px: 2,
                    py: 1,
                    backgroundColor: faceApiReady ? "info.main" : "warning.main",
                    color: "white",
                    borderRadius: 2,
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                  }}
                >
                  {faceApiReady ? "🎭 API Ready" : "⏳ Loading..."}
                </Box>

                {loadingProgress && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      right: 8,
                      px: 2,
                      py: 1,
                      backgroundColor: "rgba(0,0,0,0.8)",
                      color: "white",
                      borderRadius: 2,
                      fontSize: "0.7rem",
                      textAlign: "center",
                    }}
                  >
                    {loadingProgress}
                  </Box>
                )}

                {isVideoPlaying && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      px: 1,
                      py: 0.5,
                      backgroundColor: "rgba(76, 175, 80, 0.8)",
                      color: "white",
                      borderRadius: 1,
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                    }}
                  >
                    📊 {emotionBuffer.length}/30
                  </Box>
                )}
              </CameraContainer>
            )}

            <ControlsContainer>
              {isMobile && (
                <IconButton
                  onClick={handlePlayPause}
                  color="primary"
                  size="large"
                  sx={{
                    position: "absolute",
                    left: 10,
                    bottom: "100%",
                    marginBottom: "10px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                  }}
                >
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </IconButton>
              )}

              {!isMobile && (
                <IconButton onClick={handlePlayPause} color="primary" size="large">
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </IconButton>
              )}

              {/* UPDATED: Camera toggle button - now always clickable */}
              <IconButton
                onClick={handleCameraToggle}
                color="primary"
                size="large"
                sx={{
                  position: "relative",
                  opacity: 1, // Always fully visible
                }}
                title={hasCamera ? "Turn off camera" : "Turn on camera"}
              >
                {/* Show different icons based on camera state */}
                {hasCamera ? <FiCameraOff /> : <FiCamera />}

                {/* Status indicator */}
                {hasCamera && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: faceApiReady ? "success.main" : "warning.main",
                      border: "2px solid white",
                    }}
                  />
                )}
              </IconButton>

              <IconButton onClick={() => setShowRecommendations(!showRecommendations)} color="primary" size="large">
                <Badge badgeContent={recommendedMovies?.length > 0 ? recommendedMovies.length : null} color="error">
                  <FiFilm />
                </Badge>
              </IconButton>

              <IconButton
                onClick={handleRefreshAndShow}
                color="primary"
                size="large"
                disabled={loadingRecommendations}
                sx={{
                  position: "relative",
                }}
              >
                {loadingRecommendations ? <CircularProgress size={20} color="inherit" /> : <FiRefreshCw />}

                {showRecommendations && !hasAutoClicked && !loadingRecommendations && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "#ff9800",
                      animation: "pulse 1s infinite",
                      "@keyframes pulse": {
                        "0%": {
                          transform: "scale(1)",
                          opacity: 1,
                        },
                        "50%": {
                          transform: "scale(1.2)",
                          opacity: 0.7,
                        },
                        "100%": {
                          transform: "scale(1)",
                          opacity: 1,
                        },
                      },
                    }}
                  />
                )}
              </IconButton>

              <IconButton onClick={handleBackward} color="primary" size="large">
                <FiRewind />
              </IconButton>

              <IconButton onClick={handleForward} color="primary" size="large">
                <FiFastForward />
              </IconButton>

              <IconButton
                onClick={toggleFullscreen}
                color="primary"
                size="large"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? "🔽" : "🔳"}
              </IconButton>
            </ControlsContainer>
          </VideoContainer>

          {showRecommendations && recommendedMovies && recommendedMovies.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                  🎬 AI-Powered Movie Recommendations
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {dominantEmotion && (
                    <Chip
                      label={`${dominantEmotion.toUpperCase()} (${(emotionConfidence * 100).toFixed(1)}%)`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "white",
                        borderColor: "white",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  <IconButton
                    onClick={handleRefreshAndShow}
                    disabled={loadingRecommendations}
                    size="small"
                    sx={{
                      color: "white",
                      position: "relative",
                    }}
                  >
                    {loadingRecommendations ? <CircularProgress size={16} color="inherit" /> : <FiRefreshCw />}

                    {showRecommendations && !hasAutoClicked && !loadingRecommendations && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -2,
                          right: -2,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#ff9800",
                          animation: "pulse 1s infinite",
                          "@keyframes pulse": {
                            "0%": {
                              transform: "scale(1)",
                              opacity: 1,
                            },
                            "50%": {
                              transform: "scale(1.2)",
                              opacity: 0.7,
                            },
                            "100%": {
                              transform: "scale(1)",
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    )}
                  </IconButton>
                  <IconButton onClick={() => setShowRecommendations(false)} size="small" sx={{ color: "white" }}>
                    <FiX />
                  </IconButton>
                </Box>
              </Box>

              {recommendationError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {recommendationError}
                </Alert>
              )}

              {loadingRecommendations ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 200,
                  }}
                >
                  <CircularProgress size={40} />
                  <Typography variant="body1" sx={{ ml: 2, color: "white" }}>
                    Analyzing your emotions and finding perfect movies...
                  </Typography>
                </Box>
              ) : (
                <RecommendedMovies recommendedMovies={recommendedMovies} />
              )}
            </Box>
          )}

          <EmotionGraphContainer>
            <EmotionGraph
              emotionHistory={emotionHistory}
              currentEmotions={currentEmotions}
              hasCamera={hasCamera}
              faceApiReady={faceApiReady}
              loadingProgress={loadingProgress}
              faceDetected={faceDetected}
            />
          </EmotionGraphContainer>

          <Snackbar open={showCameraAlert} autoHideDuration={8000} onClose={() => setShowCameraAlert(false)}>
            <Alert onClose={() => setShowCameraAlert(false)} severity="warning" sx={{ width: "100%" }}>
              {!hasCamera
                ? "🎥 Please click the camera button and allow access to enable emotion-based recommendations during video playback"
                : !faceApiReady
                  ? "🎭 Face-API.js is loading... Please wait for the AI models to download (~30 seconds)"
                  : "⏳ Please wait for Face-API.js to fully initialize before starting video playback"}
            </Alert>
          </Snackbar>

          <Chatbot
            emotionData={{
              dominantEmotion: dominantEmotion,
              confidence: emotionConfidence,
            }}
            hasCamera={hasCamera}
            currentEmotions={currentEmotions}
          />
        </Box>
      </StyledDialog>
    </ThemeProvider>
  )
}

export default VideoPlayback
