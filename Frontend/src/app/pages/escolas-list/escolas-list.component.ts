import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-escolas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './escolas-list.component.html',
})
export class EscolasListComponent {
  escolas = [
    {
      id: 1,
      nome: 'Escola Municipal João Silva',
      endereco: 'Rua das Flores, 123',
      telefone: '(11) 1234-5678',
      totalAlunos: 450,
    },
    {
      id: 2,
      nome: 'Colégio Estadual Maria Santos',
      endereco: 'Av. Principal, 456',
      telefone: '(11) 2345-6789',
      totalAlunos: 680,
    },
    {
      id: 3,
      nome: 'Escola Particular Educação Plus',
      endereco: 'Rua do Conhecimento, 789',
      telefone: '(11) 3456-7890',
      totalAlunos: 320,
    },
  ];
}
