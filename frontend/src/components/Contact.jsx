import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { useContactMessageMutation } from "../redux/api/orderApiSlice";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const [contactMessage] = useContactMessageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await contactMessage(formData).unwrap();
      if (res.success) {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message. Please try again later.");
      }
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Email Error:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // background: "linear-gradient(135deg,rgb(222, 212, 233),rgb(126, 168, 240))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 15,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: "black",
            fontWeight: "bold",
            mb: 4,
            textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Contact Us
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Contact Details */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "#fff",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Get in Touch
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "gray" }}>
                Have any questions? Reach out via phone, email, or the contact
                form.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body1">
                  <FaPhone style={{ color: "#6a11cb", marginRight: 8 }} />
                  +91 8986397619
                </Typography>
                <Typography variant="body1">
                  <FaEnvelope style={{ color: "#2575fc", marginRight: 8 }} />
                  support@rentease.com
                </Typography>
                <Typography variant="body1">
                  <FaMapMarkerAlt style={{ color: "red", marginRight: 8 }} />
                  Patna, Bihar, India
                </Typography>
              </Box>

              {/* Social Icons */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <FaFacebook
                    size={28}
                    style={{
                      color: "#1877f2",
                      transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "#0d47a1")}
                    onMouseOut={(e) => (e.target.style.color = "#1877f2")}
                  />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram
                    size={28}
                    style={{
                      color: "#e1306c",
                      transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "#b71c1c")}
                    onMouseOut={(e) => (e.target.style.color = "#e1306c")}
                  />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                  <FaLinkedin
                    size={28}
                    style={{
                      color: "#0e76a8",
                      transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "#003b5c")}
                    onMouseOut={(e) => (e.target.style.color = "#0e76a8")}
                  />
                </a>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={6}
              sx={{ p: 4, borderRadius: 3, background: "#fff" }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Send a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{ mb: 3 }}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  error={!!errors.message}
                  helperText={errors.message}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "#6a11cb",
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    py: 1.5,
                    transition: "0.3s",
                    "&:hover": {
                      bgcolor: "#4a0f9c",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Google Map */}
          <Grid item xs={12}>
            <Box sx={{ overflow: "hidden", borderRadius: 3, mt: 4 }}>
              <iframe
                title="Google Map"
                width="100%"
                height="350"
                style={{ borderRadius: "10px" }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8861645226197!2d85.13756431445584!3d25.59409432168639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398db18c72b7b50d%3A0x103bfe6c7587f9d5!2sPatna%2C%20Bihar%2C%20India!5e0!3m2!1sen!2sin!4v1620897007367!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
