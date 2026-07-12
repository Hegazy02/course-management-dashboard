import { Injectable, computed, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.clear();
      }
    });
  }
  private readonly requests = signal(new Set<string>());

  readonly loading = computed(() => this.requests().size > 0);

  show(id: string): void {
    this.requests.update((requests) => {
      const next = new Set(requests);
      next.add(id);
      return next;
    });
  }

  hide(id: string): void {
    this.requests.update((requests) => {
      const next = new Set(requests);
      next.delete(id);
      return next;
    });
  }

  clear(): void {
    this.requests.set(new Set());
  }
}
