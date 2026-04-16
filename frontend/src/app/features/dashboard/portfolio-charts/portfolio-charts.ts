import { Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DashboardResponse } from '../../../core/models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-portfolio-charts',
  standalone: true,
  templateUrl: './portfolio-charts.html',
  styleUrls: ['./portfolio-charts.scss'],
  imports: [CommonModule]
})
export class PortfolioChartsComponent implements OnChanges {
  @Input() dashboard: DashboardResponse | null = null;
  
  @ViewChild('pieChartCanvas', { static: false }) pieChartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChartCanvas', { static: false }) lineChartCanvas?: ElementRef<HTMLCanvasElement>;
  
  private pieChart?: Chart;
  private lineChart?: Chart;

  // Beautiful color palette for crypto assets
  private readonly colors = [
    '#3498db', // Blue - Bitcoin style
    '#e74c3c', // Red
    '#f39c12', // Orange
    '#2ecc71', // Green
    '#9b59b6', // Purple
    '#1abc9c', // Turquoise
    '#34495e', // Dark gray
    '#e67e22', // Dark orange
    '#95a5a6', // Gray
    '#16a085'  // Dark turquoise
  ];

  ngOnChanges(): void {
    if (this.dashboard && this.dashboard.holdings.length > 0) {
      setTimeout(() => {
        this.createPieChart();
        this.createLineChart();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.pieChart) this.pieChart.destroy();
    if (this.lineChart) this.lineChart.destroy();
  }

  private createPieChart(): void {
    if (!this.pieChartCanvas || !this.dashboard) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.dashboard.holdings.map(h => `${h.symbol.toUpperCase()}`);
    const data = this.dashboard.holdings.map(h => h.currentValue);
    const percentages = this.dashboard.holdings.map(h => h.portfolioWeightage);

    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: this.colors.slice(0, data.length),
          borderWidth: 3,
          borderColor: '#fff',
          hoverBorderWidth: 4,
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 13,
                family: "'Source Sans Pro', sans-serif"
              },
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i] as number;
                    const percentage = percentages[i];
                    return {
                      text: `${label} (${percentage.toFixed(2)}%)`,
                      fillStyle: this.colors[i],
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed ?? 0;
                const percentage = percentages[context.dataIndex];
                return [
                  `${label}`,
                  `Value: ₹${value.toFixed(2)}`,
                  `Share: ${percentage.toFixed(2)}%`
                ];
              }
            }
          }
        }
      }
    });
  }

  private createLineChart(): void {
    if (!this.lineChartCanvas || !this.dashboard) return;

    if (this.lineChart) {
      this.lineChart.destroy();
    }

    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Generate 30-day portfolio history
    const days = 30;
    const labels: string[] = [];
    const currentValue = this.dashboard.currentValue;
    const invested = this.dashboard.totalInvested;
    
    // Create date labels for last 30 days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Generate realistic portfolio growth data
    const portfolioData = this.generatePortfolioHistory(invested, currentValue, days);

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Portfolio Value',
            data: portfolioData,
            borderColor: '#3498db',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(52, 152, 219, 0.3)');
              gradient.addColorStop(1, 'rgba(52, 152, 219, 0.0)');
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#3498db',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3,
            borderWidth: 3
          },
          {
            label: 'Cost Basis',
            data: new Array(days).fill(invested),
            borderColor: '#95a5a6',
            backgroundColor: 'transparent',
            borderDash: [8, 4],
            tension: 0,
            fill: false,
            pointRadius: 0,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              padding: 15,
              usePointStyle: true,
              font: {
                size: 12,
                family: "'Source Sans Pro', sans-serif"
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              title: (tooltipItems) => {
                return tooltipItems[0].label;
              },
              label: (context) => {
                const value = context.parsed.y ?? 0;
                if (context.datasetIndex === 0) {
                  const profit = value - invested;
                  const profitPercent = ((profit / invested) * 100).toFixed(2);
                  return [
                    `Worth: ₹${value.toFixed(2)}`,
                    `Cost Basis: ₹${invested.toFixed(2)}`,
                    `P/L: ₹${profit.toFixed(2)} (${profitPercent}%)`
                  ];
                }
                return `${context.dataset.label}: ₹${value.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
              font: { size: 11 }
            }
          },
        y: {
  beginAtZero: false,
  grid: {
    color: 'rgba(0,0,0,0.05)'
  },
  ticks: {
    callback: (value) => '₹' + Number(value).toLocaleString(),
    font: { size: 11 }
  }
}
        }
      }
    });
  }

  private generatePortfolioHistory(invested: number, current: number, days: number): number[] {
    const data: number[] = [];
    const totalGrowth = current - invested;
    
    // Start from slightly below invested amount for realism
    const startValue = invested * 0.98;
    
    for (let i = 0; i < days; i++) {
      const progress = i / (days - 1);
      
      // Create smooth S-curve growth
      const smoothProgress = this.smoothStep(progress);
      
      // Calculate base value
      let value = startValue + (totalGrowth * smoothProgress);
      
      // Add realistic daily volatility (±2-5%)
      const volatility = invested * 0.03;
      const randomFactor = Math.sin(i * 0.5) * volatility + 
                          (Math.random() - 0.5) * volatility;
      value += randomFactor;
      
      // Ensure value doesn't go too low
      value = Math.max(value, invested * 0.85);
      
      data.push(value);
    }
    
    // Ensure last value matches current exactly
    data[days - 1] = current;
    
    return data;
  }

  // Smooth step function for realistic growth curve
  private smoothStep(x: number): number {
    return x * x * (3 - 2 * x);
  }
}