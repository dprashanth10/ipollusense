import { Box } from "@mui/material";

const getAQIStatus = (aqiValue) => {
  const aqiData = {
    1: { status: "Good", color: "#4caf50", imageName: "1.png" },
    2: { status: "Moderate", color: "#ffeb3b", imageName: "2.png" },
    3: { status: "Satisfactory", color: "#ff9800", imageName: "3.png" },
    4: { status: "Poor", color: "#f44336", imageName: "4.png" },
    5: { status: "Very Poor", color: "#e53935", imageName: "5.png" },
    6: { status: "Severe", color: "#d32f2f", imageName: "6.png" },
  };

  const defaultStatus = {
    status: "Unknown",
    color: "#9e9e9e",
    imageName: "7.png",
  };

  const status = aqiData[aqiValue] || defaultStatus;

  return {
    status: status.status,
    emoji: (
      <Box
        component="img"
        src={`/assets/${status.imageName}`}
        alt="Styled Image"
        sx={{
          height: "10rem",
          maxWidth: 400,
          borderRadius: "16px",
          objectFit: "cover",
        }}
      />
    ),
    color: status.color,
  };
};

export default getAQIStatus;
