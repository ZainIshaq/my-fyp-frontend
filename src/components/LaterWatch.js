import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import {
  Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Chip, CircularProgress, Dialog,
  Grid, IconButton, Snackbar, Typography
} from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlinePlayCircle } from 'react-icons/ai';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  backgroundColor: '#2a2a2a',
  color: 'white',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
}));

const VideoCard = ({ video, onRemove, onWatch, loading }) => {
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="250"
        image={
          video.posterUrl ||
          video.backdropUrl ||
          'https://via.placeholder.com/400x600?text=No+Image'
        }
        alt={video.title}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'white',
            fontWeight: '600',
            height: '3em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {video.title}
        </Typography>

        {video.releaseDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: '#ccc' }} />
            <Typography variant="caption" color="#ccc">
              {formatReleaseDate(video.releaseDate)}
            </Typography>
          </Box>
        )}

        {video.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StarIcon sx={{ fontSize: 14, mr: 0.5, color: '#FFD700' }} />
            <Typography variant="caption" color="#FFD700">
              {video.rating.toFixed(1)}/10
            </Typography>
          </Box>
        )}

        {video.genre && (
          <Chip
            label={video.genre}
            size="small"
            sx={{
              backgroundColor: 'rgba(103, 58, 183, 0.3)',
              color: '#BB86FC',
              mb: 1,
            }}
          />
        )}

        <Typography
          variant="body2"
          color="#bbb"
          sx={{
            height: '3em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {video.description || 'No description available'}
        </Typography>

        {video.recommendationReason && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={video.recommendationReason}
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                color: '#007BFF',
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }}
            />
          </Box>
        )}
      </CardContent>

      <CardActions
        sx={{
          backgroundColor: '#1a1a1a',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Button
          startIcon={<AiOutlinePlayCircle />}
          variant="contained"
          size="small"
          onClick={() => onWatch(video)}
          sx={{
            backgroundColor: '#673AB7',
            '&:hover': {
              backgroundColor: '#5E35B1',
            },
          }}
        >
          Watch
        </Button>

        <Button
          startIcon={<AiOutlineClose />}
          variant="outlined"
          color="error"
          size="small"
          onClick={() => onRemove(video.movieId || video.id)}
          disabled={loading}
          sx={{
            '&:disabled': {
              opacity: 0.6,
            },
          }}
        >
          {loading ? <CircularProgress size={16} /> : 'Remove'}
        </Button>
      </CardActions>
    </StyledCard>
  );
};

const LaterWatch = ({ isVisible, onClose }) => {
  const [watchLaterVideos, setWatchLaterVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // API base URL
  const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/users`;

  // Get auth token
  const getAuthToken = () => {
    return (
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Load watch later videos
  const loadWatchLaterVideos = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/watch-later`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setWatchLaterVideos(result.data);
      } else {
        showSnackbar('Error loading Watch Later videos', 'error');
      }
    } catch (error) {
      console.error('Error loading watch later videos:', error);
      showSnackbar('Error loading Watch Later videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Remove video from watch later
  const handleRemoveVideo = async (movieId) => {
    try {
      setRemoveLoading(movieId);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/watch-later/${movieId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setWatchLaterVideos((prev) =>
          prev.filter((v) => (v.movieId || v.id) !== movieId)
        );
        showSnackbar('Video removed from Watch Later');
      } else {
        showSnackbar(result.message || 'Error removing video', 'error');
      }
    } catch (error) {
      console.error('Error removing video:', error);
      showSnackbar('Error removing video', 'error');
    } finally {
      setRemoveLoading(null);
    }
  };

  // Handle watch movie
  const handleWatchMovie = (video) => {
    if (video.movieLink) {
      window.open(video.movieLink, '_blank');
    } else {
      // Fallback to search
      const searchQuery = encodeURIComponent(video.title);
      window.open(
        `https://www.google.com/search?q=${searchQuery}+watch+online`,
        '_blank'
      );
    }
  };

  // Load videos when dialog opens
  useEffect(() => {
    if (isVisible) {
      loadWatchLaterVideos();
    }
  }, [isVisible]);

  return (
    <>
      <Dialog
        open={isVisible}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            minHeight: '80vh',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ color: 'white', fontWeight: 'bold' }}
              >
                🕒 Watch Later
              </Typography>
              {watchLaterVideos.length > 0 && (
                <Typography variant="subtitle1" color="#ccc">
                  {watchLaterVideos.length} movie
                  {watchLaterVideos.length !== 1 ? 's' : ''} saved
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <AiOutlineClose />
            </IconButton>
          </Box>

          {/* Loading State */}
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 300,
              }}
            >
              <CircularProgress size={60} sx={{ color: '#673AB7' }} />
            </Box>
          ) : watchLaterVideos.length === 0 ? (
            /* Empty State */
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 300,
                textAlign: 'center',
              }}
            >
              <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                🕒
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No movies saved to watch later
              </Typography>
              <Typography variant="body2" color="#999">
                Movies you add to "Watch Later" will appear here
              </Typography>
            </Box>
          ) : (
            /* Movies Grid */
            <Grid container spacing={3}>
              {watchLaterVideos.map((video) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={video.id || video.movieId}
                >
                  <VideoCard
                    video={video}
                    onRemove={handleRemoveVideo}
                    onWatch={handleWatchMovie}
                    loading={removeLoading === (video.movieId || video.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LaterWatch;
