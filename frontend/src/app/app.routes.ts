import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { Information } from './pages/public/information/information';
import { Aboutus } from './pages/public/aboutus/aboutus';
import { Contact } from './pages/public/contact/contact';
import { Private } from './pages/private/private';

export const routes: Routes = [
    {path: '', component:Home},
    {path: 'informacion', component:Information},
    {path: 'nosotros', component:Aboutus},
    {path: 'contacto', component:Contact},
    {path: 'privado', component:Private},
    {path: '**', redirectTo: ''} /*Con esto si el usuario pone una ruta que no existe, lo lleva al inicio*/
];
