/* ===== Upgrade Logic ===== */

const Upgrader = {
    selectedSkin: null,
    targetSkin: null,

    init() {
        document.getElementById('upgradeFrom').addEventListener('click', () => this.openSkinSelect());
        document.getElementById('closeSkinModal')?.addEventListener('click', () => {
            document.getElementById('selectSkinModal').classList.remove('active');
        });
        document.getElementById('upgradeBtn').addEventListener('click', () => this.doUpgrade());
        document.getElementById('upgradeResultClose').addEventListener('click', () => {
            document.getElementById('upgradeModal').classList.remove('active');
        });

        this.renderTargets();
    },

    openSkinSelect() {
        const modal = document.getElementById('selectSkinModal');
        const grid = document.getElementById('selectSkinGrid');

        if (App.inventory.length === 0) {
            App.notify('Инвентарь пуст! Открой кейс сначала.', 'warning');
            return;
        }

        const sorted = [...App.inventory].sort((a, b) => b.price - a.price);

        grid.innerHTML = sorted.map(skin => `
            <div class="skin-card" data-rarity="${skin.rarity}" data-uid="${skin.uid}">
                <div class="skin-card-image">
                    <span class="skin-icon">${getSkinIcon(skin)}</span>
                </div>
                <div class="skin-card-info">
                    <div class="skin-card-name">${skin.name}</div>
                    <div class="skin-card-weapon">${skin.weapon}</div>
                    <div class="skin-card-price">${skin.price} ₽</div>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.skin-card').forEach(card => {
            card.addEventListener('click', () => {
                const uid = parseFloat(card.dataset.uid);
                const skin = App.inventory.find(s => s.uid === uid);
                if (skin) {
                    this.selectSkin(skin);
                    modal.classList.remove('active');
                }
            });
        });

        modal.classList.add('active');
    },

    selectSkin(skin) {
        this.selectedSkin = skin;
        const slot = document.getElementById('upgradeFrom');
        slot.classList.add('has-skin');
        slot.innerHTML = `
            <div class="slot-skin">
                <div class="slot-skin-icon">${getSkinIcon(skin)}</div>
                <div class="slot-skin-name" style="color: ${getRarityColor(skin.rarity)}">${skin.name}</div>
                <div class="slot-skin-weapon">${skin.weapon}</div>
                <div class="slot-skin-price">${skin.price} ₽</div>
            </div>
        `;

        this.renderTargets();
        this.updateChance();
    },

    renderTargets() {
        const grid = document.getElementById('targetsGrid');
        let targets = ALL_SKINS.filter(s => {
            if (!this.selectedSkin) return s.price > 100;
            return s.price > this.selectedSkin.price;
        });

        targets.sort((a, b) => a.price - b.price);
        targets = targets.slice(0, 12);

        grid.innerHTML = targets.map(skin => `
            <div class="target-card ${this.targetSkin && this.targetSkin.id === skin.id ? 'selected' : ''}" data-skin-id="${skin.id}">
                <div class="target-card-icon">${getSkinIcon(skin)}</div>
                <div class="target-card-name" style="color: ${getRarityColor(skin.rarity)}">${skin.name}</div>
                <div class="target-card-weapon">${skin.weapon}</div>
                <div class="target-card-price">${skin.price} ₽</div>
                <span class="skin-card-rarity rarity-${skin.rarity}">${getRarityName(skin.rarity)}</span>
            </div>
        `).join('');

        grid.querySelectorAll('.target-card').forEach(card => {
            card.addEventListener('click', () => {
                const skinId = parseInt(card.dataset.skinId);
                const skin = ALL_SKINS.find(s => s.id === skinId);
                if (skin) {
                    this.selectTarget(skin);
                    grid.querySelectorAll('.target-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                }
            });
        });
    },

    selectTarget(skin) {
        this.targetSkin = skin;
        const slot = document.getElementById('upgradeTo');
        slot.classList.add('has-skin');
        slot.innerHTML = `
            <div class="slot-skin">
                <div class="slot-skin-icon">${getSkinIcon(skin)}</div>
                <div class="slot-skin-name" style="color: ${getRarityColor(skin.rarity)}">${skin.name}</div>
                <div class="slot-skin-weapon">${skin.weapon}</div>
                <div class="slot-skin-price">${skin.price} ₽</div>
            </div>
        `;

        this.updateChance();
    },

    updateChance() {
        const btn = document.getElementById('upgradeBtn');
        const chanceEl = document.getElementById('upgradeChance');
        const progressEl = document.getElementById('circleProgress');
        const circleEl = document.getElementById('upgradeCircle');

        if (!this.selectedSkin || !this.targetSkin) {
            chanceEl.textContent = '0%';
            progressEl.style.strokeDashoffset = 565.48;
            btn.disabled = true;
            circleEl.className = 'upgrade-circle';
            return;
        }

        const chance = Math.min(95, Math.max(1, (this.selectedSkin.price / this.targetSkin.price) * 100));
        const roundedChance = Math.round(chance * 10) / 10;

        chanceEl.textContent = roundedChance + '%';

        // Update circle
        const circumference = 565.48;
        const offset = circumference - (chance / 100) * circumference;
        progressEl.style.strokeDashoffset = offset;

        // Color based on chance
        circleEl.className = 'upgrade-circle';
        if (chance >= 50) {
            circleEl.classList.add('chance-high');
        } else if (chance >= 20) {
            circleEl.classList.add('chance-mid');
        } else {
            circleEl.classList.add('chance-low');
        }

        btn.disabled = false;
    },

    doUpgrade() {
        if (!this.selectedSkin || !this.targetSkin) return;

        const chance = Math.min(95, Math.max(1, (this.selectedSkin.price / this.targetSkin.price) * 100));
        const won = Math.random() * 100 <= chance;

        // Remove selected skin from inventory
        App.removeFromInventory(this.selectedSkin.uid);

        // Show animation
        const modal = document.getElementById('upgradeModal');
        const animation = document.getElementById('upgradeAnimation');
        const result = document.getElementById('upgradeResult');

        animation.classList.remove('hidden');
        result.classList.add('hidden');
        modal.classList.add('active');

        setTimeout(() => {
            animation.classList.add('hidden');
            result.classList.remove('hidden');

            const titleEl = document.getElementById('upgradeResultTitle');
            const skinEl = document.getElementById('upgradeResultSkin');

            if (won) {
                titleEl.textContent = 'УСПЕХ!';
                titleEl.className = 'result-success';

                const wonSkin = { ...this.targetSkin };
                App.addToInventory(wonSkin);
                App.createConfetti();

                skinEl.innerHTML = `
                    <div class="won-skin-display">
                        <div class="skin-big-icon">${getSkinIcon(wonSkin)}</div>
                        <div class="skin-big-name" style="color: ${getRarityColor(wonSkin.rarity)}">${wonSkin.name}</div>
                        <div>${wonSkin.weapon}</div>
                        <div class="skin-big-price">${wonSkin.price} ₽</div>
                        <span class="skin-card-rarity rarity-${wonSkin.rarity}">${getRarityName(wonSkin.rarity)}</span>
                    </div>
                `;

                App.notify(`Апгрейд успешен! Получен ${wonSkin.weapon} | ${wonSkin.name}`, 'success');
            } else {
                titleEl.textContent = 'НЕУДАЧА';
                titleEl.className = 'result-fail';

                skinEl.innerHTML = `
                    <div class="won-skin-display">
                        <div class="skin-big-icon" style="opacity: 0.3; font-size: 64px;">💀</div>
                        <div style="color: var(--text-secondary); margin-top: 12px;">Скин потерян</div>
                    </div>
                `;

                App.notify('Апгрейд не удался. Скин потерян.', 'error');
            }

            // Reset
            this.selectedSkin = null;
            this.targetSkin = null;
            this.resetSlots();

        }, 2500);
    },

    resetSlots() {
        const fromSlot = document.getElementById('upgradeFrom');
        const toSlot = document.getElementById('upgradeTo');

        fromSlot.classList.remove('has-skin');
        fromSlot.innerHTML = `
            <div class="slot-placeholder">
                <i class="fas fa-plus"></i>
                <span>Выбери скин</span>
            </div>
        `;

        toSlot.classList.remove('has-skin');
        toSlot.innerHTML = `
            <div class="slot-placeholder">
                <i class="fas fa-star"></i>
                <span>Выбери цель</span>
            </div>
        `;

        // Re-bind click
        fromSlot.addEventListener('click', () => this.openSkinSelect());

        this.updateChance();
        this.renderTargets();
    }
};

document.addEventListener('DOMContentLoaded', () => Upgrader.init());
