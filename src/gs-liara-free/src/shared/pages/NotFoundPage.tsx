import {
  faArrowLeft,
  faGhost,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { keyframes, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

// 1. Define animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const shadowPulse = keyframes`
  0% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(0.8); opacity: 0.1; }
  100% { transform: scale(1); opacity: 0.2; }
`;

export default function NotFoundPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Stack
      sx={{ flex: "auto", alignItems: "center", justifyContent: "center" }}
    >
      {/* 2. Ghost Icon & Shadow */}
      <Box sx={{ position: "relative", mb: 4 }}>
        {/* The Ghost Icon */}
        <Box
          sx={{
            animation: `${float} 3s ease-in-out infinite`,
            // Logic to color the ghost based on theme
            color: theme.palette.mode === "dark" ? "primary.main" : "grey.300",
            // Make the icon large
            fontSize: { xs: "8rem", sm: "10rem" },
            lineHeight: 1,
          }}
        >
          <FontAwesomeIcon icon={faGhost} />
        </Box>

        {/* The Shadow */}
        <Box
          sx={{
            width: 120,
            height: 15,
            bgcolor: "text.secondary",
            borderRadius: "50%",
            mx: "auto",
            animation: `${shadowPulse} 3s ease-in-out infinite`,
          }}
        />
      </Box>

      {/* 3. Text Content */}
      <Typography
        variant="h1"
        fontWeight="bold"
        color="primary"
        sx={{ fontSize: { xs: "4rem", sm: "6rem" } }}
      >
        404
      </Typography>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
        Page Not Found
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        Oops! It looks like you've stumbled into the void. The page you are
        looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </Typography>

      {/* 4. Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          onClick={() => navigate(-1)}
          size="large"
        >
          <span className="text-box-trim">Go Back</span>
        </Button>
        <Button
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faHome} />}
          onClick={() => navigate("/")}
          size="large"
          disableElevation
        >
          <span className="text-box-trim">Back to Home</span>
        </Button>
      </Box>
    </Stack>
  );
}
