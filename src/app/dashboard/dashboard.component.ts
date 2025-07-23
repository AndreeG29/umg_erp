import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { GoogleChartsModule } from 'angular-google-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, GoogleChartsModule]
})
export class DashboardComponent implements OnInit {
  user = {
    name: 'Usuario',
    role: 'Usuario'
  };

  stats = {
    totalSales: 0,
    totalProducts: 0,
    totalClients: 0,
    totalEmployees: 0
  };

  salesChart: any = {
    title: 'Ventas por Mes (Q)',
    type: 'ColumnChart',
    data: [
      ['Enero', 0],
      ['Febrero', 0],
      ['Marzo', 0],
      ['Abril', 0],
      ['Mayo', 0],
      ['Junio', 0],
      ['Julio', 0]
    ],
    columnNames: ['Mes', 'Ventas'],
    options: {
      height: 400,
      animation: {
        duration: 1000,
        easing: 'out'
      },
      colors: ['#3498db'],
      backgroundColor: 'transparent',
      chartArea: {
        width: '85%',
        height: '80%'
      },
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: {
          color: '#2c3e50',
          fontSize: 14
        }
      },
      titleTextStyle: {
        color: '#2c3e50',
        fontSize: 18,
        bold: true
      },
      hAxis: {
        textStyle: {
          color: '#7f8c8d'
        },
        gridlines: {
          color: '#f5f5f5'
        }
      },
      vAxis: {
        textStyle: {
          color: '#7f8c8d'
        },
        gridlines: {
          color: '#f5f5f5'
        },
        format: 'Q#,###'
      }
    }
  };

  productsChart: any = {
    title: 'Productos Más Vendidos',
    type: 'PieChart',
    data: [],
    columnNames: ['Producto', 'Cantidad'],
    options: {
      height: 400,
      colors: ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22'],
      backgroundColor: 'transparent',
      chartArea: {
        width: '90%',
        height: '80%'
      },
      legend: {
        position: 'right',
        textStyle: {
          color: '#2c3e50',
          fontSize: 14
        }
      },
      titleTextStyle: {
        color: '#2c3e50',
        fontSize: 18,
        bold: true
      },
      pieSliceTextStyle: {
        color: 'white',
        fontSize: 14
      },
      pieHole: 0.4,
      pieSliceBorderColor: 'white',
      pieSliceText: 'percentage',
      tooltip: {
        showColorCode: true,
        textStyle: {
          color: '#2c3e50',
          fontSize: 14
        }
      },
      animation: {
        duration: 1000,
        easing: 'out',
        startup: true
      }
    }
  };

  salesTrendChart: any = {
    title: 'Tendencia de Ventas',
    type: 'LineChart',
    data: [
      ['Ago', 4200], ['Sep', 4500], ['Oct', 5100], 
      ['Nov', 5400], ['Dic', 6200], ['Ene', 5800],
      ['Feb', 5900], ['Mar', 6500], ['Abr', 6300],
      ['May', 6800], ['Jun', 7200], ['Jul', 7500]
    ],
    columnNames: ['Mes', 'Ventas'],
    options: {
      height: 300,
      curveType: 'function',
      colors: ['#3498db'],
      backgroundColor: 'transparent',
      chartArea: { width: '85%', height: '75%' },
      legend: { position: 'none' },
      hAxis: { textStyle: { color: '#7f8c8d' } },
      vAxis: { format: 'Q#,###', textStyle: { color: '#7f8c8d' } },
      pointSize: 6,
      lineWidth: 3,
      animation: { duration: 1000, easing: 'out' }
    }
  };

  categoryChart: any = {
    title: 'Ventas por Categoría',
    type: 'AreaChart',
    data: [
      ['Ene', 1200, 800, 400],
      ['Feb', 1300, 900, 450],
      ['Mar', 1400, 950, 500],
      ['Abr', 1350, 850, 550],
      ['May', 1500, 1000, 600],
      ['Jun', 1600, 1050, 650],
      ['Jul', 1700, 1100, 700]
    ],
    columnNames: ['Mes', 'Electrónicos', 'Muebles', 'Accesorios'],
    options: {
      height: 300,
      colors: ['#3498db', '#2ecc71', '#9b59b6'],
      backgroundColor: 'transparent',
      isStacked: true,
      chartArea: { width: '85%', height: '70%' },
      legend: { position: 'top' },
      animation: { duration: 1000, easing: 'out' }
    }
  };

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
    this.loadSalesChart();
    this.loadProductsChart();
    this.loadSalesTrendChart();
    this.loadCategoryChart();
  }

  loadUserData(): void {
    this.authService.getCurrentUser().subscribe({
      next: (userData) => {
        console.log('Datos del usuario desde backend:', userData);
        this.user.name = userData.name || 'Usuario';
        this.user.role = userData.role || 'Usuario';
      },
      error: (error) => {
        console.error('Error obteniendo datos del usuario:', error);
        this.user.name = 'Usuario';
      }
    });
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe(data => {
      this.stats = data;
    });
  }

  loadSalesChart(): void {
    this.dashboardService.getSalesByMonth().subscribe(data => {
      if (data && data.labels && data.values) {
        this.salesChart.data = data.labels.map((label: string, index: number) => [
          label, data.values[index]
        ]);
      }
    });
  }

  loadProductsChart(): void {
    this.dashboardService.getTopProducts().subscribe(data => {
      if (data && data.labels && data.values) {
        this.productsChart.data = data.labels.map((label: string, index: number) => [
          label, data.values[index]
        ]);
      }
    });
  }

  loadSalesTrendChart(): void {
    this.dashboardService.getSalesTrend().subscribe(data => {
      if (data && data.labels && data.values) {
        this.salesTrendChart.data = data.labels.map((label: string, index: number) => [
          label, data.values[index]
        ]);
      }
    });
  }

  loadCategoryChart(): void {
    this.dashboardService.getSalesByCategory().subscribe(data => {
      if (data && data.months && data.categories) {
        const months = data.months;
        const categories = data.categories;
        
        this.categoryChart.data = months.map((month: string, i: number) => {
          const row: any[] = [month];
          categories.forEach((category: any) => {
            row.push(category.values[i]);
          });
          return row;
        });

        this.categoryChart.columnNames = ['Mes', ...categories.map((c: any) => c.name)];
      }
    });  
  }
}
