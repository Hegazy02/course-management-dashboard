import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-dialog-confirmation',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './dialog-confirmation.component.html',
  styleUrl: './dialog-confirmation.component.css',
})
export class ConfirmationDialogComponent {
  protected readonly service = inject(ConfirmationService);
}
