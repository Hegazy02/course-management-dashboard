export interface TableColumn<T> {
  field: Extract<keyof T, string>;
  header: string;
  type?: 'text' | 'date' | 'number' | 'boolean' | 'tag' | 'image';
  clickable?: boolean;
  filterable?: boolean;
  width?: string;
  format?: string;
  severity?: (row: T) => 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
}
