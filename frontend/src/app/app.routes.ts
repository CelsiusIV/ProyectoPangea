import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { Information } from './pages/public/information/information';
import { Aboutus } from './pages/public/aboutus/aboutus';
import { Contact } from './pages/public/contact/contact';
import { Private } from './pages/private/private';
import { Public } from './pages/public/public';
import { Dashboard } from './pages/private/dashboard/dashboard';
import { Users } from './pages/private/users/users';
import { Account } from './pages/private/account/account';
import { Clases } from './pages/public/clases/clases';
import { authGuard } from './auth-guard';
import { Administration } from './pages/private/administration/administration';

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
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'usuarios', component: Users },
            { path: 'cuenta', component: Account },
            { path: 'administracion', component: Administration}

        ]
    },
    { path: '**', redirectTo: '' } 
];
