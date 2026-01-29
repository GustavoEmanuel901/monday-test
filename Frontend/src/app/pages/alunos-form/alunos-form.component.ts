import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlunosService, AlunoDto, CreateAlunoRequest } from '../../services/alunos.service';
import { EscolasService, EscolaDto } from '../../services/escolas.service';

@Component({
  selector: 'app-alunos-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alunos-form.component.html',
})
export class AlunosFormComponent implements OnInit {
  isEdit = false;
  alunoId: string | null = null;
  loading = false;
  errorMessage = '';
  escolas: EscolaDto[] = [];

  form = {
    nome: '',
    cpf: '',
    celular: '',
    dataNascimento: '',
    codEscola: '',
  };

  constructor(
    private service: AlunosService,
    private escolasService: EscolasService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.alunoId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.alunoId;

    this.loadEscolas();

    if (this.isEdit && this.alunoId) {
      this.loadAluno(this.alunoId);
    }
  }

  loadEscolas(): void {
    // Carregar todas as escolas (página 1, 1000 itens para pegar todas)
    this.escolasService.list('', 1, 1000).subscribe({
      next: (res) => {
        this.escolas = res.itens;
      },
      error: (err) => {
        console.error('Erro ao carregar escolas:', err);
      },
    });
  }

  loadAluno(id: string): void {
    this.loading = true;
    console.log('Carregando aluno com ID:', id);
    this.service.getById(id).subscribe({
      next: (aluno) => {
        console.log('Dados recebidos da API:', aluno);
        this.form.nome = aluno.nome;
        this.form.cpf = aluno.cpf;
        this.form.celular = aluno.celular;
        this.form.codEscola = aluno.codEscola;
        // Convert to yyyy-MM-dd format for input[type="date"]
        if (aluno.dataNascimento) {
          const date = new Date(aluno.dataNascimento);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          this.form.dataNascimento = `${year}-${month}-${day}`;
        }
        console.log('Formulário preenchido:', this.form);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const error = this.service.parseError(err);
        this.errorMessage = error.message;
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request: CreateAlunoRequest = {
      nome: this.form.nome,
      cpf: this.form.cpf,
      celular: this.form.celular,
      dataNascimento: this.form.dataNascimento,
      codEscola: this.form.codEscola,
    };

    const operation =
      this.isEdit && this.alunoId
        ? this.service.update(this.alunoId, request)
        : this.service.create(request);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/alunos']);
      },
      error: (err) => {
        const error = this.service.parseError(err);
        this.errorMessage = error.message;
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/alunos']);
  }

  isValid(): boolean {
    return !!(
      this.form.nome.trim() &&
      this.form.cpf.trim() &&
      this.form.celular.trim() &&
      this.form.dataNascimento &&
      this.form.codEscola
    );
  }
}
