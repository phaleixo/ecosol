# 🌿 Ecosol - Plataforma de Economia Solidária

A **Ecosol** é uma plataforma voltada para a gestão e fomento da economia solidária, projetada para conectar prestadores e consumidores em um ecossistema sustentável. Desenvolvida com foco em performance e escalabilidade utilizando **Next.js 16**, **Prisma 7.2** e **Supabase**.

---

## 🚀 Tecnologias principais

* **Framework:** [Next.js 16 (Turbopack)](https://nextjs.org/)
* **ORM:** [Prisma 7.2](https://www.prisma.io/)
* **Database:** [Supabase (PostgreSQL)](https://supabase.com/)
* **E-mail:** [Resend](https://resend.com/)
* **Estilização:** Tailwind CSS

---

## 💻 Começando

Primeiro, instale as dependências:

```bash
npm install

Depois, inicie o servidor de desenvolvimento:
Bash

npm run dev

Abra http://localhost:3000 no seu navegador para ver o resultado.
🛠 Configuração do Backend (Prisma 7 + Supabase)

No Prisma 7.2, as URLs de conexão não são mais suportadas diretamente no arquivo schema.prisma. Elas são gerenciadas via prisma.config.ts.
1. Variáveis de Ambiente (.env)

Certifique-se de que caracteres especiais na senha estejam codificados (ex: * como %2A, $ como %24). Recomenda-se o host IPv4 para evitar problemas de conexão em sistemas Linux.
Snippet de código

# URL para a aplicação (Porta 6543 - Transaction Mode com PgBouncer)
DATABASE_URL="postgresql://postgres.[ID]:[SENHA]@[HOST]:6543/postgres?pgbouncer=true"

# URL para Migrações e CLI (Porta 5432 - Session Mode Direto)
DIRECT_URL="postgresql://postgres.[ID]:[SENHA]@[HOST]:5432/postgres"

# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL="https://[ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_chave_anon_aqui"

# E-mail Service
RESEND_API_KEY="re_sua_chave_aqui"

2. Configuração do Prisma CLI (prisma.config.ts)

O arquivo de configuração deve apontar para a DIRECT_URL para que as migrações e comandos de terminal funcionem corretamente:
TypeScript

import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  datasource: {
    // O CLI utiliza esta URL para migrações (Porta 5432)
    url: process.env.DIRECT_URL as string,
  },
});

3. Sincronização de Banco de Dados
Bash

# Gerar o Prisma Client
npx prisma generate

# Sincronizar o schema com o banco (ou usar migrate para dev)
npx prisma db push

🔐 Autenticação e Storage (Supabase)

Configurações obrigatórias no painel do Supabase:

    Redirect URLs: Adicione http://localhost:3000/** em Authentication > URL Configuration.

    Storage: Criar um bucket público chamado logos para armazenamento de imagens.

    Auth Helpers: Implementado em app/oauth/consent/page.tsx para gerenciar autorizações de login.

📦 Deploy

O projeto está configurado para deploy contínuo na Vercel. Para realizar o deploy via terminal:
Bash

# Preview
vercel

# Produção
vercel --prod