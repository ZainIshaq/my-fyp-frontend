import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
    boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)',
  },
}));

const FavoriteCard = ({ movie, onRemove, onWatch, loading }) => {
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
          movie.posterUrl ||
          movie.backdropUrl ||
          'https://via.placeholder.com/400x600?text=No+Image'
        }
        alt={movie.title}
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
          {movie.title}
        </Typography>

        {movie.releaseDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: '#ccc' }} />
            <Typography variant="caption" color="#ccc">
              {formatReleaseDate(movie.releaseDate)}
            </Typography>
          </Box>
        )}

        {movie.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StarIcon sx={{ fontSize: 14, mr: 0.5, color: '#FFD700' }} />
            <Typography variant="caption" color="#FFD700">
              {movie.rating.toFixed(1)}/10
            </Typography>
          </Box>
        )}

        {movie.genre && (
          <Chip
            label={movie.genre}
            size="small"
            sx={{
              backgroundColor: 'rgba(233, 30, 99, 0.3)',
              color: '#FF6EC7',
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
          {movie.description || 'No description available'}
        </Typography>

        {movie.recommendationReason && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={movie.recommendationReason}
              size="small"
              sx={{
                backgroundColor: 'rgba(233, 30, 99, 0.2)',
                color: '#E91E63',
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
          onClick={() => onWatch(movie)}
          sx={{
            backgroundColor: '#E91E63',
            '&:hover': {
              backgroundColor: '#C2185B',
            },
          }}
        >
          Watch
        </Button>

        <Button
          startIcon={<FavoriteIcon />}
          variant="outlined"
          size="small"
          onClick={() => onRemove(movie.movieId || movie.id)}
          disabled={loading}
          sx={{
            color: '#E91E63',
            borderColor: '#E91E63',
            '&:hover': {
              backgroundColor: 'rgba(233, 30, 99, 0.1)',
              borderColor: '#E91E63',
            },
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

const Favorites = ({ isVisible, onClose }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
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
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Load favorite movies
  const loadFavoriteMovies = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setFavoriteMovies(result.data);
      } else {
        showSnackbar('Error loading Favorite movies', 'error');
      }
    } catch (error) {
      console.error('Error loading favorite movies:', error);
      showSnackbar('Error loading Favorite movies', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Remove movie from favorites
  const handleRemoveMovie = async (movieId) => {
    try {
      setRemoveLoading(movieId);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/favorites/${movieId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setFavoriteMovies((prev) =>
          prev.filter((m) => (m.movieId || m.id) !== movieId)
        );
        showSnackbar('Movie removed from Favorites');
      } else {
        showSnackbar(result.message || 'Error removing movie', 'error');
      }
    } catch (error) {
      console.error('Error removing movie:', error);
      showSnackbar('Error removing movie', 'error');
    } finally {
      setRemoveLoading(null);
    }
  };

  // Handle watch movie
  const handleWatchMovie = (movie) => {
    if (movie.movieLink) {
      window.open(movie.movieLink, '_blank');
    } else {
      // Fallback to search
      const searchQuery = encodeURIComponent(movie.title);
      window.open(
        `https://www.google.com/search?q=${searchQuery}+watch+online`,
        '_blank'
      );
    }
  };

  // Load movies when dialog opens
  useEffect(() => {
    if (isVisible) {
      loadFavoriteMovies();
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
                ❤️ Favorites
              </Typography>
              {favoriteMovies.length > 0 && (
                <Typography variant="subtitle1" color="#ccc">
                  {favoriteMovies.length} favorite movie
                  {favoriteMovies.length !== 1 ? 's' : ''}
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
              <CircularProgress size={60} sx={{ color: '#E91E63' }} />
            </Box>
          ) : favoriteMovies.length === 0 ? (
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
                ❤️
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No favorite movies yet
              </Typography>
              <Typography variant="body2" color="#999">
                Movies you mark as favorites will appear here
              </Typography>
            </Box>
          ) : (
            /* Movies Grid */
            <Grid container spacing={3}>
              {favoriteMovies.map((movie) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={movie.id || movie.movieId}
                >
                  <FavoriteCard
                    movie={movie}
                    onRemove={handleRemoveMovie}
                    onWatch={handleWatchMovie}
                    loading={removeLoading === (movie.movieId || movie.id)}
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

export default Favorites;
