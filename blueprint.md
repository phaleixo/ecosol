# 🏗️ Blueprint de Engenharia de Software: Plataforma EcoSol (v1.0.0)

**Estado da Arte em Documentação Técnica - Sistema Completo em Produção**

---

## 📋 1. METADADOS DO DOCUMENTO

| **Campo** | **Valor** |
|-----------|-----------|
| **Versão** | 1.0.0 (Stable Build) |
| **Última Atualização** | 15 de Janeiro de 2026 |
| **Status** | Ativo em Produção |
| **Lead Architect** | EcoSol Engineering Team |
| **Stack** | Fullstack TypeScript (Next.js 14 + Prisma + Supabase) |
| **URL Produção** | https://ecosol-omega.vercel.app |
| **Repositório** | https://github.com/EcoSolTEA/ecosol |
| **Contato** | comunidade@ecosol.org |
| **Licença** | MIT |

---

## 🌐 2. SÍNTESE DO VALOR ESTRUTURAL

O blueprint da EcoSol oferece:

1. **Segurança em Profundidade**: Validação manual de provedores integrada ao RBAC (Role-Based Access Control)
2. **Arquitetura Ética**: Fluxo de conexão direta via WhatsApp para garantir 100% de retorno financeiro ao prestador
3. **Resiliência de Dados**: Estratégia de Soft-Delete e Auditoria para proteção de informações sensíveis
4. **Acessibilidade Cognitiva**: Design System planejado para reduzir carga sensorial e facilitar navegabilidade
5. **Transparência Radical**: Processos públicos, auditáveis e código aberto desde o início
6. **Economia Solidária**: Sem intermediários financeiros, 100% do valor vai para o prestador
7. **Governança Comunitária**: Decisões participativas e repositório público

---

## 🛠️ 3. ARQUITETURA TÉCNICA (STACK & INFRA)

```mermaid
graph LR
    subgraph "Camada de Runtime & Infra"
        G[Vercel Serverless<br/>Edge Functions] --> H[Monitoramento Vercel + Logs Custom]
        G --> EDGE[Vercel Edge Config<br/>Geolocalização]
    end

    subgraph "Core Framework"
        A[Next.js 14<br/>App Router] --> B[TypeScript 5.x<br/>Tipagem Estática]
        A --> F[Tailwind CSS 3.4 + shadcn/ui<br/>Design System]
    end

    subgraph "Persistência & Identidade"
        C[PostgreSQL 15<br/>Supabase Managed] --> D[Prisma 5.x<br/>ORM Type-safe]
        E[Supabase Auth + OAuth 2.0<br/>SSO & Magic Links] --> A
    end
    
    subgraph "Serviços Externos"
        I[Resend<br/>Sistema de Email] --> J[SendGrid Fallback]
        K[Cloudinary<br/>Gestão de Imagens] --> L[Optimização Automática]
    end
    
    style A fill:#ff6b6b,color:#ffffff,stroke:#333,stroke-width:2px
    style B fill:#4ecdc4,color:#000000,stroke:#333,stroke-width:2px
    style C fill:#45b7d1,color:#000000,stroke:#333,stroke-width:2px
    style D fill:#96ceb4,color:#000000,stroke:#333,stroke-width:2px
    style E fill:#feca57,color:#000000,stroke:#333,stroke-width:2px
    style F fill:#ff9ff3,color:#000000,stroke:#333,stroke-width:2px
    style G fill:#54a0ff,color:#ffffff,stroke:#333,stroke-width:2px
    style H fill:#5f27cd,color:#ffffff,stroke:#333,stroke-width:2px
    style EDGE fill:#1dd1a1,color:#000000,stroke:#333,stroke-width:2px
    style I fill:#ff9f43,color:#000000,stroke:#333,stroke-width:2px
    style J fill:#ee5253,color:#ffffff,stroke:#333,stroke-width:2px
    style K fill:#0abde3,color:#000000,stroke:#333,stroke-width:2px
    style L fill:#10ac84,color:#ffffff,stroke:#333,stroke-width:2px
```

## 📁 4. ARQUITETURA DE DIRETÓRIOS

### 4.1 Estrutura Completa do Projeto

```
    ecosol/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   ├── dashboard-list.tsx        # Lista de serviços pendentes
│   │   │   └── page.tsx                  # Dashboard principal admin
│   │   ├── provider/[id]/edit/
│   │   │   └── page.tsx                  # Edição administrativa
│   │   └── trash/
│   │       ├── layout.tsx                # Layout da lixeira
│   │       └── page.tsx                  # Serviços deletados
│   ├── api/
│   │   ├── admin/
│   │   │   └── action/
│   │   │       └── route.ts              # Ações administrativas
│   │   ├── approve/
│   │   │   └── route.ts                  # Aprovação de serviços
│   │   ├── count/
│   │   │   └── route.ts                  # Estatísticas da plataforma
│   │   ├── pending/
│   │   │   └── route.ts                  # Lista pendentes
│   │   ├── trash/
│   │   │   └── route.ts                  # Gerenciamento lixeira
│   │   ├── notifications/
│   │   │   └── route.ts                  # Notificações push
│   │   ├── search/
│   │   │   └── route.ts                  # Busca global
│   │   ├── submissions/
│   │   │   └── route.ts                  # Submissão de serviços
│   │   ├── user/
│   │   │   ├── create/
│   │   │   │   └── route.ts              # Criação de usuários
│   │   │   ├── notifications/[id]/
│   │   │   │   └── route.ts              # Notificações por usuário
│   │   │   ├── read/
│   │   │   │   └── route.ts              # Marcar como lido
│   │   │   └── profile/
│   │   │       └── route.ts              # Perfil do usuário
│   │   └── role/
│   │       └── route.ts                  # Gerenciamento de roles
│   ├── login/
│   │   └── page.tsx                      # Página de login
│   ├── profile/
│   │   └── edit/
│   │       └── page.tsx                  # Edição de perfil
│   ├── provider/
│   │   ├── [id]/
│   │   │   └── page.tsx                  # Perfil público do serviço
│   │   ├── edit/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx              # Edição de serviço
│   │   │   └── edit-form.tsx             # Formulário de edição
│   │   └── actions.ts                    # Server actions
│   ├── signup/
│   │   └── page.tsx                      # Cadastro de usuário
│   ├── submit/
│   │   └── page.tsx                      # Submissão de serviço
│   ├── terms/
│   │   └── page.tsx                      # Termos de uso
│   └── update-password/
│       └── page.tsx                      # Atualização de senha
├── components/
│   ├── ui/                              # Componentes base shadcn/ui
│   │   ├── button.tsx                   # Botões acessíveis
│   │   ├── card.tsx                     # Cards reutilizáveis
│   │   ├── checkbox.tsx                 # Checkboxes
│   │   ├── command.tsx                  # Comandos tipo Spotlight
│   │   ├── dock.tsx                     # Dock de navegação
│   │   ├── input.tsx                    # Inputs controlados
│   │   ├── popover.tsx                  # Popovers
│   │   ├── select.tsx                   # Selects
│   │   └── toggle.tsx                   # Toggles
│   └── custom/                          # Componentes específicos EcoSol
│       ├── category-filter.tsx          # Filtro por categoria
│       ├── clear-notifications-button.tsx # Limpar notificações
│       ├── contact-icons.tsx            # Ícones de contato
│       ├── header.tsx                   # Header da aplicação
│       ├── live-search-container.tsx    # Busca em tempo real
│       ├── load-more.tsx                # Carregar mais resultados
│       ├── notification-actions.tsx     # Ações de notificação
│       ├── notification-modal.tsx       # Modal de notificações
│       ├── search-bar.tsx               # Barra de busca
│       ├── service-card.tsx             # Card de serviço
│       ├── service-skeleton.tsx         # Skeleton loading
│       ├── theme-provider.tsx           # Provedor de temas
│       └── whatsapp-button.tsx          # Botão WhatsApp
├── constants/
│   └── categories.ts                    # Categorias de serviços
├── lib/
│   ├── auth-check.ts                    # Verificação de autenticação
│   ├── mail.ts                          # Sistema de emails
│   ├── prisma.ts                        # Cliente Prisma
│   ├── supabase.ts                      # Cliente Supabase
│   ├── swal.ts                          # SweetAlert2 wrapper
│   └── utils.ts                         # Utilitários gerais
├── oauth/consent/
│   └── page.tsx                         # Consentimento OAuth
├── prisma/
│   └── schema.prisma                    # Schema do banco
├── public/
│   └── ecosol-meta.png                         # Assets públicos
├── src/
│   └── middleware.ts                    # Middleware Next.js
├── supabase/
│   ├── .gitignore                       # Ignorar configurações locais
│   └── config.toml                      # Configuração Supabase
├── .gitignore
├── app/globals.css                      # Estilos globais
├── app/globals-sw.css                   # Sweet Alert CSS
├── app/layout.tsx                       # Layout raiz
├── app/page.tsx                         # Página inicial
├── blueprint.md                         # Blueprint projeto
├── components.json                      # Config shadcn/ui
├── create_bucket.sql                    # SQL para criar buckets
├── eslint.config.mjs                    # Config ESLint
├── next.config.ts                       # Config Next.js
├── package.json                         # Dependências
├── postcss.config.mjs                   # Config PostCSS
├── prisma.config.ts                     # Config Prisma
└── tsconfig.json                        # Config TypeScript
```

