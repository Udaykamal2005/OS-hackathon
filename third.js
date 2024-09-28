// Global Variables
let processes = [];
let processCount = 1;

// Add process input fields dynamically
document.getElementById('add-process').addEventListener('click', function () {
    processCount++;
    const processInputs = document.getElementById('process-inputs');
    const newProcess = document.createElement('div');
    newProcess.classList.add('process');
    newProcess.innerHTML = `
        <label>Process ID: <input type="text" class="process-id" value="P${processCount}" disabled></label>
        <label>Arrival Time: <input type="number" class="arrival-time" min="0"></label>
        <label>Burst Time: <input type="number" class="burst-time" min="1"></label>
    `;
    processInputs.appendChild(newProcess);
});

// Simulate FCFS scheduling
document.getElementById('simulate').addEventListener('click', function () {
    processes = [];
    const processElements = document.querySelectorAll('.process');

    // Extract data from input fields
    processElements.forEach((processEl, index) => {
        const arrivalTime = parseInt(processEl.querySelector('.arrival-time').value);
        const burstTime = parseInt(processEl.querySelector('.burst-time').value);

        // Ensure valid burstTime
        if (isNaN(burstTime) || burstTime <= 0) {
            alert("Please enter valid burst times greater than 0.");
            return;
        }

        processes.push({
            id: `P${index + 1}`,
            arrivalTime,
            burstTime
        });
    });

    // Run FCFS algorithm
    const results = FCFS(processes);

    // Display Gantt chart
    displayGanttChart(results);

    // Display results in table
    displayResultsTable(results);
});

// First-Come, First-Served (FCFS) Algorithm
function FCFS(processes) {
    let currentTime = 0;
    let results = [];

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);  // Sort by arrival time

    processes.forEach(process => {
        let startTime = Math.max(currentTime, process.arrivalTime);
        let finishTime = startTime + process.burstTime;

        results.push({
            processId: process.id,
            startTime: startTime,
            finishTime: finishTime,
            waitingTime: startTime - process.arrivalTime,
            turnaroundTime: finishTime - process.arrivalTime,
            responseTime: startTime - process.arrivalTime,
            burstTime: process.burstTime
        });

        currentTime = finishTime;
    });

    return results;
}

// Display Gantt chart using Chart.js
function displayGanttChart(results) {
    const ctx = document.getElementById('gantt-chart').getContext('2d');

    if (results.length === 0) {
        console.log("No data to display in the Gantt chart.");
        return;
    }

    const labels = results.map(result => result.processId);
    const data = results.map(result => result.burstTime);  // Burst times for the Gantt chart

    const backgroundColors = results.map(() => getRandomColor());

    // Clear previous chart instance if exists (to prevent multiple charts stacking)
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Initialize Chart.js Gantt Chart
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Burst Time',
                data: data,  // Ensure burst time data is correctly passed
                backgroundColor: backgroundColors
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bar chart
            scales: {
                x: {
                    beginAtZero: true,
                    max: Math.max(...data) + 2  // Adjust max to ensure visibility
                }
            }
        }
    });
}

// Generate random color for Gantt chart
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Display results table
function displayResultsTable(results) {
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.processId}</td>
            <td>${result.waitingTime}</td>
            <td>${result.turnaroundTime}</td>
            <td>${result.responseTime}</td>
        `;
        tbody.appendChild(row);
    });
}
