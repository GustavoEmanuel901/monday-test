import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlunosService, AlunoDto } from './../../services/alunos.service';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { FilterCardComponent } from '../../shared/filter-card/filter-card.component';
import { DataTableComponent, TableColumn } from '../../shared/data-table/data-table.component';

@Component({
  selector: 'app-alunos-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageHeaderComponent,
    FilterCardComponent,
    DataTableComponent,
  ],
  templateUrl: './alunos-list.component.html',
})
export class AlunosListComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'nome', label: 'Nome', align: 'left' },
    { key: 'cpf', label: 'CPF', align: 'left' },
    { key: 'celular', label: 'Celular', align: 'left' },
    {
      key: 'dataNascimento',
      label: 'Nascimento',
      align: 'left',
      formatter: (value: string) => {
        if (!value) return '';
        const date = new Date(value);
        return date.toLocaleDateString('pt-BR');
      },
    },
  ];

  alunos: AlunoDto[] = [];
  nome = '';
  cpf = '';
  page = 1;
  pageSize = 10;
  sortField: 'nome' | 'cpf' = 'nome';
  sortDir: 'asc' | 'desc' = 'asc';
  totalItems = 0;
  totalPages = 1;

  constructor(
    private service: AlunosService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onNovoAluno(): void {
    this.router.navigate(['/alunos/novo']);
  }

  load(): void {
    this.page = 1;
    this.loadData();
  }

  loadData(): void {
    this.service.list(this.nome, this.cpf, this.page, this.pageSize).subscribe((res) => {
      this.alunos = res.itens;
      this.totalItems = res.totalItens;
      this.totalPages = Math.max(1, Math.ceil(res.totalItens / this.pageSize));
      this.cdr.detectChanges();
    });
  }

  prev(): void {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }
  next(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadData();
    }
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadData();
  }

  remove(aluno: any): void {
    // if (!confirm('Confirmar exclusão?')) return;
    this.service.delete(aluno.codAluno).subscribe(() => {
      // Se deletar o último item da página atual e não for a primeira página, volta uma página
      if (this.alunos.length === 1 && this.page > 1) {
        this.page--;
      }
      this.loadData();
    });
  }
}
