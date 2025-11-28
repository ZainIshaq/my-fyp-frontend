"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import axios from "axios"

// Custom hook for emotion detection functionality
export const useEmotionDetection = () => {
  const [hasCamera, setHasCamera] = useState(false)
  const [stream, setStream] = useState(null)
  const [emotionHistory, setEmotionHistory] = useState([])

  // Only store original detected emotions (no dummy data)
  const [currentEmotions, setCurrentEmotions] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    fearful: 0,
    disgusted: 0,
    neutral: 0,
  })

  // Processed emotions for recommendations (will be empty if no face detected)
  const [processedEmotions, setProcessedEmotions] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    fearful: 0,
    disgusted: 0,
    neutral: 0,
  })

  const [faceDetected, setFaceDetected] = useState(false)
  const [debugLogs, setDebugLogs] = useState([])
  const [faceApiReady, setFaceApiReady] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState("")

  // Movie recommendation states
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [dominantEmotion, setDominantEmotion] = useState("")
  const [recommendationError, setRecommendationError] = useState("")
  const [lastRecommendationTime, setLastRecommendationTime] = useState(0)
  const [emotionConfidence, setEmotionConfidence] = useState(0)

  // Enhanced emotion tracking states
  const [emotionBuffer, setEmotionBuffer] = useState([])
  const [videoStartTime, setVideoStartTime] = useState(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showRecommendationPopup, setShowRecommendationPopup] = useState(false)
  const [recommendationTriggerCount, setRecommendationTriggerCount] = useState(0)

  // Track if we have valid emotion data
  const [hasValidEmotionData, setHasValidEmotionData] = useState(false)

  const cameraVideoRef = useRef(null)
  const emotionIntervalRef = useRef(null)
  const faceApiRef = useRef(null)
  const recommendationTimeoutRef = useRef(null)
  const emotionTrackingIntervalRef = useRef(null)

  // Configuration constants
  const EMOTION_TRACKING_WINDOW = 15000 // 15 seconds
  const RECOMMENDATION_INTERVAL = 12000 // 12 seconds between recommendations
  const MIN_CONFIDENCE_THRESHOLD = 0.15 // Minimum emotion confidence
  const BUFFER_SIZE = 30 // Number of emotion readings to keep in buffer