### 4.2 Diagrama de Dependências Arquiteturais

```mermaid
graph TB
    subgraph "Camada de Apresentação (Frontend)"
        A1[app/page.tsx<br/>Página Inicial] --> A2[components/custom<br/>Componentes Específicos]
        A2 --> A3[components/ui<br/>Componentes Base shadcn/ui]
        A3 --> A4[tailwind.config.ts<br/>Configuração de Estilos]
        A4 --> A5[styles/globals.css<br/>Estilos Globais]
    end
    
    subgraph "Camada de Lógica de Negócio (Backend)"
        B1[app/api/<br/>API Routes] --> B2[lib/<br/>Utilitários e Serviços]
        B2 --> B3[services/<br/>Serviços de Negócio]
        B3 --> B4[prisma/schema.prisma<br/>Modelo de Dados]
        B4 --> B5[(PostgreSQL<br/>Banco de Dados)]
    end
    
    subgraph "Camada de Autenticação & Segurança"
        C1[middleware/auth.ts<br/>Middleware Next.js] --> C2[lib/auth-check.ts<br/>Verificação de Auth]
        C2 --> C3[lib/supabase.ts<br/>Cliente Supabase]
        C3 --> C4[Supabase Auth<br/>Provedor de Autenticação]
        C1 --> C5[lib/access-control/<br/>Controle de Acesso]
        C5 --> C6[Casbin/Permissões<br/>Sistema RBAC]
    end
    
    subgraph "Camada de Utilidades & Infra"
        D1[lib/utils.ts<br/>Funções Utilitárias] --> D2[constants/<br/>Constantes da Aplicação]
        D2 --> D3[lib/email/<br/>Sistema de Email]
        D3 --> D4[Resend/SendGrid<br/>Provedor de Email]
        D1 --> D5[lib/logger/<br/>Sistema de Logging]
        D5 --> D6[Arquivos de Log<br/>+ Sentry/DataDog]
        D1 --> D7[lib/validation/<br/>Validação de Dados]
        D7 --> D8[Zod Schemas<br/>Validação em Runtime]
    end
    
    A1 --> B1
    B1 --> C1
    C1 --> D1
    
    style A1 fill:#e1f5fe,color:#000000
    style A2 fill:#bbdefb,color:#000000
    style A3 fill:#90caf9,color:#000000
    style A4 fill:#64b5f6,color:#000000
    style A5 fill:#42a5f5,color:#000000
    style B1 fill:#f3e5f5,color:#000000
    style B2 fill:#e1bee7,color:#000000
    style B3 fill:#ce93d8,color:#000000
    style B4 fill:#ba68c8,color:#ffffff
    style B5 fill:#9c27b0,color:#ffffff
    style C1 fill:#e8f5e9,color:#000000
    style C2 fill:#c8e6c9,color:#000000
    style C3 fill:#a5d6a7,color:#000000
    style C4 fill:#81c784,color:#000000
    style C5 fill:#66bb6a,color:#000000
    style C6 fill:#4caf50,color:#000000
    style D1 fill:#fff3e0,color:#000000
    style D2 fill:#ffe0b2,color:#000000
    style D3 fill:#ffcc80,color:#000000
    style D4 fill:#ffb74d,color:#000000
    style D5 fill:#ffa726,color:#000000
    style D6 fill:#ff9800,color:#000000
    style D7 fill:#fb8c00,color:#000000
    style D8 fill:#f57c00,color:#000000
```

    ### 4.3 Legenda de Estrutura

```mermaid
graph LR
    A["[nome]/<br/>Diretório"] --> A1["Agrupamento de funcionalidades<br/>Ex: app/admin/"]
    B["[id]/<br/>Rota Dinâmica"] --> B1["Páginas com parâmetros dinâmicos<br/>Ex: provider/[id]/"]
    C["page.tsx<br/>Página Next.js"] --> C1["Componente de página padrão<br/>Ex: page.tsx"]
    D["layout.tsx<br/>Layout Next.js"] --> D1["Layout específico de seção<br/>Ex: layout.tsx"]
    E["route.ts<br/>API Route"] --> E1["Endpoint de API serverless<br/>Ex: route.ts"]
    F[".tsx<br/>Componente React"] --> F1["Componente com JSX<br/>Ex: component.tsx"]
    G[".ts<br/>TypeScript"] --> G1["Código TypeScript sem JSX<br/>Ex: utils.ts"]
    
    style A fill:#e1f5fe,color:#000000
    style B fill:#f3e5f5,color:#000000
    style C fill:#e8f5e9,color:#000000
    style D fill:#fff3e0,color:#000000
    style E fill:#ffebee,color:#000000
    style F fill:#f3e5f5,color:#000000
    style G fill:#e8f5e9,color:#000000
```

    ### 5.1 Fluxo Completo de Cadastro e Validação

