import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './core/services/loader.service';
import { ToastComponent } from "./shared/components/toast/toast.component";
import { LoaderComponent } from "./shared/components/loader/loader.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('course-management-dashboard');
    protected readonly loader = inject(LoaderService);

}
