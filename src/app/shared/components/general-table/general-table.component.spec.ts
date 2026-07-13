import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralTableComponent } from './general-table.component';
import { TableColumn } from './table-column.model';

interface TestItem {
  id: number;
  name: string;
}

const columns: TableColumn<TestItem>[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
];

describe('GeneralTableComponent', () => {
  let component: GeneralTableComponent<TestItem>;
  let fixture: ComponentFixture<GeneralTableComponent<TestItem>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralTableComponent<TestItem>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', columns);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data rows', () => {
    const data: TestItem[] = [
      { id: 1, name: 'Item A' },
      { id: 2, name: 'Item B' },
    ];
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Item A');
    expect(el.textContent).toContain('Item B');
  });
});
