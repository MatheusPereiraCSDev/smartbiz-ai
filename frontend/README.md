# SmartBiz AI — Tela de Acesso (Front-End)

Primeira etapa do sistema de Gestão Empresarial **SmartBiz AI**: a tela de
Login e Cadastro, construída como interface pura (sem backend, sem
autenticação real, sem banco de dados). Pronta para futura integração com
FastAPI + JWT.

## Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Estrutura

```
src/
  components/
    AnimatedGears.tsx   → engrenagens animadas de fundo (canto inferior esquerdo)
    Button.tsx           → botão reutilizável (variants: primary | ghost)
    Input.tsx             → campo de formulário reutilizável
    Logo.tsx               → logo temporária + wordmark
    LoginForm.tsx          → formulário de login
    RegisterModal.tsx      → modal de cadastro (borda #7B61FF, fade + scale)
  pages/
    LoginPage.tsx           → composição da tela inicial
  types/
    auth.ts                  → tipos de formulário (LoginFormData, RegisterFormData)
  App.tsx
  main.tsx
  index.css
```

## Paleta

| Token | Hex |
|---|---|
| Fundo principal | `#1E1F2A` |
| Fundo profundo | `#15161C` |
| Superfície (cards) | `#25273A` |
| Destaque (accent) | `#7B61FF` |
| Texto | `#F5F5FA` |

## Notas

- Nenhuma chamada de rede, autenticação ou persistência foi implementada —
  os formulários apenas gerenciam estado local de UI.
- Componentização de responsabilidade única, pronta para receber lógica de
  integração na próxima etapa.
