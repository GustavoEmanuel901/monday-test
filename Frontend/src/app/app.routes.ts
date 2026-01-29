import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { AlunosListComponent } from './pages/alunos-list/alunos-list.component';
import { AlunosFormComponent } from './pages/alunos-form/alunos-form.component';
import { EscolasListComponent } from './pages/escolas-list/escolas-list.component';
import { EscolasFormComponent } from './pages/escolas-form/escolas-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'alunos', component: AlunosListComponent, canActivate: [authGuard] },
  { path: 'alunos/novo', component: AlunosFormComponent, canActivate: [authGuard] },
  { path: 'alunos/:id', component: AlunosFormComponent, canActivate: [authGuard] },
  { path: 'escolas', component: EscolasListComponent, canActivate: [authGuard] },
  { path: 'escolas/novo', component: EscolasFormComponent, canActivate: [authGuard] },
  { path: 'escolas/:id', component: EscolasFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' },
];
