import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './utils/404_notFound/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { PolicyComponent } from './shared/models/policy/policy.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  },
  {
    path: 'Login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'qrgenerator',
    loadChildren: () => import('./pages/qrgenerator/qrgenerator.module').then( m => m.QrgeneratorPageModule),
    //canActivate:[AuthGuard]
  },
  {
    path: 'recuperacion',
    loadChildren: () => import('./pages/recuperacion/recuperacion.module').then( m => m.RecuperacionPageModule),
  },
  {
    path: 'confirm-forgot/:email',
    loadChildren: () => import('./pages/confirm-forgot/confirm-forgot.module').then( m => m.ConfirmForgotPageModule)
  },
  {
    path: 'report/:nombre',
    loadChildren: () => import('./pages/report/report.module').then( m => m.ReportPageModule)
  },
  {
    path:'term-policy-dev',
    component: PolicyComponent
  },
  {
    path:'**',component:NotFoundComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
