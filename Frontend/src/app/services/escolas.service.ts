import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EscolaDto {
  codEscola: string;
  descricao: string;
}

export interface PagedResult<T> {
  itens: T[];
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
}

export interface CreateEscolaRequest {
  descricao: string;
}

export interface UpdateEscolaRequest extends CreateEscolaRequest {}

export interface ApiError {
  status: number | null;
  message: string;
  details?: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class EscolasService {
  private readonly API_URL = 'http://localhost:8080/api';

  private baseUrl = `${this.API_URL}/Escolas`;
  constructor(private http: HttpClient) {}

  list(
    descricao?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PagedResult<EscolaDto>> {
    const params: any = { page, pageSize };
    // Só adiciona descricao se tiver valor
    if (descricao && descricao.trim()) {
      params.descricao = descricao;
    }
    console.log('EscolasService - Chamando API com params:', params);
    return this.http.get<PagedResult<EscolaDto>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<EscolaDto> {
    return this.http.get<EscolaDto>(`${this.baseUrl}/${id}`);
  }

  create(body: CreateEscolaRequest): Observable<EscolaDto> {
    return this.http.post<EscolaDto>(this.baseUrl, body);
  }

  update(id: string, body: UpdateEscolaRequest): Observable<EscolaDto> {
    return this.http.put<EscolaDto>(`${this.baseUrl}/${id}`, body);
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

    // 409: conflito
    if (status === 409) {
      return { status, message: baseMessage || 'Operação em conflito (registro já cadastrado?)' };
    }

    // 404: não encontrado
    if (status === 404) {
      return { status, message: 'Escola não encontrada' };
    }

    // Outros
    return { status, message: baseMessage };
  }
}