const API_BASE_URL = "https://my-fyp-backend-1.onrender.com/api/users"
  

  // Add debug log - MEMOIZED
  const addDebugLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp}: ${message}`
    console.log(logMessage)
    setDebugLogs((prev) => [...prev.slice(-5), logMessage])
  }, [])

  // Helper function to get the correct auth token - MEMOIZED
  const getAuthToken = useCallback(() => {
    return localStorage.getItem("authToken") || localStorage.getItem("token")
  }, [])

  // Helper function to reset emotions to zero - MEMOIZED
  const resetEmotions = useCallback(() => {
    const zeroEmotions = {
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      fearful: 0,
      disgusted: 0,
      neutral: 0,
    }
    setCurrentEmotions(zeroEmotions)
    setProcessedEmotions(zeroEmotions)
    setHasValidEmotionData(false)
  }, [])

  // Function to fetch trending movies as fallback - MEMOIZED
  const fetchTrendingMovies = useCallback(async () => {
    try {
      const token = getAuthToken()

      const response = await axios.get(`${API_BASE_URL}/movies/trending?limit=9`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setRecommendedMovies(response.data.movies)
        setDominantEmotion("trending")
        addDebugLog("📈 Loaded trending movies as fallback")
      }
    } catch (error) {
      console.error("Error fetching trending movies:", error)
      addDebugLog(`❌ Trending movies error: ${error.message}`)
    }
  }, [getAuthToken, addDebugLog, API_BASE_URL])

  // Function to fetch movie recommendations based on emotions - MEMOIZED
  const fetchMovieRecommendations = useCallback(
    async (emotions) => {
      try {
        setLoadingRecommendations(true)
        setRecommendationError("")

        const token = getAuthToken()

        addDebugLog("🎬 Fetching movie recommendations...")

        const response = await axios.post(
          `${API_BASE_URL}/recommend-movies`,
          {
            emotions: emotions,
            limit: 9,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (response.data.success) {
          setRecommendedMovies(response.data.movies)
          setDominantEmotion(response.data.dominantEmotion)
          setEmotionConfidence(response.data.confidence)
          setLastRecommendationTime(Date.now())
          setShowRecommendationPopup(true)
          setRecommendationTriggerCount((prev) => prev + 1)

          addDebugLog(
            `✅ Got ${response.data.movies.length} recommendations for ${response.data.dominantEmotion} (trigger: ${recommendationTriggerCount + 1})`,
          )
          return true
        }
      } catch (error) {
        console.error("Error fetching movie recommendations:", error)
        setRecommendationError("Failed to fetch movie recommendations")
        addDebugLog(`❌ Recommendation error: ${error.message}`)

        await fetchTrendingMovies()
      } finally {
        setLoadingRecommendations(false)
      }
    },
    [getAuthToken, addDebugLog, API_BASE_URL, recommendationTriggerCount, fetchTrendingMovies],
  )

  // Enhanced function to analyze emotion patterns over time - MEMOIZED
  const analyzeEmotionPatterns = useCallback(
    (buffer) => {
      if (buffer.length < 5) return null // Need at least 5 readings

      // Only analyze if we have valid emotion readings
      const validReadings = buffer.filter((reading) => reading.emotions && reading.hasValidData)
      if (validReadings.length === 0) {
        addDebugLog("❌ No valid emotion readings for analysis")
        return null
      }

      // Calculate average emotions over the buffer period (excluding neutral)
      const emotionSums = {
        happy: 0,
        sad: 0,
        angry: 0,
        surprised: 0,
        fearful: 0,
        disgusted: 0,
      }

      // Sum all emotion values
      validReadings.forEach((reading) => {
        Object.keys(emotionSums).forEach((emotion) => {
          emotionSums[emotion] += reading.emotions[emotion] || 0
        })
      })

      // Calculate averages
      const emotionAverages = {}
      Object.keys(emotionSums).forEach((emotion) => {
        emotionAverages[emotion] = emotionSums[emotion] / validReadings.length
      })

      // Filter out emotions below threshold
      const significantEmotions = Object.entries(emotionAverages)
        .filter(([emotion, value]) => value >= MIN_CONFIDENCE_THRESHOLD)
        .sort(([, a], [, b]) => b - a)

      if (significantEmotions.length === 0) {
        addDebugLog("❌ No significant emotions detected above threshold")
        return null
      }

      // Get top 2-3 emotions
      const topEmotions = significantEmotions.slice(0, 3)

      addDebugLog(`📊 Emotion analysis: ${topEmotions.map(([e, v]) => `${e}: ${(v * 100).toFixed(1)}%`).join(", ")}`)

      return {
        dominantEmotions: topEmotions,
        confidence: topEmotions[0][1], // Highest emotion confidence
        emotionMix: topEmotions.reduce((acc, [emotion, value]) => {
          acc[emotion] = value
          return acc
        }, {}),
        analysisTime: Date.now(),
      }
    },
    [addDebugLog, MIN_CONFIDENCE_THRESHOLD],
  )

  // Enhanced movie recommendation function with emotion mixing - MEMOIZED
  const fetchMovieRecommendationsWithMix = useCallback(
    async (emotionAnalysis) => {
      try {
        setLoadingRecommendations(true)
        setRecommendationError("")

        const token = getAuthToken()

        addDebugLog("🎬 Fetching mixed emotion recommendations...")

        const response = await axios.post(
          `${API_BASE_URL}/recommend-movies-mixed`,
          {
            emotionMix: emotionAnalysis.emotionMix,
            dominantEmotions: emotionAnalysis.dominantEmotions,
            confidence: emotionAnalysis.confidence,
            limit: 9,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (response.data.success) {
          setRecommendedMovies(response.data.movies)
          setDominantEmotion(response.data.dominantEmotion)
          setEmotionConfidence(response.data.confidence)
          setLastRecommendationTime(Date.now())
          setShowRecommendationPopup(true)
          setRecommendationTriggerCount((prev) => prev + 1)

          addDebugLog(
            `✅ Got ${response.data.movies.length} mixed recommendations (trigger: ${recommendationTriggerCount + 1})`,
          )
          return true
        }
      } catch (error) {
        console.error("Error fetching mixed recommendations:", error)
        // Fallback to regular recommendation only if we have valid emotions
        if (hasValidEmotionData) {
          await fetchMovieRecommendations(emotionAnalysis.emotionMix)
        } else {
          await fetchTrendingMovies()
        }
      } finally {
        setLoadingRecommendations(false)
      }
    },
    [
      getAuthToken,
      addDebugLog,
      API_BASE_URL,
      recommendationTriggerCount,
      hasValidEmotionData,
      fetchMovieRecommendations,
      fetchTrendingMovies,
    ],
  )

  // Enhanced emotion processing to reduce neutral dominance (for recommendations only) - MEMOIZED
  const processEmotionsForRecommendations = useCallback((rawEmotions) => {
    // Define weights to reduce neutral dominance and enhance expressive emotions
    const emotionWeights = {
      happy: 1.3, // Boost happy emotions
      sad: 1.2, // Boost sad emotions
      angry: 1.4, // Boost angry emotions
      surprised: 1.3, // Boost surprised emotions
      fearful: 1.1, // Slightly boost fearful
      disgusted: 1.1, // Slightly boost disgusted
      neutral: 0.4, // Significantly reduce neutral dominance
    }

    // Apply weights to emotions
    const weightedEmotions = {}
    let totalWeighted = 0

    Object.entries(rawEmotions).forEach(([emotion, value]) => {
      const weighted = value * (emotionWeights[emotion] || 1)
      weightedEmotions[emotion] = weighted
      totalWeighted += weighted
    })

    // Normalize weighted emotions
    const normalizedEmotions = {}
    Object.entries(weightedEmotions).forEach(([emotion, value]) => {
      normalizedEmotions[emotion] = totalWeighted > 0 ? value / totalWeighted : 0
    })

    return normalizedEmotions
  }, [])

  // Add emotion reading to buffer - MEMOIZED
  const addEmotionToBuffer = useCallback(
    (emotions, hasValidData) => {
      const reading = {
        emotions: { ...emotions },
        timestamp: Date.now(),
        faceDetected: faceDetected,
        hasValidData: hasValidData, // Track if this is real or dummy data
      }

      setEmotionBuffer((prev) => {
        const newBuffer = [...prev, reading]
        // Keep only recent readings within the window
        const cutoffTime = Date.now() - EMOTION_TRACKING_WINDOW
        const filteredBuffer = newBuffer.filter((r) => r.timestamp > cutoffTime)
        return filteredBuffer.slice(-BUFFER_SIZE) // Limit buffer size
      })
    },
    [faceDetected, EMOTION_TRACKING_WINDOW, BUFFER_SIZE],
  )

  // Start video emotion tracking - MEMOIZED
  const startVideoEmotionTracking = useCallback(() => {
    if (!isVideoPlaying) return

    setVideoStartTime(Date.now())
    setEmotionBuffer([])

    addDebugLog("🎥 Started video emotion tracking")

    // Clear any existing tracking interval
    if (emotionTrackingIntervalRef.current) {
      clearInterval(emotionTrackingIntervalRef.current)
    }

    // Start emotion analysis tracking
    emotionTrackingIntervalRef.current = setInterval(() => {
      if (!isVideoPlaying) return

      const now = Date.now()
      const timeSinceStart = now - (videoStartTime || now)

      // Check if we should analyze emotions (every 12-15 seconds)
      if (timeSinceStart >= RECOMMENDATION_INTERVAL && emotionBuffer.length > 0) {
        const analysis = analyzeEmotionPatterns(emotionBuffer)

        if (analysis && analysis.dominantEmotions.length > 0) {
          // Check if enough time has passed since last recommendation
          const timeSinceLastRec = now - lastRecommendationTime

          if (timeSinceLastRec >= RECOMMENDATION_INTERVAL) {
            addDebugLog(`🎯 Triggering recommendation after ${(timeSinceStart / 1000).toFixed(1)}s of watching`)
            fetchMovieRecommendationsWithMix(analysis)
          }
        }

        // Reset tracking window but keep some overlap
        setEmotionBuffer((prev) => prev.slice(-10)) // Keep last 10 readings for overlap
        setVideoStartTime(now) // Reset the window
      }
    }, 2000) // Check every 2 seconds
  }, [
    isVideoPlaying,
    videoStartTime,
    emotionBuffer,
    RECOMMENDATION_INTERVAL,
    analyzeEmotionPatterns,
    lastRecommendationTime,
    addDebugLog,
    fetchMovieRecommendationsWithMix,
  ])

  // Stop video emotion tracking - MEMOIZED
  const stopVideoEmotionTracking = useCallback(() => {
    if (emotionTrackingIntervalRef.current) {
      clearInterval(emotionTrackingIntervalRef.current)
      emotionTrackingIntervalRef.current = null
    }

    setIsVideoPlaying(false)
    setVideoStartTime(null)
    setEmotionBuffer([])

    addDebugLog("⏹️ Stopped video emotion tracking")
  }, [addDebugLog])

  // Load script helper - MEMOIZED
  const loadScript = useCallback((src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }, [])

  // UPDATED: Handle no face detected - reset emotions to zero - MEMOIZED
  const handleNoFaceDetected = useCallback(() => {
    if (!cameraVideoRef.current) return

    const video = cameraVideoRef.current

    if (video.readyState >= 2 && video.videoWidth > 0) {
      setFaceDetected(false)
      setHasValidEmotionData(false)

      // Reset emotions to zero when no face is detected
      resetEmotions()

      addDebugLog("❌ No face detected - emotions reset to zero")
    } else {
      setFaceDetected(false)
      setHasValidEmotionData(false)
      resetEmotions()
      addDebugLog("❌ No face detected (camera not ready)")
    }
  }, [resetEmotions, addDebugLog])

  // UPDATED: Enhanced emotion detection - only shows original emotions, no dummy data - MEMOIZED
  const detectEmotions = useCallback(async () => {
    if (!faceApiReady || !cameraVideoRef.current) {
      return
    }

    const video = cameraVideoRef.current
    if (video.readyState < 2 || video.videoWidth === 0) {
      return
    }

    try {
      if (faceApiRef.current && window.faceapi) {
        const detections = await faceApiRef.current
          .detectAllFaces(
            video,
            new faceApiRef.current.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.5,
            }),
          )
          .withFaceExpressions()

        if (detections && detections.length > 0) {
          const detection = detections[0]
          const expressions = detection.expressions

          setFaceDetected(true)
          setHasValidEmotionData(true)

          // Store original emotions for display
          const originalEmotions = {
            happy: expressions.happy || 0,
            sad: expressions.sad || 0,
            angry: expressions.angry || 0,
            surprised: expressions.surprised || 0,
            fearful: expressions.fearful || 0,
            disgusted: expressions.disgusted || 0,
            neutral: expressions.neutral || 0,
          }

          // Set original emotions for display
          setCurrentEmotions(originalEmotions)

          // Process emotions for recommendations only
          const processed = processEmotionsForRecommendations(originalEmotions)
          setProcessedEmotions(processed)

          // Add to emotion buffer for video tracking (with valid data flag)
          if (isVideoPlaying) {
            addEmotionToBuffer(originalEmotions, true)
          }

          // Store original emotions in history
          setEmotionHistory((prev) => {
            const newHistory = [...prev, { ...originalEmotions, timestamp: Date.now() }]
            return newHistory.slice(-100)
          })

          const dominantOriginal = Object.entries(originalEmotions).reduce((max, current) =>
            current[1] > max[1] ? current : max,
          )

          addDebugLog(`😊 Face-API detected - ${dominantOriginal[0]}: ${(dominantOriginal[1] * 100).toFixed(1)}%`)
          return
        }
      }

      // UPDATED: No face detected - reset emotions instead of simulating
      handleNoFaceDetected()
    } catch (error) {
      addDebugLog(`❌ Face-API detection error: ${error.message}`)
      handleNoFaceDetected()
    }
  }, [
    faceApiReady,
    processEmotionsForRecommendations,
    isVideoPlaying,
    addEmotionToBuffer,
    addDebugLog,
    handleNoFaceDetected,
  ])

  // Start emotion detection - MEMOIZED
  const startEmotionDetection = useCallback(() => {
    if (!hasCamera || !faceApiReady) {
      addDebugLog("❌ Cannot start detection - camera or Face-API.js not ready")
      return
    }

    addDebugLog("▶️ Starting Face-API.js emotion detection")
    emotionIntervalRef.current = setInterval(detectEmotions, 500)
  }, [hasCamera, faceApiReady, addDebugLog, detectEmotions])

  // Stop emotion detection - MEMOIZED
  const stopEmotionDetection = useCallback(() => {
    if (emotionIntervalRef.current) {
      clearInterval(emotionIntervalRef.current)
      emotionIntervalRef.current = null
      addDebugLog("⏹️ Stopped emotion detection")
    }

    if (recommendationTimeoutRef.current) {
      clearTimeout(recommendationTimeoutRef.current)
      recommendationTimeoutRef.current = null
    }

    // Reset emotions when stopping detection
    resetEmotions()
  }, [addDebugLog, resetEmotions])

  // Request camera access - MEMOIZED
  const requestCamera = useCallback(async () => {
    try {
      addDebugLog("📹 Requesting camera access...")

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: "user",
        },
      })

      addDebugLog("✅ Camera permission granted")
      setStream(mediaStream)
      setHasCamera(true)

      const initializeVideo = () => {
        if (cameraVideoRef.current) {
          addDebugLog("📹 Initializing camera video...")

          const video = cameraVideoRef.current
          video.srcObject = mediaStream

          video.onloadedmetadata = () => {
            addDebugLog(`📹 Camera ready: ${video.videoWidth}x${video.videoHeight}`)
            video.play().then(() => {
              addDebugLog("✅ Camera video playing")

              if (faceApiReady) {
                setTimeout(() => {
                  addDebugLog("🧪 Testing Face-API.js detection...")
                  detectEmotions()
                }, 1000)
              }
            })
          }
        } else {
          setTimeout(initializeVideo, 100)
        }
      }

      setTimeout(initializeVideo, 50)
    } catch (error) {
      addDebugLog(`❌ Camera access denied: ${error.message}`)
      throw error
    }
  }, [addDebugLog, faceApiReady, detectEmotions])

  // Clean up camera - MEMOIZED
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setHasCamera(false)
    }
    stopEmotionDetection()
    stopVideoEmotionTracking()
    setFaceDetected(false)
    setHasValidEmotionData(false)
    setEmotionHistory([])
    resetEmotions()
    addDebugLog("📹 Camera stopped")
  }, [stream, stopEmotionDetection, stopVideoEmotionTracking, resetEmotions, addDebugLog])

  // Handle manual recommendation refresh with processed emotions - MEMOIZED
  const handleRefreshRecommendations = useCallback(() => {
    addDebugLog("🔄 Manual refresh triggered")
    setRecommendationTriggerCount((prev) => prev + 1)

    // Only use emotion-based recommendations if we have valid emotion data
    if (hasValidEmotionData && Object.values(processedEmotions).some((val) => val > 0)) {
      fetchMovieRecommendations(processedEmotions)
    } else {
      addDebugLog("❌ No valid emotion data - fetching trending movies")
      fetchTrendingMovies()
    }
  }, [addDebugLog, hasValidEmotionData, processedEmotions, fetchMovieRecommendations, fetchTrendingMovies])

  // Get dominant emotion for display (using original emotions) - MEMOIZED
  const getDominantEmotionData = useCallback(() => {
    if (!hasValidEmotionData) {
      return { name: "none", value: 0 }
    }

    const emotions = Object.entries(currentEmotions)
    const dominant = emotions.reduce((max, current) => (current[1] > max[1] ? current : max))
    return { name: dominant[0], value: dominant[1] }
  }, [hasValidEmotionData, currentEmotions])

  // Video control functions - MEMOIZED
  const startVideoWatching = useCallback(() => {
    setIsVideoPlaying(true)
    startVideoEmotionTracking()
    addDebugLog("🎥 Video watching started with emotion tracking")
  }, [startVideoEmotionTracking, addDebugLog])

  const stopVideoWatching = useCallback(() => {
    setIsVideoPlaying(false)
    stopVideoEmotionTracking()
    addDebugLog("🎥 Video watching stopped")
  }, [stopVideoEmotionTracking, addDebugLog])

  // Load Face-API.js with proper model URLs
  useEffect(() => {
    const loadFaceApi = async () => {
      try {
        addDebugLog("🔄 Loading Face-API.js...")
        setLoadingProgress("Loading Face-API.js library...")

        await loadScript("https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js")

        if (window.faceapi) {
          addDebugLog("📦 Face-API.js loaded, initializing models...")
          setLoadingProgress("Loading AI models...")

          const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

          try {
            setLoadingProgress("Loading face detection model...")
            await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
            addDebugLog("✅ Face detector loaded")

            setLoadingProgress("Loading face landmark model...")
            await window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
            addDebugLog("✅ Face landmarks loaded")

            setLoadingProgress("Loading face expression model...")
            await window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
            addDebugLog("✅ Face expressions loaded")

            faceApiRef.current = window.faceapi
            setFaceApiReady(true)
            setLoadingProgress("")
            addDebugLog("🎭 Face-API.js ready for emotion detection!")

            await fetchTrendingMovies()
          } catch (modelError) {
            addDebugLog(`❌ Model loading failed: ${modelError.message}`)
            setFaceApiReady(true)
            setLoadingProgress("")
            await fetchTrendingMovies()
          }
        }
      } catch (error) {
        addDebugLog(`❌ Face-API.js loading failed: ${error.message}`)
        setLoadingProgress("Failed to load Face-API.js")
        setFaceApiReady(true)
        setLoadingProgress("")
        await fetchTrendingMovies()
      }
    }

    loadFaceApi()
  }, [addDebugLog, loadScript, fetchTrendingMovies])

  // Component cleanup
  useEffect(() => {
    return () => {
      stopCamera()
      stopVideoEmotionTracking()
    }
  }, [stopCamera, stopVideoEmotionTracking])

  return {
    // States
    hasCamera,
    stream,
    emotionHistory,
    currentEmotions,
    faceDetected,
    debugLogs,
    faceApiReady,
    loadingProgress,
    recommendedMovies,
    loadingRecommendations,
    dominantEmotion,
    recommendationError,
    emotionConfidence,
    hasValidEmotionData, // NEW: indicates if we have real emotion data

    // New video tracking states
    isVideoPlaying,
    showRecommendationPopup,
    setShowRecommendationPopup,
    emotionBuffer,
    recommendationTriggerCount,

    // Refs
    cameraVideoRef,

    // Functions
    startEmotionDetection,
    stopEmotionDetection,
    requestCamera,
    stopCamera,
    handleRefreshRecommendations,
    getDominantEmotionData,
    fetchTrendingMovies,
    addDebugLog,

    // New video control functions
    startVideoWatching,
    stopVideoWatching,
    analyzeEmotionPatterns,
  }
}
