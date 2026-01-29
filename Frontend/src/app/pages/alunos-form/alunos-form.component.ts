import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlunosService, AlunoDto, CreateAlunoRequest } from '../../services/alunos.service';
import { EscolasService, EscolaDto } from '../../services/escolas.service';
import { z } from 'zod';

// Schema de validação Zod
const alunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF inválido'),
  celular: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$/, 'Celular inválido'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  codEscola: z.string().min(1, 'Escola é obrigatória'),
});

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
  fieldErrors: Record<string, string> = {};

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
    // Limpar erros anteriores
    this.fieldErrors = {};
    this.errorMessage = '';

    // Validar com Zod
    const validation = alunoSchema.safeParse(this.form);

    if (!validation.success) {
      // Mapear erros do Zod para o objeto fieldErrors
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          this.fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      this.errorMessage = 'Por favor, corrija os erros antes de continuar.';
      return;
    }

    this.loading = true;

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

  // Máscaras
  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Aplica máscara: xxx.xxx.xxx-xx
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    this.form.cpf = value;
  }

  onCelularInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Aplica máscara: (xx) xxxxx-xxxx ou (xx) xxxx-xxxx
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/, '($1) $2');
      if (value.length === 15) {
        // (xx) xxxxx-xxxx
        value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
      } else {
        value = value.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
      }
    }

    this.form.celular = value;
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
