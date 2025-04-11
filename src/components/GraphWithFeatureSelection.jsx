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

// import React, {
//   useState,
//   useMemo,
//   useCallback,
//   useEffect,
//   useRef,
// } from "react";
// import {
//   Typography,
//   Box,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
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

// // created on 10-04-2025
// import dayjs from "dayjs"; // Import dayjs for date manipulation
// // ended on 10-04-2025

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
//   const [showActualData, setShowActualData] = useState(false); // State to toggle between actual and scaled data

//   // created on 10-04-2025
//   const [timeRange, setTimeRange] = useState(""); // Track the selected time range
//   const [loading, setLoading] = useState(false); // Loading state for data fetching

//   const defaultOriginalData = useRef([]);

//   // ended on 10-04-2025

//   console.log("graph - 10:-", data);

//   // useEffect(() => {
//   //   setOriginalData(data);
//   // }, [data]);

//   useEffect(() => {
//     if (!timeRange) {
//       console.log("✅ Setting originalData from props");
//       defaultOriginalData.current = data;
//       setOriginalData(data);
//     } else {
//       console.log("❌ Ignoring prop update due to active time range");
//     }
//   }, [data, timeRange]);

//   const handleFeatureToggle = useCallback((key) => {
//     setSelectedFeatures((prev) =>
//       prev.includes(key)
//         ? prev.filter((feature) => feature !== key)
//         : [...prev, key]
//     );
//   }, []);

//   // created on 10-04-2025
//   // ended on 10-04-2025

//   // created on 10-04-2025
//   // Fetch data based on time range
//   const fetchData = async (selectedTimeRange) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://localhost:3500/api/node/filterByTimeRange",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             timeRange: selectedTimeRange,
//             nodeValue: 1192,
//           }),
//         }
//       );
//       const result = await response.json();
//       setOriginalData(
//         result.data.map(
//           ({
//             activityData: { timestamp, data, calculated, predicted },
//             createdAt,
//           }) => ({
//             timestamp,
//             createdAt,
//             pm2_5: data?.pm2_5 || 0,
//             pm10: data?.pm10 || 0,
//             pm1: data?.pm1 || 0,
//             temperature: data?.temperature || 0,
//             humidity: data?.humidity || 0,
//             co: data?.co || 0,
//             voc: data?.voc || 0,
//             co2: data?.co2 || 0,
//             aqi_calc: Math.max(
//               calculated?.aqi_co || 0,
//               calculated?.aqi_dust || 0,
//               calculated?.aqi_co2 || 0,
//               calculated?.aqi_voc || 0
//             ),
//             aqi_pred: Math.max(predicted?.aqi_co, predicted?.aqi_dust),
//           })
//         )
//       ); // Update graph data with fetched data
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle time range change
//   const handleTimeRangeChange = (event) => {
//     const selectedTimeRange = event.target.value;
//     setTimeRange(selectedTimeRange);
//     // if (selectedTimeRange) {
//     //   fetchData(selectedTimeRange); // Fetch data for the selected time range
//     // } else {
//     //   setOriginalData(originalData); // Reset to original data
//     // }
//     if (selectedTimeRange) {
//       fetchData(selectedTimeRange);
//     } else {
//       setOriginalData(defaultOriginalData.current);
//     }
//   };

//   const generateCustomTicks = (data, selectedTimeRange) => {
//     let intervalMinutes;

//     switch (selectedTimeRange) {
//       case "1h":
//         intervalMinutes = 10;
//         break;
//       case "5h":
//         intervalMinutes = 30;
//         break;
//       case "1d":
//         intervalMinutes = 60;
//         break;
//       default:
//         return undefined; // fallback to default behavior (show all)
//     }

//     return data
//       .filter((entry) => {
//         const minutes = dayjs(entry.timestamp).minute();
//         const hours = dayjs(entry.timestamp).hour();
//         return (
//           minutes % intervalMinutes === 0 &&
//           (intervalMinutes >= 60 ? minutes === 0 : true)
//         );
//       })
//       .map((entry) => entry.timestamp);
//   };

//   // ended on 10-04-2025

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
//     const sortedData = [...originalData].sort(
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
//       return scaledItem;
//     });
//   }, [originalData, selectedFeatures]);

//   const graphData = showActualData ? originalData : scaledData; // Choose data based on toggle state
//   console.log("originalData on 10th:- ", originalData);

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

