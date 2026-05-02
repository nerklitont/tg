/* ===== Case Opening Logic ===== */

const CaseOpener = {
    currentCase: null,
    isSpinning: false,
    wonSkin: null,

    openModal(caseId) {
        this.currentCase = CASES.find(c => c.id === caseId);
        if (!this.currentCase) return;

        const modal = document.getElementById('caseModal');
        const title = document.getElementById('caseModalTitle');
        const priceSpan = document.getElementById('casePrice');
        const result = document.getElementById('caseResult');
        const openBtn = document.getElementById('openCaseBtn');

        title.textContent = this.currentCase.name;
        priceSpan.textContent = this.currentCase.price;
        result.classList.add('hidden');
        openBtn.classList.remove('hidden');
        openBtn.disabled = false;

        this.buildRoulette();
        modal.classList.add('active');

        openBtn.onclick = () => this.spin();
        document.getElementById('closeCaseModal').onclick = () => {
            if (!this.isSpinning) modal.classList.remove('active');
        };
    },

    buildRoulette() {
        const strip = document.getElementById('rouletteStrip');
        const items = [];

        for (let i = 0; i < 60; i++) {
            const skin = this.getRandomSkin();
            items.push(skin);
        }

        strip.innerHTML = items.map(skin => `
            <div class="roulette-item" data-rarity="${skin.rarity}">
                <div class="roulette-item-icon">
                    ${getSkinImageTag(skin, 'roulette-img')}
                </div>
                <div class="roulette-item-name">${skin.name}</div>
                <div class="roulette-item-price">${skin.price} ₽</div>
            </div>
        `).join('');

        strip.style.transform = 'translateX(0)';
        strip.style.transition = 'none';

        this._rouletteItems = items;
    },

    getRandomSkin() {
        const c = this.currentCase;
        const roll = Math.random() * 100;
        let cumulative = 0;
        let targetRarity = 'consumer';

        for (const [rarity, chance] of Object.entries(c.drops)) {
            cumulative += chance;
            if (roll <= cumulative) {
                targetRarity = rarity;
                break;
            }
        }

        const caseSkins = c.skins.map(id => getSkinById(id)).filter(s => s);
        const raritySkins = caseSkins.filter(s => s.rarity === targetRarity);

        if (raritySkins.length > 0) {
            return raritySkins[Math.floor(Math.random() * raritySkins.length)];
        }

        return caseSkins[Math.floor(Math.random() * caseSkins.length)];
    },

    spin() {
        if (this.isSpinning) return;

        const c = this.currentCase;
        if (!App.subtractBalance(c.price)) {
            App.notify('Недостаточно средств!', 'error');
            return;
        }

        this.isSpinning = true;
        const openBtn = document.getElementById('openCaseBtn');
        openBtn.disabled = true;

        this.wonSkin = this.getRandomSkin();

        const winIndex = 52;
        if (this._rouletteItems) {
            this._rouletteItems[winIndex] = this.wonSkin;
            const strip = document.getElementById('rouletteStrip');
            const items = strip.children;
            if (items[winIndex]) {
                items[winIndex].setAttribute('data-rarity', this.wonSkin.rarity);
                items[winIndex].querySelector('.roulette-item-icon').innerHTML = getSkinImageTag(this.wonSkin, 'roulette-img');
                items[winIndex].querySelector('.roulette-item-name').textContent = this.wonSkin.name;
                items[winIndex].querySelector('.roulette-item-price').textContent = this.wonSkin.price + ' ₽';
            }
        }

        const itemWidth = 160;
        const wrapper = document.querySelector('.roulette-wrapper');
        const wrapperCenter = wrapper.offsetWidth / 2;
        const targetOffset = -(winIndex * itemWidth - wrapperCenter + itemWidth / 2);
        const randomOffset = (Math.random() - 0.5) * (itemWidth * 0.6);
        const finalOffset = targetOffset + randomOffset;

        const strip = document.getElementById('rouletteStrip');

        requestAnimationFrame(() => {
            strip.style.transition = 'transform 5s cubic-bezier(0.15, 0.8, 0.3, 1)';
            strip.style.transform = `translateX(${finalOffset}px)`;
        });

        setTimeout(() => {
            this.showResult();
        }, 5200);
    },

    showResult() {
        this.isSpinning = false;
        const skin = this.wonSkin;
        const result = document.getElementById('caseResult');
        const openBtn = document.getElementById('openCaseBtn');
        const resultSkin = document.getElementById('resultSkin');
        const sellPrice = document.getElementById('sellPrice');

        resultSkin.innerHTML = `
            <div class="skin-won">
                <div class="skin-won-icon">${getSkinImageTag(skin, 'skin-won-img')}</div>
                <div class="skin-won-name" style="color: ${getRarityColor(skin.rarity)}">${skin.name}</div>
                <div class="skin-won-weapon">${skin.weapon}</div>
                <div class="skin-won-price">${skin.price} ₽</div>
                <span class="skin-card-rarity rarity-${skin.rarity}">${getRarityName(skin.rarity)}</span>
            </div>
        `;

        sellPrice.textContent = skin.price;
        result.classList.remove('hidden');
        openBtn.classList.add('hidden');

        const rarityIndex = RARITY_ORDER.indexOf(skin.rarity);
        if (rarityIndex >= 4) {
            App.createConfetti();
        }

        document.getElementById('sellSkinBtn').onclick = () => {
            App.addBalance(skin.price);
            App.notify(`${skin.weapon} | ${skin.name} продан за ${skin.price} ₽`, 'success');
            this.resetModal();
        };

        document.getElementById('keepSkinBtn').onclick = () => {
            App.addToInventory(skin);
            App.notify(`${skin.weapon} | ${skin.name} добавлен в инвентарь`, 'info');
            this.resetModal();
        };
    },

    resetModal() {
        const result = document.getElementById('caseResult');
        const openBtn = document.getElementById('openCaseBtn');

        result.classList.add('hidden');
        openBtn.classList.remove('hidden');
        openBtn.disabled = false;

        this.buildRoulette();
    }
};