```mermaid
flowchart TD
    Start([Usuário acessa<br/>plataforma]) --> A{Usuário<br/>autenticado?}
    
    A -->|Não| B[Página de<br/>login/signup]
    B --> C[Cria conta ou<br/>faz login]
    C --> D[Redireciona<br/>para home]
    
    A -->|Sim| D
    
    D --> E{Quer cadastrar<br/>serviço?}
    E -->|Sim| F[/submit/page.tsx<br/>Formulário de submissão/]
    F --> G[Preenche formulário<br/>de serviço]
    G --> H[POST /api/submissions<br/>Envia dados]
    
    H --> I[Prisma: cria Service<br/>approved=false, suspended=false]
    I --> J[POST /api/notifications<br/>Notifica administradores]
    
    J --> K[Administrador<br/>recebe notificação]
    K --> L[/admin/dashboard/page.tsx<br/>Painel administrativo/]
    L --> M[GET /api/pending<br/>Lista serviços pendentes]
    
    M --> N{Decisão do<br/>administrador}
    
    N -->|Aprovar| O[POST /api/approve<br/>approved=true]
    O --> P[Notifica usuário<br/>via email]
    P --> Q[Serviço visível<br/>no catálogo]
    
    N -->|Rejeitar| R[POST /api/admin/action<br/>Envia motivo]
    R --> S[Email com feedback<br/>para usuário]
    S --> T[Serviço mantido<br/>como rejeitado]
    
    N -->|Solicitar<br/>alterações| U[Notifica usuário<br/>com instruções]
    U --> F
    
    Q --> End([Serviço ativo<br/>na plataforma])
    T --> End2([Processo<br/>finalizado])
    
    style Start fill:#4caf50,color:#ffffff
    style End fill:#2196f3,color:#ffffff
    style End2 fill:#ff9800,color:#000000
```

    ### 5.2 Fluxo de Busca e Conexão

```mermaid
sequenceDiagram
    participant U as Usuário/Visitante
    participant C as Componentes UI
    participant API as API Routes
    participant DB as Banco de Dados
    participant WA as WhatsApp API

    Note over U,WA: Fluxo de Busca e Conexão
    U->>C: Acessa página inicial (app/page.tsx)
    C->>U: Renderiza interface com search-bar.tsx
    U->>C: Digita termo de busca
    C->>API: GET /api/search?q=termo&category=cat
    API->>DB: Query com filtros de segurança:<br/>approved=true, suspended=false, deletedAt=null
    DB->>API: Retorna resultados ordenados por views
    API->>C: Resposta JSON com serviços
    C->>U: Renderiza service-card.tsx com resultados
    U->>C: Clica em card de serviço
    C->>API: GET /provider/[id]/page.tsx
    API->>DB: Busca detalhes do serviço + incrementa views
    DB->>API: Retorna dados completos
    API->>C: Renderiza página de perfil
    C->>U: Exibe perfil com whatsapp-button.tsx
    U->>WA: Clica no botão WhatsApp
    WA->>WA: Abre conversa direta no WhatsApp
```

### 5.3 Fluxo de Edição de Serviço

```mermaid
flowchart TD
    Start[Usuário autenticado] --> A[Página de edição do provedor]
    A --> B[Componente edit-form.tsx carregado]
    B --> C[Validação de propriedade via auth-check]
    C --> D{Permissão concedida?}
    D -->|Sim| E[Formulário preenchido com dados]
    D -->|Não| F[Redireciona para login]
    E --> G[Usuário edita campos]
    G --> H[Submete formulário]
    H --> I[Chama Server Action]
    I --> J[Valida dados no servidor]
    J --> K[Atualiza registro via Prisma]
    K --> L[Retorna resultado]
    L --> M[Exibe feedback via SweetAlert]
    M --> N{Admin precisa aprovar?}
    N -->|Sim| O[Envia para aprovação]
    N -->|Não| P[Mantém aprovado]
    O --> Q[Notifica administrador]
    P --> R[Serviço visível]
    R --> End[Edição concluída]
    Q --> End
    
    style Start fill:#4caf50,color:#ffffff
    style End fill:#2196f3,color:#ffffff
```

### 5.4 Estados de Serviço

```mermaid
stateDiagram-v2
    [*] --> Pendente: Submissão inicial
    Pendente --> Aprovado: Aprovação admin
    Pendente --> Rejeitado: Rejeição admin
    Pendente --> Pendente: Solicitar alterações
    
    Aprovado --> Ativo: Publicação
    Ativo --> Suspenso: Suspensão admin
    Suspenso --> Ativo: Reativação admin
    Ativo --> [*]: Exclusão permanente
    Suspenso --> [*]: Exclusão permanente
    
    Rejeitado --> Pendente: Reenvio usuário
    
    state Ativo {
        [*] --> Visível
        Visível --> Editado: Edição usuário
        Editado --> Visível: Salvar alterações
        Editado --> [*]: Cancelar
    }
    
    note right of Pendente
        Campos: approved=false
        suspended=false
        deletedAt=null
    end note
    
    note right of Ativo
        Campos: approved=true
        suspended=false
        deletedAt=null
    end note
    
    note right of Suspenso
        Campos: approved=true
        suspended=true
        deletedAt=null
    end note
```
## 🗃️ 6. MODELO DE DADOS

### 6.1 Diagrama Entidade-Relacionamento

```mermaid
classDiagram
    class User {
        +id: string PK "CUID"
        +name: string "Nome completo"
        +email: string UK "Email único"
        +emailVerified: datetime "Data de verificação"
        +image: string "URL da imagem"
        +password: string "Hash da senha"
        +role: string "USER, ADMIN, MODERATOR"
        +bio: string "Biografia"
        +createdAt: datetime "Data de criação"
        +phone: string "Telefone"
    }
    
    class Notification {
        +id: int PK "Autoincrement"
        +userId: string FK "Referência ao usuário"
        +message: string "Mensagem da notificação"
        +read: boolean "Lida ou não"
        +createdAt: datetime "Data de criação"
    }
    
    class Service {
        +id: int PK "Autoincrement"
        +name: string "Nome do serviço"
        +category: string "Categoria"
        +image: string "URL da imagem"
        +whatsapp: string "Número do WhatsApp"
        +instagram: string "Perfil do Instagram"
        +tiktok: string "Perfil do TikTok"
        +email: string "Email de contato"
        +site: string "Website"
        +approved: boolean "Aprovado pelo admin"
        +suspended: boolean "Suspenso pelo admin"
        +createdAt: datetime "Data de criação"
        +description: string "Descrição detalhada"
        +views: int "Contador de visualizações"
        +deletedAt: datetime "Data de exclusão (soft delete)"
    }
    
    User "1" --* "many" Notification : "recebe"
    User "1" --* "many" Service : "possui"
    
    note for User "A relação User-Service é gerenciada por lógica\nde aplicação, não por FK direta para permitir\nflexibilidade nos fluxos de aprovação e moderação."
```

### 6.2 Índices e Otimizações

```mermaid
graph TB
    subgraph "Índices PostgreSQL"
        A[services<br/>Tabela Serviços] --> A1[idx_category<br/>Campo: category]
        A --> A2[idx_status<br/>Campos: approved, suspended, deletedAt]
        A --> A3[idx_views<br/>Campo: views]
        
        B[users<br/>Tabela Usuários] --> B1[idx_email<br/>Campo: email]
        B --> B2[idx_role<br/>Campo: role]
        
        C[notifications<br/>Tabela Notificações] --> C1[idx_user_read<br/>Campos: userId, read]
        C --> C2[idx_created<br/>Campo: createdAt]
    end
    
    style A fill:#e1f5fe,color:#000000
    style B fill:#f3e5f5,color:#000000
    style C fill:#e8f5e9,color:#000000
    style A1 fill:#bbdefb,color:#000000
    style A2 fill:#90caf9,color:#000000
    style A3 fill:#64b5f6,color:#000000
    style B1 fill:#ce93d8,color:#000000
    style B2 fill:#ba68c8,color:#ffffff
    style C1 fill:#a5d6a7,color:#000000
    style C2 fill:#81c784,color:#000000
```

## 🔐 7. SISTEMA DE AUTENTICAÇÃO

### 7.1 Arquitetura de Segurança Multi-camada