//       {/* Time Range Dropdown on 10-04-2025 */}

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 2, // Add spacing between elements
//           // Margin bottom for spacing below the group
//         }}
//       >
//         {/* Toggle Button */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setShowActualData((prev) => !prev)}
//           sx={{ mb: 3, height: 56, minWidth: 200 }}
//         >
//           {showActualData ? "Show Scaled Data" : "Show Actual Data"}
//         </Button>

//         <FormControl sx={{ mb: 3, height: 56, minWidth: 200 }}>
//           <InputLabel id="time-range-label">Time Range</InputLabel>
//           <Select
//             labelId="time-range-label"
//             label="Time Range"
//             value={timeRange}
//             onChange={handleTimeRangeChange}
//           >
//             <MenuItem value="">Original Data</MenuItem>
//             <MenuItem value="1h">Last 1 Hour</MenuItem>
//             <MenuItem value="5h">Last 5 Hours</MenuItem>
//             <MenuItem value="1d">Last 1 Day</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>
//       {/* Time Range Dropdown 10-04-2025*/}

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
//                 data={graphData}
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
//                 {/* changed on 10-04-25 */}
//                 {/* <XAxis
//                   dataKey="timestamp" // Use timestamp for x-axis
//                   tick={{ fill: "#555", fontWeight: "bold" }}
//                   angle={-45} // Optional: Rotate labels if timestamps are long
//                   textAnchor="end"
//                   interval={0} // Show all ticks
//                 /> */}

//                 {timeRange ? (
//                   <XAxis
//                     dataKey="timestamp"
//                     tick={{ fill: "#555", fontWeight: "bold" }}
//                     angle={-45}
//                     textAnchor="end"
//                     interval={0}
//                     ticks={generateCustomTicks(data, timeRange)}
//                     tickFormatter={(tick) => dayjs(tick).format("HH:mm")}
//                   />
//                 ) : (
//                   <XAxis
//                     dataKey="timestamp" // Use timestamp for x-axis
//                     tick={{ fill: "#555", fontWeight: "bold" }}
//                     angle={-45} // Optional: Rotate labels if timestamps are long
//                     textAnchor="end"
//                     interval={0} // Show all ticks
//                   />
//                 )}
//                 {/* ended on 10-04-25 */}

//                 <YAxis
//                   tick={{ fill: "#555", fontWeight: "bold" }}
//                   tickFormatter={(value) => value.toFixed(2)}
//                   domain={showActualData ? ["auto", "auto"] : [0, 1]} // Adjust domain based on toggle
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
  CircularProgress,
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
import dayjs from "dayjs";

