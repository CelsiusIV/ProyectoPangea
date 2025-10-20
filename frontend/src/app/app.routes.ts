import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Information } from './pages/information/information';
import { Aboutus } from './pages/aboutus/aboutus';
import { Contact } from './pages/contact/contact';
import { Private } from './pages/private/private';

export const routes: Routes = [
    {path: '', component:Home},
    {path: 'informacion', component:Information},
    {path: 'nosotros', component:Aboutus},
    {path: 'contacto', component:Contact},
    {path: 'privado', component:Private},
    {path: '**', redirectTo: ''} /*Con esto si el usuario pone una ruta que no existe, lo lleva al inicio*/
];
