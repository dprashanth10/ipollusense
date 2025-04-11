// import React, { useState, useMemo, useCallback } from "react";
// import {
//   Typography,
//   Box,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
// } from "@mui/material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import { CircularProgress } from "@mui/material";

// const GraphWithFeatureSelection = ({ data }) => {
//   const allFeatures = useMemo(
//     () => [
//       { key: "pm2_5", label: "PM2.5", color: "#FF5733" },
//       { key: "pm10", label: "PM10", color: "#33FF57" },
//       { key: "pm1", label: "PM1", color: "#3357FF" },
//       { key: "temperature", label: "Temperature", color: "#FFC300" },
//       { key: "humidity", label: "Humidity", color: "#DAF7A6" },
//       { key: "co", label: "CO", color: "#C70039" },
//       { key: "voc", label: "VOC", color: "#900C3F" },
//       { key: "co2", label: "CO2", color: "#581845" },
//       { key: "aqi_calc", label: "AQI (Calculated)", color: "#FF33FF" },
//       { key: "aqi_pred", label: "AQI (Predicted)", color: "#33FFFF" },
//     ],
//     []
//   );

//   const [selectedFeatures, setSelectedFeatures] = useState(["pm2_5", "pm10"]);

//   const handleFeatureToggle = useCallback((key) => {
//     setSelectedFeatures((prev) =>
//       prev.includes(key)
//         ? prev.filter((feature) => feature !== key)
//         : [...prev, key]
//     );
//   }, []);

//   const formatTooltipValue = useCallback((value) => {
//     return value !== null && value !== undefined ? value.toFixed(2) : "N/A";
//   }, []);

//   const scaledData = useMemo(() => {
//     if (data.length === 0) return [];

//     const featureMinMax = selectedFeatures.reduce((acc, feature) => {
//       const values = data.map((item) => item[feature]);
//       acc[feature] = {
//         min: Math.min(...values),
//         max: Math.max(...values),
//       };
//       return acc;
//     }, {});

//     return data.map((item) => {
//       const scaledItem = { ...item };
//       selectedFeatures.forEach((feature) => {
//         const { min, max } = featureMinMax[feature];
//         if (min === max) {
//           scaledItem[feature] = 0.5;
//         } else {
//           scaledItem[feature] = (item[feature] - min) / (max - min);
//         }
//       });
//       return {
//         ...scaledItem,
//         timestamp: new Date(item.createdAt)
//           .toISOString()
//           .slice(0, 19)
//           .split("T")
//           .join(" "), // Extract YYYY-MM-DD
//       };
//     });
//   }, [data, selectedFeatures]);

//   console.log("data:- ", data);
//   console.log("Selected Features:- ", selectedFeatures);

//   return (
//     <Box sx={{ width: "98%", textAlign: "center", p: "10px" }}>
//       {/* Graph Title */}
//       <Typography
//         variant="h4"
//         sx={{
//           color: "#1976d2",
//           fontWeight: "bold",
//           mb: 3,
//           textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
//         }}
//       >
//         iPolluSense Dynamic Sensor Data Graph
//       </Typography>

//       {/* Checkbox List for Features */}
//       <FormGroup row sx={{ justifyContent: "center", mb: 3 }}>
//         {allFeatures.map((feature) => (
//           <FormControlLabel
//             key={feature.key}
//             control={
//               <Checkbox
//                 checked={selectedFeatures.includes(feature.key)}
//                 onChange={() => handleFeatureToggle(feature.key)}
//                 sx={{
//                   color: feature.color,
//                   "&.Mui-checked": { color: feature.color },
//                 }}
//               />
//             }
//             label={
//               <span style={{ color: feature.color, fontWeight: "bold" }}>
//                 {feature.label}
//               </span>
//             }
//             sx={{ marginRight: "20px" }}
//           />
//         ))}
//       </FormGroup>

