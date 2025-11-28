import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import StarIcon from "@mui/icons-material/Star";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";

// RENDER BACKEND BASE URL CONSTANT - (ADDED)
const RENDER_BASE_URL = "https://my-fyp-backend-1.onrender.com";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 320,
  minHeight: 480, // Changed from height to minHeight
  width: "100%", // Ensure full width within grid
  backgroundColor: "#1a1a1a",
  borderRadius: "16px",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  display: "flex", // Make it flexbox
  flexDirection: "column", // Stack children vertically
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.4)",
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  flexShrink: 0, // Prevent shrinking
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)",
    zIndex: 1,
  },
}));

const EmotionChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  zIndex: 2,
  backgroundColor: "rgba(255,255,255,0.9)",
  color: "#1a1a1a",
  fontWeight: "bold",
  fontSize: "0.75rem",
  textTransform: "capitalize",
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 12,
  left: 12,
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  gap: "4px",
  backgroundColor: "rgba(0,0,0,0.7)",
  padding: "4px 8px",
  borderRadius: "8px",
}));

const RecommendedMovies = ({ recommendedMovies = [] }) => {
  const [openStory, setOpenStory] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false); // API base URL (FIXED HERE)

  const API_BASE_URL = `${RENDER_BASE_URL}/api/users`; // Get auth token

  const getAuthToken = () => {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  }; // Show notification

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }; // Handle Watch Later click

  const handleWatchLater = async (movie) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const movieData = {
        id: movie.id || Date.now().toString(),
        title: movie.title,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        genre: movie.genre,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
        description: movie.description,
        emotionMatch: movie.emotionMatch,
        recommendationReason: movie.recommendationReason,
        movieLink: movie.movieLink,
        confidence: movie.confidence,
      };

      // --- API CALL FIXED HERE ---
      const response = await fetch(`${API_BASE_URL}/watch-later`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      });
      // ---------------------------

      const result = await response.json();

      if (result.success) {
        showSnackbar(`${movie.title} added to Watch Later! 🕒`);
      } else {
        showSnackbar(result.message || "Error adding to Watch Later", "error");
      }
    } catch (error) {
      console.error("Error adding to watch later:", error);
      showSnackbar("Error adding to Watch Later", "error");
    }
    setLoading(false);
  }; // Handle Favorite click

  const handleFavorite = async (movie) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const movieData = {
        id: movie.id || Date.now().toString(),
        title: movie.title,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        genre: movie.genre,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
        description: movie.description,
        emotionMatch: movie.emotionMatch,
        recommendationReason: movie.recommendationReason,
        movieLink: movie.movieLink,
        confidence: movie.confidence,
      };

      // --- API CALL FIXED HERE ---
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      });
      // ---------------------------

      const result = await response.json();

      if (result.success) {
        showSnackbar(`${movie.title} added to Favorites! ❤️`);
      } else {
        showSnackbar(result.message || "Error adding to Favorites", "error");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      showSnackbar("Error adding to Favorites", "error");
    }
    setLoading(false);
  };

  const handleShowStory = (movie) => {
    setSelectedMovie(movie);
    setOpenStory(true);
  };

  const handleCloseStory = () => {
    setOpenStory(false);
    setSelectedMovie(null);
  };

  const handleWatchMovie = (movie) => {
    if (movie.movieLink) {
      window.open(movie.movieLink, "_blank");
    } else {
      const searchQuery = encodeURIComponent(movie.title);
      window.open(
        `https://www.google.com/search?q=${searchQuery}+watch+online`,
        "_blank"
      );
    }
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return "Unknown";
    }
  };

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      happy: "#4CAF50",
      sad: "#2196F3",
      angry: "#F44336",
      surprised: "#FF9800",
      fearful: "#9C27B0",
      disgusted: "#795548",
      neutral: "#9E9E9E",
      trending: "#E91E63",
    };
    return emotionColors[emotion] || "#9E9E9E";
  };

  if (!recommendedMovies || recommendedMovies.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          border: "2px dashed rgba(255,255,255,0.3)",
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      >
               {" "}
        <Typography variant="h6" color="text.secondary" textAlign="center">
                    🎬 No movie recommendations available           <br />     
             {" "}
          <Typography variant="caption">
                        Start the video and enable camera to get personalized  
                      recommendations!          {" "}
          </Typography>
                 {" "}
        </Typography>
             {" "}
      </Box>
    );
  }

  return (
    <>
           {" "}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Changed auto-fill to auto-fit
          gap: 3,
          width: "100%",
          padding: "16px", // Add padding to prevent edge clipping
          boxSizing: "border-box",
        }}
      >
               {" "}
        {recommendedMovies.map((movie, index) => (
          <StyledCard key={movie.id || index}>
                       {" "}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
                           {" "}
              <StyledCardMedia
                image={
                  movie.posterUrl ||
                  movie.backdropUrl ||
                  "https://via.placeholder.com/500x750?text=No+Image"
                }
                title={movie.title}
              />
                            {/* Emotion/Reason Chip */}             {" "}
              {movie.emotionMatch && (
                <EmotionChip
                  label={
                    movie.emotionMatch === "trending"
                      ? "Trending"
                      : `${movie.emotionMatch} mood`
                  }
                  size="small"
                  sx={{
                    backgroundColor: getEmotionColor(movie.emotionMatch),
                    color: "white",
                  }}
                />
              )}
                            {/* Rating */}             {" "}
              {movie.rating && (
                <RatingContainer>
                                   {" "}
                  <StarIcon sx={{ fontSize: 16, color: "#FFD700" }} />         
                         {" "}
                  <Typography
                    variant="caption"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                                        {movie.rating.toFixed(1)}               
                     {" "}
                  </Typography>
                                 {" "}
                </RatingContainer>
              )}
                         {" "}
            </Box>
                       {" "}
            <CardContent
              sx={{
                backgroundColor: "#2a2a2a",
                color: "white",
                flexGrow: 1, // Take up available space
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "16px",
              }}
            >
                           {" "}
              <Box>
                               {" "}
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    textAlign: "center",
                    color: "#fff",
                    minHeight: "2.5em",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    mb: 2,
                  }}
                >
                                    {movie.title}               {" "}
                </Typography>
                               {" "}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                                   {" "}
                  <CalendarTodayIcon
                    sx={{ fontSize: 14, mr: 0.5, color: "#ccc" }}
                  />
                                   {" "}
                  <Typography variant="caption" color="#ccc">
                                        {formatReleaseDate(movie.releaseDate)} 
                                   {" "}
                  </Typography>
                                 {" "}
                </Box>
                               {" "}
                <Typography
                  variant="body2"
                  color="#bbb"
                  sx={{
                    fontSize: "0.85rem",
                    textAlign: "center",
                    mb: 1,
                    fontWeight: "500",
                  }}
                >
                                    {movie.genre || "Various Genres"}           
                     {" "}
                </Typography>
                             {" "}
              </Box>
                           {" "}
              {movie.recommendationReason && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    color: getEmotionColor(movie.emotionMatch),
                    fontStyle: "italic",
                    fontWeight: "bold",
                    mt: "auto",
                  }}
                >
                                    {movie.recommendationReason}               {" "}
                </Typography>
              )}
                         {" "}
            </CardContent>
                        {/* Watch Movie Button */}           {" "}
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "8px 16px",
                backgroundColor: "#1a1a1a",
                flexShrink: 0,
              }}
            >
                           {" "}
              <Button
                variant="contained"
                size="small"
                onClick={() => handleWatchMovie(movie)}
                sx={{
                  fontSize: "0.8rem",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#673AB7",
                  borderRadius: "20px",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#5E35B1",
                    transform: "scale(1.05)",
                  },
                }}
              >
                                🎬 Watch Movie              {" "}
              </Button>
                         {" "}
            </CardActions>
                        {/* Action Buttons */}           {" "}
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 16px",
                backgroundColor: "#1a1a1a",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                flexShrink: 0,
              }}
            >
                           {" "}
              <Tooltip title="Add to Watch Later">
                               {" "}
                <Button
                  size="small"
                  startIcon={<WatchLaterIcon />}
                  onClick={() => handleWatchLater(movie)}
                  disabled={loading}
                  sx={{
                    fontSize: "0.75rem",
                    color: "#007BFF",
                    textTransform: "none",
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "rgba(0, 123, 255, 0.1)",
                    },
                    "&:disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                                    {loading ? "..." : "Later"}               {" "}
                </Button>
                             {" "}
              </Tooltip>
                           {" "}
              <Tooltip title="Add to Favorites">
                               {" "}
                <Button
                  size="small"
                  startIcon={<FavoriteIcon />}
                  onClick={() => handleFavorite(movie)}
                  disabled={loading}
                  sx={{
                    fontSize: "0.75rem",
                    color: "#FF5722",
                    textTransform: "none",
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "rgba(255, 87, 34, 0.1)",
                    },
                    "&:disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                                    {loading ? "..." : "♡"}               {" "}
                </Button>
                             {" "}
              </Tooltip>
                           {" "}
              <Tooltip title="View movie details">
                               {" "}
                <Button
                  size="small"
                  startIcon={<InfoIcon />}
                  onClick={() => handleShowStory(movie)}
                  sx={{
                    fontSize: "0.75rem",
                    color: "#4CAF50",
                    textTransform: "none",
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                    },
                  }}
                >
                                    Info                {" "}
                </Button>
                             {" "}
              </Tooltip>
                         {" "}
            </CardActions>
                     {" "}
          </StyledCard>
        ))}
             {" "}
      </Box>
            {/* Movie Details Dialog */}     {" "}
      <Dialog
        open={openStory}
        onClose={handleCloseStory}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a1a",
            color: "white",
            borderRadius: "16px",
            maxHeight: "80vh",
          },
        }}
      >
               {" "}
        <DialogTitle
          sx={{
            backgroundColor: "#2a2a2a",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
          }}
        >
                   {" "}
          <Box>
                       {" "}
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
                            {selectedMovie?.title}           {" "}
            </Typography>
                       {" "}
            {selectedMovie?.releaseDate && (
              <Typography variant="subtitle2" color="#ccc">
                                Released:{" "}
                {formatReleaseDate(selectedMovie.releaseDate)}             {" "}
              </Typography>
            )}
                     {" "}
          </Box>
                   {" "}
          {selectedMovie?.rating && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                           {" "}
              <Rating
                value={selectedMovie.rating / 2}
                precision={0.1}
                readOnly
                size="small"
                sx={{ color: "#FFD700" }}
              />
                           {" "}
              <Typography variant="body2" color="#FFD700" fontWeight="bold">
                                {selectedMovie.rating.toFixed(1)}/10            
                 {" "}
              </Typography>
                         {" "}
            </Box>
          )}
                 {" "}
        </DialogTitle>
               {" "}
        <DialogContent sx={{ backgroundColor: "#1a1a1a", color: "white" }}>
                   {" "}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                       {" "}
            {selectedMovie?.posterUrl && (
              <Box sx={{ flexShrink: 0 }}>
                               {" "}
                <img
                  src={selectedMovie.posterUrl}
                  alt={selectedMovie.title}
                  style={{
                    width: "200px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  }}
                />
                             {" "}
              </Box>
            )}
                       {" "}
            <Box sx={{ flex: 1 }}>
                           {" "}
              {selectedMovie?.genre && (
                <Box sx={{ mb: 2 }}>
                                   {" "}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#4CAF50"
                    gutterBottom
                  >
                                        Genre                  {" "}
                  </Typography>
                                   {" "}
                  <Typography variant="body1">{selectedMovie.genre}</Typography>
                                 {" "}
                </Box>
              )}
                           {" "}
              {selectedMovie?.recommendationReason && (
                <Box sx={{ mb: 2 }}>
                                   {" "}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#FF9800"
                    gutterBottom
                  >
                                        Why This Movie?                  {" "}
                  </Typography>
                                   {" "}
                  <Chip
                    label={selectedMovie.recommendationReason}
                    sx={{
                      backgroundColor: getEmotionColor(
                        selectedMovie.emotionMatch
                      ),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                                 {" "}
                </Box>
              )}
                         {" "}
            </Box>
                     {" "}
          </Box>
                   {" "}
          {selectedMovie?.description && (
            <Box>
                           {" "}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="#E91E63"
                gutterBottom
              >
                                Synopsis              {" "}
              </Typography>
                           {" "}
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                {selectedMovie.description}             {" "}
              </Typography>
                         {" "}
            </Box>
          )}
                 {" "}
        </DialogContent>
               {" "}
        <DialogActions
          sx={{
            backgroundColor: "#2a2a2a",
            padding: "16px 24px",
            gap: 2,
          }}
        >
                   {" "}
          <Button
            onClick={() => handleWatchLater(selectedMovie)}
            variant="outlined"
            startIcon={<WatchLaterIcon />}
            disabled={loading}
            sx={{
              color: "#007BFF",
              borderColor: "#007BFF",
              "&:hover": {
                backgroundColor: "rgba(0,123,255,0.1)",
              },
            }}
          >
                        {loading ? "Adding..." : "Add to Watch Later"}         {" "}
          </Button>
                   {" "}
          <Button
            onClick={() => handleFavorite(selectedMovie)}
            variant="outlined"
            startIcon={<FavoriteIcon />}
            disabled={loading}
            sx={{
              color: "#FF5722",
              borderColor: "#FF5722",
              "&:hover": {
                backgroundColor: "rgba(255,87,34,0.1)",
              },
            }}
          >
                        {loading ? "Adding..." : "Add to Favorites"}         {" "}
          </Button>
                   {" "}
          <Button
            onClick={() => handleWatchMovie(selectedMovie)}
            variant="contained"
            sx={{
              backgroundColor: "#673AB7",
              "&:hover": {
                backgroundColor: "#5E35B1",
              },
            }}
          >
                        Watch Now          {" "}
          </Button>
                   {" "}
          <Button
            onClick={handleCloseStory}
            variant="outlined"
            sx={{
              color: "#ccc",
              borderColor: "#ccc",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
                        Close          {" "}
          </Button>
                 {" "}
        </DialogActions>
             {" "}
      </Dialog>
            {/* Snackbar for notifications */}     {" "}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
               {" "}
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
                    {snackbar.message}       {" "}
        </Alert>
             {" "}
      </Snackbar>
         {" "}
    </>
  );
};

export default RecommendedMovies;
