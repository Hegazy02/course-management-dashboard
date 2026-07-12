import { TableColumn } from '../../../../../shared/components/general-table/table-column.model';
import { Course } from '../../../models/course.model';

export const courseColumns: TableColumn<Course>[] = [
  {
    field: 'thumbnail',
    header: 'Thumbnail',
    type: 'image',
  },
  {
    field: 'courseName',
    header: 'Course Name',
    clickable: true,
  },
  {
    field: 'instructorName',
    header: 'Instructor',
  },
  {
    field: 'category',
    header: 'Category',
  },
  {
    field: 'duration',
    header: 'Duration (Hours)',
    type: 'number',
  },
  {
    field: 'price',
    header: 'Price',
    type: 'number',
  },
  {
    field: 'status',
    header: 'Status',
    type: 'tag',
  },
  {
    field: 'createdDate',
    header: 'Created Date',
    type: 'date',
  },
];
