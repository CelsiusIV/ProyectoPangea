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
import { LoginBox } from "../../component/login-box/login-box";
import { App } from "../../app";
import { Public } from "../public/public";
import { ClassType } from '../../shared/models/classes.interface';
import { ClassTypeService } from '../../service/class-type-service';


@Component({
    selector: 'app-private',
    imports: [CommonModule, RouterOutlet, MatToolbar, MatIcon, MatSidenavContainer, MatSidenav, MatNavList, MatSidenavContent, MatDivider, RouterLinkWithHref, LoginBox, App, Public],
    templateUrl: './private.html',
    styleUrl: './private.css'
})

export class Private implements OnDestroy, AfterViewInit {

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    isAuth = false;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher, public authService: AuthService, private router: Router) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    checkAuth() {
        this.authService.sesionCheck().subscribe(response => {
            this.isAuth = response;
        });
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/']);
                console.log("sesion cerrada");
            },
            error: () => {
                console.log("ERRROOOOOOOOOOOOOOOOOOOOOOOOOOOOR");
            }
        });
    }
}

