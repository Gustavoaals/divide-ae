import { authService } from '../services/auth.service.js';
import { icon } from '../components/icons.js';

function authFrame(content, eyebrow = 'BEM-VINDO AO DIVIDE AÊ') {
  return `<main class="auth-page"><section class="auth-aside"><a class="brand brand-light" href="#/"><span class="brand-mark">d<span>+</span></span><span>divide <b>aê.</b></span></a><div class="auth-message"><span class="eyebrow">MORAR JUNTO, SEM COMPLICAÇÃO</span><h1>Compartilhar a casa pode ser mais leve.</h1><p>Organize a rotina, combine responsabilidades e deixe a convivência fluir.</p><div class="auth-decoration"><span>casa</span><span>+</span><span>gente</span><span>+</span><span>harmonia</span></div></div><small class="aside-foot">Um espaço melhor começa com organização.</small></section><section class="auth-main"><div class="auth-card"><div class="auth-mobile-brand">${icon('home', 22)} divide aê.</div><span class="eyebrow">${eyebrow}</span>${content}</div><small class="auth-legal">© ${new Date().getFullYear()} Divide Aê. Feito para viver melhor junto.</small></section></main>`;
}

export function loginPage() {
  return authFrame(`<h2>Que bom ter você de volta!</h2><p class="auth-subtitle">Entre na sua conta para continuar.</p><form id="login-form" class="form-stack"><label>E-mail<input type="email" name="email" placeholder="voce@email.com" autocomplete="email" required></label><label>Senha<input type="password" name="password" placeholder="Sua senha" autocomplete="current-password" required minlength="6"></label><div class="form-meta"><span></span><a href="#/recuperar-senha">Esqueceu a senha?</a></div><button class="btn btn-primary btn-full" type="submit">Entrar ${icon('arrow', 18)}</button><p class="form-feedback" id="feedback" role="status"></p></form><p class="auth-switch">Ainda não tem conta? <a href="#/cadastro">Criar minha conta</a></p>`);
}
export function signupPage() {
  return authFrame(`<h2>Vamos começar?</h2><p class="auth-subtitle">Crie sua conta e organize seu espaço.</p><form id="signup-form" class="form-stack"><label>Nome completo<input name="name" placeholder="Como podemos te chamar?" autocomplete="name" required></label><label>E-mail<input type="email" name="email" placeholder="voce@email.com" autocomplete="email" required></label><label>Senha<input type="password" name="password" placeholder="Mínimo de 6 caracteres" autocomplete="new-password" required minlength="6"></label><button class="btn btn-primary btn-full" type="submit">Criar conta ${icon('arrow', 18)}</button><p class="form-feedback" id="feedback" role="status"></p></form><p class="auth-switch">Já tem uma conta? <a href="#/login">Entrar</a></p>`, 'CRIE SEU ESPAÇO');
}
export function recoveryPage() {
  return authFrame(`<h2>Recuperar acesso</h2><p class="auth-subtitle">Informe seu e-mail. Enviaremos um link para redefinir sua senha.</p><form id="recovery-form" class="form-stack"><label>E-mail<input type="email" name="email" placeholder="voce@email.com" autocomplete="email" required></label><button class="btn btn-primary btn-full" type="submit">Enviar link ${icon('arrow', 18)}</button><p class="form-feedback" id="feedback" role="status"></p></form><p class="auth-switch"><a href="#/login">Voltar para o login</a></p>`, 'RECUPERE SUA CONTA');
}
export function newPasswordPage() {
  return authFrame(`<h2>Escolha uma nova senha</h2><p class="auth-subtitle">Crie uma senha segura para sua conta.</p><form id="password-form" class="form-stack"><label>Nova senha<input type="password" name="password" placeholder="Mínimo de 6 caracteres" required minlength="6"></label><button class="btn btn-primary btn-full" type="submit">Salvar nova senha ${icon('arrow', 18)}</button><p class="form-feedback" id="feedback" role="status"></p></form>`);
}

export function bindAuthForms() {
  const bind = (id, action, success) => document.getElementById(id)?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const feedback = document.getElementById('feedback');
    button.disabled = true; button.classList.add('loading'); feedback.textContent = 'Aguarde...'; feedback.className = 'form-feedback';
    try { await action(new FormData(form)); feedback.textContent = success; feedback.classList.add('success'); if (id === 'password-form') setTimeout(() => { location.hash = '/login'; }, 1400); }
    catch (error) { feedback.textContent = error.message || 'Não foi possível concluir. Tente novamente.'; feedback.classList.add('error'); }
    finally { button.disabled = false; button.classList.remove('loading'); }
  });
  bind('login-form', (data) => authService.signIn(data.get('email'), data.get('password')), 'Login realizado.');
  bind('signup-form', (data) => authService.signUp(data.get('name'), data.get('email'), data.get('password')), 'Conta criada! Verifique seu e-mail para confirmar o cadastro, se solicitado.');
  bind('recovery-form', (data) => authService.resetPassword(data.get('email')), 'Se o endereço estiver cadastrado, você receberá um link de recuperação.');
  bind('password-form', (data) => authService.updatePassword(data.get('password')), 'Senha atualizada com sucesso!');
}
