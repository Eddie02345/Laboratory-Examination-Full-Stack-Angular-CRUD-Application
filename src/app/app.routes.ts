import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LeaderList } from './pages/leader-list/leader-list';
import { LeaderForm } from './pages/leader-form/leader-form';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home,
    title: 'Pokémon League - HQ'
  },
  {
    path: 'leaders',
    component: LeaderList,
    title: 'Pokémon League - Directory'
  },
  {
    path: 'leaders/new',
    component: LeaderForm,
    title: 'Pokémon League - Register Leader'
  },
  {
    path: 'leaders/:id/edit',
    component: LeaderForm,
    title: 'Pokémon League - Edit Leader'
  },
  {
    path: '**',
    component: NotFound,
    title: 'Pokémon League - 404 Not Found'
  }
];