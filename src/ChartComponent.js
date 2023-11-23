import React from "react";
import { Bar } from "react-chartjs-2";

// Import the necessary classes from 'chart.js'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController,
} from "chart.js/auto";

// Register the required elements and scales
Chart.register(BarElement, CategoryScale, LinearScale, BarController);

function ChartComponent() {
  const chartData = {
    labels: ["Label 1", "Label 2", "Label 3"],
    datasets: [
      {
        label: "Sample Data",
        data: [10, 20, 15],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "category",
        position: "bottom",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}

export default ChartComponent;
