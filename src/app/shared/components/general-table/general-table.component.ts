import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
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

  // Outputs
  cellClick = output<{
    column: TableColumn<T>;
    row: T;
    value: T[keyof T];
  }>();

  lazyLoad = output<TableLazyLoadEvent>();

  pageChange = output<TablePageEvent>();

  selectionChange = output<T | T[]>();

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

  getSeverity(value: boolean): 'success' | 'danger' {
    return value ? 'success' : 'danger';
  }
  onLazyLoad(event: TableLazyLoadEvent): void {
    if(event.first !== undefined && event.rows !== undefined) {
     
      this.lazyLoad.emit(event);
    }
  }
}