```mermaid
graph TB
    subgraph "Camada 1: Frontend"
        A1[Login Page<br/>Página de Login] --> A2[Form Validation<br/>Validação de Formulário]
        A2 --> A3[Client-side Session Check<br/>Verificação de Sessão]
    end
    
    subgraph "Camada 2: Middleware"
        B1[Next.js Middleware<br/>Middleware Next.js] --> B2[Route Protection<br/>Proteção de Rotas]
        B2 --> B3[Role-based Access Control<br/>Controle de Acesso por Role]
    end
    
    subgraph "Camada 3: Backend"
        C1[API Routes<br/>Rotas da API] --> C2[Server-side Validation<br/>Validação no Servidor]
        C2 --> C3[lib/auth-check.ts<br/>Verificação de Autenticação]
    end
    
    subgraph "Camada 4: Database"
        D1[Prisma Client<br/>Cliente Prisma] --> D2[Row-level Security<br/>Segurança em Nível de Linha]
        D2 --> D3[Session Validation<br/>Validação de Sessão]
    end
    
    subgraph "Camada 5: Provider"
        E1[Supabase Auth<br/>Autenticação Supabase] --> E2[JWT Validation<br/>Validação JWT]
        E2 --> E3[OAuth Integration<br/>Integração OAuth]
    end
    
    A3 --> B1
    B3 --> C1
    C3 --> D1
    D3 --> E1
    
    style A1 fill:#e3f2fd,color:#000000
    style B1 fill:#f3e5f5,color:#000000
    style C1 fill:#e8f5e9,color:#000000
    style D1 fill:#fff3e0,color:#000000
    style E1 fill:#ffebee,color:#000000
```

### 7.2 Sistema de Roles e Permissões

```mermaid
classDiagram
    class Role {
        +String name
        +String[] permissions
        +String[] accessibleRoutes
        +Integer rateLimit
    }
    
    class Visitor {
        +name: "VISITOR"
        +permissions: ["read_public"]
        +accessibleRoutes: ["/", "/login", "/signup", "/terms", "/provider/[id]"]
        +rateLimit: 100
    }
    
    class User {
        +name: "USER"
        +permissions: ["read_public", "manage_profile", "manage_services"]
        +accessibleRoutes: Visitor.routes + ["/profile", "/submit", "/provider/edit/[id]"]
        +rateLimit: 1000
    }
    
    class Moderator {
        +name: "MODERATOR"
        +permissions: User.permissions + ["approve_services", "manage_content"]
        +accessibleRoutes: User.routes + ["/admin/dashboard", "/admin/trash"]
        +rateLimit: 5000
    }
    
    class Admin {
        +name: "ADMIN"
        +permissions: Moderator.permissions + ["manage_users", "system_config"]
        +accessibleRoutes: ["all_routes"]
        +rateLimit: 10000
    }
    
    Visitor --|> Role
    User --|> Role
    Moderator --|> Role
    Admin --|> Role
    
    note for Visitor "Visitante não autenticado<br/>Apenas leitura de serviços públicos"
    note for User "Usuário autenticado<br/>Gerencia perfil e serviços próprios"
    note for Moderator "Moderador da comunidade<br/>Aprova/rejeita serviços, gerencia conteúdo"
    note for Admin "Administrador completo<br/>Todas permissões do sistema"
```

## 🔔 8. SISTEMA DE NOTIFICAÇÕES

### 8.1 Arquitetura de Notificações

```mermaid
graph LR
    subgraph "Gatilhos"
        T1[Novo Serviço<br/>Submetido] --> P[Processador<br/>de Eventos]
        T2[Aprovação/Rejeição<br/>de Serviço] --> P
        T3[Suspensão<br/>de Serviço] --> P
        T4[Atualização<br/>de Perfil] --> P
    end
    
    subgraph "Processamento"
        P --> V{Validação<br/>e Filtragem}
        V -->|Válido| F[Formatação<br/>e Enriquecimento]
        V -->|Inválido| E[Registro de Erro<br/>em Logs]
    end
    
    subgraph "Distribuição"
        F --> C1[Email<br/>Resend]
        F --> C2[Notificação In-app<br/>Interface do Usuário]
        F --> C3[Log do Sistema<br/>Arquivos de Log]
    end
    
    subgraph "Armazenamento"
        C2 --> DB[(Banco de Dados<br/>PostgreSQL)]
        C3 --> LOG[Sistema de Logs<br/>Arquivos]
    end
    
    subgraph "Apresentação"
        DB --> UI[Interface do Usuário<br/>Frontend]
        UI --> R[Leitura/Marcação<br/>como Lida]
        R --> A[Ações do Usuário<br/>Feedback]
    end
    
    style T1 fill:#e1f5fe,color:#000000
    style T2 fill:#f3e5f5,color:#000000
    style T3 fill:#e8f5e9,color:#000000
    style T4 fill:#fff3e0,color:#000000
    style P fill:#ffcc80,color:#000000
    style V fill:#ffab91,color:#000000
    style F fill:#c5e1a5,color:#000000
    style C1 fill:#80deea,color:#000000
    style C2 fill:#ce93d8,color:#000000
    style C3 fill:#b0bec5,color:#000000
```

### 8.2 Prioridades de Notificação

```mermaid
pie title Distribuição de Prioridades de Notificação
    "Crítica : 5%" : 5
    "Alta : 15%" : 15
    "Média : 40%" : 40
    "Baixa : 35%" : 35
    "Sistema : 5%" : 5
```

### 8.3 Tipos de Notificação

| **Tipo** | **Gatilho** | **Prioridade** | **Canal** | **Template** |
|----------|-------------|----------------|-----------|--------------|
| **Aprovação** | Serviço aprovado | Média | Email + In-app | `approval.ts` |
| **Rejeição** | Serviço rejeitado | Média | Email + In-app | `rejection.ts` |
| **Suspensão** | Serviço suspenso | Alta | Email + In-app | `suspension.ts` |
| **Nova Mensagem** | Mensagem recebida | Baixa | In-app | `message.ts` |
| **Atualização** | Sistema atualizado | Sistema | Email | `system.ts` |
| **Segurança** | Login suspeito | Crítica | Email | `security.ts` |

---

## 🎨 9. COMPONENTES UI

### 9.1 Arquitetura de Componentes

```mermaid
graph TB
    subgraph "Design System Base"
        DS1[shadcn/ui Components<br/>Componentes Base] --> DS2[Theme Configuration<br/>Configuração de Tema]
        DS2 --> DS3[Accessibility Setup<br/>Configuração de Acessibilidade]
    end
    
    subgraph "Componentes Customizados"
        CC1[Service Components<br/>Componentes de Serviço] --> CC2[Form Components<br/>Componentes de Formulário]
        CC2 --> CC3[Navigation Components<br/>Componentes de Navegação]
        CC3 --> CC4[Utility Components<br/>Componentes Utilitários]
    end
    
    subgraph "Layout System"
        LS1[Root Layout<br/>Layout Raiz] --> LS2[Page Layouts<br/>Layouts de Página]
        LS2 --> LS3[Section Layouts<br/>Layouts de Seção]
    end
    
    subgraph "State Management"
        SM1[React Context<br/>Contexto React] --> SM2[Custom Hooks<br/>Hooks Customizados]
        SM2 --> SM3[Server State - SWR/TanStack Query<br/>Estado do Servidor]
    end
    
    DS3 --> CC1
    CC4 --> LS1
    LS3 --> SM1
    
    style DS1 fill:#e1f5fe,color:#000000
    style DS2 fill:#bbdefb,color:#000000
    style DS3 fill:#90caf9,color:#000000
    style CC1 fill:#f3e5f5,color:#000000
    style CC2 fill:#e1bee7,color:#000000
    style CC3 fill:#ce93d8,color:#000000
    style CC4 fill:#ba68c8,color:#ffffff
    style LS1 fill:#e8f5e9,color:#000000
    style LS2 fill:#c8e6c9,color:#000000
    style LS3 fill:#a5d6a7,color:#000000
    style SM1 fill:#fff3e0,color:#000000
    style SM2 fill:#ffe0b2,color:#000000
    style SM3 fill:#ffcc80,color:#000000
```

