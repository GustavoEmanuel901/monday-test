import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EscolasService, EscolaDto, CreateEscolaRequest } from '../../services/escolas.service';

@Component({
  selector: 'app-escolas-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './escolas-form.component.html',
})
export class EscolasFormComponent implements OnInit {
  isEdit = false;
  escolaId: string | null = null;
  loading = false;
  errorMessage = '';

  form = {
    descricao: '',
  };

  constructor(
    private service: EscolasService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.escolaId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.escolaId;

    if (this.isEdit && this.escolaId) {
      this.loadEscola(this.escolaId);
    }
  }

  loadEscola(id: string): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (escola) => {
        this.form.descricao = escola.descricao;
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
      this.errorMessage = 'Por favor, preencha a descrição da escola.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request: CreateEscolaRequest = {
      descricao: this.form.descricao,
    };

    const operation =
      this.isEdit && this.escolaId
        ? this.service.update(this.escolaId, request)
        : this.service.create(request);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/escolas']);
      },
      error: (err) => {
        const error = this.service.parseError(err);
        this.errorMessage = error.message;
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/escolas']);
  }

  isValid(): boolean {
    return !!this.form.descricao.trim();
  }
}
