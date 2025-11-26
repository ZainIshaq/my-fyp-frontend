import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  Avatar,
  Fab,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Tooltip,
  Badge,
  Collapse,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import { FaRobot, FaUser, FaHeart, FaClock, FaPlay } from 'react-icons/fa';
import { IoSend, IoRefresh, IoClose } from 'react-icons/io5';
import { MdEmojiEmotions, MdMovie, MdStar } from 'react-icons/md';
import axios from 'axios';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  backgroundColor: '#673AB7',
  color: 'white',
  zIndex: 1300,
  '&:hover': {
    backgroundColor: '#5E35B1',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 24px rgba(103, 58, 183, 0.4)',
}));

const ChatWindow = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 450,
    height: '80vh',
    maxHeight: 700,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    color: 'white',
  },
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: '16px',
  backgroundColor: '#1a1a1a',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#2a2a2a',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#673AB7',
    borderRadius: '3px',
  },
}));

const MessageBubble = styled(Paper)(({ isBot }) => ({
  padding: '12px 16px',
  borderRadius: isBot ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
  maxWidth: '85%',
  marginBottom: 12,
  backgroundColor: isBot ? '#2a2a2a' : '#673AB7',
  color: 'white',
  marginLeft: isBot ? 0 : 'auto',
  marginRight: isBot ? 'auto' : 0,
  position: 'relative',
  wordBreak: 'break-word',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: '16px',
  backgroundColor: '#2a2a2a',
  borderTop: '1px solid #404040',
}));

const HeaderContainer = styled(Box)({
  padding: '16px',
  backgroundColor: '#673AB7',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
});

const SuggestionChip = styled(Chip)({
  margin: '4px',
  backgroundColor: '#404040',
  color: 'white',
  fontSize: '0.75rem',
  '&:hover': {
    backgroundColor: '#673AB7',
  },
  cursor: 'pointer',
});

const RecommendChip = styled(Chip)({
  margin: '4px',
  backgroundColor: '#673AB7',
  color: 'white',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#5E35B1',
    transform: 'scale(1.05)',
  },
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(103, 58, 183, 0.3)',
});

const MovieCard = styled(Card)({
  backgroundColor: '#2a2a2a',
  color: 'white',
  margin: '8px 0',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #404040',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(103, 58, 183, 0.3)',
  },
});

const MoviePopup = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: 16,
    maxWidth: '90vw',
    maxHeight: '90vh',
    width: '800px',
  },
}));

