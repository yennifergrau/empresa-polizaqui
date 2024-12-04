import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QrcodeService } from 'src/app/services/qrcode.service';
import { ReportAliado } from 'src/app/shared/models/reporteInterface';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  public items: ReportAliado[] = [];
  public filteredItems: ReportAliado[] = [];  // Almacena los elementos filtrados
  public searchTerm: string = '';
  public startDate: string = '';
  public endDate: string = '';
  private reporteSeleccionado: ReportAliado[] = [];
  private activatedRoute = inject(ActivatedRoute)
  loading: boolean = false;
  private reportService = inject(QrcodeService);
  public documento: any;
  selectedDateInitial: string = '';
  selectedDateFinaly :  string = '';
  nombre:any

  constructor() { }

  ngOnInit() {
    this.nombre = this.activatedRoute.snapshot.paramMap.get('nombre');
    this.getReport();
  }
  
  toggleDetalles(reporte: any) {
    reporte.mostrarDetalles = !reporte.mostrarDetalles;
    this.items.forEach((c: { mostrarDetalles: boolean; }) => {
      if (c !== reporte) {
        c.mostrarDetalles = false;
      }
    });
  }
  private getReport() {
    this.reportService.getReportData().subscribe(data => {
      this.items = data.data;
      console.log(data);
  
      // Filtrar por nombre y empresa
      this.filteredItems = this.items.filter(item => item.empresa === this.nombre);
      console.log(this.filteredItems);
      
    });
  }
  


  getMetodoPagoTexto(metodo: string): string {
    switch (metodo) {
      case 'CELE':
        return 'Pago Móvil';
      case 'CNTA':
        return 'Transferencia Bancaria';
      default:
        return metodo; // Si no coincide, devuelve el valor original
    }
  }

  mostrarDetalles(reporte: any) {
    this.reporteSeleccionado = reporte;
  }

}
