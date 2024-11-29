import { Routes } from '@angular/router';
import { FacultadComponent } from './facultad/facultad.component';
import { SedeComponent } from './sede/sede.component';
import { NavegarComponent } from './component/navegar/navegar.component';

export const routes: Routes = [
    { 
        path: 'facultad',
        component: FacultadComponent,
        title: 'Facultades'
    },
    {
        path: 'sede',
        component: SedeComponent,
        title: 'Sedes' 
    },
    {
        path: '**',
        component: NavegarComponent,
        title: 'Navegar'
    }
];
