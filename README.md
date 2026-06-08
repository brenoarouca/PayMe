# PayMe - Sistema de Gerenciamento de Cobranças

## 📝 Sobre o Projeto

O **PayMe** é uma aplicação desenvolvida para a disciplina de Engenharia de Software com o objetivo de gerenciar cobranças financeiras. O sistema permite o controle de pendências, associação de participantes a cobranças, divisão de valores e acompanhamento de pagamentos.

Este projeto foca na aplicação prática de conceitos fundamentais da engenharia de software, como:
- Desenvolvimento Orientado a Testes (TDD).
- Arquitetura de Software em camadas.
- Modelagem de dados relacional.
- Documentação técnica automatizada.

---

## 🛠️ Metodologia e Ferramentas

### Metodologia: TDD (Test Driven Development)
O desenvolvimento seguiu rigorosamente o ciclo do TDD:
1.  🔴 **RED**: Escrita de testes unitários que falham antes de qualquer implementação.
2.  🟢 **GREEN**: Implementação do código mínimo necessário para que os testes passem.
3.  🔵 **REFACTOR**: Melhoria da estrutura do código mantendo o comportamento validado pelos testes.

### Ferramentas Utilizadas

**Backend:**
- **NestJS**: Framework Node.js para construção de APIs eficientes e escaláveis.
- **TypeScript**: Linguagem base para maior segurança e tipagem.
- **TypeORM**: ORM para interação com o banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Jest**: Framework de testes utilizado para o TDD.
- **Swagger**: Geração automática da documentação das rotas da API.
- **Compodoc**: Documentação técnica da estrutura do código fonte.

**Frontend:**
- **React**: Biblioteca para construção da interface de usuário.
- **Vite**: Build tool rápida para projetos modernos.
- **TanStack Start/Router**: Gerenciamento de rotas e estado.
- **Tailwind CSS & Shadcn UI**: Estilização e componentes de interface.

**Infraestrutura:**
- **Git & GitHub**: Versionamento e colaboração.
- **Docker**: Containerização do ambiente (Banco de dados).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v20+)

### 1. Clonar o Repositório
```bash
git clone https://github.com/usuario/payme.git
cd payme
```

### 2. Configurar o Backend (API)
```bash
cd api
npm install
# Configure o arquivo .env baseado no .env.example
# Certifique-se de ter um banco de dados PostgreSQL rodando
npm run migration:run
npm run start:dev
```

### 3. Configurar o Frontend (Web)
```bash
cd ../web
npm install
npm run dev
```

---

## 📚 Documentação

O projeto conta com dois níveis de documentação:

### 1. Documentação da API (Swagger)
Fornece uma interface interativa para testar os endpoints da aplicação.
- **Como acessar**: Com o servidor rodando, acesse `http://localhost:3000/api`

### 2. Documentação do Código Fonte (Compodoc)
Gera um relatório detalhado sobre a arquitetura do código (módulos, classes, controladores, etc).
- **Como visualizar**:
  - Os arquivos estáticos já estão gerados na pasta `api/documentation`.
  - Para abrir, utilize um servidor de arquivos estáticos ou abra o arquivo `api/documentation/index.html` no navegador.
  - Para gerar novamente (no backend): `npx compodoc -p tsconfig.json`

---

## 🧪 Testes
Para executar a suíte de testes (essencial para validar o TDD):
```bash
cd api
npm run test        # Testes unitários
npm run test:e2e    # Testes de integração (End-to-End)
```

---

## 🏗️ Estrutura do Software
O projeto implementa CRUDs completos para:
- **Participantes**: Gerenciamento de pessoas (Nome, Email, Telefone).
- **Cobranças**: Criação de cobranças com recorrência e valor total.
- **Vínculos**: Associação dinâmica entre participantes e cobranças, permitindo rateio de valores e controle de vencimentos.
