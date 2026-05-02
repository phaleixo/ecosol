# Ecosol

![Screenshot 640x360](public/icons/screenshot-640x360.png)

Plataforma de Economia Solidária

<p>
  <a href="https://nextjs.org" title="Next.js">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nextdotjs.svg" alt="Next.js" width="36" height="36" style="vertical-align:middle; margin-right:8px;" />
  </a>
  <a href="https://www.typescriptlang.org" title="TypeScript">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg" alt="TypeScript" width="36" height="36" style="vertical-align:middle; margin-right:8px;" />
  </a>
  <a href="https://www.prisma.io" title="Prisma">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/prisma.svg" alt="Prisma" width="36" height="36" style="vertical-align:middle; margin-right:8px;" />
  </a>
  <a href="https://supabase.com" title="Supabase">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/supabase.svg" alt="Supabase" width="36" height="36" style="vertical-align:middle; margin-right:8px;" />
  </a>
</p>


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
- Use `.env.local.example` como referência; mantenha `.env.local` em `.gitignore`.


## Versão do aplicativo

A aplicação lê a versão exibida a partir do campo `version` no arquivo `package.json`. Para alterar a versão em todo o app, basta atualizar o valor de `version` em `package.json` (por exemplo, `"version": "1.2.0"`) e reiniciar o servidor de desenvolvimento/produção.

Exemplo:

```json
{
  "version": "1.2.0"
}
```


Licença - MIT
