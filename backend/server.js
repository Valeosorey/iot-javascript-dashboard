const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB configuration
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "iot_dashboard";

const client = new MongoClient(MONGO_URI);

let db;

// Middleware
app.use(express.json());
app.use(express.static("../frontend"));

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "IoT Monitoring API is running!"
    });
});

// Get latest sensor data
app.get("/api/sensors", async (req, res) => {
    try {
        const readings = await db
            .collection("sensor_readings")
            .find({})
            .sort({ timestamp: -1 })
            .limit(1)
            .toArray();

        if (readings.length === 0) {
            return res.status(404).json({
                message: "No sensor data found"
            });
        }

        res.json(readings[0]);

    } catch (error) {
        console.error("Error getting sensor data:", error);

        res.status(500).json({
            message: "Error retrieving sensor data"
        });
    }
});

// Get sensor history
app.get("/api/sensors/history", async (req, res) => {
    try {
        const readings = await db
            .collection("sensor_readings")
            .find({})
            .sort({ timestamp: -1 })
            .limit(10)
            .toArray();

        res.json(readings);

    } catch (error) {
        console.error("Error getting sensor history:", error);

        res.status(500).json({
            message: "Error retrieving sensor history"
        });
    }
});

// Save sensor data
app.post("/api/sensors", async (req, res) => {
    try {
        const { temperature, humidity, motor } = req.body;

        if (
            temperature === undefined ||
            humidity === undefined ||
            motor === undefined
        ) {
            return res.status(400).json({
                message: "temperature, humidity and motor are required"
            });
        }

        const reading = {
            temperature,
            humidity,
            motor,
            timestamp: new Date()
        };

        const result = await db
            .collection("sensor_readings")
            .insertOne(reading);

        res.status(201).json({
            message: "Sensor data saved successfully",
            data: {
                ...reading,
                _id: result.insertedId
            }
        });

    } catch (error) {
        console.error("Error saving sensor data:", error);

        res.status(500).json({
            message: "Error saving sensor data"
        });
    }
});

// Start server
async function startServer() {
    try {
        await client.connect();

        db = client.db(DB_NAME);

        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

startServer();