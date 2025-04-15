// import { Box } from "@mui/material";

// const getAQIStatus = (aqiValue) => {
//   const aqiData = {
//     1: { status: "Good", color: "#4caf50", imageName: "1.png" },
//     2: { status: "Moderate", color: "#ffeb3b", imageName: "2.png" },
//     3: { status: "Satisfactory", color: "#ff9800", imageName: "3.png" },
//     4: { status: "Poor", color: "#f44336", imageName: "4.png" },
//     5: { status: "Very Poor", color: "#e53935", imageName: "5.png" },
//     6: { status: "Severe", color: "#d32f2f", imageName: "6.png" },
//   };

//   const defaultStatus = {
//     status: "Unknown",
//     color: "#9e9e9e",
//     imageName: "7.png",
//   };

//   const status = aqiData[aqiValue] || defaultStatus;

//   return {
//     status: status.status,
//     emoji: (
//       <Box
//         component="img"
//         src={`/assets/${status.imageName}`}
//         alt="Styled Image"
//         sx={{
//           height: "10rem",
//           maxWidth: 400,
//           borderRadius: "16px",
//           objectFit: "cover",
//         }}
//       />
//     ),
//     color: status.color,
//   };
// };

// export default getAQIStatus;

import { Box } from "@mui/material";

/**
 * AQI level mapping based on value ranges.
 * Each level includes a label, color, and emoji image filename.
 */
const AQI_LEVELS = {
  1: { label: "Good", color: "#4caf50", image: "1.png" },
  2: { label: "Moderate", color: "#ffeb3b", image: "2.png" },
  3: { label: "Satisfactory", color: "#ff9800", image: "3.png" },
  4: { label: "Poor", color: "#f44336", image: "4.png" },
  5: { label: "Very Poor", color: "#e53935", image: "5.png" },
  6: { label: "Severe", color: "#d32f2f", image: "6.png" },
};

/**
 * Default fallback status for unrecognized AQI values.
 */
const DEFAULT_AQI_STATUS = {
  label: "Unknown",
  color: "#9e9e9e",
  image: "7.png",
};

/**
 * Returns the AQI status object containing:
 * - status: human-readable label
 * - emoji: JSX image component for display
 * - color: associated status color
 *
 * @param {number} aqiValue - AQI index value (1 to 6)
 * @returns {Object} status info for given AQI level
 */
const getAQIStatus = (aqiValue) => {
  // ─── State Management ─────────────────────────────────────────────

  const { label, color, image } = AQI_LEVELS[aqiValue] || DEFAULT_AQI_STATUS;

  return {
    status: label,
    color,
    emoji: (
      <Box
        component="img"
        src={`/assets/${image}`}
        alt={label}
        sx={{
          height: "10rem",
          maxWidth: "25rem",
          borderRadius: "16px",
          objectFit: "cover",
        }}
      />
    ),
  };
};

export default getAQIStatus;
