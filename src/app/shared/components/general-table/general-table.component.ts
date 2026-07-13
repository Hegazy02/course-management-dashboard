import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal, DestroyRef, inject, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TableLazyLoadEvent, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TableColumn } from './table-column.model';

@Component({
  selector: 'app-general-table',
  standalone: true,
  imports: [TableModule, TagModule, Skeleton, DatePipe],
  templateUrl: './general-table.component.html',
  styleUrl: './general-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralTableComponent<T> {
  // Inputs
  columns = input<TableColumn<T>[]>([]);
  data = input<T[]>([]);
  loading = input(false);

  totalRecords = input(0);
  rows = input(10);

  paginator = input(false);
  paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');

  showCurrentPageReport = input(false);
  currentPageReportTemplate = input('{first} to {last} of {totalRecords}');

  lazy = input(false);
  lazyLoadOnInit = input(false);

  scrollable = input(false);
  scrollHeight = input<string>();

  virtualScroll = input(false);
  virtualScrollItemSize = input(40);
  virtualScrollOptions = input<{ delay?: number; scrollHeight?: string }>();

  stripedRows = input(false);
  showGridlines = input(false);

  tableStyle = input<Record<string, string>>({
    'min-width': '50rem',
  });

  selectionMode = input<'single' | 'multiple'>();
  selection = input<T | T[] | null>();

  rowsPerPageOptions = input<number[]>();
  alwaysShowPaginator = input(true);

  emptyMessage = input('No records found.');
  rowHover = input(false);

  size = input<'small' | 'large'>();
  skeletonRows = input(5);
  responsiveLayout = input<'scroll' | 'stack'>('scroll');

  // Outputs
  cellClick = output<{
    column: TableColumn<T>;
    row: T;
    value: T[keyof T];
  }>();

  lazyLoad = output<TableLazyLoadEvent>();

  pageChange = output<TablePageEvent>();

  selectionChange = output<T | T[]>();

  private readonly destroyRef = inject(DestroyRef);
  readonly isMobile = signal(false);
  readonly currentPage = signal(1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalRecords() / this.rows())));
  private readonly isStackMode = computed(() => this.responsiveLayout() === 'stack' && this.isMobile());

  constructor() {
    const mql = window.matchMedia('(max-width: 768px)');
    this.isMobile.set(mql.matches);
    fromEvent(mql, 'change')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e: Event) => this.isMobile.set((e.target as MediaQueryList).matches));

    effect(() => {
      if (this.isStackMode() && this.lazy() && this.lazyLoadOnInit() && this.totalRecords() === 0) {
        this.loadPage(1);
      }
    });
  }

  skeletonRowsArray = computed(() => Array.from({ length: this.skeletonRows() }, (_, i) => i));

  onCellClick(column: TableColumn<T>, row: T, value: T[Extract<keyof T, string>]): void {
    if (column.clickable) {
      this.cellClick.emit({
        column,
        row,
        value,
      });
    }
  }

  firstItem = computed(() => (this.currentPage() - 1) * this.rows() + 1);
  lastItem = computed(() => Math.min(this.currentPage() * this.rows(), this.totalRecords()));

  onRowSelect(row: T): void {
    if (this.selectionMode() === 'single') {
      this.selectionChange.emit(row);
    }
  }

  getSeverity(value: boolean): 'success' | 'danger' | 'secondary' {
    return value ? 'success' : 'danger';
  }
  loadPage(page: number): void {
    if (!this.lazy()) return;
    const rows = this.rows();
    this.currentPage.set(page);
    this.lazyLoad.emit({ first: (page - 1) * rows, rows, globalFilter: undefined as any });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    if (event.first !== undefined && event.rows != null) {
      this.currentPage.set(Math.floor(event.first / event.rows) + 1);
      this.lazyLoad.emit(event);
    }
  }
}