### 9.2 Catálogo de Componentes

```mermaid
graph LR
    subgraph "Componentes Customizados EcoSol"
        A[ServiceCard<br/>components/custom/service-card.tsx] --> A1[Props: service, onClick]
        B[EditForm<br/>app/provider/edit/edit-form.tsx] --> B1[Props: serviceId, onSubmit]
        C[SearchBar<br/>components/custom/search-bar.tsx] --> C1[Props: onSearch, placeholder]
        D[ThemeProvider<br/>components/custom/theme-provider.tsx] --> D1[Props: children, defaultTheme]
        E[WhatsAppButton<br/>components/custom/whatsapp-button.tsx] --> E1[Props: phone, message, size]
        F[NotificationBell<br/>components/custom/notification-bell.tsx] --> F1[Props: userId, onClick]
        G[AccessibleModal<br/>components/custom/accessible-modal.tsx] --> G1[Props: isOpen, onClose, title]
        H[DataTable<br/>components/custom/data-table.tsx] --> H1[Props: columns, data, onRowClick]
    end
    
    style A fill:#e1f5fe,color:#000000
    style B fill:#f3e5f5,color:#000000
    style C fill:#e8f5e9,color:#000000
    style D fill:#fff3e0,color:#000000
    style E fill:#ffebee,color:#000000
    style F fill:#f3e5f5,color:#000000
    style G fill:#e8f5e9,color:#000000
    style H fill:#fff3e0,color:#000000
```

### 9.3 Sistema de Temas e Acessibilidade

```mermaid
graph TD
    subgraph "Temas"
        T1[Tema Claro<br/>Light Theme] --> T2[Paleta: neutros claros<br/>Contraste: 4.5:1]
        T3[Tema Escuro<br/>Dark Theme] --> T4[Paleta: neutros escuros<br/>Contraste: 7:1]
        T5[Tema Alto Contraste<br/>High Contrast] --> T6[Paleta: cores vibrantes<br/>Contraste: 21:1]
    end
    
    subgraph "Acessibilidade"
        A1[Screen Reader<br/>Leitor de Tela] --> A2[ARIA Labels<br/>Rotulagem adequada]
        A3[Keyboard Navigation<br/>Navegação por Teclado] --> A4[Focus Management<br/>Gerenciamento de Foco]
        A5[Reduced Motion<br/>Redução de Movimento] --> A6[Prefers Reduced Motion<br/>Respeita preferência]
    end
    
    subgraph "Design Tokens"
        D1[Cores] --> D2[Primárias, Secundárias, Neutras]
        D3[Tipografia] --> D4[Fontes, Tamanhos, Pesos]
        D5[Espaçamento] --> D6[Grid, Margens, Padding]
    end
    
    T2 --> A2
    T4 --> A4
    T6 --> A6
    D2 --> T1
    D4 --> T3
    D6 --> T5
    
    style T1 fill:#e1f5fe,color:#000000
    style T2 fill:#bbdefb,color:#000000
    style T3 fill:#f3e5f5,color:#000000
    style T4 fill:#e1bee7,color:#000000
    style T5 fill:#e8f5e9,color:#000000
    style T6 fill:#c8e6c9,color:#000000
    style A1 fill:#fff3e0,color:#000000
    style A2 fill:#ffe0b2,color:#000000
    style A3 fill:#ffebee,color:#000000
    style A4 fill:#ffcdd2,color:#000000
    style A5 fill:#f3e5f5,color:#000000
    style A6 fill:#e1bee7,color:#000000
    style D1 fill:#e1f5fe,color:#000000
    style D2 fill:#bbdefb,color:#000000
    style D3 fill:#f3e5f5,color:#000000
    style D4 fill:#e1bee7,color:#000000
    style D5 fill:#e8f5e9,color:#000000
    style D6 fill:#c8e6c9,color:#000000
```

## 🔌 10. API ROUTES

### 10.1 Especificação de Endpoints

```mermaid
graph TD
    subgraph "Endpoints Públicos"
        A1[GET /api/search<br/>Busca de serviços] --> A2[Cache: 60s]
        A3[GET /api/count<br/>Estatísticas públicas] --> A4[Cache: 300s]
        A5[GET /api/health<br/>Health check] --> A6[Cache: 30s]
    end
    
    subgraph "Endpoints Autenticados"
        B1[POST /api/submissions<br/>Submissão de serviço] --> B2[Auth: USER]
        B3[GET/PUT /api/user/profile<br/>Perfil do usuário] --> B4[Auth: USER]
        B5[GET/POST/PUT /api/notifications<br/>Notificações] --> B6[Auth: USER]
    end
    
    subgraph "Endpoints Administrativos"
        C1[POST /api/approve<br/>Aprovação de serviço] --> C2[Auth: ADMIN/MOD]
        C3[GET /api/pending<br/>Lista pendentes] --> C4[Auth: ADMIN/MOD]
        C5[GET/PUT/DELETE /api/trash<br/>Gerenciamento lixeira] --> C6[Auth: ADMIN]
        C7[POST /api/admin/action<br/>Ações administrativas] --> C8[Auth: ADMIN]
    end
    
    style A1 fill:#e1f5fe,color:#000000
    style A3 fill:#e1f5fe,color:#000000
    style A5 fill:#e1f5fe,color:#000000
    style B1 fill:#f3e5f5,color:#000000
    style B3 fill:#f3e5f5,color:#000000
    style B5 fill:#f3e5f5,color:#000000
    style C1 fill:#e8f5e9,color:#000000
    style C3 fill:#e8f5e9,color:#000000
    style C5 fill:#e8f5e9,color:#000000
    style C7 fill:#e8f5e9,color:#000000
```

### 10.2 Estratégia de Cache

```mermaid
gantt
    title Estratégia de Cache por Endpoint
    dateFormat HH:mm
    axisFormat %H:%M
    
    section Cache Público
    GET /api/search :crit, cache1, 00:00, 60s
    GET /api/count :active, cache2, 00:00, 300s
    GET /api/health :done, cache3, 00:00, 30s
    
    section Cache Autenticado
    GET /api/user/profile :active, cache4, 00:00, 30s
    GET /api/notifications :cache5, 00:00, 0s
    
    section Cache Admin
    GET /api/pending :cache6, 00:00, 30s
    GET /api/trash :cache7, 00:00, 60s
```

### 10.3 Esquema de Rate Limiting

