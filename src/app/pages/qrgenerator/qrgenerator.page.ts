import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QrcodeService } from 'src/app/services/qrcode.service';
import { saveAs } from 'file-saver';
import { LoadingController, ToastController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-qrgenerator',
  templateUrl: './qrgenerator.page.html',
  styleUrls: ['./qrgenerator.page.scss'],
})
export class QrgeneratorPage implements OnInit {
  title: string = 'Generar QR';
  qrCodeUrl!: string;
  formQR!: FormGroup;
  private toastController = inject(ToastController);
  nombre: any;
  rif: any;
  showLoading: boolean = false;

  @ViewChild('qrContainer') qrContainer!: ElementRef;

  constructor(private fb: FormBuilder, private qrcodeService: QrcodeService) {
    this.createForm();
  }

  private createForm() {
    this.formQR = this.fb.group({
      nombre: ['',],
      cedula_rif: ['',],
    });
  }

  get nameControl(): AbstractControl {
    return this.formQR.get('nombre')!;
  }

  get rifControl(): AbstractControl {
    return this.formQR.get('cedula_rif')!;
  }

  ngOnInit() {
    const storedRegisters = localStorage.getItem('currentUser');

    if (storedRegisters) {
      const decodedToken = this.decodeToken(storedRegisters);
      this.nombre = decodedToken.nombre;
      this.rif = decodedToken.cedula_rif;
      localStorage.setItem('empresa-aliada',JSON.stringify(this.nombre))
      this.formQR.get('nombre')?.patchValue(this.nombre);
      this.formQR.get('cedula_rif')?.patchValue(this.rif);

      this.generateQRCode();
    }
  }

  decodeToken(token: string): any {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  async generateQRCode() {
    if (this.formQR.invalid) {
      this.presentToast('Ocurrió un error. Inténtalo de nuevo', 'danger');
      return;
    }

    const nombre = this.nombre;
    const cedula_rif = this.rif;

    this.showLoading = true;

    try {
      const result = await this.qrcodeService.generateQRCode(cedula_rif, nombre).toPromise();

      if (result.status) {
        this.qrCodeUrl = result.qrCode;
        this.presentToast('QR generado exitosamente', 'success');
      } else {
        this.presentToast('No se pudo generar el QR', 'danger');
      }
    } catch (error) {
      this.presentToast('El aliado no existe', 'danger');
    } finally {
      this.showLoading = false;
    }
  }

  async downloadQRCode() {
    if (this.qrCodeUrl) {
      const qrContainer = this.qrContainer.nativeElement;
      qrContainer.style.display = 'block';  // Mostrar temporalmente el contenedor
  
      html2canvas(qrContainer, {
        useCORS: true,
        scale: 4, // Aumentar la resolución de la captura
      }).then(canvas => {
        qrContainer.style.display = 'none';  // Ocultar el contenedor nuevamente
        canvas.toBlob(blob => {
          if (blob) {
            saveAs(blob, `${this.nameControl.value}.PNG`);
            this.presentToast('QR descargado con éxito', 'success');
          }
        });
      });
    } else {
      console.error('No QR code URL to download');
    }
  }
  
  
  
  
}
