import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { NewsToolbar } from '../../news-toolbar/news-toolbar';

@Component({
  selector: 'app-main-header',
  imports: [RouterLink, RouterLinkActive, NewsToolbar],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  private readonly router = inject(Router);

  currentDate: string = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  issueNumber: number = 1;

  // The header sits OUTSIDE <router-outlet>, so it isn't re-created when the
  // page changes. To react to navigation we listen to the router's event
  // stream (an Observable), keep only "navigation finished" events, and pull
  // out the final URL. `toSignal` turns that Observable into a signal, which
  // is easier to use in templates and in computed().
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  // '/' and '/world-news' both redirect to '/home', and urlAfterRedirects
  // gives the final address, so checking '/home' covers all three.
  readonly showNewsToolbar = computed(() => this.url().startsWith('/home'));
}
