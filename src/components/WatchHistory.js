import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/system";
import { IoClose, IoTime, IoPlay, IoBookmark } from "react-icons/io5";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxWidth: "1200px",
    width: "90%",
    maxHeight: "90vh",
    margin: "16px"
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)"
  }
}));

const MovieCard = styled(CardMedia)({
  height: 200,
  backgroundSize: "cover"
});

const ActionButton = styled(Button)({
  margin: "4px",
  borderRadius: "20px"
});

const WatchHistory = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const mockMovies = [
    {
      id: 1,
      title: "Inception",
      thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
      watchedAt: "2024-01-15T10:30:00",
      duration: "2h 28min",
      genres: ["Sci-Fi", "Action"],
    },
    {
      id: 2,
      title: "The Dark Knight",
      thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
      watchedAt: "2024-01-14T15:45:00",
      duration: "2h 32min",
      genres: ["Action", "Crime", "Drama"],
    },
    {
      id: 3,
      title: "Interstellar",
      thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
      watchedAt: "2024-01-13T20:15:00",
      duration: "2h 49min",
      genres: ["Sci-Fi", "Adventure"],
    },
    {
      id: 4,
      title: "Pulp Fiction",
      thumbnail: "https://images.unsplash.com/photo-1542204165-65bf26472b9b",
      watchedAt: "2024-01-12T18:20:00",
      duration: "2h 34min",
      genres: ["Crime", "Drama"],
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <StyledDialog
      open={isVisible}
      onClose={onClose}
      aria-labelledby="watch-history-dialog"
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Watch History</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: "grey.500" }}
        >
          <IoClose />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {mockMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <StyledCard>
                <MovieCard
                  image={movie.thumbnail}
                  title={movie.title}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728";
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
                    {movie.genres.map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <IoTime style={{ verticalAlign: "middle" }} /> {formatDate(movie.watchedAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Duration: {movie.duration}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <ActionButton
                      variant="contained"
                      size="small"
                      startIcon={<IoPlay />}
                    >
                      Watch
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      size="small"
                      startIcon={<IoBookmark />}
                    >
                      Watch Later
                    </ActionButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </StyledDialog>
  );
};

export default WatchHistory;
