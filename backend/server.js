
const express = require("express");
const path = require("path");
require("dotenv").config();
const climateRoutes = require("./routes/climate");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/api", climateRoutes);

// Serve frontend files
app.use(express.static(
    path.join(__dirname, "../fortend")
));

// Test API route
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend connected successfully!",
        project: "ClimateGuard AI"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