//       {/* Loading Spinner */}
//       {data.length === 0 ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           {/* Line Chart */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               p: 2,
//               borderRadius: "10px",
//               boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
//               background: "#b1d6b7",
//             }}
//           >
//             <ResponsiveContainer width="100%" height={500}>
//               <LineChart
//                 data={scaledData}
//                 margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
//                 style={{ backgroundColor: "#b1d6b7" }}
//               >
//                 <defs>
//                   {allFeatures.map((feature) => (
//                     <linearGradient
//                       key={feature.key}
//                       id={feature.key}
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="5%"
//                         stopColor={feature.color}
//                         stopOpacity={0.8}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor={feature.color}
//                         stopOpacity={0.3}
//                       />
//                     </linearGradient>
//                   ))}
//                 </defs>
//                 <XAxis
//                   dataKey="timestamp" // Use timestamp for x-axis
//                   tick={{ fill: "#555", fontWeight: "bold" }}
//                   angle={-45} // Optional: Rotate labels if timestamps are long
//                   textAnchor="end"
//                   interval={0} // Show all ticks
//                 />
//                 <YAxis
//                   tick={{ fill: "#555", fontWeight: "bold" }}
//                   tickFormatter={(value) => value.toFixed(2)}
//                   domain={[0, 1]} // Set Y-axis domain from 0 to 1
//                 />
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#00796b",
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                   }}
//                   itemStyle={{ fontWeight: "bold", color: "#333" }}
//                   formatter={formatTooltipValue}
//                 />
//                 <Legend
//                   wrapperStyle={{
//                     bottom: -10,
//                     fontWeight: "bold",
//                     color: "#555",
//                   }}
//                 />
//                 {allFeatures
//                   .filter((feature) => selectedFeatures.includes(feature.key))
//                   .map((feature) => (
//                     <Line
//                       key={feature.key}
//                       type="monotone"
//                       dataKey={feature.key}
//                       stroke={`url(#${feature.key})`}
//                       strokeWidth={3}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                       name={feature.label}
//                     />
//                   ))}
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default GraphWithFeatureSelection;

// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import {
//   Typography,
//   Box,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
// } from "@mui/material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import { CircularProgress } from "@mui/material";

// const GraphWithFeatureSelection = ({ data }) => {
//   const allFeatures = useMemo(
//     () => [
//       { key: "pm2_5", label: "PM2.5", color: "#FF5733" },
//       { key: "pm10", label: "PM10", color: "#079220" },
//       { key: "pm1", label: "PM1", color: "#3357FF" },
//       { key: "temperature", label: "Temperature", color: "#D4A302" },
//       { key: "humidity", label: "Humidity", color: "#3C5D01" },
//       { key: "co", label: "CO", color: "#C70039" },
//       { key: "voc", label: "VOC", color: "#900C3F" },
//       { key: "co2", label: "CO2", color: "#581845" },
//       { key: "aqi_calc", label: "AQI (Calculated)", color: "#FF33FF" },
//       { key: "aqi_pred", label: "AQI (Predicted)", color: "#007979" },
//     ],
//     []
//   );

//   const [selectedFeatures, setSelectedFeatures] = useState(["pm2_5", "pm10"]);
//   const [originalData, setOriginalData] = useState([]);

//   useEffect(() => {
//     setOriginalData(data);
//   }, [data]);

//   const handleFeatureToggle = useCallback((key) => {
//     setSelectedFeatures((prev) =>
//       prev.includes(key)
//         ? prev.filter((feature) => feature !== key)
//         : [...prev, key]
//     );
//   }, []);

//   // const formatTooltipValue = useCallback(
//   //   (value, name, props) => {
//   //     console.log("props:- ", props);

//   //     const originalItem = originalData[0];
//   //     console.log("originalItem:- ", originalItem);
//   //     console.log("originalItem DataKey:- ", originalItem[props.dataKey]);

