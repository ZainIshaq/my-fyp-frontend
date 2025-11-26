import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CameraAlt from "@mui/icons-material/CameraAlt";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const UserProfileDialog = ({ open, onClose }) => {
  const navigate = useNavigate(); // Initialize useNavigate



  const handleLogout = () => {
    // Clear user data or call logout API
    console.log("User logged out");

    // Navigate to the /logout route
    navigate("/");

    // Close the dialog after logout
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Log out</DialogTitle>
      <DialogContent>
    
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleLogout}
          sx={{ marginTop: 2 }}
        >
          Logout
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;