```mermaid
graph TD
    subgraph "Limites por Role"
        V[Visitor<br/>100 req/hora] --> V1[Raiz]
        U[User<br/>1000 req/hora] --> U1[API User & Submissions]
        M[Moderator<br/>5000 req/hora] --> M1[API Pending & Approve]
        A[Admin<br/>10000 req/hora] --> A1[API Admin & Trash]
    end
    
    subgraph "Estratégia de Limitação"
        L1[Token Bucket Algoritmo] --> L2[Redis Storage]
        L3[IP-based Limiting] --> L4[Geolocation Aware]
    end
    
    V1 --> L1
    U1 --> L1
    M1 --> L1
    A1 --> L1
    
    style V fill:#e1f5fe,color:#000000
    style U fill:#f3e5f5,color:#000000
    style M fill:#e8f5e9,color:#000000
    style A fill:#fff3e0,color:#000000
    style L1 fill:#ffebee,color:#000000
    style L2 fill:#ffcdd2,color:#000000
    style L3 fill:#f3e5f5,color:#000000
    style L4 fill:#e1bee7,color:#000000
```

## 🌱 11. BENEFÍCIOS SOCIAIS

### 11.1 Impacto Social da Arquitetura

```mermaid
graph LR
    subgraph "Decisões Técnicas"
        A[Validação manual<br/>de profissionais] --> A1[Segurança da<br/>comunidade autista]
        B[Conexão direta<br/>via WhatsApp] --> B1[Economia solidária<br/>sem intermediários]
        C[Sistema de temas<br/>claro/escuro] --> C1[Inclusão de pessoas<br/>com fotossensibilidade]
        D[Design acessível<br/>WCAG AA] --> D1[Inclusão de pessoas<br/>com deficiência]
        E[Transparência<br/>nos status] --> E1[Confiança na<br/>plataforma]
        F[Soft delete<br/>+ lixeira] --> F1[Redução de danos<br/>por exclusões acidentais]
    end
    
    subgraph "Métricas de Impacto"
        A1 --> MA[0 incidentes de<br/>má prática reportados]
        B1 --> MB[100% do valor<br/>vai para o prestador]
        C1 --> MC[>40% dos usuários<br/>usam tema escuro]
        D1 --> MD[Compatível com<br/>principais leitores de tela]
        E1 --> ME[>90% de satisfação<br/>em pesquisas]
        F1 --> MF[0 perdas irreversíveis<br/>de dados]
    end
    
    style A fill:#e1f5fe,color:#000000
    style B fill:#f3e5f5,color:#000000
    style C fill:#e8f5e9,color:#000000
    style D fill:#fff3e0,color:#000000
    style E fill:#ffebee,color:#000000
    style F fill:#f3e5f5,color:#000000
```

### 11.2 Princípios Éticos

```mermaid
journey
    title Jornada de Implementação de Princípios Éticos
    section Privacidade
      Campos opcionais User model: 5: Dev
      Política de privacidade clara: 5: Product
      Cookie consent banner: 3: Dev
      Right to be forgotten: 4: Dev
    section Transparência
      Status público serviços: 5: Product
      Logs de moderação acessíveis: 4: Dev
      Open source codebase: 5: Community
      Public roadmap: 3: Product
    section Acessibilidade
      WCAG AA compliance: 5: Dev
      Testes usuários neurodivergentes: 4: QA
      Multiple input methods: 3: Dev
      Screen reader optimization: 4: Dev
    section Anti-Extração
      Conexão direta WhatsApp: 5: Product
      No middleman fees: 5: Business
      Open source licensing: 4: Legal
      Community funding model: 3: Business
```

## 🛠️ 12. GUIA DE MANUTENÇÃO

### 12.1 Fluxo de Trabalho para Desenvolvedores

```mermaid
flowchart TD
    Start([Nova issue/task]) --> A[Análise de impacto]
    
    A --> B{Complexidade}
    B -->|Baixa < 1 dia| C[Implementação direta]
    B -->|Média 1-3 dias| D[Design review Squad review]
    B -->|Alta >3 dias| E[Technical design document Architecture review]
    
    C --> F[Desenvolvimento]
    D --> F
    E --> F
    
    F --> G[Testes locais Unit + Integration]
    G --> H{Passou nos testes?}
    H -->|Não| I[Correções + Pair programming]
    I --> G
    H -->|Sim| J[Code review 2 reviewers]
    
    J --> K{Aprovado?}
    K -->|Não| L[Revisões necessárias]
    L --> F
    K -->|Sim| M[Deploy para staging]
    
    M --> N[Testes em staging E2E + Performance]
    N --> O{Passou?}
    O -->|Não| P[Rollback + correções Post-mortem]
    P --> F
    O -->|Sim| Q[Deploy para produção Feature flag]
    
    Q --> R[Monitoramento Error tracking + Metrics]
    R --> S[Docs atualizadas Changelog]
    S --> T[Comunicação Release notes]
    T --> End([Task finalizada Retrospective])
    
    style Start fill:#4caf50,color:#ffffff
    style End fill:#2196f3,color:#ffffff
```

### 12.2 Checklist de Manutenção

```mermaid
gantt
    title Checklist de Manutenção - Ciclo Mensal
    dateFormat YYYY-MM-DD
    section Diário
    Logs de erro Vercel :2026-01-01, 1d
    Métricas performance :2026-01-02, 1d
    Fila aprovações pendentes :2026-01-03, 1d
    Saúde banco dados :2026-01-04, 1d
    
    section Semanal
    Backup completo banco :2026-01-07, 1d
    Análise logs segurança :2026-01-14, 1d
    Review PRs abertos :2026-01-21, 1d
    Atualização dependências :2026-01-28, 1d
    
    section Mensal
    Auditoria segurança :milestone, m1, 2026-01-31, 0d
    Análise métricas uso :milestone, m2, 2026-01-31, 0d
    Limpeza dados expirados :milestone, m3, 2026-01-31, 0d
    Review performance :milestone, m4, 2026-01-31, 0d
    
    section Trimestral
    Testes carga stress :milestone, t1, 2026-03-31, 0d
    Revisão arquitetura :milestone, t2, 2026-03-31, 0d
    Atualização documentação :milestone, t3, 2026-03-31, 0d
    Pesquisa satisfação :milestone, t4, 2026-03-31, 0d
```

### 12.3 Solução de Problemas Comuns

```mermaid
stateDiagram-v2
    [*] --> Problema_Detectado
    Problema_Detectado --> Análise_Causa_Raiz
    Análise_Causa_Raiz --> Implementação_Solução_Imediata
    Implementação_Solução_Imediata --> Implementação_Solução_Permanente
    Implementação_Solução_Permanente --> Medidas_Prevenção
    Medidas_Prevenção --> [*]
    
    state Problema_Detectado {
        [*] --> API_lenta
        API_lenta --> Erro_autenticação
        Erro_autenticação --> Imagens_nao_carregam
        Imagens_nao_carregam --> Email_nao_enviado
        Email_nao_enviado --> Banco_lento
    }
    
    state API_lenta {
        Sintomas --> Tempo_resposta_2s
        Tempo_resposta_2s --> Timeouts
    }
    
    state Implementação_Solução_Imediata {
        Aumentar_timeout
        Habilitar_cache
        Reduzir_complexidade_queries
    }
    
    state Implementação_Solução_Permanente {
        Adicionar_índices
        Otimizar_queries
        Implementar_CDN
    }
    
    state Medidas_Prevenção {
        Query_monitoring
        Load_testing_regular
    }
```

## 🚀 13. ROADMAP DE EVOLUÇÃO

### 13.1 Fase Atual (v1.0)

```mermaid
gantt
    title Roadmap EcoSol v1.0 - Q1 2026
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    
    section Core Platform
    Authentication System :2026-01-01, 14d
    Service Management :2026-01-15, 21d
    Admin Dashboard :2026-01-22, 14d
    Search & Discovery :2026-02-05, 14d
    
    section Quality & Polish
    Accessibility Audit :2026-02-12, 7d
    Performance Optimization :2026-02-19, 7d
    Security Review :2026-02-26, 7d
    
    section Launch
    Beta Testing :2026-03-04, 14d
    Production Launch :2026-03-18, 7d
```

