import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  protected readonly loader = inject(LoaderService);
}
