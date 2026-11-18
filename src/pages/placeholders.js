import { icon } from '../components/icons.js';
export function placeholderPage(title, description) {
  return `<div class="welcome-row"><div><span class="eyebrow">DIVIDE AÊ</span><h1>${title}</h1><p class="muted">${description}</p></div></div><section class="panel coming-soon"><div class="empty-illustration">${icon('grid', 32)}</div><h3>Estamos preparando este espaço</h3><p>Esta área já está prevista na estrutura da plataforma. O módulo será conectado aos dados reais nas próximas etapas.</p><a class="btn btn-outline" href="#/">Voltar ao início ${icon('arrow', 16)}</a></section>`;
}
