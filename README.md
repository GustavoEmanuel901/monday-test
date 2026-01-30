# Avaliação Angular Full-Stack

## Objetivo

Desenvolver uma aplicação **CRUD** utilizando o framework **Angular** para o **front-end** e **.NET** para o **back-end**.  
O armazenamento dos dados será feito **em memória**, não sendo necessário o uso de banco de dados.

---

## 1️⃣ Back-end

### Requisitos

- Criar uma **API em .NET**.
- Implementar **endpoints** para manipulação de dados de **Alunos** e **Escolas**.
- Armazenar os dados **em memória**.
- Criar um endpoint de **login** que gere um **token JWT**, necessário para acessar os endpoints internos de Alunos e Escolas.

### Modelos de Dados

#### 📘 Alunos
- `iCodAluno` (int): Identificador único  
- `sNome` (string): Nome do aluno  
- `dNascimento` (date): Data de nascimento  
- `sCPF` (string): CPF do aluno  
- `sEndereco` (string): Endereço  
- `sCelular` (string): Telefone celular  
- `iCodEscola` (int): Identificador da escola associada  

#### 🏫 Escolas
- `iCodEscola` (int): Identificador único  
- `sDescricao` (string): Descrição da escola  

#### 👤 Usuários
- `iCodUsuario` (int): Identificador único  
- `sNome` (string): Nome do usuário  
- `sSenha` (string): Senha do usuário  

### Ferramentas Recomendadas

- Visual Studio (opcional)

---

## 2️⃣ Front-end

### Requisitos

- Desenvolver a interface utilizando **Angular**, consumindo a API criada.
- Criar uma **tela de Login** como página inicial.  
  - Credenciais fixas:
    - **Usuário:** `TESTE`
    - **Senha:** `123`
- Criar uma **página de listagem de Alunos**, acessível após o login.
- Criar uma **página de listagem de Escolas**, associada aos alunos.
- Implementar **CRUD completo** (Incluir, Alterar e Excluir) para:
  - Alunos
  - Escolas
- Criar um **menu de navegação** para acesso às listas de Alunos e Escolas.
- Incluir um **botão de sair** no menu para retornar à tela de login.
- Implementar **máscaras de input** quando necessário:
  - CPF
  - Telefone
  - Data de nascimento
- Criar campo de **pesquisa**:
  - Alunos: busca por **Nome** e **CPF**
  - Escolas: busca por **Descrição**
- Garantir que o layout seja:
  - **Responsivo (mobile)**
  - **Amigável ao usuário**
- Utilizar **Bootstrap**, **Angular Material** ou outro framework de componentes.
- Organizar o projeto utilizando:
  - Components
  - Classes
  - Services
- Aplicar **boas práticas** de organização, estruturação e indentação do código.

### Ferramentas Recomendadas

- Node.js  
- NPM (Gerenciador de pacotes)  
- Visual Studio Code (opcional)

---

## 3️⃣ Observações sobre a aplicação (opcional)

Utilize este espaço para descrever decisões técnicas, desafios encontrados ou melhorias futuras.

---

## 4️⃣ Portfólio e Experiência (opcional)

- Zênite: [https://zenitefacil.com.br/](https://zenitefacil.com.br/)
- Ficates: [https://www.iem.inf.br/softwares/](https://www.iem.inf.br/softwares/detalhe/1/ficates-sistema-de-fiscalizacao-e-calculo-do-transporte-escolar)
- QrCattle: [https://qrcattle.com/](https://qrcattle.com/)

---

## ✅ Critérios de Avaliação

- Correta implementação dos requisitos  
- Boas práticas de desenvolvimento  
- Estrutura e organização do código  
- Layout responsivo e boa usabilidade  
- Uso adequado de componentes e serviços no Angular  

---

**Boa sorte! 🚀**
