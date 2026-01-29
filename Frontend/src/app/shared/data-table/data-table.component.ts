import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent<T> implements OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() emptyMessage = 'Nenhum registro encontrado';
  @Input() showActions = true;
  @Input() editRoute = '';
  @Input() idKey = 'id'; // Key to use for the ID in routes

  // Pagination inputs
  @Input() showPagination = true;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;

  @Output() deleteItem = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('DataTable - data changed:', {
        previousValue: changes['data'].previousValue,
        currentValue: changes['data'].currentValue,
        dataLength: this.data?.length,
      });
    }
  }

  onDelete(item: T): void {
    this.deleteItem.emit(item);
  }

  getCellValue(item: any, key: string): any {
    return item[key];
  }

  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any) => string;
}
