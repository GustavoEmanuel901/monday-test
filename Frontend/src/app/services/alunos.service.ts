import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AlunoDto {
  id: string;
  nome: string;
  cpf: string;
  celular: string;
  dataNascimento: string;
}

export interface PagedResult<T> {
  itens: T[];
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
}

export interface CreateAlunoRequest {
  nome: string;
  cpf: string;
  celular: string;
  dataNascimento: string;
}

export interface UpdateAlunoRequest extends CreateAlunoRequest {}

export interface ApiError {
  status: number | null;
  message: string;
  details?: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class AlunosService {
  private baseUrl = '/api/alunos';
  constructor(private http: HttpClient) {}

  list(
    name?: string,
    cpf?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PagedResult<AlunoDto>> {
    const params: any = { page, pageSize };
    if (name) params.name = name;
    if (cpf) params.cpf = cpf;
    return this.http.get<PagedResult<AlunoDto>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<AlunoDto> {
    return this.http.get<AlunoDto>(`${this.baseUrl}/${id}`);
  }

  create(body: CreateAlunoRequest): Observable<AlunoDto> {
    return this.http.post<AlunoDto>(this.baseUrl, body);
  }

  update(id: string, body: UpdateAlunoRequest): Observable<AlunoDto> {
    return this.http.put<AlunoDto>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  parseError(error: any): ApiError {
    if (!error) {
      return { status: null, message: 'Erro desconhecido' };
    }

    const status: number | null = typeof error.status === 'number' ? error.status : null;
    const baseMessage =
      error.error?.error || error.error?.message || error.message || 'Erro ao processar requisição';

    // 400: validação
    if (status === 400) {
      if (error.error?.errors) {
        const details = error.error.errors;
        const firstError = Object.values(details)[0] as string[] | undefined;
        const message = firstError?.[0] || 'Dados inválidos. Verifique os campos.';
        return { status, message, details };
      }
      return { status, message: baseMessage || 'Dados inválidos' };
    }

    // 409: conflito (email duplicado)
    if (status === 409) {
      return { status, message: baseMessage || 'Operação em conflito (email já cadastrado?)' };
    }

    // 404: não encontrado
    if (status === 404) {
      return { status, message: 'Cliente não encontrado' };
    }

    // Outros
    return { status, message: baseMessage };
  }
}
