import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlunosService, AlunoDto } from './../../services/alunos.service';

@Component({
  selector: 'app-alunos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './alunos-list.component.html',
})
export class AlunosListComponent implements OnInit {
  alunos: AlunoDto[] = [];
  nome = '';
  cpf = '';
  page = 1;
  pageSize = 10;
  sortField: 'nome' | 'cpf' = 'nome';
  sortDir: 'asc' | 'desc' = 'asc';
  totalItems = 0;
  totalPages = 1;

  constructor(private service: AlunosService) {}

  ngOnInit(): void {
    this.loadData();
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

  remove(id: string): void {
    if (!confirm('Confirmar exclusão?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
