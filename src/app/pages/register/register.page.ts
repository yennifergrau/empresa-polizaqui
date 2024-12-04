import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  title: string = 'Regístrate';
  formRegister!: FormGroup;
  passwordFieldType: string = 'password';
  passwordIcon: string = 'eye-off'; 
  showLoading: boolean = false;
  verificarCorreoControl: FormControl = new FormControl(''); // Control separado para "verificar correo"
  correoNoCoincide: boolean = false; // Variable para el error de coincidencia
  correoCoincide: boolean = false
  isSecondCheckboxChecked = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.formulario();
  }

  ngOnInit() {}

  verificarCoincidencia(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const correoVerificado = inputElement.value;
    
    const correoTomador = this.formRegister.get('email')?.value;
    
    // Verificar si los correos coinciden
    this.correoNoCoincide = correoTomador !== correoVerificado;
    this.correoCoincide = correoTomador === correoVerificado; // Nueva propiedad para el éxito
  }

  formulario(): void {
    this.formRegister = this.fb.group({
      cedula_rif: ['', [Validators.required, Validators.pattern(/^[JGVEjgevp]-\d{8}-\d{1}$/)]],
      nombre: ['', [Validators.required]], 
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^(0414|0416|0424|0426|0412)-\d{7}$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]

    });
  }

  get rifControl(): AbstractControl {
    return this.formRegister.get('cedula_rif')!;
  }

  get nameControl(): AbstractControl {
    return this.formRegister.get('nombre')!;
  }

  get telefonoControl(): AbstractControl {
    return this.formRegister.get('telefono')!;
  }

  get emailControl(): AbstractControl {
    return this.formRegister.get('email')!;
  }

  get direControl(): AbstractControl {
    return this.formRegister.get('direccion')!;
  }

  get passwordControl(): AbstractControl {
    return this.formRegister.get('password')!;
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordFieldType === 'password' ? 'eye-off' : 'eye';
  }

  async Submit() {
    if (this.formRegister.valid) {
        this.showLoading = true;

        this.http.post<any>(`${environment.register}/register`, this.formRegister.value).pipe(
            catchError((error: HttpErrorResponse) => {
                this.showLoading = false;
                if (error.error && error.error.message === "Aliado Already Registered") {
                    this.presentToast('Aliado ya registrado', 'danger');
                } else if (error.error.code === 400) {
                    this.presentToast('Correo ya registrado', 'danger');
                } else {
                    this.presentToast('Ocurrió un error. Inténtalo de nuevo', 'danger');
                }
                return throwError(error);
            })
        ).subscribe((res: any) => {
            this.showLoading = false;
            if (res.code === 200) {
                this.presentToast('Registro Exitoso...', 'success');
                this.navCtrl.navigateRoot(['Login']);
            }
        });
    } else {
        // Verificar específicamente el campo de contraseña
        if (this.passwordControl.errors?.['minlength']) {
            this.presentToast('La contraseña debe tener al menos 6 caracteres', 'danger');
        } else {
            this.presentToast('Completa todos los campos', 'danger');
        }
    }
}


  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  login() {
    this.navCtrl.navigateRoot(['Login']);
  }
}
