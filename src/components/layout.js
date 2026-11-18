import { icon } from './icons.js';

const navItems = [
  ['/', 'Visão geral', 'grid'],
  ['/moradias', 'Minhas moradias', 'home'],
  ['/moradores', 'Moradores', 'users'],
  ['/despesas', 'Despesas', 'wallet'],
  ['/tarefas', 'Tarefas', 'check'],
];

export function shell(content, user, active = '/') {
  const initials = (user?.user_metadata?.full_name || user?.email || 'DA').slice(0, 2).toUpperCase();
  return `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <a class="brand" href="#/" aria-label="Divide Aê início"><span class="brand-mark">d<span>+</span></span><span>divide <b>aê.</b></span></a>
        <div class="nav-caption">MENU PRINCIPAL</div>
        <nav class="main-nav">${navItems.map(([path, label, glyph]) => `<a class="nav-link ${active === path ? 'active' : ''}" href="#${path}">${icon(glyph)}<span>${label}</span></a>`).join('')}</nav>
        <div class="sidebar-bottom">
          <a class="nav-link ${active === '/configuracoes' ? 'active' : ''}" href="#/configuracoes">${icon('settings')}<span>Configurações</span></a>
          <div class="profile-row"><div class="avatar">${initials}</div><div class="profile-copy"><strong>${escapeHtml(user?.user_metadata?.full_name || 'Minha conta')}</strong><small>${escapeHtml(user?.email || '')}</small></div><button class="icon-button" id="logout" title="Sair">${icon('logout', 18)}</button></div>
        </div>
      </aside>
      <main class="main-area"><header class="topbar"><button class="icon-button mobile-menu" id="menu-toggle" aria-label="Abrir menu">${icon('menu')}</button><div class="breadcrumb">Seu espaço <span>/</span> <b>${navItems.find(([path]) => path === active)?.[1] || 'Conta'}</b></div><div class="topbar-right"><span class="online-dot"></span><span>Seu lar, em ordem</span></div></header><section class="page-content">${content}</section></main>
    </div>`;
}
export function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