//   //     if (originalItem && originalItem[props.dataKey] !== undefined) {
//   //       console.log("Original Item:- ", originalItem);
//   //       const originalValue = originalItem[props.dataKey];
//   //       console.log("Original Value:- ", originalValue);

//   //       return originalValue !== null && originalValue !== undefined
//   //         ? originalValue.toFixed(2)
//   //         : "N/A";
//   //     }
//   //     return "N/A";
//   //   },
//   //   [originalData]
//   // );
//   const formatTooltipValue = useCallback(
//     (value, name, props) => {
//       const originalItem = props.payload; // This is the hovered data object

//       if (!originalItem) return "N/A";

//       // Find the index of the hovered item in the original data
//       const index = originalData.findIndex(
//         (item) => item.createdAt === originalItem.createdAt
//       );

//       if (index !== -1 && originalData[index][props.dataKey] !== undefined) {
//         return originalData[index][props.dataKey] !== null
//           ? originalData[index][props.dataKey].toFixed(2)
//           : "N/A";
//       }

//       return "N/A";
//     },
//     [originalData]
//   );

//   const scaledData = useMemo(() => {
//     if (data.length === 0) return [];

//     // Sort the data by the createdAt field
//     const sortedData = [...data].sort(
//       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//     );

//     const featureMinMax = selectedFeatures.reduce((acc, feature) => {
//       const values = sortedData.map((item) => item[feature]);
//       acc[feature] = {
//         min: Math.min(...values),
//         max: Math.max(...values),
//       };
//       return acc;
//     }, {});

//     return sortedData.map((item) => {
//       const scaledItem = { ...item };
//       selectedFeatures.forEach((feature) => {
//         const { min, max } = featureMinMax[feature];
//         if (min === max) {
//           scaledItem[feature] = 0.5;
//         } else {
//           scaledItem[feature] = (item[feature] - min) / (max - min);
//         }
//       });
//       // return {
//       //   ...scaledItem,
//       //   timestamp: new Date(item.createdAt)
//       //     .toISOString()
//       //     .slice(0, 19)
//       //     .split("T")
//       //     .join(" "), // Extract YYYY-MM-DD
//       // };
//       return scaledItem;
//     });
//   }, [data, selectedFeatures]);

//   console.log("data:- ", data);
//   console.log("Selected Features:- ", scaledData);

//   return (
//     <Box sx={{ width: "98%", textAlign: "center", p: "10px" }}>
//       {/* Graph Title */}
//       <Typography
//         variant="h4"
//         sx={{
//           color: "#1976d2",
//           fontWeight: "bold",
//           mb: 3,
//           textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
//         }}
//       >
//         iPolluSense Dynamic Sensor Data Graph
//       </Typography>

//       {/* Checkbox List for Features */}
//       <FormGroup row sx={{ justifyContent: "center", mb: 3 }}>
//         {allFeatures.map((feature) => (
//           <FormControlLabel
//             key={feature.key}
//             control={
//               <Checkbox
//                 checked={selectedFeatures.includes(feature.key)}
//                 onChange={() => handleFeatureToggle(feature.key)}
//                 sx={{
//                   color: feature.color,
//                   "&.Mui-checked": { color: feature.color },
//                 }}
//               />
//             }
//             label={
//               <span style={{ color: feature.color, fontWeight: "bold" }}>
//                 {feature.label}
//               </span>
//             }
//             sx={{ marginRight: "20px" }}
//           />
//         ))}
//       </FormGroup>

