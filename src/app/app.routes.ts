import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { List } from './features/list/list';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', component: List },
      { path: 'dashboard', component: Dashboard },
    ],
  },
];
