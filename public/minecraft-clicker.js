// MINECRAFT CLICKER - Полный JavaScript код

// Игровые данные
let gameData = {
    nickname: 'Игрок',
    clan: 'Нет',
    coins: 0,
    donateBalance: 0,
    clicks: 0,
    timeOnSite: 0,
    friendsInvited: 0,
    totalEarned: 0,
    casesOpened: 0,
    privilege: 'Выживший',
    inventory: [],
    isAdmin: false
};

// Привилегии
const privileges = [
    { name: 'Выживший', price: 0 },
    { name: 'Профессионал', price: 100 },
    { name: 'БедВарсер', price: 123 },
    { name: 'Хакер', price: 345 },
    { name: 'Читер', price: 567 },
    { name: 'Гидра', price: 1239 },
    { name: 'Бог', price: 12383 }
];

// Магазин предметов
const shopItems = [
    { name: 'Деревянный меч', price: 0 },
    { name: 'Железный меч', price: 10000 },
    { name: 'Незеритовый меч', price: 100000 },
    { name: 'Меч Бога с силой х5', price: 34000000 }
];

// Кейсы
const casePacks = [
    { count: 1, price: 500 },
    { count: 3, price: 1500 },
    { count: 5, price: 2000 },
    { count: 10, price: 4500 }
];

// Ставки казино
const casinoBets = [10000, 50000, 100000, 1000000, 10000000];

// Загрузка данных из localStorage
function loadGame() {
    const saved = localStorage.getItem('minecraftClicker');
    if (saved) {
        gameData = JSON.parse(saved);
    }
    updateUI();
}

// Сохранение данных в localStorage
function saveGame() {
    localStorage.setItem('minecraftClicker', JSON.stringify(gameData));
}

// Обновление UI
function updateUI() {
    const elements = {
        nickname: document.getElementById('nickname'),
        clan: document.getElementById('clan'),
        coins: document.getElementById('coins'),
        donate: document.getElementById('donate'),
        clicks: document.getElementById('clicks'),
        currentPrivilege: document.getElementById('currentPrivilege'),
        inventoryCount: document.getElementById('inventoryCount'),
        inventoryTotal: document.getElementById('inventoryTotal'),
        totalEarned: document.getElementById('totalEarned'),
        casesOpened: document.getElementById('casesOpened'),
        timeOnSite: document.getElementById('timeOnSite'),
        friendsInvited: document.getElementById('friendsInvited')
    };

    if (elements.nickname) elements.nickname.textContent = gameData.nickname;
    if (elements.clan) elements.clan.textContent = gameData.clan;
    if (elements.coins) elements.coins.textContent = gameData.coins.toLocaleString();
    if (elements.donate) elements.donate.textContent = gameData.donateBalance.toLocaleString();
    if (elements.clicks) elements.clicks.textContent = gameData.clicks.toLocaleString();
    if (elements.currentPrivilege) elements.currentPrivilege.textContent = gameData.privilege;
    if (elements.inventoryCount) elements.inventoryCount.textContent = gameData.inventory.length;
    if (elements.inventoryTotal) elements.inventoryTotal.textContent = gameData.inventory.length;
    if (elements.totalEarned) elements.totalEarned.textContent = gameData.totalEarned.toLocaleString();
    if (elements.casesOpened) elements.casesOpened.textContent = gameData.casesOpened;
    
    // Форматирование времени
    const hours = Math.floor(gameData.timeOnSite / 3600);
    const minutes = Math.floor((gameData.timeOnSite % 3600) / 60);
    const seconds = gameData.timeOnSite % 60;
    if (elements.timeOnSite) {
        elements.timeOnSite.textContent = `${hours}ч ${minutes}м ${seconds}с`;
    }
}

