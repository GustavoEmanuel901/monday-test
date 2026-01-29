import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlunosService, AlunoDto, CreateAlunoRequest } from '../../services/alunos.service';

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

  form = {
    nome: '',
    cpf: '',
    celular: '',
    dataNascimento: '',
  };

  constructor(
    private service: AlunosService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.alunoId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.alunoId;

    if (this.isEdit && this.alunoId) {
      this.loadAluno(this.alunoId);
    }
  }

  loadAluno(id: string): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (aluno) => {
        this.form.nome = aluno.nome;
        this.form.cpf = aluno.cpf;
        this.form.celular = aluno.celular;
        // Convert to yyyy-MM-dd format for input[type="date"]
        if (aluno.dataNascimento) {
          const date = new Date(aluno.dataNascimento);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          this.form.dataNascimento = `${year}-${month}-${day}`;
        }
        this.loading = false;
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
      this.form.dataNascimento
    );
  }
}
