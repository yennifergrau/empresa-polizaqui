import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  title: string = 'Iniciar Sesión';
  subtitle: string = 'Olvidaste tu contraseña';
  formLogin!: FormGroup;
  passwordFieldType: string = 'password'; // Tipo de campo de contraseña
  passwordIcon: string = 'eye-off'; // Icono de ojo
  loading: boolean = false; // Bandera para mostrar/ocultar el loader

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {
    this.formulario();
  }

  ngOnInit() {}

  formulario(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get emailControl(): AbstractControl {
    return this.formLogin.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.formLogin.get('password')!;
  }

  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordFieldType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  async Submit() {
    if (this.formLogin.valid) {
      this.loading = true; // Mostrar el loader

      const { email, password } = this.formLogin.value;
      this.authService.login(email, password).subscribe(
        (res: any) => {
          this.loading = false; // Ocultar el loader
          if (res.code === 200) {
            this.presentToast('Inicio Exitoso...', 'success');
            localStorage.setItem('currentUser', JSON.stringify(res));
            setTimeout(() => {
              this.navCtrl.navigateRoot(['qrgenerator']);
            }, 2500);
          }
        },
        (error) => {
          this.loading = false; // Ocultar el loader
          this.presentToast('Credenciales inválidas', 'danger');
        }
      );
    } else {
      this.presentToast('Completa los campos', 'danger');
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

  RoutingNavigate() {
    this.navCtrl.navigateRoot(['recuperacion']);
  }

  Routing() {
    this.navCtrl.navigateRoot(['register']);
  }
}