// Подписка на канал
function subscribe() {
    window.open('https://t.me/av7272g', '_blank');
    document.getElementById('subscribeScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

// Старт игры
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    loadGame();
    renderPrivileges();
    renderShop();
    renderDonate();
    renderCasino();
    renderInventory();
    startTimer();
}

// Таймер времени на сайте
function startTimer() {
    setInterval(() => {
        gameData.timeOnSite++;
        updateUI();
        saveGame();
    }, 1000);
}

// Удар по зомби
function hit() {
    gameData.coins++;
    gameData.clicks++;
    gameData.totalEarned++;
    updateUI();
    saveGame();
}

// Переключение вкладок
function switchTab(tabName) {
    // Убираем активный класс со всех вкладок
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Добавляем активный класс на текущую вкладку
    event.target.classList.add('active');
    
    // Скрываем все вкладки контента
    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Показываем нужную вкладку
    const tabElement = document.getElementById('tab-' + tabName);
    if (tabElement) {
        tabElement.classList.remove('hidden');
    }
    
    // Обновляем контент для динамических вкладок
    if (tabName === 'privileges') {
        renderPrivileges();
    } else if (tabName === 'shop') {
        renderShop();
    } else if (tabName === 'donate') {
        renderDonate();
    } else if (tabName === 'casino') {
        renderCasino();
    } else if (tabName === 'inventory') {
        renderInventory();
    }
}

// Рендер привилегий
function renderPrivileges() {
    const list = document.getElementById('privilegesList');
    if (!list) return;
    
    list.innerHTML = privileges.map(privilege => `
        <button class="item-btn privilege-btn ${gameData.privilege === privilege.name ? 'active' : ''}" 
                onclick="buyPrivilege('${privilege.name}', ${privilege.price})">
            ${privilege.name} - ${privilege.price === 0 ? 'Бесплатно' : privilege.price + ' 💎'}
        </button>
    `).join('');
}

// Покупка привилегии
function buyPrivilege(name, price) {
    if (gameData.donateBalance >= price) {
        gameData.donateBalance -= price;
        gameData.privilege = name;
        alert(`✅ Привилегия "${name}" куплена!`);
        updateUI();
        saveGame();
        renderPrivileges();
    } else {
        alert('❌ Недостаточно доната!');
    }
}

// Рендер магазина
function renderShop() {
    const list = document.getElementById('shopList');
    if (!list) return;
    
    list.innerHTML = shopItems.map(item => `
        <button class="item-btn shop-btn" onclick="buyItem('${item.name}', ${item.price})">
            ${item.name} - ${item.price === 0 ? 'Бесплатно' : item.price.toLocaleString() + ' 💰'}
        </button>
    `).join('');
}

// Покупка предмета
function buyItem(name, price) {
    if (gameData.coins >= price) {
        gameData.coins -= price;
        gameData.inventory.push(name);
        alert(`✅ Куплено: ${name}`);
        updateUI();
        saveGame();
        renderInventory();
    } else {
        alert('❌ Недостаточно монет!');
    }
}

// Рендер донат-магазина
function renderDonate() {
    const list = document.getElementById('donateList');
    if (!list) return;
    
    list.innerHTML = casePacks.map(pack => `
        <button class="item-btn donate-btn" onclick="buyCase(${pack.count}, ${pack.price})">
            🎁 ${pack.count} кейс(ов) - ${pack.price} 💎
        </button>
    `).join('') + `
        <button class="item-btn autoclicker-btn" onclick="activateAutoClicker()">
            ⚡ Автокликер (10 минут) - 50 💎
        </button>
    `;
}

// Покупка кейсов
function buyCase(count, price) {
    if (gameData.donateBalance >= price) {
        gameData.donateBalance -= price;
        gameData.casesOpened += count;
        
        const items = ['Деревянный меч', 'Железный меч', 'Алмазный меч', 'Незеритовый меч'];
        for (let i = 0; i < count; i++) {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            gameData.inventory.push(randomItem);
        }
        
        alert(`✅ Открыто ${count} кейсов!`);
        updateUI();
        saveGame();
        renderInventory();
    } else {
        alert('❌ Недостаточно доната!');
    }
}

// Активация автокликера
function activateAutoClicker() {
    if (gameData.donateBalance >= 50) {
        gameData.donateBalance -= 50;
        alert('⚡ Автокликер активирован на 10 минут!');
        updateUI();
        saveGame();
        
        let counter = 0;
        const interval = setInterval(() => {
            if (counter >= 600) {
                clearInterval(interval);
                alert('⚡ Автокликер закончился!');
            } else {
                gameData.coins++;
                gameData.clicks++;
                gameData.totalEarned++;
                updateUI();
                counter++;
            }
        }, 1000);
    } else {
        alert('❌ Недостаточно доната!');
    }
}

// Рендер казино
function renderCasino() {
    const list = document.getElementById('casinoList');
    if (!list) return;
    
    list.innerHTML = casinoBets.map(bet => `
        <button class="item-btn casino-btn" onclick="playCasino(${bet})">
            Ставка ${bet.toLocaleString()} 💰
        </button>
    `).join('');
}

// Игра в казино
function playCasino(bet) {
    if (gameData.coins >= bet) {
        gameData.coins -= bet;
        const win = Math.random() > 0.5;
        
        if (win) {
            const winAmount = bet * 2;
            gameData.coins += winAmount;
            gameData.totalEarned += bet;
            alert(`🎰 Выигрыш! +${winAmount.toLocaleString()} монет`);
        } else {
            alert('🎰 Проигрыш!');
        }
        
        updateUI();
        saveGame();
    } else {
        alert('❌ Недостаточно монет!');
    }
}

// Рендер инвентаря
function renderInventory() {
    const list = document.getElementById('inventoryList');
    if (!list) return;
    
    if (gameData.inventory.length === 0) {
        list.innerHTML = '<p>Пусто</p>';
    } else {
        list.innerHTML = gameData.inventory.map(item => `
            <div class="inventory-item">${item}</div>
        `).join('');
    }
    
    updateUI();
}

// Приглашение друга
function inviteFriend() {
    window.open('https://t.me/MINECRAFTCLICKERBOT', '_blank');
}

// Показать форму входа в админку
function showAdminLogin() {
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.remove('hidden');
}

// Вход в админ-панель
function adminLogin() {
    const login = document.getElementById('adminLoginInput').value;
    const password = document.getElementById('adminPasswordInput').value;
    
    if (login === 'KosmoCat' && password === 'KosmoCat') {
        gameData.isAdmin = true;
        document.getElementById('adminLoginForm').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        alert('✅ Вход выполнен!');
    } else {
        alert('❌ Неверный логин или пароль!');
    }
}

// Добавить монеты (админ)
function addCoins() {
    const amount = prompt('Сколько монет добавить?');
    if (amount && !isNaN(amount)) {
        gameData.coins += parseInt(amount);
        updateUI();
        saveGame();
        alert(`✅ Добавлено ${parseInt(amount).toLocaleString()} монет`);
    }
}

// Добавить донат (админ)
function addDonate() {
    const amount = prompt('Сколько доната добавить?');
    if (amount && !isNaN(amount)) {
        gameData.donateBalance += parseInt(amount);
        updateUI();
        saveGame();
        alert(`✅ Добавлено ${parseInt(amount).toLocaleString()} доната`);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 MINECRAFT CLICKER загружен!');
});