const Chatbot = ({ emotionData, hasCamera, currentEmotions }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendationPopup, setShowRecommendationPopup] = useState(false);
  const [hasNewRecommendations, setHasNewRecommendations] = useState(false);
  const [conversationState, setConversationState] = useState('');
  const [error, setError] = useState('');
  const [lastRecommendationRequest, setLastRecommendationRequest] =
    useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/users`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, recommendations]);

  useEffect(() => {
    if (open && chatHistory.length === 0) {
      // Only initialize if we don't already have chat history
      const welcomeMessage = {
        text: "Hi there! 🎬 I'm your AI movie assistant. I can recommend movies based on your emotions and preferences!\n\nTo get started, tell me what kind of movies you're in the mood for, or just say 'recommend' and I'll analyze your current emotions!",
        isBot: true,
        timestamp: Date.now(),
        hasEmotionData: !!emotionData,
      };

      setChatHistory([welcomeMessage]);
      setSuggestions([
        'Comedy movies',
        'Action films',
        'Romance',
        'Horror',
        'Sci-Fi',
        'Recommend now',
      ]);
    }
  }, [open]);

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const initializeChat = () => {
    // Only initialize if chat history is completely empty
    if (chatHistory.length === 0) {
      const welcomeMessage = {
        text: "Hi there! 🎬 I'm your AI movie assistant. I can recommend movies based on your emotions and preferences!\n\nTo get started, tell me what kind of movies you're in the mood for, or just say 'recommend' and I'll analyze your current emotions!",
        isBot: true,
        timestamp: Date.now(),
        hasEmotionData: !!emotionData,
      };

      setChatHistory([welcomeMessage]);
      setSuggestions([
        'Comedy movies',
        'Action films',
        'Romance',
        'Horror',
        'Sci-Fi',
        'Recommend now',
      ]);
    }
  };

  const handleToggle = () => {
    setOpen(!open);
    if (!open) {
      setError('');
      setHasNewRecommendations(false);
    }
  };

  const sendMessage = async (messageText = message) => {
    if (!messageText.trim() || loading) return; // Prevent sending if already loading

    const userMessage = {
      text: messageText,
      isBot: false,
      timestamp: Date.now(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
    setError('');

    try {
      const token = getAuthToken();

      // Add timestamp to ensure different requests
      const requestData = {
        message: messageText,
        conversationId: conversationId,
        requestId: Date.now(), // Add unique request ID
        lastRequest: lastRecommendationRequest,
        emotionData: {
          currentEmotions: currentEmotions,
          dominantEmotion: emotionData?.dominantEmotion,
          hasCamera: hasCamera,
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/chat/message`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success && response.data.response) {
        const botMessage = {
          text: response.data.response,
          isBot: true,
          timestamp: Date.now(),
          hasRecommendations: response.data.recommendations?.length > 0,
        };

        setChatHistory((prev) => [...prev, botMessage]);
        setConversationId(response.data.conversationId);
        setSuggestions(response.data.suggestionChips || []);
        setUserPreferences(response.data.userPreferences || {});
        setConversationState(response.data.conversationState);

        if (response.data.recommendations?.length > 0) {
          setRecommendations(response.data.recommendations);
          setShowRecommendationPopup(true);
          setHasNewRecommendations(true);
          setLastRecommendationRequest(messageText); // Track last request
        }
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.response?.data?.message || 'Failed to send message');

      const errorMessage = {
        text: "Sorry, I'm having trouble right now. Please try again in a moment! 🔧",
        isBot: true,
        timestamp: Date.now(),
        isError: true,
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Prevent rapid clicking of the same suggestion
    if (loading || lastRecommendationRequest === suggestion) return;
    sendMessage(suggestion);
  };

  const resetConversation = async () => {
    try {
      const token = getAuthToken();

      await axios.post(
        `${API_BASE_URL}/chat/reset`,
        {
          conversationId: conversationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Clear all state
      setChatHistory([]);
      setRecommendations([]);
      setShowRecommendationPopup(false);
      setUserPreferences({});
      setConversationId('');
      setSuggestions([]);
      setHasNewRecommendations(false);

      // Initialize fresh chat
      setTimeout(() => {
        initializeChat();
      }, 100);
    } catch (error) {
      console.error('Error resetting conversation:', error);
    }
  };

  const handleWatchMovie = (movie) => {
    if (movie.movieLink) {
      window.open(movie.movieLink, '_blank');
    } else {
      const searchQuery = encodeURIComponent(movie.title);
      window.open(
        `https://www.google.com/search?q=${searchQuery}+watch+online`,
        '_blank'
      );
    }
  };

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      happy: '#4CAF50',
      sad: '#2196F3',
      angry: '#F44336',
      surprised: '#FF9800',
      fearful: '#9C27B0',
      disgusted: '#795548',
      neutral: '#9E9E9E',
      trending: '#E91E63',
      preference: '#673AB7',
    };
    return emotionColors[emotion] || '#9E9E9E';
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <>
      <StyledFab
        color="primary"
        onClick={handleToggle}
        aria-label="AI Movie Assistant"
      >
        <Badge badgeContent={hasNewRecommendations ? '!' : null} color="error">
          <FaRobot size={24} />
        </Badge>
      </StyledFab>

      <ChatWindow open={open} onClose={handleToggle}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <HeaderContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ backgroundColor: '#ffffff' }}>
                <FaRobot color="#673AB7" />
              </Avatar>
              <Box>
                <Typography variant="h6">AI Movie Assistant</Typography>
                {hasCamera && (
                  <Typography
                    variant="caption"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <MdEmojiEmotions size={12} />
                    Emotion Detection Active
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Reset conversation">
                <IconButton
                  onClick={resetConversation}
                  sx={{ color: 'white' }}
                  size="small"
                >
                  <IoRefresh />
                </IconButton>
              </Tooltip>
              <IconButton
                onClick={handleToggle}
                sx={{ color: 'white' }}
                size="small"
              >
                <IoClose />
              </IconButton>
            </Box>
          </HeaderContainer>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          {/* Messages */}
          <MessageContainer>
            <List>
              {chatHistory.map((chat, index) => (
                <ListItem key={index} sx={{ display: 'block', p: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      flexDirection: chat.isBot ? 'row' : 'row-reverse',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: chat.isBot ? '#673AB7' : '#404040',
                        mt: 1,
                      }}
                    >
                      {chat.isBot ? (
                        <FaRobot size={16} />
                      ) : (
                        <FaUser size={16} />
                      )}
                    </Avatar>
                    <MessageBubble isBot={chat.isBot}>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {chat.text}
                      </Typography>
                      {chat.timestamp && (
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            fontSize: '0.65rem',
                            display: 'block',
                            mt: 0.5,
                          }}
                        >
                          {new Date(chat.timestamp).toLocaleTimeString()}
                        </Typography>
                      )}
                      {chat.hasRecommendations &&
                        recommendations.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => setShowRecommendationPopup(true)}
                              sx={{
                                backgroundColor: '#673AB7',
                                color: 'white',
                                '&:hover': { backgroundColor: '#5E35B1' },
                              }}
                            >
                              🎬 View Recommendations ({recommendations.length})
                            </Button>
                          </Box>
                        )}
                    </MessageBubble>
                  </Box>
                </ListItem>
              ))}

              {/* Loading indicator */}
              {loading && (
                <ListItem sx={{ display: 'block', p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{ width: 32, height: 32, backgroundColor: '#673AB7' }}
                    >
                      <FaRobot size={16} />
                    </Avatar>
                    <MessageBubble isBot={true}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <CircularProgress size={16} color="inherit" />
                        <Typography>Thinking...</Typography>
                      </Box>
                    </MessageBubble>
                  </Box>
                </ListItem>
              )}
            </List>
            <div ref={messagesEndRef} />
          </MessageContainer>

          {/* Suggestion Chips */}
          {suggestions.length > 0 && (
            <Box
              sx={{
                p: 2,
                backgroundColor: '#2a2a2a',
                borderTop: '1px solid #404040',
                flexShrink: 0,
              }}
            >
              <Typography
                variant="caption"
                color="#ccc"
                sx={{ mb: 1, display: 'block' }}
              >
                Quick suggestions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {suggestions.map((suggestion, index) => {
                  const isRecommendButton = suggestion
                    .toLowerCase()
                    .includes('recommend');
                  const ChipComponent = isRecommendButton
                    ? RecommendChip
                    : SuggestionChip;

                  return (
                    <ChipComponent
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {/* User Preferences Display */}
          {Object.keys(userPreferences).length > 0 && (
            <Box
              sx={{
                p: 2,
                backgroundColor: '#1a1a1a',
                borderTop: '1px solid #404040',
                flexShrink: 0,
              }}
            >
              <Typography
                variant="caption"
                color="#ccc"
                sx={{ mb: 1, display: 'block' }}
              >
                Your preferences:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {Object.entries(userPreferences).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${
                      Array.isArray(value) ? value.join(', ') : value
                    }`}
                    size="small"
                    sx={{
                      backgroundColor: '#404040',
                      color: 'white',
                      fontSize: '0.65rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input Container */}
          <InputContainer>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                ref={inputRef}
                fullWidth
                multiline
                maxRows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about movies or tell me your preferences..."
                variant="outlined"
                size="small"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#404040',
                    color: 'white',
                    '& fieldset': { borderColor: '#673AB7' },
                    '&:hover fieldset': { borderColor: '#673AB7' },
                    '&.Mui-focused fieldset': { borderColor: '#673AB7' },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#ccc',
                    opacity: 1,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={() => sendMessage()}
                disabled={!message.trim() || loading}
                sx={{
                  backgroundColor: '#673AB7',
                  color: 'white',
                  '&:hover': { backgroundColor: '#5E35B1' },
                  '&:disabled': { backgroundColor: '#404040', color: '#666' },
                }}
              >
                <IoSend />
              </IconButton>
            </Box>

            {/* Emotion Status */}
            {hasCamera && currentEmotions && (
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '0.75rem',
                  color: '#ccc',
                }}
              >
                <MdEmojiEmotions size={14} />
                <Typography variant="caption">
                  Current emotion:{' '}
                  {Object.entries(currentEmotions)
                    .filter(([emotion]) => emotion !== 'neutral')
                    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral'}
                </Typography>
              </Box>
            )}
          </InputContainer>
        </Box>
      </ChatWindow>

      {/* Movie Recommendations Popup */}
      <MoviePopup
        open={showRecommendationPopup}
        onClose={() => setShowRecommendationPopup(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: '#673AB7',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MdMovie size={24} />
            <Typography variant="h6">AI Movie Recommendations</Typography>
          </Box>
          <IconButton
            onClick={() => setShowRecommendationPopup(false)}
            sx={{ color: 'white' }}
          >
            <IoClose />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: '#1a1a1a', p: 3 }}>
          {recommendations.length > 0 ? (
            <Grid container spacing={3}>
              {recommendations.map((movie, index) => (
                <Grid item xs={12} sm={6} md={4} key={movie.id || index}>
                  <MovieCard sx={{ height: '100%' }}>
                    {movie.posterUrl && (
                      <CardMedia
                        component="img"
                        height="300"
                        image={movie.posterUrl}
                        alt={movie.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      >
                        {movie.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <MdStar color="#FFD700" size={16} />
                        <Typography variant="body2">
                          {movie.rating?.toFixed(1) || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="#ccc">
                          ({formatReleaseDate(movie.releaseDate)})
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="#bbb" sx={{ mb: 1 }}>
                        {movie.genre
                          ?.replace(/\d+/g, '')
                          .replace(/,\s*,/g, ',')
                          .replace(/^,|,$/g, '') || 'Various Genres'}
                      </Typography>
                      {movie.recommendationReason && (
                        <Chip
                          label={movie.recommendationReason}
                          size="small"
                          sx={{
                            backgroundColor: getEmotionColor(
                              movie.emotionMatch
                            ),
                            color: 'white',
                            fontSize: '0.75rem',
                            mb: 1,
                          }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4,
                        }}
                      >
                        {movie.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleWatchMovie(movie)}
                        sx={{
                          backgroundColor: '#673AB7',
                          '&:hover': { backgroundColor: '#5E35B1' },
                        }}
                      >
                        <FaPlay size={14} style={{ marginRight: 8 }} />
                        Watch Movie
                      </Button>
                    </CardActions>
                  </MovieCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="#ccc">
                No recommendations available
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ backgroundColor: '#2a2a2a', p: 2, gap: 1 }}>
          <Button
            onClick={() => setShowRecommendationPopup(false)}
            sx={{ color: 'white' }}
          >
            Close
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setShowRecommendationPopup(false);
              sendMessage('Show me similar movies');
            }}
            sx={{
              color: '#673AB7',
              borderColor: '#673AB7',
              '&:hover': { backgroundColor: 'rgba(103, 58, 183, 0.1)' },
            }}
          >
            More Similar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowRecommendationPopup(false);
              sendMessage('Show me different movies');
            }}
            sx={{
              backgroundColor: '#673AB7',
              '&:hover': { backgroundColor: '#5E35B1' },
            }}
          >
            Different Movies
          </Button>
        </DialogActions>
      </MoviePopup>
    </>
  );
};

export default Chatbot;
