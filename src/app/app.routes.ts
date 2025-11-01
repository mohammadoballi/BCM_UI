import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Dashboard,
      },
    ],
  },
];
