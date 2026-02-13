import { Component, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { MatSidenavContent } from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/list';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { MatButtonModule } from "@angular/material/button";


@Component({
    selector: 'app-private',
    imports: [CommonModule, RouterOutlet, MatToolbar, MatIcon, MatSidenavContainer, MatSidenav, MatNavList, MatSidenavContent, MatDivider, RouterLinkWithHref, MatButtonModule],
    templateUrl: './private.html',
    styleUrl: './private.css'
})

export class Private implements OnDestroy, AfterViewInit {

    // Variables
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    isAuth = false;

    // Constructor
    constructor(private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher, public authService: AuthService, private router: Router) {

        // Estas opciones hacen que cambie el menu según el tamaño de la pantalla
        this.mobileQuery = this.media.matchMedia('(max-width: 800px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    // Revisa si el usuario esta logueado
    checkAuth() {
        this.authService.sesionCheck().subscribe(response => {
            this.isAuth = response;
        });
    }

    // Llama al servicio logout
    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: () => {
            }
        });
    }
}