// Component
const GraphWithFeatureSelection = ({ data }) => {
  /** ──────── 📦 Constants ──────── */
  const NODE_ID = 1192;

  const FEATURE_LIST = useMemo(
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

  /** ──────── 🧠 States ──────── */
  const [selectedFeatures, setSelectedFeatures] = useState(["pm2_5", "pm10"]);
  const [originalData, setOriginalData] = useState([]);
  const [showActualData, setShowActualData] = useState(false);
  const [timeRange, setTimeRange] = useState("");
  const [loading, setLoading] = useState(false);
  const defaultOriginalData = useRef([]);

  /** ──────── 🎣 Effects ──────── */
  useEffect(() => {
    if (!timeRange) {
      defaultOriginalData.current = data;
      setOriginalData(data);
    }
  }, [data, timeRange]);

  /** ──────── 🔁 Handlers ──────── */
  const handleFeatureToggle = useCallback((key) => {
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  }, []);

  const handleTimeRangeChange = (event) => {
    const selected = event.target.value;
    setTimeRange(selected);
    selected
      ? fetchData(selected)
      : setOriginalData(defaultOriginalData.current);
  };

  const fetchData = async (selectedRange) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3500/api/node/filterByTimeRange",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timeRange: selectedRange,
            nodeValue: NODE_ID,
          }),
        }
      );
      const result = await response.json();
      const formatted = result.data.map(({ activityData, createdAt }) => ({
        timestamp: activityData.timestamp,
        createdAt,
        pm2_5: activityData.data?.pm2_5 || 0,
        pm10: activityData.data?.pm10 || 0,
        pm1: activityData.data?.pm1 || 0,
        temperature: activityData.data?.temperature || 0,
        humidity: activityData.data?.humidity || 0,
        co: activityData.data?.co || 0,
        voc: activityData.data?.voc || 0,
        co2: activityData.data?.co2 || 0,
        aqi_calc: Math.max(
          activityData.calculated?.aqi_co || 0,
          activityData.calculated?.aqi_dust || 0,
          activityData.calculated?.aqi_co2 || 0,
          activityData.calculated?.aqi_voc || 0
        ),
        aqi_pred: Math.max(
          activityData.predicted?.aqi_co,
          activityData.predicted?.aqi_dust
        ),
      }));
      console.log("Formatted Data:", formatted);

      setOriginalData(formatted);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomTicks = (data, selectedRange) => {
    let interval;
    if (selectedRange === "1h") interval = 10;
    else if (selectedRange === "5h") interval = 30;
    else if (selectedRange === "1d") interval = 60;

    return data
      .filter((entry) => {
        const minutes = dayjs(entry.timestamp).minute();
        return interval >= 60 ? minutes === 0 : minutes % interval === 0;
      })
      .map((entry) => entry.timestamp);
  };

  const formatTooltipValue = useCallback(
    (value, name, props) => {
      const item = props.payload;
      if (!item) return "N/A";
      const match = originalData.find((d) => d.createdAt === item.createdAt);
      const val = match?.[props.dataKey];
      return val !== null && val !== undefined ? val.toFixed(2) : "N/A";
    },
    [originalData]
  );

  /** ──────── 📊 Data Processing ──────── */
  const scaledData = useMemo(() => {
    if (originalData.length === 0) return [];
    const sorted = [...originalData].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const featureMinMax = selectedFeatures.reduce((acc, feature) => {
      const values = sorted.map((item) => item[feature]);
      acc[feature] = { min: Math.min(...values), max: Math.max(...values) };
      return acc;
    }, {});

    return sorted.map((item) => {
      const scaledItem = { ...item };
      selectedFeatures.forEach((feature) => {
        const { min, max } = featureMinMax[feature];
        scaledItem[feature] =
          min === max ? 0.5 : (item[feature] - min) / (max - min);
      });
      return scaledItem;
    });
  }, [originalData, selectedFeatures]);

  const sortedOriginalData = useMemo(() => {
    return [...originalData].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [originalData]);

  const graphData = useMemo(() => {
    return showActualData ? sortedOriginalData : scaledData;
  }, [showActualData, scaledData, sortedOriginalData]);

  /** ──────── 🧱 JSX Return ──────── */
  return (
    <Box sx={{ width: "98%", p: 1, textAlign: "center" }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
      >
        iPolluSense Dynamic Sensor Data Graph
      </Typography>

      {/* Feature Checkboxes */}
      <FormGroup row sx={{ justifyContent: "center", mb: 3 }}>
        {FEATURE_LIST.map((feature) => (
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
            sx={{ mr: 2 }}
          />
        ))}
      </FormGroup>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // ← stack on small screens
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setShowActualData((prev) => !prev)}
          sx={{ height: 56, minWidth: { xs: "100%", sm: 200 } }} // full width on mobile
        >
          {showActualData ? "Show Scaled Data" : "Show Actual Data"}
        </Button>
        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Time Range"
          >
            <MenuItem value="">Original Data</MenuItem>
            <MenuItem value="1h">Last 1 Hour</MenuItem>
            <MenuItem value="5h">Last 5 Hours</MenuItem>
            <MenuItem value="1d">Last 1 Day</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Conditional Graph */}
      {loading || data.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            backgroundColor: "aliceblue",
          }}
        >
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={graphData}
              margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
            >
              {/* Gradients */}
              <defs>
                {FEATURE_LIST.map((feature) => (
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

              {/* X-Axis */}
              <XAxis
                dataKey="timestamp"
                angle={-45}
                textAnchor="end"
                tick={{ fill: "#555", fontWeight: "bold", fontSize: 11 }}
                interval={0}
                ticks={
                  timeRange
                    ? generateCustomTicks(graphData, timeRange)
                    : undefined
                }
                tickFormatter={(tick) =>
                  dayjs(tick).format("YYYY-MM-DD HH:mm:ss")
                }
              />

              {/* Y-Axis */}
              <YAxis
                tick={{
                  fill: "#555",
                  fontWeight: "bold",
                  fontSize: 11,
                }}
                domain={showActualData ? ["auto", "auto"] : [0, 1]}
                tickFormatter={(val) => val.toFixed(2)}
              />

              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{ backgroundColor: "#00796b", borderRadius: 5 }}
                itemStyle={{ fontWeight: "bold", color: "#fff" }}
              />
              <Legend
                wrapperStyle={{
                  bottom: 5,
                  fontWeight: "bold",
                  color: "#555",
                }}
              />

              {/* Lines */}
              {FEATURE_LIST.filter((f) => selectedFeatures.includes(f.key)).map(
                (feature) => (
                  <Line
                    key={feature.key}
                    dataKey={feature.key}
                    type="monotone"
                    stroke={`url(#${feature.key})`}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name={feature.label}
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default GraphWithFeatureSelection;

// import React, {
//   useState,
//   useMemo,
//   useCallback,
//   useEffect,
//   useRef,
// } from "react";
// import {
//   Typography,
//   Box,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
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
//   Scatter,
// } from "recharts";
// import { CircularProgress } from "@mui/material";
// import dayjs from "dayjs"; // Import dayjs for date manipulation
// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
// } from "firebase/firestore";

// // Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCSDU3MoCUfcC3Jfn_T-cZ6fqcp2ZUFFMk",
//   authDomain: "ipollusense-52f67.firebaseapp.com",
//   projectId: "ipollusense-52f67",
//   storageBucket: "ipollusense-52f67.appspot.com",
//   messagingSenderId: "733434038670",
//   appId: "1:733434038670:web:7e3d9475fd6310d1afbcdf",
//   measurementId: "G-VHSG19J7HN",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

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
//   const [showActualData, setShowActualData] = useState(false); // State to toggle between actual and scaled data
//   const [timeRange, setTimeRange] = useState(""); // Track the selected time range
//   const [loading, setLoading] = useState(false); // Loading state for data fetching
//   const [checkpoints, setCheckpoints] = useState([]); // State for Firebase checkpoints
//   const defaultOriginalData = useRef([]);

//   useEffect(() => {
//     if (!timeRange) {
//       defaultOriginalData.current = data;
//       setOriginalData(data);
//     }
//   }, [data, timeRange]);

//   const handleFeatureToggle = useCallback((key) => {
//     setSelectedFeatures((prev) =>
//       prev.includes(key)
//         ? prev.filter((feature) => feature !== key)
//         : [...prev, key]
//     );
//   }, []);

//   const fetchData = async (selectedTimeRange) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://localhost:3500/api/node/filterByTimeRange",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             timeRange: selectedTimeRange,
//             nodeValue: 1192,
//           }),
//         }
//       );
//       const result = await response.json();
//       setOriginalData(
//         result.data.map(
//           ({
//             activityData: { timestamp, data, calculated, predicted },
//             createdAt,
//           }) => ({
//             timestamp,
//             createdAt,
//             pm2_5: data?.pm2_5 || 0,
//             pm10: data?.pm10 || 0,
//             pm1: data?.pm1 || 0,
//             temperature: data?.temperature || 0,
//             humidity: data?.humidity || 0,
//             co: data?.co || 0,
//             voc: data?.voc || 0,
//             co2: data?.co2 || 0,
//             aqi_calc: Math.max(
//               calculated?.aqi_co || 0,
//               calculated?.aqi_dust || 0,
//               calculated?.aqi_co2 || 0,
//               calculated?.aqi_voc || 0
//             ),
//             aqi_pred: Math.max(predicted?.aqi_co, predicted?.aqi_dust),
//           })
//         )
//       );
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCheckpoints = async (startDate, endDate) => {
//     try {
//       const checkpointsQuery = query(
//         collection(db, "devices"),
//         orderBy("timestamp", "desc")
//         // where("timestamp", ">=", startDate),
//         // where("timestamp", "<=", endDate)
//       );
//       console.log("Checkpoints Query:- ", checkpointsQuery);

//       const querySnapshot = await getDocs(checkpointsQuery);
//       setCheckpoints(
//         querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching checkpoints:", error);
//     }
//   };
//   console.log("Checkpoints new :- ", checkpoints);

//   useEffect(() => {
//     if (originalData.length > 0) {
//       const startDate = new Date(originalData[0]?.createdAt);
//       const endDate = new Date(
//         originalData[originalData.length - 1]?.createdAt
//       );
//       console.log(
//         "Start Date:- ",
//         startDate.toISOString().split("T").join(" ")
//       );
//       console.log("End Date:- ", endDate.toISOString());

//       fetchCheckpoints(startDate, endDate);
//     }
//   }, [originalData]);

//   console.log("Checkpoints from Firebase:- ", checkpoints);

//   // const graphDataWithCheckpoints = useMemo(() => {
//   //   console.log("Original data under function :- ", originalData);
//   //   console.log("Checkpoints under function 1:- ", checkpoints);

//   //   return originalData.map((point) => {
//   //     const checkpoint = checkpoints.find(
//   //       (cp) =>
//   //         new Date(cp.timestamp).toISOString() ===
//   //         new Date(point.createdAt).toISOString()
//   //     );
//   //     console.log("Checkpoint under function:- ", checkpoint);

//   //     return {
//   //       ...point,
//   //       checkpoint: checkpoint ? checkpoint.name || "Checkpoint" : null,
//   //     };
//   //   });
//   // }, [originalData, checkpoints]);

//   const graphDataWithCheckpoints = useMemo(() => {
//     console.log("Original data under function :- ", originalData);
//     console.log("Checkpoints under function 1:- ", checkpoints);

//     return originalData.map((point) => {
//       // Convert point timestamp to Date object
//       const pointDate = new Date(point.createdAt);

//       // Find the closest checkpoint within the allowed time difference
//       let closestCheckpoint = null;
//       let smallestDifference = Infinity;

//       checkpoints.forEach((cp) => {
//         const checkpointDate = new Date(cp.timestamp);

//         // Ensure the date is the same
//         const isSameDate =
//           pointDate.toISOString().split("T")[0] ===
//           checkpointDate.toISOString().split("T")[0];

//         // Calculate the time difference in milliseconds
//         const timeDifference = Math.abs(checkpointDate - pointDate);

//         // Check if the time difference is within the allowed range (e.g., 5 minutes)
//         const isWithinAllowedTime = timeDifference <= 5 * 60 * 1000; // 5 minutes in milliseconds

//         if (
//           isSameDate &&
//           isWithinAllowedTime &&
//           timeDifference < smallestDifference
//         ) {
//           smallestDifference = timeDifference;
//           closestCheckpoint = cp;
//         }
//       });

//       console.log("Closest checkpoint for point:", point, closestCheckpoint);

//       return {
//         ...point,
//         checkpoint: closestCheckpoint
//           ? closestCheckpoint.name || "Checkpoint"
//           : null,
//       };
//     });
//   }, [originalData, checkpoints]);

//   console.log("graphDataWithCheckpoints:- ", graphDataWithCheckpoints);

//   const graphData = showActualData
//     ? graphDataWithCheckpoints
//     : graphDataWithCheckpoints.map((item) => {
//         const scaledItem = { ...item };
//         selectedFeatures.forEach((feature) => {
//           const { min, max } = selectedFeatures.reduce((acc, key) => {
//             const values = originalData.map((d) => d[key]);
//             acc[key] = { min: Math.min(...values), max: Math.max(...values) };
//             return acc;
//           }, {})[feature];
//           scaledItem[feature] =
//             min === max ? 0.5 : (item[feature] - min) / (max - min);
//         });
//         return scaledItem;
//       });

//   return (
//     <Box sx={{ width: "98%", textAlign: "center", p: "10px" }}>
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

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             p: 2,
//             borderRadius: "10px",
//             boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
//             background: "aliceblue",
//           }}
//         >
//           <ResponsiveContainer width="100%" height={500}>
//             <LineChart
//               data={graphData}
//               margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
//               style={{ backgroundColor: "aliceblue" }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="timestamp"
//                 tick={{ fill: "#555", fontWeight: "bold" }}
//                 angle={-45}
//                 textAnchor="end"
//                 interval={0}
//               />
//               <YAxis
//                 tick={{ fill: "#555", fontWeight: "bold" }}
//                 domain={showActualData ? ["auto", "auto"] : [0, 1]}
//               />
//               <Tooltip />
//               <Legend />
//               {allFeatures
//                 .filter((feature) => selectedFeatures.includes(feature.key))
//                 .map((feature) => (
//                   <Line
//                     key={feature.key}
//                     type="monotone"
//                     dataKey={feature.key}
//                     stroke={feature.color}
//                     strokeWidth={3}
//                     dot={{ r: 4 }}
//                     activeDot={{ r: 6 }}
//                     name={feature.label}
//                   />
//                 ))}
//               <Scatter
//                 data={graphData.filter((point) => point.checkpoint)}
//                 dataKey="timestamp"
//                 fill="red"
//                 name="Checkpoints"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default GraphWithFeatureSelection;
