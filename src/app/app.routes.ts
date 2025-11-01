import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './shared/components/layout/layout';
import { Card } from './pages/card/card';
import { authorizeGuard } from './core/guard/authorize-guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'dashboard',
    component:  Layout,
    children: [
      {
        path: '',
        component: Dashboard,
        canActivate: [authorizeGuard]
      },
      {
        path: 'card',
        component: Card,
        canActivate: [authorizeGuard]
      },
    ],
  },
];
