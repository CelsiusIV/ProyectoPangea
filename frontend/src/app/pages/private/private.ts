import { Component, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { MatSidenavContent } from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/list';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';


@Component({
  selector: 'app-private',
  imports: [RouterOutlet, MatToolbar, MatIcon, MatMenu, MatSidenavContainer, MatSidenav, MatNavList, MatSidenavContent, MatDivider, RouterLinkWithHref],
  templateUrl: './private.html',
  styleUrl: './private.css'
})

export class Private  implements OnDestroy, AfterViewInit {

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    isAdmin: boolean = false;

    private autoLogoutSubscription: Subscription = new Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
    }


    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }
}

