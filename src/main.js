import { authService } from './services/auth.service.js';
import { supabase } from './lib/supabase.js';
import { shell } from './components/layout.js';
import { loginPage, signupPage, recoveryPage, newPasswordPage, bindAuthForms } from './pages/auth.js';
import { dashboardPage, bindDashboard } from './pages/dashboard.js';
import { placeholderPage } from './pages/placeholders.js';
import './styles/main.css';

const app = document.querySelector('#app');
let session = null;
let currentUser = null;
let households = [];
let loading = false;

const routes = {
  '/login': () => loginPage(),
  '/cadastro': () => signupPage(),
  '/recuperar-senha': () => recoveryPage(),
  '/redefinir-senha': () => newPasswordPage(),
};
const protectedRoutes = {
  '/': ['Visão geral', ''],
  '/moradias': ['Minhas moradias', 'Acompanhe os espaços que você compartilha.'],
  '/moradores': ['Moradores', 'Gerencie quem faz parte de cada moradia.'],
  '/despesas': ['Despesas', 'Organize os gastos e acompanhe os combinados.'],
  '/tarefas': ['Tarefas', 'Distribua responsabilidades da casa.'],
  '/configuracoes': ['Configurações', 'Gerencie suas preferências e dados de conta.'],
};

function currentRoute() { return window.location.hash.replace(/^#/, '') || '/'; }
function renderMessage(title, message) { app.innerHTML = `<main class="center-screen"><div class="loading-mark">d<span>+</span></div><h2>${title}</h2><p>${message}</p></main>`; }

async function render() {
  const path = currentRoute();
  if (routes[path]) {
    if (session && path !== '/redefinir-senha') { location.hash = '/'; return; }
    app.innerHTML = routes[path](); bindAuthForms(); return;
  }
  if (!session) { location.hash = '/login'; return; }
  const [title, description] = protectedRoutes[path] || protectedRoutes['/'];
  if (path === '/') {
    renderMessage('Preparando seu espaço...', 'Buscando suas moradias.');
    try { households = await (await import('./services/household.service.js')).householdService.getMyHouseholds(); }
    catch (error) { console.error(error); households = []; }
    app.innerHTML = shell(dashboardPage(currentUser, households), currentUser, '/');
    bindDashboard();
  } else {
    app.innerHTML = shell(placeholderPage(title, description), currentUser, path);
  }
  bindShell();
}
function bindShell() {
  document.getElementById('logout')?.addEventListener('click', async () => { try { await authService.signOut(); } catch (error) { alert(error.message); } });
  document.getElementById('menu-toggle')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => document.getElementById('sidebar')?.classList.remove('open')));
}
window.addEventListener('hashchange', render);
window.addEventListener('household-created', render);

if (!supabase) {
  // Exibe orientação sem fingir que autenticação ou persistência estão ativas.
  renderMessage('Quase lá!', 'Configure as credenciais do Supabase no arquivo .env para ativar sua plataforma.');
  setTimeout(() => { if (!location.hash) location.hash = '/login'; }, 700);
} else {
  renderMessage('Divide Aê', 'Conectando sua conta com segurança...');
  try { session = await authService.getSession(); currentUser = session?.user ?? null; }
  catch (error) { console.error(error); }
  authService.onAuthStateChange((_event, nextSession) => {
    session = nextSession; currentUser = nextSession?.user ?? null;
    if (loading) return;
    loading = true; render().finally(() => { loading = false; });
  });
  await render();
}
