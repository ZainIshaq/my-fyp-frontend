import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EmotionGraph = ({ 
  emotionHistory, 
  currentEmotions, 
  hasCamera, 
  faceApiReady, 
  loadingProgress, 
  faceDetected 
}) => {
  // Generate chart data
  const emotionData = {
    labels: emotionHistory.map((_, index) => `${(index * 0.5).toFixed(1)}s`),
    datasets: [
      {
        label: "Happy",
        data: emotionHistory.map(e => e.happy * 100),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Sad",
        data: emotionHistory.map(e => e.sad * 100),
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Angry",
        data: emotionHistory.map(e => e.angry * 100),
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Surprised",
        data: emotionHistory.map(e => e.surprised * 100),
        borderColor: "#FF9800",
        backgroundColor: "rgba(255, 152, 0, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Fearful",
        data: emotionHistory.map(e => e.fearful * 100),
        borderColor: "#9C27B0",
        backgroundColor: "rgba(156, 39, 176, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Disgusted",
        data: emotionHistory.map(e => e.disgusted * 100),
        borderColor: "#795548",
        backgroundColor: "rgba(121, 85, 72, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Neutral",
        data: emotionHistory.map(e => e.neutral * 100),
        borderColor: "#9E9E9E",
        backgroundColor: "rgba(158, 158, 158, 0.1)",
        tension: 0.4,
        fill: false,
      }
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
        ticks: {
          color: "#ccc",
        },
        title: {
          display: true,
          text: 'Emotion Intensity (%)',
          color: "#ccc",
        }
      },
      x: {
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
        ticks: {
          color: "#ccc",
          maxTicksLimit: 20,
        },
        title: {
          display: true,
          text: 'Time (seconds)',
          color: "#ccc",
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: "#ccc",
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Real-time Face-API.js Emotion Detection',
        color: "#fff",
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#ccc",
      }
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 4,
      }
    }
  };

  // Helper function to get emotion color
  const getEmotionColor = (emotion) => {
    const colors = {
      happy: '76,175,80',
      sad: '33,150,243',
      angry: '244,67,54',
      surprised: '255,152,0',
      fearful: '156,39,176',
      disgusted: '121,85,72',
      neutral: '158,158,158'
    };
    return colors[emotion] || '158,158,158';
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: "100%", backgroundColor: '#1e1e1e' }}>
      <Typography variant="h5" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
        🎭 Face-API.js Emotion Analysis
      </Typography>
      
      {/* Current emotions display */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "#ccc" }}>
          Current Emotions:
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 1 }}>
          {Object.entries(currentEmotions).map(([emotion, value]) => (
            <Box
              key={emotion}
              sx={{
                p: 1,
                backgroundColor: `rgba(${getEmotionColor(emotion)}, 0.2)`,
                borderRadius: 2,
                border: `2px solid rgba(${getEmotionColor(emotion)}, 0.5)`,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "#fff", fontWeight: "bold", textTransform: "capitalize" }}>
                {emotion}
              </Typography>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {(value * 100).toFixed(1)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Chart or placeholder */}
      {emotionHistory.length > 0 ? (
        <Box sx={{ height: "250px" }}>
          <Line data={emotionData} options={chartOptions} />
        </Box>
      ) : (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "200px",
          border: "2px dashed rgba(255,255,255,0.3)",
          borderRadius: 2,
        }}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            {!hasCamera ? (
              <>
                📹 Click the camera button to enable Face-API.js emotion tracking<br />
                <Typography variant="caption">Advanced AI-powered facial expression analysis</Typography>
              </>
            ) : !faceApiReady ? (
              <>
                🎭 Loading Face-API.js models...<br />
                <Typography variant="caption">{loadingProgress || "Please wait while AI models are downloaded"}</Typography>
              </>
            ) : !faceDetected ? (
              <>
                👤 Position your face in the camera view<br />
                <Typography variant="caption">Face-API.js will analyze your facial expressions in real-time</Typography>
              </>
            ) : (
              <>
                🎬 Press play to start emotion tracking<br />
                <Typography variant="caption">Real-time analysis of 7 different emotions</Typography>
              </>
            )}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EmotionGraph;

