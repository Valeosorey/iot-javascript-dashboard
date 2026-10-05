let sensorChart = null;
async function updateDashboard() {
    try {
        const data = await getSensorData();

        console.log("Sensor data:", data);

        document.getElementById("temperature").textContent =
            data.temperature;

        document.getElementById("humidity").textContent =
            data.humidity;

        document.getElementById("motor").textContent =
            data.motor ? "ACTIVE" : "INACTIVE";
	document.getElementById("timestamp").textContent =
    	    new Date(data.timestamp).toLocaleString();

    } catch (error) {
        console.error("Error updating dashboard:", error);
    }
}

async function simulateSensorReading() {
    const sensorData = {
        temperature: Number((20 + Math.random() * 10).toFixed(1)),
        humidity: Math.floor(50 + Math.random() * 30),
        motor: Math.random() > 0.5
    };

    console.log("Simulated data:", sensorData);

    try {
        const result = await sendSensorData(sensorData);

	console.log("Server response:", result);

	await updateDashboard();
	await loadSensorHistory();
	await createSensorChart();

    } catch (error) {
        console.error("Error sending sensor data:", error);
    }
}

document
    .getElementById("refreshButton")
    .addEventListener("click", updateDashboard);

document
    .getElementById("simulateButton")
    .addEventListener("click", simulateSensorReading);

updateDashboard();

async function loadSensorHistory() {
    try {
        const history = await getSensorHistory();

        const tableBody = document.getElementById("historyTable");

        tableBody.innerHTML = "";

        history.forEach((reading) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${reading.temperature} °C</td>
                <td>${reading.humidity} %</td>
                <td>${reading.motor ? "ACTIVE" : "INACTIVE"}</td>
                <td>${new Date(reading.timestamp).toLocaleString()}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading sensor history:", error);
    }
}
async function createSensorChart() {
    try {
	if (sensorChart) {
    		sensorChart.destroy();
	}

        const history = await getSensorHistory();

        const temperatures = history.map(reading => reading.temperature);
        const humidities = history.map(reading => reading.humidity);

        const labels = history.map(reading =>
            new Date(reading.timestamp).toLocaleTimeString()
        );

        const ctx = document
            .getElementById("sensorChart")
            .getContext("2d");

        sensorChart = new Chart(ctx, {
            type: "line",

            data: {
                labels: labels,

                datasets: [
                    {
                        label: "Temperature (°C)",
                        data: temperatures
                    },
                    {
                        label: "Humidity (%)",
                        data: humidities
                    }
                ]
            },

            options: {
                responsive: true,

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error creating sensor chart:", error);
    }
}

createSensorChart();