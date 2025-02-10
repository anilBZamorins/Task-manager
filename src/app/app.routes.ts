import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/task-master' },
    { path: 'task-master',component: PagesComponent},
    
];

