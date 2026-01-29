import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './auth/auth.guard';
import { AlunosListComponent } from './pages/alunos-list/alunos-list.component';
import { EscolasListComponent } from './pages/escolas-list/escolas-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'alunos', component: AlunosListComponent, canActivate: [authGuard] },
  { path: 'escolas', component: EscolasListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' },
];
