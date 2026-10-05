const API_URL = "/api/sensors";

async function getSensorData() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch sensor data");
    }

    return await response.json();
}

async function sendSensorData(sensorData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sensorData)
    });

    if (!response.ok) {
        throw new Error("Failed to send sensor data");
    }

    return await response.json();
}

async function getSensorHistory() {
    const response = await fetch(`${API_URL}/history`);

    if (!response.ok) {
        throw new Error("Failed to fetch sensor history");
    }

    return await response.json();
}