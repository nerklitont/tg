/* ===== Authentication Module ===== */

const Auth = {
    token: null,
    user: null,

    init() {
        this.token = localStorage.getItem('cs2skins_token');
        const savedUser = localStorage.getItem('cs2skins_user');
        if (savedUser) {
            try {
                this.user = JSON.parse(savedUser);
            } catch (e) {
                this.user = null;
            }
        }

        this.bindEvents();

        if (this.token) {
            this.checkAuth();
        } else {
            this.showGuest();
        }
    },

    bindEvents() {
        // Show login/register modals
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showModal('login'));
        document.getElementById('registerBtn')?.addEventListener('click', () => this.showModal('register'));
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        // Close auth modal
        document.getElementById('closeAuthModal')?.addEventListener('click', () => {
            document.getElementById('authModal').classList.remove('active');
        });

        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.tab;
                document.getElementById('loginForm').classList.toggle('hidden', target !== 'login');
                document.getElementById('registerForm').classList.toggle('hidden', target !== 'register');
            });
        });

        // Login form
        document.getElementById('loginFormEl')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Register form
        document.getElementById('registerFormEl')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });
    },

    showModal(tab = 'login') {
        const modal = document.getElementById('authModal');
        modal.classList.add('active');

        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
        document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');

        document.getElementById('authError').textContent = '';
    },

    async login() {
        const loginVal = document.getElementById('loginInput').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('authError');

        if (!loginVal || !password) {
            errorEl.textContent = 'Заполните все поля';
            return;
        }

        try {
            const resp = await this.apiCall('/api/auth/login', 'POST', {
                login: loginVal,
                password: password,
            });

            if (resp.success) {
                this.setSession(resp.token, resp.user);
                document.getElementById('authModal').classList.remove('active');
                App.notify(`Добро пожаловать, ${resp.user.username}!`, 'success');
            }
        } catch (err) {
            errorEl.textContent = err.message || 'Ошибка входа';
        }
    },

    async register() {
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const password2 = document.getElementById('regPassword2').value;
        const errorEl = document.getElementById('authError');

        if (!username || !email || !password) {
            errorEl.textContent = 'Заполните все поля';
            return;
        }

        if (password !== password2) {
            errorEl.textContent = 'Пароли не совпадают';
            return;
        }

        if (password.length < 6) {
            errorEl.textContent = 'Пароль минимум 6 символов';
            return;
        }

        try {
            const resp = await this.apiCall('/api/auth/register', 'POST', {
                username, email, password,
            });

            if (resp.success) {
                this.setSession(resp.token, resp.user);
                document.getElementById('authModal').classList.remove('active');
                App.notify(`Аккаунт создан! Добро пожаловать, ${resp.user.username}!`, 'success');
            }
        } catch (err) {
            errorEl.textContent = err.message || 'Ошибка регистрации';
        }
    },

    setSession(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('cs2skins_token', token);
        localStorage.setItem('cs2skins_user', JSON.stringify(user));
        this.showUser();
        this.syncFromServer();
    },

    async checkAuth() {
        try {
            const resp = await this.apiCall('/api/auth/me', 'GET');
            if (resp.success) {
                this.user = resp.user;
                localStorage.setItem('cs2skins_user', JSON.stringify(resp.user));
                this.showUser();
                this.syncFromServer();
            }
        } catch {
            this.logout(true);
        }
    },

    async syncFromServer() {
        if (!this.token || !this.user) return;

        // Sync balance
        App.balance = this.user.balance;
        App.updateBalance();

        // Sync inventory
        try {
            const resp = await this.apiCall('/api/user/inventory', 'GET');
            if (resp.success) {
                App.inventory = resp.items.map(item => ({
                    ...item,
                    uid: item.id,
                    image: item.image,
                }));
                App.renderInventory();
            }
        } catch (e) {
            console.warn('Failed to sync inventory');
        }
    },

    logout(silent = false) {
        this.token = null;
        this.user = null;
        localStorage.removeItem('cs2skins_token');
        localStorage.removeItem('cs2skins_user');
        this.showGuest();

        // Reset to local mode
        App.balance = 10000;
        App.inventory = [];
        App.updateBalance();
        App.renderInventory();

        if (!silent) App.notify('Вы вышли из аккаунта', 'info');
    },

    showUser() {
        document.getElementById('guestButtons')?.classList.add('hidden');
        document.getElementById('userMenu')?.classList.remove('hidden');
        document.getElementById('userName').textContent = this.user?.username || '';
    },

    showGuest() {
        document.getElementById('guestButtons')?.classList.remove('hidden');
        document.getElementById('userMenu')?.classList.add('hidden');
    },

    isLoggedIn() {
        return !!this.token && !!this.user;
    },

    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    },

    async apiCall(url, method = 'GET', body = null) {
        const opts = {
            method,
            headers: this.getHeaders(),
        };

        if (body && method !== 'GET') {
            opts.body = JSON.stringify(body);
        }

        const resp = await fetch(url, opts);
        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data.detail || 'Ошибка сервера');
        }

        return data;
    },
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
