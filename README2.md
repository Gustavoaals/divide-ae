# Divide Aê

Fundação inicial de uma plataforma web para organização de moradias compartilhadas. Front-end em HTML5, CSS3 e JavaScript modular; autenticação, API e persistência via Supabase; banco PostgreSQL.

## Requisitos

- Node.js 20 ou superior (recomendado)
- Projeto criado no [Supabase](https://supabase.com/)

## Executar localmente

```bash
npm install
cp .env.example .env
```

Preencha `.env` com a URL do projeto e a chave pública (anon/publishable) do Supabase. Nunca coloque `service_role` ou segredo administrativo no navegador.

```bash
npm run dev
```

O Vite exibirá o endereço local. Para validar a versão de produção:

```bash
npm run build
npm run preview
```

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Em **Project Settings → API**, copie a Project URL e a chave publicável/anon.
3. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env`.
4. Abra o **SQL Editor** do Supabase e execute `supabase/migrations/001_initial_schema.sql`.
5. Em **Authentication → URL Configuration**, configure a URL local `http://localhost:5173` e inclua `http://localhost:5173/redefinir-senha` entre os Redirect URLs. Em produção, substitua pelos domínios reais.
6. Configure os provedores e a confirmação de e-mail conforme a política do seu projeto.

## O que já está implementado

- Layout responsivo com sidebar, navegação e dashboard.
- Telas de login, cadastro, solicitação de recuperação e redefinição de senha.
- Sessão persistente e autenticação pelo Supabase Auth.
- Criação real de moradia por função PostgreSQL transacional (`create_household`).
- Consulta das moradias do usuário autenticado.
- Estrutura inicial de `profiles`, `households` e `household_members` com RLS habilitado.
- Páginas estruturais para moradores, despesas, tarefas e configurações, explicitamente identificadas como módulos futuros.

## Estrutura

```text
divide-ae/
├── index.html
├── package.json
├── .env.example
├── README.md
├── src/
│   ├── main.js                 # inicialização e roteamento
│   ├── config/env.js           # variáveis de ambiente
│   ├── lib/supabase.js         # cliente Supabase
│   ├── services/               # regras de acesso a dados e autenticação
│   ├── components/             # layout, ícones e componentes compartilhados
│   ├── pages/                  # telas por funcionalidade
│   └── styles/main.css         # identidade visual e responsividade
└── supabase/migrations/        # schema e políticas PostgreSQL
```

## Segurança e limites desta etapa

- A chave publicável/anon pode estar no cliente; a proteção dos dados depende das políticas RLS. A chave `service_role` nunca deve ser exposta.
- A criação de moradia é feita por RPC com `auth.uid()` e adiciona o criador como `owner` na mesma transação.
- O front-end não contém moradores, despesas ou tarefas fictícias. Indicadores ainda não implementados aparecem como `—` e os módulos futuros são identificados como preparação.
- Não há convite de moradores, gestão de despesas ou tarefas nesta entrega; as telas são pontos de extensão, não funcionalidades simuladas.
- A conexão real só pode ser validada depois que as credenciais e a migration forem aplicadas em um projeto Supabase. O projeto não está publicado nem provisionado automaticamente.

## Próximas etapas recomendadas

1. Convites de moradores com tokens de uso único e expiração.
2. CRUD de moradores e papéis/permissões por moradia.
3. Categorias, lançamentos, rateio e liquidação de despesas.
4. Tarefas recorrentes, responsáveis e histórico.
5. Testes automatizados, logs e monitoramento.