//       {/* Loading Spinner */}
//       {data.length === 0 ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           {/* Line Chart */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               p: 2,
//               borderRadius: "10px",
//               boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
//               background: "aliceblue",
//             }}
//           >
//             <ResponsiveContainer width="100%" height={500}>
//               <LineChart
//                 data={scaledData}
//                 margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
//                 style={{ backgroundColor: "aliceblue" }}
//               >
//                 <defs>
//                   {allFeatures.map((feature) => (
//                     <linearGradient
//                       key={feature.key}
//                       id={feature.key}
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="5%"
//                         stopColor={feature.color}
//                         stopOpacity={0.8}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor={feature.color}
//                         stopOpacity={0.3}
//                       />
//                     </linearGradient>
//                   ))}
//                 </defs>
//                 <XAxis
//                   dataKey="timestamp" // Use timestamp for x-axis
//                   tick={{ fill: "#555", fontWeight: "bold" }}
//                   angle={-45} // Optional: Rotate labels if timestamps are long
//                   textAnchor="end"
//                   interval={0} // Show all ticks
//                 />
//                 <YAxis
//                   tick={{ fill: "#555", fontWeight: "bold" }}
//                   tickFormatter={(value) => value.toFixed(2)}
//                   domain={[0, 1]} // Set Y-axis domain from 0 to 1
//                 />
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#00796b",
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                   }}
//                   itemStyle={{ fontWeight: "bold", color: "#333" }}
//                   formatter={formatTooltipValue}
//                 />
//                 <Legend
//                   wrapperStyle={{
//                     bottom: -10,
//                     fontWeight: "bold",
//                     color: "#555",
//                   }}
//                 />
//                 {allFeatures
//                   .filter((feature) => selectedFeatures.includes(feature.key))
//                   .map((feature) => (
//                     <Line
//                       key={feature.key}
//                       type="monotone"
//                       dataKey={feature.key}
//                       stroke={`url(#${feature.key})`}
//                       strokeWidth={3}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                       name={feature.label}
//                     />
//                   ))}
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default GraphWithFeatureSelection;

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CircularProgress } from "@mui/material";

// created on 10-04-2025
import dayjs from "dayjs"; // Import dayjs for date manipulation
// ended on 10-04-2025

