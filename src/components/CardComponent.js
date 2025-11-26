import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import VideoPlayback from "../Screens/VideoPlayback";
import { useEmotionDetection } from "./EmotionDetection";
export default function Cardt({ thumbnail, videoUrl, title, description, genre }) {
  const [isHovered, setIsHovered] = useState(false);

  // FIXED: Format media URL function
  const formatMediaUrl = (url) => {
    if (!url) return '';
    
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

  const handleWatchLater = () => {
    // Here you would typically save to your backend or local storage
    const watchLaterList = JSON.parse(localStorage.getItem('watchLater') || '[]');
    const newItem = {
      id: Date.now(),
      title,
      thumbnail: formatMediaUrl(thumbnail), // Use formatted URL
      videoUrl: formatMediaUrl(videoUrl),   // Use formatted URL
      description,
      genre,
      addedAt: new Date().toISOString()
    };
    
    // Check if already exists
    const exists = watchLaterList.some(item => item.videoUrl === formatMediaUrl(videoUrl));
    if (!exists) {
      watchLaterList.push(newItem);
      localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
      alert("Added to Watch Later");
    } else {
      alert("Already in Watch Later");
    }
  };

  // Format URLs for use throughout the component
  const formattedVideoUrl = formatMediaUrl(videoUrl);
  const formattedThumbnail = formatMediaUrl(thumbnail);

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          position: "relative",
          height: 200,
          width: "100%",
          overflow: "hidden",
          cursor: "pointer"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isHovered ? (
          <img
            src={formattedThumbnail} // Use formatted URL
            alt={title}
            style={{ 
              height: "100%", 
              width: "100%", 
              objectFit: "cover",
              transition: "transform 0.3s ease"
            }}
            onError={(e) => {
              console.error('Thumbnail failed to load:', formattedThumbnail);
              // Use a simple fallback without external dependencies
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFRodW1ibmFpbDwvdGV4dD48L3N2Zz4=';
            }}
          />
        ) : (
          <video
            width="100%"
            height="100%"
            autoPlay
            muted
            loop
            style={{ objectFit: "cover" }}
            onError={(e) => {
              console.error('Video failed to load:', formattedVideoUrl);
            }}
          >
            <source src={formattedVideoUrl} type="video/mp4" />
            <source src={formattedVideoUrl} type="video/webm" />
            <source src={formattedVideoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Overlay for better UX */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <Typography variant="h6" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Preview
            </Typography>
          </div>
        )}
      </div>

      <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{ 
            textAlign: "center", 
            marginBottom: 1,
            fontSize: '1rem',
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              textAlign: "center", 
              marginBottom: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {description}
          </Typography>
        )}

        {genre && (
          <Typography
            variant="caption"
            sx={{ 
              textAlign: "center", 
              marginBottom: 2,
              padding: '4px 8px',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 1,
              display: 'inline-block',
              alignSelf: 'center'
            }}
          >
            {genre}
          </Typography>
        )}
      </div>

      <CardActions sx={{ justifyContent: "space-between", padding: '16px' }}>
        {/* UPDATED: Pass formatted URL to VideoPlayback */}
        <VideoPlayback videoSrc={formattedVideoUrl} />
        
        {/* <Button 
          size="small" 
          onClick={handleWatchLater}
          startIcon={<WatchLaterIcon />}
          variant="outlined"
        >
          Later
        </Button> */}
      </CardActions>
    </Card>
  );
}