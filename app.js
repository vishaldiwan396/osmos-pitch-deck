// ======================
// Osmos Investor Deck JS
// ======================

// Reveal.js initialization
Reveal.initialize({
  hash: true,
  center: true,
  transition: 'fade',
  backgroundTransition: 'fade',
  controls: true,
  progress: false,
  history: true,
  keyboard: true,
  overview: false,
  touch: true,
  width: 1024,
  height: 768,
  margin: 0.04,
  disableLayout: false,
});

// ----------------------
// Data (from provided JSON)
// ----------------------
const data = {
  retail_media_spend: [50.7, 68, 89.8, 98.2, 115, 140, 165.9],
  digital_ad_spend: [850, 900, 950, 1000, 1100, 1200, 1250],
  years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
  tam: 165.9,
  sam: 10.25,
  som: 1,
  market_share: [
    { vendor: 'Salesforce', share: 35 },
    { vendor: 'Monday', share: 10 },
    { vendor: 'ADvendio', share: 5 },
    { vendor: 'Placements.io', share: 7 },
    { vendor: 'Osmos', share: 5 },
  ],
  persona_metrics: {
    manual_hours: 18,
    forecast_accuracy: 60,
  },
};

// Brand colors
const colors = {
  navy: '#001E60',
  cyan: '#01B2FF',
  lime: '#6CEE60',
  grey: '#cccccc',
  darkText: '#333333',
};

// Global chart store to avoid re-creation
const charts = {};

// Create all charts when their slide becomes visible
Reveal.on('slidechanged', (event) => {
  const id = event.currentSlide.id;
  if (id && typeof chartCreators[id] === 'function') {
    chartCreators[id]();
  }

  // add active class for fade-in of charts
  const chartContainers = event.currentSlide.querySelectorAll('.chart-container, .chart-container-small');
  chartContainers.forEach((div) => div.classList.add('active'));
});

// Chart creator functions keyed by slide id
const chartCreators = {
  'slide-2': createMarketOpportunityChart,
  'slide-3': createTamChart,
  'slide-5': createMarketShareChart,
  'slide-7': createInvestmentChart,
  // Gauges for personas derived inside slide 4 creation
  'slide-4': createPersonaGauges,
};

// ----------------------
// Market Opportunity Line Chart (Slide 2)
// ----------------------
function createMarketOpportunityChart() {
  if (charts.marketOpportunity) return;
  const ctx = document.getElementById('marketChart');
  if (!ctx) return;

  charts.marketOpportunity = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.years,
      datasets: [
        {
          label: 'Retail Media Spend ($B)',
          data: data.retail_media_spend,
          borderColor: colors.cyan,
          backgroundColor: `${colors.cyan}26`,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: colors.cyan,
          pointRadius: 4,
        },
        {
          label: 'Total Digital Ad Spend ($B)',
          data: data.digital_ad_spend,
          borderColor: colors.navy,
          backgroundColor: `${colors.navy}13`,
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: colors.navy,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 14, family: 'Poppins', weight: '500' },
            color: colors.darkText,
          },
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'USD Billions',
            font: { size: 14, weight: '600', family: 'Poppins' },
          },
          ticks: { color: colors.darkText, font: { size: 12 } },
          grid: { color: '#e0e0e0' },
        },
        x: {
          ticks: { color: colors.darkText, font: { size: 12 } },
          grid: { display: false },
        },
      },
    },
  });
}

// ----------------------
// TAM / SAM / SOM Doughnut Chart (Slide 3)
// ----------------------
function createTamChart() {
  if (charts.tam) return;
  const ctx = document.getElementById('tamChart');
  if (!ctx) return;

  charts.tam = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        `TAM $${data.tam}B`,
        `SAM $${data.sam}B`,
        `SOM $${data.som}B`,
      ],
      datasets: [
        {
          data: [data.tam, data.sam, data.som],
          backgroundColor: [colors.navy, colors.cyan, colors.lime],
          borderColor: [colors.navy, colors.cyan, colors.lime],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '50%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 14, weight: '600', family: 'Poppins' },
            color: colors.darkText,
          },
        },
        title: { display: false },
      },
    },
  });
}

// ----------------------
// Market Share Bar Chart (Slide 5)
// ----------------------
function createMarketShareChart() {
  if (charts.marketShare) return;
  const ctx = document.getElementById('marketShareChart');
  if (!ctx) return;

  charts.marketShare = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.market_share.map((d) => d.vendor),
      datasets: [
        {
          label: 'Market Share (%)',
          data: data.market_share.map((d) => d.share),
          backgroundColor: data.market_share.map((d) =>
            d.vendor === 'Osmos' ? colors.lime : colors.cyan
          ),
          borderColor: colors.navy,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 40,
          ticks: { color: colors.darkText },
          grid: { color: '#e0e0e0' },
        },
        x: {
          ticks: { color: colors.darkText },
          grid: { display: false },
        },
      },
    },
  });
}

// ----------------------
// Investment Pie Chart (Slide 7)
// ----------------------
function createInvestmentChart() {
  if (charts.investment) return;
  const ctx = document.getElementById('investmentChart');
  if (!ctx) return;

  charts.investment = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Product 50%', 'Ops 30%', 'Marketing 20%'],
      datasets: [
        {
          data: [50, 30, 20],
          backgroundColor: [colors.navy, colors.cyan, colors.lime],
          borderColor: [colors.navy, colors.cyan, colors.lime],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 14, weight: '600', family: 'Poppins' }, color: colors.darkText },
        },
        title: { display: false },
      },
    },
  });
}

// ----------------------
// Persona Gauges (Slide 4)
// ----------------------
function createPersonaGauges() {
  if (charts.personaGauges) return; // prevent duplicate

  // Helper to create semicircle gauge as doughnut
  function createGauge(canvasId, value, maxValue, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Remaining'],
        datasets: [
          {
            data: [value, maxValue - value],
            backgroundColor: [color, colors.grey],
            borderWidth: 0,
          },
        ],
      },
      options: {
        rotation: -90,
        circumference: 180,
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
  }

  const gauge1 = createGauge('hoursGauge', data.persona_metrics.manual_hours, 40, colors.cyan);
  const gauge2 = createGauge('accuracyGauge', data.persona_metrics.forecast_accuracy, 100, colors.lime);
  charts.personaGauges = [gauge1, gauge2];
}

// ----------------------
// Initial chart creation on first load (title slide doesn't need charts)
// ----------------------
Reveal.on('ready', (event) => {
  const id = event.currentSlide.id;
  if (id && typeof chartCreators[id] === 'function') {
    chartCreators[id]();
  }
});

// ----------------------
// Accessibility: prevent common save/print shortcuts
// ----------------------
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['s', 'p'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});

// Disable context menu
window.addEventListener('contextmenu', (e) => e.preventDefault());

// Resize charts on window resize for responsiveness
window.addEventListener('resize', () => {
  Object.values(charts).forEach((chart) => {
    if (Array.isArray(chart)) {
      chart.forEach((c) => c && c.resize());
    } else if (chart && typeof chart.resize === 'function') {
      chart.resize();
    }
  });
});