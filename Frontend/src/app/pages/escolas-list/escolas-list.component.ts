import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { FilterCardComponent } from '../../shared/filter-card/filter-card.component';
import { DataTableComponent, TableColumn } from '../../shared/data-table/data-table.component';
import { EscolasService, EscolaDto } from '../../services/escolas.service';

@Component({
  selector: 'app-escolas-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageHeaderComponent,
    FilterCardComponent,
    DataTableComponent,
  ],
  templateUrl: './escolas-list.component.html',
})
export class EscolasListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', align: 'left' },
    { key: 'descricao', label: 'Descrição', align: 'left' },
  ];

  escolas: EscolaDto[] = [];
  descricao = '';
  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(
    private service: EscolasService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  load(): void {
    this.page = 1;
    this.loadData();
  }

  loadData(): void {
    this.service.list(this.descricao, this.page, this.pageSize).subscribe((res) => {
      this.escolas = res.itens;
      this.totalItems = res.totalItens;
      this.totalPages = Math.max(1, Math.ceil(res.totalItens / this.pageSize));
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadData();
  }

  remove(escola: any): void {
    if (!confirm('Confirmar exclusão?')) return;
    this.service.delete(escola.id).subscribe(() => this.load());
  }

  onNovaEscola(): void {
    this.router.navigate(['/escolas/novo']);
  }
}
