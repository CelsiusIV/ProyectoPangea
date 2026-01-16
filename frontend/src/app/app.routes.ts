import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { Information } from './pages/public/information/information';
import { Aboutus } from './pages/public/aboutus/aboutus';
import { Contact } from './pages/public/contact/contact';
import { Private } from './pages/private/private';
import { Public } from './pages/public/public';
import { Dashboard } from './pages/private/dashboard/dashboard';
import { Schedules } from './pages/private/schedules/schedules';
import { Site } from './pages/private/site/site';
import { Users } from './pages/private/users/users';
import { Account } from './pages/private/account/account';
import { Clases } from './pages/public/clases/clases';

export const routes: Routes = [
    {
        path: '', component: Public,
        children: [
            { path: '', component: Home },
            { path: 'clases', component: Clases },
            { path: 'informacion', component: Information },
            { path: 'nosotros', component: Aboutus },
            { path: 'contacto', component: Contact },
        ]
    },

    {
        path: 'privado', component: Private,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'horarios', component: Schedules },
            { path: 'sitio', component: Site },
            { path: 'usuarios', component: Users },
            { path: 'cuenta', component: Account }

        ]
    },
    { path: '**', redirectTo: '' } /*Con esto si el usuario pone una ruta que no existe, lo lleva al inicio*/
];