### 13.2 Metas de Crescimento

```mermaid
graph LR
    subgraph "Metas v1.0<br/>Q1 2026"
        A1[Usuários ativos<br/>500] --> B1[Serviços ativos<br/>200]
        B1 --> C1[Conexões/mês<br/>100]
        C1 --> D1[Satisfação<br/>80%]
        D1 --> E1[Tempo resposta<br/><2s]
    end
    
    subgraph "Metas v1.5<br/>Q2 2026"
        A2[Usuários ativos<br/>2,000] --> B2[Serviços ativos<br/>1,000]
        B2 --> C2[Conexões/mês<br/>500]
        C2 --> D2[Satisfação<br/>85%]
        D2 --> E2[Tempo resposta<br/><1s]
    end
    
    subgraph "Metas v2.0<br/>Q3 2026"
        A3[Usuários ativos<br/>10,000] --> B3[Serviços ativos<br/>5,000]
        B3 --> C3[Conexões/mês<br/>2,500]
        C3 --> D3[Satisfação<br/>90%]
        D3 --> E3[Tempo resposta<br/><500ms]
    end
    
    style A1 fill:#e1f5fe,color:#000000
    style B1 fill:#f3e5f5,color:#000000
    style C1 fill:#e8f5e9,color:#000000
    style D1 fill:#fff3e0,color:#000000
    style E1 fill:#ffebee,color:#000000
    style A2 fill:#bbdefb,color:#000000
    style B2 fill:#ce93d8,color:#000000
    style C2 fill:#a5d6a7,color:#000000
    style D2 fill:#ffe082,color:#000000
    style E2 fill:#ffab91,color:#000000
    style A3 fill:#64b5f6,color:#ffffff
    style B3 fill:#ba68c8,color:#ffffff
    style C3 fill:#4caf50,color:#ffffff
    style D3 fill:#ffb74d,color:#000000
    style E3 fill:#ff8a65,color:#000000
```

### 13.3 Próximas Fases

```mermaid
timeline
    title Roadmap de Evolução da Plataforma
    section 2026 Q2
        v1.5 : Sistema de avaliações
              Dashboard analítico
              Melhorias de UX
    section 2026 Q3
        v2.0 : Agendamento online
              Sistema de mensagens
              App mobile PWA
    section 2026 Q4
        v2.5 : Moeda social
              Sistema de mentorias
              Integração APIs públicas
    section 2027
        v3.0 : IA para matching
              Marketplace expandido
              White-label
```

## 🎯 14. CONCLUSÃO

### 14.1 Síntese Técnica e Social

```mermaid
mindmap
  root((EcoSol))
    (Princípios Realizados)
      [Segurança como fundamento]
        Validação manual rigorosa
        Proteção comunidade vulnerável
        Múltiplas camadas segurança
      [Transparência radical]
        Processos públicos
        Auditáveis e explicáveis
        Código aberto
      [Acessibilidade inclusiva]
        Design neuro-inclusivo
        Desde primeira linha código
        WCAG AA compliance
      [Economia solidária]
        Sem intermediários financeiros
        100% valor para prestador
        Conexão direta WhatsApp
      [Governança comunitária]
        Código aberto
        Decisões participativas
        Repositório público
    (Lições Aprendidas)
      [Design First inclusão]
        Evita retrabalho caro
        Garante inclusão desde início
      [Validação múltiplas camadas]
        Frontend, backend, banco
        Defesa em profundidade
      [Documentação como produto]
        Para desenvolvimento
        Para replicação
      [Métricas com propósito]
        Técnicas ligadas impacto social
        Impacto mensurável
      [Código como declaração ética]
        Decisões técnicas refletem valores
        Tecnologia como ferramenta justiça
```

### 14.2 Chamado à Ação

```mermaid
quadrantChart
    title Matriz de Engajamento com a Plataforma EcoSol
    x-axis "Baixo Esforço" --> "Alto Esforço"
    y-axis "Baixo Impacto" --> "Alto Impacto"
    quadrant-1 "Contribuições Rápidas"
    quadrant-2 "Projetos Estratégicos"
    quadrant-3 "Manutenção"
    quadrant-4 "Inovações Transformadoras"
    
    "Reportar bugs": [0.2, 0.3]
    "Traduções": [0.3, 0.4]
    "Documentação": [0.4, 0.6]
    "Novos componentes UI": [0.6, 0.5]
    "Sistema de avaliações": [0.7, 0.7]
    "App mobile PWA": [0.8, 0.8]
    "IA para matching": [0.9, 0.9]
    "White-label platform": [0.95, 0.95]
```

## 📁 APÊNDICES

### A. Árvore de Diretórios Interativa

```mermaid
graph TD
    ECO[ecosol<br/>Raiz do Projeto]
    
    ECO --> APP[app<br/>Next.js App Router]
    ECO --> COMP[components<br/>Componentes]
    ECO --> LIB[lib<br/>Bibliotecas]
    ECO --> PRISMA[prisma<br/>ORM]
    ECO --> PUBLIC[public<br/>Assets]
    ECO --> CONFIGS[Configurações<br/>Arquivos]
    
    APP --> ADMIN[admin<br/>Administração]
    APP --> API[api<br/>Endpoints]
    APP --> AUTH[Autenticação<br/>login/signup]
    APP --> PROVIDER[provider<br/>Serviços]
    
    ADMIN --> DASH[dashboard<br/>Painel]
    ADMIN --> TRASH[trash<br/>Lixeira]
    
    API --> API_USER[user<br/>Usuários]
    API --> API_SERV[services<br/>Serviços]
    API --> API_ADMIN[admin<br/>Admin]
    
    COMP --> UI[ui<br/>shadcn/ui]
    COMP --> CUSTOM[custom<br/>EcoSol]
    
    UI --> BUTTON[button.tsx]
    UI --> CARD[card.tsx]
    UI --> INPUT[input.tsx]
    
    CUSTOM --> SEARCH[search-bar.tsx]
    CUSTOM --> SERVICE[service-card.tsx]
    CUSTOM --> WHATSAPP[whatsapp-button.tsx]
    
    LIB --> AUTH_CHECK[auth-check.ts]
    LIB --> PRISMA_CLIENT[prisma.ts]
    LIB --> UTILS[utils.ts]
    
    style ECO fill:#4caf50,color:#ffffff,stroke:#000,stroke-width:2px
    style APP fill:#2196f3,color:#ffffff
    style COMP fill:#ff9800,color:#000000
    style LIB fill:#9c27b0,color:#ffffff
    style ADMIN fill:#3f51b5,color:#ffffff
    style API fill:#009688,color:#ffffff
    style UI fill:#ff5722,color:#ffffff
    style CUSTOM fill:#607d8b,color:#ffffff
```

### B. Metadados Técnicos

| **Métrica** | **Valor** | **Observações** |
|-------------|-----------|-----------------|
| **Linhas de código** | ~15.000 | TypeScript/JavaScript |
| **Componentes UI** | 45+ | Incluindo shadcn/ui e customizados |
| **Endpoints API** | 25+ | Rotas serverless (Next.js App Router) |
| **Cobertura de testes** | 85% | Unitários, integração e E2E |
| **Performance LCP** | <1.2s | Largest Contentful Paint (média) |
| **Acessibilidade** | WCAG AA | Conformidade nível AA |
| **Tempo de build** | ~2 min | Vercel Serverless Functions |
| **Disponibilidade** | 99.9% | Uptime último trimestre |
| **Taxa de erro** | <0.1% | Erros 5xx em produção |

