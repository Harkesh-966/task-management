import {
    ChangeDetectionStrategy,
    Component,
    effect,
    signal,
    inject,
    HostListener
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { ToastComponent } from './shared/toast/toast.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from './core/services/confirm-dialog.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent, ConfirmDialogComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    private dialog = inject(ConfirmDialogService);
    private router = inject(Router);
    private location = inject(Location)
    private auth = inject(AuthService);
    theme = signal<'dark' | 'light'>((localStorage.getItem('tm_theme') as any) || 'light');
    isAuthPage = signal(false);

    menuOpen = signal(false);

    user = this.auth.user;

    constructor() {

        if (!this.location.path(true).includes("/auth")) {
            this.auth.bootstrapSession()
        }
        const updateAuthPage = (url: string) => {
            const onAuth = url.startsWith('/auth');
            this.isAuthPage.set(onAuth);
            document.body.classList.toggle('no-scroll', onAuth);
            this.menuOpen.set(false);
        };
        updateAuthPage(this.router.url);
        this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe(e => updateAuthPage(e.urlAfterRedirects));

        effect(() => {
            void this.user();
            this.menuOpen.set(false);
        });
    }

    toggleTheme() {
        this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    }

    toggleMenu(ev: MouseEvent) {
        ev.stopPropagation();
        this.menuOpen.update(v => !v);
    }
    closeMenu() { this.menuOpen.set(false); }

    logout() {
        this.auth.logout();
    }

    async onLogout() {
        const ok = await this.dialog.open({
            title: 'Logout',
            message: 'Do you really want to logout?',
            confirmText: 'Logout',
            cancelText: 'Cancel',
            type: 'danger'
        });
        if (ok) {
            this.auth.logout();
            this.router.navigateByUrl('/auth/login');

        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(e: MouseEvent) {
        const el = e.target as HTMLElement | null;
        if (!el?.closest('.header__account')) {
            this.menuOpen.set(false);
        }
    }
}
