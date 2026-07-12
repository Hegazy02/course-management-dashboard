import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/course-list',
    pathMatch: 'full',
  },
  {
    path: 'course-list',
    loadComponent: () =>
      import('./features/courses/pages/course-list/course-list.component').then(
        (m) => m.CourseListComponent,
      ),
  },
  {
    path: 'course-list/:id',
    loadComponent: () =>
      import('./features/courses/pages/course-detail/course-detail.component').then(
        (m) => m.CourseDetailComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
  },
];