const GraphWithFeatureSelection = ({ data }) => {
  const allFeatures = useMemo(
    () => [
      { key: "pm2_5", label: "PM2.5", color: "#FF5733" },
      { key: "pm10", label: "PM10", color: "#079220" },
      { key: "pm1", label: "PM1", color: "#3357FF" },
      { key: "temperature", label: "Temperature", color: "#D4A302" },
      { key: "humidity", label: "Humidity", color: "#3C5D01" },
      { key: "co", label: "CO", color: "#C70039" },
      { key: "voc", label: "VOC", color: "#900C3F" },
      { key: "co2", label: "CO2", color: "#581845" },
      { key: "aqi_calc", label: "AQI (Calculated)", color: "#FF33FF" },
      { key: "aqi_pred", label: "AQI (Predicted)", color: "#007979" },
    ],
    []
  );

  const [selectedFeatures, setSelectedFeatures] = useState(["pm2_5", "pm10"]);
  const [originalData, setOriginalData] = useState([]);
  const [showActualData, setShowActualData] = useState(false); // State to toggle between actual and scaled data

  // created on 10-04-2025
  const [timeRange, setTimeRange] = useState(""); // Track the selected time range
  const [loading, setLoading] = useState(false); // Loading state for data fetching

  const defaultOriginalData = useRef([]);

  // ended on 10-04-2025

  console.log("graph - 10:-", data);

  // useEffect(() => {
  //   setOriginalData(data);
  // }, [data]);

  useEffect(() => {
    if (!timeRange) {
      console.log("✅ Setting originalData from props");
      defaultOriginalData.current = data;
      setOriginalData(data);
    } else {
      console.log("❌ Ignoring prop update due to active time range");
    }
  }, [data, timeRange]);

  const handleFeatureToggle = useCallback((key) => {
    setSelectedFeatures((prev) =>
      prev.includes(key)
        ? prev.filter((feature) => feature !== key)
        : [...prev, key]
    );
  }, []);

  // created on 10-04-2025
  // ended on 10-04-2025

  // created on 10-04-2025
  // Fetch data based on time range
  const fetchData = async (selectedTimeRange) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3500/api/node/filterByTimeRange",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timeRange: selectedTimeRange,
            nodeValue: 1192,
          }),
        }
      );
      const result = await response.json();
      setOriginalData(
        result.data.map(
          ({
            activityData: { timestamp, data, calculated, predicted },
            createdAt,
          }) => ({
            timestamp,
            createdAt,
            pm2_5: data?.pm2_5 || 0,
            pm10: data?.pm10 || 0,
            pm1: data?.pm1 || 0,
            temperature: data?.temperature || 0,
            humidity: data?.humidity || 0,
            co: data?.co || 0,
            voc: data?.voc || 0,
            co2: data?.co2 || 0,
            aqi_calc: Math.max(
              calculated?.aqi_co || 0,
              calculated?.aqi_dust || 0,
              calculated?.aqi_co2 || 0,
              calculated?.aqi_voc || 0
            ),
            aqi_pred: Math.max(predicted?.aqi_co, predicted?.aqi_dust),
          })
        )
      ); // Update graph data with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    const selectedTimeRange = event.target.value;
    setTimeRange(selectedTimeRange);
    // if (selectedTimeRange) {
    //   fetchData(selectedTimeRange); // Fetch data for the selected time range
    // } else {
    //   setOriginalData(originalData); // Reset to original data
    // }
    if (selectedTimeRange) {
      fetchData(selectedTimeRange);
    } else {
      setOriginalData(defaultOriginalData.current);
    }
  };

  const generateCustomTicks = (data, selectedTimeRange) => {
    let intervalMinutes;

    switch (selectedTimeRange) {
      case "1h":
        intervalMinutes = 10;
        break;
      case "5h":
        intervalMinutes = 30;
        break;
      case "1d":
        intervalMinutes = 60;
        break;
      default:
        return undefined; // fallback to default behavior (show all)
    }

    return data
      .filter((entry) => {
        const minutes = dayjs(entry.timestamp).minute();
        const hours = dayjs(entry.timestamp).hour();
        return (
          minutes % intervalMinutes === 0 &&
          (intervalMinutes >= 60 ? minutes === 0 : true)
        );
      })
      .map((entry) => entry.timestamp);
  };

  // ended on 10-04-2025

  const formatTooltipValue = useCallback(
    (value, name, props) => {
      const originalItem = props.payload; // This is the hovered data object

      if (!originalItem) return "N/A";

      // Find the index of the hovered item in the original data
      const index = originalData.findIndex(
        (item) => item.createdAt === originalItem.createdAt
      );

      if (index !== -1 && originalData[index][props.dataKey] !== undefined) {
        return originalData[index][props.dataKey] !== null
          ? originalData[index][props.dataKey].toFixed(2)
          : "N/A";
      }

      return "N/A";
    },
    [originalData]
  );

  const scaledData = useMemo(() => {
    if (data.length === 0) return [];

    // Sort the data by the createdAt field
    const sortedData = [...originalData].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const featureMinMax = selectedFeatures.reduce((acc, feature) => {
      const values = sortedData.map((item) => item[feature]);
      acc[feature] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
      return acc;
    }, {});

    return sortedData.map((item) => {
      const scaledItem = { ...item };
      selectedFeatures.forEach((feature) => {
        const { min, max } = featureMinMax[feature];
        if (min === max) {
          scaledItem[feature] = 0.5;
        } else {
          scaledItem[feature] = (item[feature] - min) / (max - min);
        }
      });
      return scaledItem;
    });
  }, [originalData, selectedFeatures]);

  const graphData = showActualData ? originalData : scaledData; // Choose data based on toggle state
  console.log("originalData on 10th:- ", graphData);

  return (
    <Box sx={{ width: "98%", textAlign: "center", p: "10px" }}>
      {/* Graph Title */}
      <Typography
        variant="h4"
        sx={{
          color: "#1976d2",
          fontWeight: "bold",
          mb: 3,
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        iPolluSense Dynamic Sensor Data Graph
      </Typography>

      {/* Checkbox List for Features */}
      <FormGroup row sx={{ justifyContent: "center", mb: 3 }}>
        {allFeatures.map((feature) => (
          <FormControlLabel
            key={feature.key}
            control={
              <Checkbox
                checked={selectedFeatures.includes(feature.key)}
                onChange={() => handleFeatureToggle(feature.key)}
                sx={{
                  color: feature.color,
                  "&.Mui-checked": { color: feature.color },
                }}
              />
            }
            label={
              <span style={{ color: feature.color, fontWeight: "bold" }}>
                {feature.label}
              </span>
            }
            sx={{ marginRight: "20px" }}
          />
        ))}
      </FormGroup>

      {/* Time Range Dropdown on 10-04-2025 */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2, // Add spacing between elements
          // Margin bottom for spacing below the group
        }}
      >
        {/* Toggle Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowActualData((prev) => !prev)}
          sx={{ mb: 3, height: 56, minWidth: 200 }}
        >
          {showActualData ? "Show Scaled Data" : "Show Actual Data"}
        </Button>

        <FormControl sx={{ mb: 3, height: 56, minWidth: 200 }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            label="Time Range"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="">Original Data</MenuItem>
            <MenuItem value="1h">Last 1 Hour</MenuItem>
            <MenuItem value="5h">Last 5 Hours</MenuItem>
            <MenuItem value="1d">Last 1 Day</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Time Range Dropdown 10-04-2025*/}

      {/* Loading Spinner */}
      {data.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Line Chart */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              background: "aliceblue",
            }}
          >
            <ResponsiveContainer width="100%" height={500}>
              <LineChart
                data={graphData}
                margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
                style={{ backgroundColor: "aliceblue" }}
              >
                <defs>
                  {allFeatures.map((feature) => (
                    <linearGradient
                      key={feature.key}
                      id={feature.key}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={feature.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={feature.color}
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  ))}
                </defs>
                {/* changed on 10-04-25 */}
                {/* <XAxis
                  dataKey="timestamp" // Use timestamp for x-axis
                  tick={{ fill: "#555", fontWeight: "bold" }}
                  angle={-45} // Optional: Rotate labels if timestamps are long
                  textAnchor="end"
                  interval={0} // Show all ticks
                /> */}

                {timeRange ? (
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fill: "#555", fontWeight: "bold" }}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    ticks={generateCustomTicks(data, timeRange)}
                    tickFormatter={(tick) => dayjs(tick).format("HH:mm")}
                  />
                ) : (
                  <XAxis
                    dataKey="timestamp" // Use timestamp for x-axis
                    tick={{ fill: "#555", fontWeight: "bold" }}
                    angle={-45} // Optional: Rotate labels if timestamps are long
                    textAnchor="end"
                    interval={0} // Show all ticks
                  />
                )}
                {/* ended on 10-04-25 */}

                <YAxis
                  tick={{ fill: "#555", fontWeight: "bold" }}
                  tickFormatter={(value) => value.toFixed(2)}
                  domain={showActualData ? ["auto", "auto"] : [0, 1]} // Adjust domain based on toggle
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#00796b",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                  itemStyle={{ fontWeight: "bold", color: "#333" }}
                  formatter={formatTooltipValue}
                />
                <Legend
                  wrapperStyle={{
                    bottom: -10,
                    fontWeight: "bold",
                    color: "#555",
                  }}
                />
                {allFeatures
                  .filter((feature) => selectedFeatures.includes(feature.key))
                  .map((feature) => (
                    <Line
                      key={feature.key}
                      type="monotone"
                      dataKey={feature.key}
                      stroke={`url(#${feature.key})`}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name={feature.label}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Box>
  );
};

export default GraphWithFeatureSelection;