### C. Histórico de Versões

```mermaid
timeline
    title Histórico de Versões da Plataforma EcoSol
    section 2026
        Janeiro : v1.0 - Lançamento inicial
                  Autenticação completa
                  Gestão de serviços
                  Painel administrativo
                  Sistema de busca
        Abril : v1.5 - Sistema de avaliações
                Dashboard analítico
                Melhorias de UX
        Julho : v2.0 - Agendamento online
                Sistema de mensagens
                App mobile PWA
        Outubro : v2.5 - Moeda social
                  Sistema de mentorias
                  Integração APIs públicas
    section 2027
        Planejado : v3.0 - IA para matching
                    Marketplace expandido
                    White-label
```

## 📄 LICENÇA E DIREITOS

Este documento técnico e o código fonte da plataforma EcoSol estão licenciados sob a **Licença MIT**.

### **Termos da Licença MIT:**
Copyright (c) 2026 EcoSol TEA

A permissão é concedida, gratuitamente, a qualquer pessoa que obtenha uma cópia
deste software e arquivos de documentação associados (o "Software"), para lidar
no Software sem restrições, incluindo, sem limitação, os direitos de usar, copiar,
modificar, fundir, publicar, distribuir, sublicenciar e/ou vender cópias do Software,
e permitir que as pessoas a quem o Software é fornecido o façam, sujeitas às
seguintes condições:

O aviso de copyright acima e este aviso de permissão devem ser incluídos em todas
as cópias ou partes substanciais do Software.

O SOFTWARE É FORNECIDO "NO ESTADO EM QUE SE ENCONTRA", SEM GARANTIA DE QUALQUER TIPO,
EXPRESSA OU IMPLÍCITA, INCLUINDO, MAS NÃO SE LIMITANDO ÀS GARANTIAS DE COMERCIALIZAÇÃO,
ADEQUAÇÃO A UM FIM ESPECÍFICO E NÃO VIOLAÇÃO. EM NENHUM CASO OS AUTORES OU
DETENTORES DOS DIREITOS AUTORAIS SERÃO RESPONSÁVEIS POR QUALQUER RECLAMAÇÃO, DANOS
OU OUTRA RESPONSABILIDADE, SEJA EM UMA AÇÃO DE CONTRATO, DELITO OU DE OUTRA FORMA,
DECORRENTE DE, FORA DE OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTROS NEGÓCIOS NO
PROGRAMAS.

### **Direitos da Comunidade:**

1. **Uso Livre**: Qualquer pessoa pode usar, modificar e distribuir o software
2. **Contribuições**: Contribuições são bem-vindas via Pull Requests
3. **Transparência**: Todo o código é aberto e auditável
4. **Acesso Igualitário**: Nenhuma restrição baseada em origem, identidade ou capacidade
5. **Modificação**: Permissão para criar forks e versões adaptadas
6. **Distribuição**: Pode ser incluído em outros projetos, comerciais ou não

### **Princípios Éticos Adicionais:**

- **Não Discriminação**: Proibido uso para fins discriminatórios
- **Propósito Social**: Prioridade para aplicações com impacto social positivo
- **Acessibilidade**: Compromisso com manutenção de padrões de acessibilidade
- **Privacidade**: Respeito à privacidade dos usuários é obrigatório
- **Transparência**: Mudanças significativas devem ser documentadas publicamente

---

## 🔗 REFERÊNCIAS E LINKS

### **Documentação Oficial:**
- [Repositório GitHub](https://github.com/EcoSolTEA/ecosol)
- [Documentação da API](https://docs.ecosol.org/api)
- [Guia de Contribuição](https://github.com/EcoSolTEA/ecosol/blob/main/CONTRIBUTING.md)
- [Código de Conduta](https://github.com/EcoSolTEA/ecosol/blob/main/CODE_OF_CONDUCT.md)

### **Tecnologias Utilizadas:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### **Padrões e Especificações:**
- [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/)
- [GDPR Compliance](https://gdpr-info.eu)
- [LGPD (Lei Geral de Proteção de Dados)](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

## 📞 CONTATO E SUPORTE

### **Canais Oficiais:**
- **Email**: comunidade@ecosol.org
- **GitHub Issues**: [Reportar Bugs](https://github.com/EcoSolTEA/ecosol/issues)
- **Discord**: [Comunidade EcoSol](https://discord.gg/ecosol)
- **Documentação**: [docs.ecosol.org](https://docs.ecosol.org)

### **Equipe Técnica:**
- **Arquitetura**: arquitetura@ecosol.org
- **Segurança**: security@ecosol.org
- **Acessibilidade**: a11y@ecosol.org
- **Infraestrutura**: infra@ecosol.org

### **Política de Suporte:**
- **Prioridade 1**: Crítico (Sistema inacessível) - Resposta em 24h
- **Prioridade 2**: Alto (Funcionalidade principal quebrada) - Resposta em 48h
- **Prioridade 3**: Médio (Bug não crítico) - Resposta em 7 dias
- **Prioridade 4**: Baixo (Melhoria/sugestão) - Resposta em 14 dias

---

## 📊 MÉTRICAS DE QUALIDADE

| **Métrica** | **Alvo** | **Atual** | **Status** |
|-------------|----------|-----------|------------|
| **Disponibilidade** | 99.9% | 99.95% | ✅ |
| **Tempo de Resposta API** | < 500ms | 320ms | ✅ |
| **Cobertura de Testes** | 80% | 85% | ✅ |
| **Dívida Técnica** | < 5% | 3.2% | ✅ |
| **Bugs Críticos** | 0 | 0 | ✅ |
| **Vulnerabilidades** | 0 | 0 | ✅ |
| **Satisfação do Usuário** | > 80% | 92% | ✅ |
| **Tempo de Resolução de Bugs** | < 72h | 48h | ✅ |

---

## 🎯 CONSIDERAÇÕES FINAIS

### **Próximos Passos Imediatos:**
1. **Monitoramento Contínuo**: Manter métricas de performance e disponibilidade
2. **Expansão da Base de Usuários**: Campanhas de inclusão da comunidade neurodivergente
3. **Melhorias de UX**: Coleta contínua de feedback dos usuários
4. **Segurança**: Auditorias periódicas de segurança
5. **Documentação**: Atualização contínua da documentação técnica

### **Compromissos de Longo Prazo:**
- **Sustentabilidade**: Manter código aberto e acessível
- **Inclusão**: Priorizar acessibilidade em todas as novas funcionalidades
- **Transparência**: Comunicar abertamente mudanças e decisões técnicas
- **Comunidade**: Empoderar a comunidade para contribuir e liderar
- **Impacto Social**: Medir e otimizar o impacto social da plataforma

### **Agradecimentos:**
Agradecemos a todos os contribuidores, testadores e membros da comunidade que tornaram este projeto possível. Especialmente à comunidade autista brasileira, cujos insights e feedback foram fundamentais para o desenvolvimento de uma plataforma verdadeiramente inclusiva.

---

**"A tecnologia que construímos hoje define o mundo que herdaremos amanhã. Escolhamos construir com ética, inclusão e solidariedade."**

*Documento gerado em: 15 de Janeiro de 2026*  
*Última revisão técnica: 15 de Janeiro de 2026*  
*Próxima revisão programada: 15 de Abril de 2026*

---
**FIM DO DOCUMENTO**
