# Ecosol

Plataforma de Economia Solidária — protótipo em Next.js + TypeScript, Prisma e Supabase.

Obs:

- Use `.env.local.example` como referência; mantenha `.env.local` em `.gitignore`.

Pré-requisitos

- Node.js 18+

## Como rodar localmente

Siga estes passos mínimos para executar a aplicação em desenvolvimento.

1. Instale dependências

```bash
npm install
```

2. Crie um arquivo de ambiente

```bash
cp .env.local.example .env.local
# Preencha os valores sensíveis em .env.local
```

3. Gere o cliente do Prisma (após ter `DATABASE_URL` configurado)

```bash
npx prisma generate
```

4. (Opcional) Verifique tipos TypeScript

```bash
npx tsc --noEmit
```

5. Rode o app em modo de desenvolvimento

```bash
npm run dev
```

Observações:

- Se estiver implantando na Vercel, garanta que as variáveis de ambiente estejam configuradas no painel do projeto.
- Para executar migrations use `npx prisma migrate deploy` (ou `npx prisma migrate dev` em desenvolvimento quando desejar aplicar migrations localmente).

Licença - MIT

# Ecosol

Plataforma de Economia Solidária — protótipo em Next.js + TypeScript, Prisma e Supabase.

Obs:

- Use `.env.example` como referência; mantenha `.env.local` em `.gitignore`.

Pré-requisitos

- Node.js 18+

Licença - MIT
