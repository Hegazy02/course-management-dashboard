import { Injectable, signal } from '@angular/core';

export interface ConfirmationConfig {
  header: string;
  message: string;
  accept: () => void;
  reject?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  dialog = signal<ConfirmationConfig | null>(null);

  confirm(config: ConfirmationConfig) {
    this.dialog.set(config);
  }

  close() {
    this.dialog.set(null);
  }
}