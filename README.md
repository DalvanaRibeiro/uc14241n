# UC14 (241N) — Entregas (Vercel + Admin seguro leve)

**Inclui**
- Admin com **usuário + senha** e **sessão de 12h**, vinculada ao usuário (front-end didático).
- Criar/remover atividades, editar rascunho, **Publicar** para página pública.
- Páginas públicas `/atividade/:id` (somente leitura).
- **Tema claro** (harmônico), **Exportar CSV**, **favicon**, `vercel.json` com SPA.
  
## Rodar localmente
```bash
npm install
npm run dev
```

## Variáveis de ambiente (defina antes de usar o admin)
Crie um arquivo `.env` na raiz com:
```
VITE_ADMIN_USER=seu_usuario
VITE_ADMIN_PASS=sua_senha
```
Na Vercel, configure esses dois **Environment Variables** no projeto (Production/Preview).

## Deploy na Vercel
- Framework: Vite (auto)
- Build: `vite build`
- Output: `dist/`
- `vercel.json` já configurado para SPA

> Observação: por ser front-end, isso é adequado para fins didáticos e controle básico. Para segurança real, implemente um backend (JWT/OAuth) ou proteja com senha do lado do servidor.
