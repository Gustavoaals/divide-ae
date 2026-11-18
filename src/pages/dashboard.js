import { icon } from '../components/icons.js';
import { escapeHtml } from '../components/layout.js';
import { householdService } from '../services/household.service.js';

export function dashboardPage(user, households = []) {
  const firstName = (user?.user_metadata?.full_name || user?.email || 'por aí').split(' ')[0];
  const hasHome = households.length > 0;
  return `<div class="welcome-row"><div><span class="eyebrow">VISÃO GERAL</span><h1>Oi, ${escapeHtml(firstName)}! <span class="wave">✳</span></h1><p class="muted">Tudo começa com uma casa bem organizada.</p></div><button class="btn btn-primary" id="new-household">${icon('plus', 18)} Nova moradia</button></div>
    <div class="stats-grid"><article class="stat-card"><div class="stat-icon lilac">${icon('home')}</div><span>Minhas moradias</span><strong>${households.length}</strong><small>espaços cadastrados</small></article><article class="stat-card"><div class="stat-icon mint">${icon('users')}</div><span>Moradores</span><strong>—</strong><small>módulo em preparação</small></article><article class="stat-card"><div class="stat-icon peach">${icon('wallet')}</div><span>Despesas do mês</span><strong>—</strong><small>módulo em preparação</small></article><article class="stat-card"><div class="stat-icon yellow">${icon('check')}</div><span>Tarefas pendentes</span><strong>—</strong><small>módulo em preparação</small></article></div>
    <div class="dashboard-grid"><section class="panel homes-panel"><div class="panel-heading"><div><h3>Suas moradias</h3><p>Os espaços que você organiza</p></div><a href="#/moradias" class="text-link">Ver todas ${icon('arrow', 16)}</a></div>${hasHome ? `<div class="house-list">${households.map((home) => `<article class="house-item"><div class="house-icon">${icon('building', 22)}</div><div class="house-info"><strong>${escapeHtml(home.name)}</strong><small>${escapeHtml(home.address || 'Endereço não informado')}</small></div><span class="role-pill">${escapeHtml(home.role || 'membro')}</span></article>`).join('')}</div>` : `<div class="empty-state"><div class="empty-illustration">${icon('home', 32)}</div><h4>Sua primeira moradia começa aqui</h4><p>Crie um espaço para reunir moradores, organizar despesas e combinar a rotina.</p><button class="btn btn-outline" id="empty-create">${icon('plus', 17)} Criar minha primeira moradia</button></div>`}</section>
    <section class="panel next-panel"><div class="panel-heading"><div><h3>Próximos passos</h3><p>Prepare seu espaço compartilhado</p></div></div><div class="step-list"><div class="step-item"><span class="step-number">01</span><div><strong>Crie uma moradia</strong><small>Cadastre o espaço que vocês dividem.</small></div></div><div class="step-item"><span class="step-number">02</span><div><strong>Convide os moradores</strong><small>Em breve, cada pessoa terá seu acesso.</small></div></div><div class="step-item"><span class="step-number">03</span><div><strong>Organize a convivência</strong><small>Despesas e tarefas em um só lugar.</small></div></div></div><div class="tip-box"><span>✦</span><p>Uma boa convivência começa com acordos claros e combinados simples.</p></div></section></div>
    <dialog class="modal" id="household-modal"><form method="dialog" class="modal-close-form"><button class="icon-button" aria-label="Fechar">×</button></form><span class="eyebrow">NOVO ESPAÇO</span><h2>Criar moradia</h2><p class="muted">Dê um nome para o espaço que vocês compartilham.</p><form id="household-form" class="form-stack"><label>Nome da moradia<input name="name" placeholder="Ex.: Apê da Rua das Flores" required maxlength="80"></label><label>Endereço <span class="optional">(opcional)</span><input name="address" placeholder="Rua, número, bairro"></label><p id="household-feedback" class="form-feedback" role="status"></p><button class="btn btn-primary btn-full" type="submit">Criar moradia ${icon('arrow', 18)}</button></form></dialog>`;
}

export function bindDashboard() {
  const modal = document.getElementById('household-modal');
  const open = () => modal?.showModal();
  document.getElementById('new-household')?.addEventListener('click', open);
  document.getElementById('empty-create')?.addEventListener('click', open);
  document.getElementById('household-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const button = form.querySelector('button[type="submit"]'); const feedback = document.getElementById('household-feedback');
    button.disabled = true; feedback.textContent = 'Salvando...';
    try { const data = new FormData(form); await householdService.createHousehold(data.get('name').trim(), data.get('address').trim()); modal.close(); window.dispatchEvent(new Event('household-created')); }
    catch (error) { feedback.textContent = error.message; feedback.className = 'form-feedback error'; }
    finally { button.disabled = false; }
  });
}
