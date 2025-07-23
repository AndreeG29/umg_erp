import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function initializeCharts() {
  console.log('Chart.js inicializado correctamente');
}