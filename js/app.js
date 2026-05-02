/* ===== Main Application ===== */

const App = {
    balance: 10000,
    inventory: [],

    init() {
        this.loadState();
        this.bindEvents();
        this.renderCases();
        this.renderInventory();
        this.updateBalance();
        this.initScrollAnimations();
        this.initCounters();
        this.initNavHighlight();
    },

    loadState() {
        const saved = localStorage.getItem('cs2skins_state');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.balance = state.balance ?? 10000;
                this.inventory = state.inventory ?? [];
            } catch (e) {
                console.warn('Failed to load state');
            }
        }
    },

    saveState() {
        localStorage.setItem('cs2skins_state', JSON.stringify({
            balance: this.balance,
            inventory: this.inventory
        }));
    },

    updateBalance() {
        document.getElementById('balance').textContent = this.balance.toFixed(2);
        this.saveState();
    },

    addBalance(amount) {
        this.balance += amount;
        this.updateBalance();
        this.notify(`Баланс пополнен на ${amount} ₽`, 'success');
    },

    subtractBalance(amount) {
        if (this.balance < amount) return false;
        this.balance -= amount;
        this.updateBalance();
        return true;
    },

    addToInventory(skin) {
        const invItem = { ...skin, uid: Date.now() + Math.random() };
        this.inventory.push(invItem);
        this.saveState();
        this.renderInventory();
        return invItem;
    },

    removeFromInventory(uid) {
        this.inventory = this.inventory.filter(item => item.uid !== uid);
        this.saveState();
        this.renderInventory();
    },

    sellSkin(uid) {
        const item = this.inventory.find(i => i.uid === uid);
        if (!item) return;
        this.addBalance(item.price);
        this.removeFromInventory(uid);
        this.notify(`${item.weapon} | ${item.name} продан за ${item.price} ₽`, 'success');
    },

    sellAll() {
        if (this.inventory.length === 0) return;
        const total = this.inventory.reduce((sum, item) => sum + item.price, 0);
        this.addBalance(total);
        this.inventory = [];
        this.saveState();
        this.renderInventory();
        this.notify(`Все скины проданы за ${total.toFixed(2)} ₽`, 'success');
    },

    bindEvents() {
        // Mobile toggle
        document.getElementById('mobileToggle').addEventListener('click', () => {
            document.querySelector('.nav').classList.toggle('open');
        });

        // Add balance
        document.getElementById('addBalanceBtn').addEventListener('click', () => {
            this.addBalance(5000);
        });

        // Sell all
        document.getElementById('sellAllBtn').addEventListener('click', () => {
            if (this.inventory.length === 0) {
                this.notify('Инвентарь пуст', 'warning');
                return;
            }
            this.sellAll();
        });

        // Header scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            header.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Inventory sort
        document.querySelectorAll('[data-sort]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderInventory(btn.dataset.sort);
            });
        });

        // Close modals on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.closest('.modal').classList.remove('active');
            });
        });

        // Smooth scroll nav
        document.querySelectorAll('.nav-link, .hero-buttons .btn').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        document.querySelector('.nav').classList.remove('open');
                    }
                }
            });
        });
    },

    renderCases() {
        const grid = document.getElementById('casesGrid');
        grid.innerHTML = CASES.map(c => {
            const skinCount = c.skins.length;
            return `
                <div class="case-card fade-in-up" data-rarity="${c.rarity}" data-case-id="${c.id}">
                    <div class="case-image">
                        <div class="case-image-bg" style="background: ${c.gradient}"></div>
                        <div class="case-image-inner">${c.icon}</div>
                    </div>
                    <div class="case-info">
                        <div class="case-name">${c.name}</div>
                        <div class="case-items-count">${skinCount} предметов</div>
                        <div class="case-price-row">
                            <span class="case-price">${c.price} ₽</span>
                            <button class="case-open-btn">Открыть</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind click events
        grid.querySelectorAll('.case-card').forEach(card => {
            card.addEventListener('click', () => {
                const caseId = parseInt(card.dataset.caseId);
                CaseOpener.openModal(caseId);
            });
        });
    },

    renderInventory(filter = 'all') {
        const grid = document.getElementById('inventoryGrid');
        let items = [...this.inventory];

        if (filter !== 'all') {
            items = items.filter(item => item.rarity === filter);
        }

        items.sort((a, b) => b.price - a.price);

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="inventory-empty">
                    <i class="fas fa-box-open"></i>
                    <p>${filter === 'all' ? 'Инвентарь пуст. Открой кейс!' : 'Нет скинов этой редкости'}</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = items.map(skin => `
            <div class="skin-card" data-rarity="${skin.rarity}" data-uid="${skin.uid}">
                <div class="skin-card-image">
                    <span class="skin-icon">${getSkinIcon(skin)}</span>
                </div>
                <div class="skin-card-info">
                    <div class="skin-card-name">${skin.name}</div>
                    <div class="skin-card-weapon">${skin.weapon}</div>
                    <div class="skin-card-price">${skin.price} ₽</div>
                    <span class="skin-card-rarity rarity-${skin.rarity}">${getRarityName(skin.rarity)}</span>
                </div>
            </div>
        `).join('');

        // Bind sell click
        grid.querySelectorAll('.skin-card').forEach(card => {
            card.addEventListener('click', () => {
                const uid = parseFloat(card.dataset.uid);
                this.sellSkin(uid);
            });
        });
    },

    notify(message, type = 'info') {
        const container = document.getElementById('notifications');
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        const el = document.createElement('div');
        el.className = `notification ${type}`;
        el.innerHTML = `<i class="${icons[type]}"></i><span>${message}</span>`;
        container.appendChild(el);

        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(100%)';
            el.style.transition = 'all 0.3s ease';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    },

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
    },

    initCounters() {
        const counters = document.querySelectorAll('.stat-value[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    this.animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    },

    animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    },

    initNavHighlight() {
        const sections = document.querySelectorAll('section[id], .hero');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 200) {
                    current = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === current) {
                    link.classList.add('active');
                }
            });
        });
    },

    createConfetti() {
        const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#d32ce6', '#ffd700'];
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDuration = (Math.random() * 2 + 1) + 's';
            piece.style.animationDelay = Math.random() * 0.5 + 's';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            piece.style.width = (Math.random() * 8 + 5) + 'px';
            piece.style.height = (Math.random() * 8 + 5) + 'px';
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 3000);
        }
    }
};

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
