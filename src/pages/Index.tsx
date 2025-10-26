import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Item {
  id: string;
  name: string;
  price: number;
  multiplier?: number;
  type: 'weapon' | 'privilege';
}

interface Inventory {
  [key: string]: number;
}

const WEAPONS: Item[] = [
  { id: 'wood-sword', name: 'Деревянный меч', price: 0, multiplier: 1, type: 'weapon' },
  { id: 'iron-sword', name: 'Железный меч', price: 10000, multiplier: 2, type: 'weapon' },
  { id: 'netherite-sword', name: 'Незеритовый меч', price: 100000, multiplier: 5, type: 'weapon' },
  { id: 'god-sword', name: 'Меч Бога x5', price: 34000000, multiplier: 25, type: 'weapon' },
];

const PRIVILEGES: Item[] = [
  { id: 'survivor', name: 'Выживший', price: 0, type: 'privilege' },
  { id: 'professional', name: 'Профессионал', price: 100, type: 'privilege' },
  { id: 'bedwars', name: 'БедВарсер', price: 123, type: 'privilege' },
  { id: 'hacker', name: 'Хакер', price: 345, type: 'privilege' },
  { id: 'cheater', name: 'Читер', price: 567, type: 'privilege' },
  { id: 'hydra', name: 'Гидра', price: 1239, type: 'privilege' },
  { id: 'god', name: 'Бог', price: 12383, type: 'privilege' },
];

const CASINO_BETS = [10000, 50000, 100000, 1000000, 10000000];

const DONAT_CASES = [
  { id: 'case-1', name: '1 кейс', price: 500, count: 1 },
  { id: 'case-3', name: '3 кейса', price: 1500, count: 3 },
  { id: 'case-5', name: '5 кейсов', price: 2000, count: 5 },
  { id: 'case-10', name: '10 кейсов', price: 4500, count: 10 },
];

const generateRandomNickname = () => {
  const number = Math.floor(Math.random() * 10000);
  const paddedNumber = number.toString().padStart(4, '0');
  return `Player${paddedNumber}`;
};

interface Business {
  id: string;
  name: string;
  price: number;
  income: number;
}

interface UserAccount {
  email: string;
  password: string;
  nickname: string;
  coins: number;
  donatCoins: number;
  clicks: number;
  inventory: Inventory;
  privilege: string;
  cases: number;
  donatCases: number;
  ownedWeapon: string | null;
  businesses: string[];
  autoClicker: boolean;
  autoClickerExpiry: number;
  lastDailyReward: string;
}

const BUSINESSES: Business[] = [
  { id: 'lemonade', name: '🍋 Лимонадный киоск', price: 50000, income: 100 },
  { id: 'cafe', name: '☕ Кафе', price: 500000, income: 1000 },
  { id: 'restaurant', name: '🍽️ Ресторан', price: 5000000, income: 10000 },
  { id: 'factory', name: '🏭 Фабрика', price: 50000000, income: 100000 },
  { id: 'bank', name: '🏦 Банк', price: 500000000, income: 1000000 },
];

const loadGameState = (email: string): UserAccount | null => {
  const saved = localStorage.getItem(`minecraft_clicker_${email}`);
  return saved ? JSON.parse(saved) : null;
};

const saveGameState = (email: string, state: UserAccount) => {
  localStorage.setItem(`minecraft_clicker_${email}`, JSON.stringify(state));
};

const loadAllAccounts = (): UserAccount[] => {
  const saved = localStorage.getItem('minecraft_clicker_accounts');
  return saved ? JSON.parse(saved) : [];
};

const saveAccount = (account: UserAccount) => {
  const accounts = loadAllAccounts();
  const index = accounts.findIndex(a => a.email === account.email);
  if (index >= 0) {
    accounts[index] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem('minecraft_clicker_accounts', JSON.stringify(accounts));
};

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [coins, setCoins] = useState(0);
  const [donatCoins, setDonatCoins] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [nickname, setNickname] = useState(generateRandomNickname());
  const [clan] = useState('⚔️ Легенды');
  const [inventory, setInventory] = useState<Inventory>({});
  const [currentPrivilege, setCurrentPrivilege] = useState('Выживший');
  const [clickMultiplier, setClickMultiplier] = useState(1);
  const [canClick, setCanClick] = useState(true);
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; x: number; y: number }[]>([]);
  const [cases, setCases] = useState(0);
  const [donatCases, setDonatCases] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [marketItems, setMarketItems] = useState<Array<{id: string; itemId: string; itemName: string; price: number; seller: string}>>([]);
  const [adminGiveEmail, setAdminGiveEmail] = useState('');
  const [businesses, setBusinesses] = useState<string[]>([]);
  const [autoClicker, setAutoClicker] = useState(false);
  const [autoClickerExpiry, setAutoClickerExpiry] = useState(0);
  const [lastDailyReward, setLastDailyReward] = useState('');

  useEffect(() => {
    const wood = inventory['wood-sword'] || 0;
    const iron = inventory['iron-sword'] || 0;
    const netherite = inventory['netherite-sword'] || 0;
    const god = inventory['god-sword'] || 0;
    
    const mult = 1 + (wood * 1) + (iron * 2) + (netherite * 5) + (god * 25);
    setClickMultiplier(mult);
  }, [inventory]);

  useEffect(() => {
    if (isLoggedIn && currentEmail) {
      const state: UserAccount = {
        email: currentEmail,
        password: '',
        nickname,
        coins,
        donatCoins,
        clicks,
        inventory,
        privilege: currentPrivilege,
        cases,
        donatCases,
        ownedWeapon: Object.keys(inventory).find(key => WEAPONS.some(w => w.id === key)) || null,
        businesses,
        autoClicker,
        autoClickerExpiry,
        lastDailyReward
      };
      saveGameState(currentEmail, state);
    }
  }, [isLoggedIn, currentEmail, nickname, coins, donatCoins, clicks, inventory, currentPrivilege, cases, donatCases, businesses, autoClicker, autoClickerExpiry, lastDailyReward]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canClick) return;
    
    const randomCoins = Math.floor(Math.random() * 2000) + 1;
    const earned = randomCoins * clickMultiplier;
    setCoins(prev => prev + earned);
    setClicks(prev => prev + 1);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setFloatingCoins(prev => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setFloatingCoins(prev => prev.slice(1));
    }, 1000);
    
    setCanClick(false);
    setTimeout(() => setCanClick(true), 1000);
  };

  const buyItem = (item: Item, currency: 'coins' | 'donat' = 'coins') => {
    const price = item.price;
    const balance = currency === 'coins' ? coins : donatCoins;
    
    if (item.type === 'weapon') {
      const hasWeapon = Object.keys(inventory).some(key => WEAPONS.some(w => w.id === key && inventory[key] > 0));
      if (hasWeapon) {
        toast.error('У вас уже есть меч! Можно купить только один.');
        return;
      }
    }
    
    if (item.type === 'privilege') {
      if (inventory[item.id] && inventory[item.id] > 0) {
        toast.error('У вас уже есть эта привилегия!');
        return;
      }
    }
    
    if (balance < price) {
      toast.error('Недостаточно средств!');
      return;
    }
    
    if (currency === 'coins') {
      setCoins(prev => prev - price);
    } else {
      setDonatCoins(prev => prev - price);
    }
    
    setInventory(prev => ({
      ...prev,
      [item.id]: 1
    }));
    
    if (item.type === 'privilege') {
      setCurrentPrivilege(item.name);
    }
    
    toast.success(`Куплено: ${item.name}!`);
  };

  const playCasino = (bet: number) => {
    if (coins < bet) {
      toast.error('Недостаточно монет!');
      return;
    }

    setCoins(prev => prev - bet);
    const win = Math.random() > 0.5;

    setTimeout(() => {
      if (win) {
        const winAmount = bet * 2;
        setCoins(prev => prev + winAmount);
        toast.success(`🎰 Выигрыш! +${winAmount.toLocaleString()} 💰`);
      } else {
        toast.error('🎰 Проигрыш! Попробуй еще раз');
      }
    }, 1000);
  };

  const buyCase = (caseItem: typeof DONAT_CASES[0]) => {
    if (donatCoins < caseItem.price) {
      toast.error('Недостаточно доната!');
      return;
    }

    setDonatCoins(prev => prev - caseItem.price);
    setCases(prev => prev + caseItem.count);
    toast.success(`Куплено кейсов: ${caseItem.count}!`);
  };

  const buyDonatCase = () => {
    if (donatCoins < 1000) {
      toast.error('Нужно 1000 💎 доната!');
      return;
    }

    setDonatCoins(prev => prev - 1000);
    setDonatCases(prev => prev + 1);
    toast.success('Куплен донат-кейс!');
  };

  const openCase = (isDonat: boolean = false) => {
    if (isDonat) {
      if (donatCases < 1) {
        toast.error('Нет донат-кейсов!');
        return;
      }
      setDonatCases(prev => prev - 1);
    } else {
      if (cases < 1) {
        toast.error('Нет кейсов!');
        return;
      }
      setCases(prev => prev - 1);
    }

    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
      
      if (isDonat) {
        const rand = Math.random();
        let prize;
        if (rand < 0.01) {
          prize = PRIVILEGES[6];
        } else if (rand < 0.02) {
          prize = PRIVILEGES[5];
        } else if (rand < 0.03) {
          prize = PRIVILEGES[4];
        } else {
          prize = PRIVILEGES[Math.floor(Math.random() * 4)];
        }
        
        if (prize.type === 'privilege') {
          setCurrentPrivilege(prize.name);
        }
        setInventory(prev => ({
          ...prev,
          [prize.id]: (prev[prize.id] || 0) + 1
        }));
        toast.success(`🎁 Выпало: ${prize.name}!`);
      } else {
        const allItems = [...WEAPONS.slice(0, 3), ...PRIVILEGES.slice(0, 5)];
        const prize = allItems[Math.floor(Math.random() * allItems.length)];
        
        if (prize.type === 'privilege') {
          setCurrentPrivilege(prize.name);
        }
        setInventory(prev => ({
          ...prev,
          [prize.id]: (prev[prize.id] || 0) + 1
        }));
        toast.success(`🎁 Выпало: ${prize.name}!`);
      }
    }, 2000);
  };

  const handleLogin = () => {
    const accounts = loadAllAccounts();
    const account = accounts.find(a => a.email === loginEmail && a.password === loginPassword);
    
    if (account) {
      setCurrentEmail(loginEmail);
      setIsLoggedIn(true);
      setNickname(account.nickname);
      setCoins(account.coins);
      setDonatCoins(account.donatCoins);
      setClicks(account.clicks);
      setInventory(account.inventory);
      setCurrentPrivilege(account.privilege);
      setCases(account.cases);
      setDonatCases(account.donatCases);
      setBusinesses(account.businesses || []);
      setAutoClicker(account.autoClicker || false);
      setAutoClickerExpiry(account.autoClickerExpiry || 0);
      setLastDailyReward(account.lastDailyReward || '');
      toast.success('Вход выполнен!');
    } else {
      toast.error('Неверный email или пароль!');
    }
  };

  const handleRegister = () => {
    const accounts = loadAllAccounts();
    if (accounts.find(a => a.email === registerEmail)) {
      toast.error('Аккаунт с таким email уже существует!');
      return;
    }

    const newAccount: UserAccount = {
      email: registerEmail,
      password: registerPassword,
      nickname: generateRandomNickname(),
      coins: 0,
      donatCoins: 0,
      clicks: 0,
      inventory: {},
      privilege: 'Выживший',
      cases: 0,
      donatCases: 0,
      ownedWeapon: null,
      businesses: [],
      autoClicker: false,
      autoClickerExpiry: 0,
      lastDailyReward: ''
    };

    saveAccount(newAccount);
    toast.success('Аккаунт создан! Теперь войдите.');
    setShowRegister(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentEmail('');
    setGameStarted(false);
    toast.success('Вы вышли из аккаунта');
  };

  const adminLogin_func = () => {
    if (adminLogin === 'admin@gmail.com' && adminPassword === 'KosmoCat') {
      setIsAdmin(true);
      setShowAdminPanel(false);
      toast.success('Вход в админ-панель выполнен!');
    } else {
      toast.error('Неверный email или пароль!');
    }
  };

  const adminGiveItem = (type: 'coins' | 'donat' | 'cases' | 'donatCases' | 'privilege' | 'weapon', amount?: number, itemId?: string) => {
    if (!isAdmin) return;

    const targetEmail = adminGiveEmail || currentEmail;
    const accounts = loadAllAccounts();
    const accountIndex = accounts.findIndex(a => a.email === targetEmail);
    
    if (accountIndex < 0) {
      toast.error('Аккаунт не найден!');
      return;
    }

    const account = accounts[accountIndex];

    switch (type) {
      case 'coins':
        account.coins += (amount || 1000);
        if (targetEmail === currentEmail) setCoins(account.coins);
        toast.success(`Выдано ${amount} монет для ${targetEmail}!`);
        break;
      case 'donat':
        account.donatCoins += (amount || 100);
        if (targetEmail === currentEmail) setDonatCoins(account.donatCoins);
        toast.success(`Выдано ${amount} доната для ${targetEmail}!`);
        break;
      case 'cases':
        account.cases += (amount || 1);
        if (targetEmail === currentEmail) setCases(account.cases);
        toast.success(`Выдано ${amount} кейсов для ${targetEmail}!`);
        break;
      case 'donatCases':
        account.donatCases += (amount || 1);
        if (targetEmail === currentEmail) setDonatCases(account.donatCases);
        toast.success(`Выдано ${amount} донат-кейсов для ${targetEmail}!`);
        break;
      case 'privilege':
        if (itemId) {
          const priv = PRIVILEGES.find(p => p.id === itemId);
          if (priv) {
            account.privilege = priv.name;
            account.inventory[itemId] = (account.inventory[itemId] || 0) + 1;
            if (targetEmail === currentEmail) {
              setCurrentPrivilege(priv.name);
              setInventory(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
            }
            toast.success(`Выдана привилегия: ${priv.name} для ${targetEmail}!`);
          }
        }
        break;
      case 'weapon':
        if (itemId) {
          const weapon = WEAPONS.find(w => w.id === itemId);
          if (weapon) {
            account.inventory[itemId] = (account.inventory[itemId] || 0) + (amount || 1);
            if (targetEmail === currentEmail) {
              setInventory(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + (amount || 1) }));
            }
            toast.success(`Выдано оружие: ${weapon.name} x${amount} для ${targetEmail}!`);
          }
        }
        break;
    }

    saveAccount(account);
  };

  const sellToMarket = (itemId: string, price: number) => {
    if (!inventory[itemId] || inventory[itemId] < 1) {
      toast.error('У вас нет этого предмета!');
      return;
    }

    const item = [...WEAPONS, ...PRIVILEGES].find(i => i.id === itemId);
    if (!item) return;

    setInventory(prev => ({
      ...prev,
      [itemId]: prev[itemId] - 1
    }));

    setMarketItems(prev => [...prev, {
      id: Date.now().toString(),
      itemId,
      itemName: item.name,
      price,
      seller: nickname
    }]);

    toast.success(`Предмет выставлен на рынок!`);
  };

  const buyFromMarket = (marketItemId: string) => {
    const marketItem = marketItems.find(m => m.id === marketItemId);
    if (!marketItem) return;

    if (coins < marketItem.price) {
      toast.error('Недостаточно монет!');
      return;
    }

    setCoins(prev => prev - marketItem.price);
    setInventory(prev => ({
      ...prev,
      [marketItem.itemId]: (prev[marketItem.itemId] || 0) + 1
    }));

    setMarketItems(prev => prev.filter(m => m.id !== marketItemId));
    toast.success(`Куплено: ${marketItem.itemName}!`);
  };

  const sellAllInventory = () => {
    let totalEarned = 0;
    const itemsToSell = Object.entries(inventory).filter(([_, count]) => count > 0);
    
    if (itemsToSell.length === 0) {
      toast.error('Инвентарь пуст!');
      return;
    }

    itemsToSell.forEach(([itemId, count]) => {
      const item = [...WEAPONS, ...PRIVILEGES].find(i => i.id === itemId);
      if (item && item.price > 0) {
        totalEarned += Math.floor(item.price * 0.5) * count;
      }
    });

    setInventory({});
    setCoins(prev => prev + totalEarned);
    toast.success(`Продано все предметы за ${totalEarned.toLocaleString()} 💰!`);
  };

  const buyBusiness = (business: Business) => {
    if (businesses.includes(business.id)) {
      toast.error('У вас уже есть этот бизнес!');
      return;
    }

    if (coins < business.price) {
      toast.error('Недостаточно монет!');
      return;
    }

    setCoins(prev => prev - business.price);
    setBusinesses(prev => [...prev, business.id]);
    toast.success(`Куплен бизнес: ${business.name}!`);
  };

  const buyAutoClicker = () => {
    if (donatCoins < 50) {
      toast.error('Нужно 50 💎 доната!');
      return;
    }

    setDonatCoins(prev => prev - 50);
    setAutoClicker(true);
    setAutoClickerExpiry(Date.now() + 10 * 60 * 1000);
    toast.success('Автокликер активирован на 10 минут!');
  };

  const claimDailyReward = () => {
    const today = new Date().toDateString();
    if (lastDailyReward === today) {
      toast.error('Вы уже получили награду сегодня!');
      return;
    }

    const reward = 10000;
    setCoins(prev => prev + reward);
    setLastDailyReward(today);
    toast.success(`Получена ежедневная награда: ${reward.toLocaleString()} 💰!`);
  };

  useEffect(() => {
    if (!autoClicker) return;

    const now = Date.now();
    if (now > autoClickerExpiry) {
      setAutoClicker(false);
      toast.info('Автокликер истёк!');
      return;
    }

    const interval = setInterval(() => {
      if (Date.now() > autoClickerExpiry) {
        setAutoClicker(false);
        toast.info('Автокликер истёк!');
        clearInterval(interval);
        return;
      }

      const randomCoins = Math.floor(Math.random() * 2000) + 1;
      const earned = randomCoins * clickMultiplier;
      setCoins(prev => prev + earned);
      setClicks(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [autoClicker, autoClickerExpiry, clickMultiplier]);

  useEffect(() => {
    if (businesses.length === 0) return;

    const interval = setInterval(() => {
      let totalIncome = 0;
      businesses.forEach(businessId => {
        const business = BUSINESSES.find(b => b.id === businessId);
        if (business) {
          totalIncome += business.income;
        }
      });
      
      if (totalIncome > 0) {
        setCoins(prev => prev + totalIncome);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [businesses]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-900 via-green-800 to-green-900 p-4">
        <h1 className="text-5xl font-bold mb-8 text-center">
          <span className="text-gold">MINECRAFT</span>{' '}
          <span className="text-minecraftRed">C</span>
          <span className="text-minecraftGreen">L</span>
          <span className="text-minecraftPurple">I</span>
          <span className="text-gold">C</span>
          <span className="text-minecraftRed">K</span>
          <span className="text-minecraftGreen">E</span>
          <span className="text-minecraftPurple">R</span>
        </h1>

        <Card className="bg-brown border-4 border-darkBrown p-6 max-w-md w-full">
          {!showRegister ? (
            <div className="space-y-4">
              <div className="text-center text-gold font-bold text-2xl mb-4">🔐 ВХОД</div>
              
              <div>
                <label className="text-white text-sm block mb-1">Email</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Введите email"
                  className="w-full bg-brown/50 text-white px-3 py-2 rounded border-2 border-gold"
                />
              </div>
              
              <div>
                <label className="text-white text-sm block mb-1">Пароль</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Введите пароль"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-brown/50 text-white px-3 py-2 rounded border-2 border-gold"
                />
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-gold hover:bg-yellow-600 text-brown font-bold text-lg py-6"
              >
                ⚡ ВОЙТИ
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-minecraftGreen hover:text-green-400 text-sm underline"
                >
                  Нет аккаунта? Зарегистрироваться
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-gold font-bold text-2xl mb-4">📝 РЕГИСТРАЦИЯ</div>
              
              <div>
                <label className="text-white text-sm block mb-1">Email</label>
                <input 
                  type="email" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="Введите email"
                  className="w-full bg-brown/50 text-white px-3 py-2 rounded border-2 border-gold"
                />
              </div>
              
              <div>
                <label className="text-white text-sm block mb-1">Пароль</label>
                <input 
                  type="password" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Создайте пароль"
                  className="w-full bg-brown/50 text-white px-3 py-2 rounded border-2 border-gold"
                />
              </div>

              <Button
                onClick={handleRegister}
                className="w-full bg-minecraftGreen hover:bg-green-700 text-white font-bold text-lg py-6"
              >
                ✅ СОЗДАТЬ АККАУНТ
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-minecraftPurple hover:text-purple-400 text-sm underline"
                >
                  Уже есть аккаунт? Войти
                </button>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-8 text-white/80 text-sm text-center">
          <p>Сайт: MINECRAFT CLICKER</p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-900 via-green-800 to-green-900 p-4">
        <h1 className="text-6xl font-bold mb-4 text-center">
          <span className="text-gold">MINECRAFT</span>{' '}
          <span className="text-minecraftRed">C</span>
          <span className="text-minecraftGreen">L</span>
          <span className="text-minecraftPurple">I</span>
          <span className="text-gold">C</span>
          <span className="text-minecraftRed">K</span>
          <span className="text-minecraftGreen">E</span>
          <span className="text-minecraftPurple">R</span>
        </h1>
        
        <div className="space-y-4">
          <Button 
            onClick={() => setGameStarted(true)}
            className="bg-gold hover:bg-yellow-600 text-brown font-bold text-2xl px-12 py-8 border-4 border-brown shadow-lg hover:scale-105 transition-transform"
          >
            ⚡ ИГРАТЬ 💰
          </Button>

          <Button 
            onClick={claimDailyReward}
            disabled={lastDailyReward === new Date().toDateString()}
            className="bg-minecraftGreen hover:bg-green-700 text-white font-bold text-lg px-8 py-4 border-4 border-green-900 disabled:opacity-50"
          >
            🎁 Ежедневная награда (10,000 💰)
          </Button>
        </div>
        
        <div className="mt-8 text-white/80 text-sm">
          <p>Сайт: MINECRAFT CLICKER</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-brown/90 border-4 border-darkBrown p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-white text-center">
            <div>
              <div className="text-gold text-sm">Никнейм</div>
              <div className="font-bold">{nickname}</div>
            </div>
            <div>
              <div className="text-gold text-sm">Клан</div>
              <div className="font-bold">{clan}</div>
            </div>
            <div>
              <div className="text-gold text-sm">Баланс</div>
              <div className="font-bold">{coins.toLocaleString()} 💰</div>
            </div>
            <div>
              <div className="text-gold text-sm">Донат баланс</div>
              <div className="font-bold">{donatCoins} 💎</div>
            </div>
            <div>
              <div className="text-gold text-sm">Кликов</div>
              <div className="font-bold">{clicks.toLocaleString()}</div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-brown/90 border-4 border-darkBrown p-6">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-shake">🧟</div>
              <div className="text-white font-bold mb-2">Зомби LVL 1</div>
              
              <div className="relative inline-block">
                <Button
                  onClick={handleClick}
                  disabled={!canClick}
                  className="bg-gold hover:bg-yellow-600 text-brown font-bold text-xl px-8 py-6 border-4 border-brown shadow-lg disabled:opacity-50 relative"
                >
                  ⚡ БИТЬ 💰
                </Button>
                
                {floatingCoins.map(coin => (
                  <div
                    key={coin.id}
                    className="absolute text-gold font-bold text-2xl pointer-events-none animate-coin-float"
                    style={{ left: coin.x, top: coin.y }}
                  >
                    +{clickMultiplier}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-white/60 text-sm">
                {canClick ? 'Готов к атаке!' : 'Восстановление (1 сек)...'}
              </div>
              <div className="mt-2 text-gold font-bold">
                Сила удара: x{clickMultiplier}
              </div>
              {autoClicker && (
                <div className="mt-2 text-minecraftGreen font-bold animate-pulse">
                  ⚡ Автокликер активен
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-brown/90 border-4 border-darkBrown p-6">
            <Tabs defaultValue="weapons">
              <TabsList className="w-full bg-darkBrown mb-4 grid grid-cols-5 md:grid-cols-10 text-xs">
                <TabsTrigger value="weapons">⚔️</TabsTrigger>
                <TabsTrigger value="privileges">👑</TabsTrigger>
                <TabsTrigger value="inventory">🎒</TabsTrigger>
                <TabsTrigger value="casino">🎰</TabsTrigger>
                <TabsTrigger value="cases">📦</TabsTrigger>
                <TabsTrigger value="donat">💎</TabsTrigger>
                <TabsTrigger value="market">🏪</TabsTrigger>
                <TabsTrigger value="business">🏢</TabsTrigger>
                <TabsTrigger value="autoclicker">⚡</TabsTrigger>
                {isAdmin && <TabsTrigger value="admin">🔧</TabsTrigger>}
              </TabsList>

              <TabsContent value="weapons" className="space-y-2 max-h-96 overflow-y-auto">
                {WEAPONS.map(weapon => (
                  <Card key={weapon.id} className="bg-card/50 p-3 flex items-center justify-between">
                    <div className="text-white">
                      <div className="font-bold">{weapon.name}</div>
                      <div className="text-sm text-gold">
                        {weapon.price === 0 ? 'Бесплатно' : `${weapon.price.toLocaleString()} 💰`}
                      </div>
                      <div className="text-xs text-white/60">Сила: x{weapon.multiplier}</div>
                    </div>
                    <Button
                      onClick={() => buyItem(weapon, 'coins')}
                      disabled={coins < weapon.price}
                      className="bg-gold hover:bg-yellow-600 text-brown font-bold border-2 border-brown"
                    >
                      Купить
                    </Button>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="privileges" className="space-y-2 max-h-96 overflow-y-auto">
                {PRIVILEGES.map(priv => (
                  <Card key={priv.id} className="bg-card/50 p-3 flex items-center justify-between">
                    <div className="text-white">
                      <div className="font-bold">{priv.name}</div>
                      <div className="text-sm text-minecraftPurple">
                        {priv.price === 0 ? 'Бесплатно' : `${priv.price} 💎 доната`}
                      </div>
                    </div>
                    <Button
                      onClick={() => buyItem(priv, 'donat')}
                      disabled={donatCoins < priv.price || currentPrivilege === priv.name}
                      className="bg-minecraftPurple hover:bg-purple-700 text-white font-bold border-2 border-purple-900"
                    >
                      {currentPrivilege === priv.name ? '✓' : 'Купить'}
                    </Button>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="inventory" className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(inventory).length > 0 && (
                  <Button
                    onClick={sellAllInventory}
                    className="w-full bg-minecraftRed hover:bg-red-700 text-white font-bold mb-3"
                  >
                    💰 Продать весь инвентарь (50% от стоимости)
                  </Button>
                )}
                
                {Object.entries(inventory).length === 0 ? (
                  <div className="text-white/60 text-center py-8">
                    Инвентарь пуст
                  </div>
                ) : (
                  Object.entries(inventory).map(([id, count]) => {
                    const item = [...WEAPONS, ...PRIVILEGES].find(i => i.id === id);
                    if (count < 1) return null;
                    return (
                      <Card key={id} className="bg-card/50 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-white">
                            <div className="font-bold">{item?.name}</div>
                            <div className="text-sm text-gold">Количество: {count}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            placeholder="Цена" 
                            className="flex-1 bg-brown/50 text-white px-2 py-1 rounded border border-gold"
                            id={`price-${id}`}
                            min="1"
                          />
                          <Button
                            onClick={() => {
                              const priceInput = document.getElementById(`price-${id}`) as HTMLInputElement;
                              const price = parseInt(priceInput?.value || '0');
                              if (price > 0) {
                                sellToMarket(id, price);
                                priceInput.value = '';
                              } else {
                                toast.error('Укажите цену!');
                              }
                            }}
                            className="bg-minecraftGreen hover:bg-green-700 text-white font-bold text-sm"
                          >
                            Продать
                          </Button>
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="casino" className="space-y-4">
                <div className="text-center text-gold font-bold text-xl mb-4">🎰 КАЗИНО 🎰</div>
                <div className="grid grid-cols-2 gap-2">
                  {CASINO_BETS.map(bet => (
                    <Button
                      key={bet}
                      onClick={() => playCasino(bet)}
                      disabled={coins < bet}
                      className="bg-minecraftRed hover:bg-red-700 text-white font-bold border-2 border-red-900 py-6"
                    >
                      <div>
                        <div className="text-lg">Ставка</div>
                        <div className="text-sm">{bet.toLocaleString()} 💰</div>
                      </div>
                    </Button>
                  ))}
                </div>
                <div className="text-white/60 text-sm text-center mt-4">
                  Шанс выигрыша 50% • Выигрыш x2
                </div>
              </TabsContent>

              <TabsContent value="cases" className="space-y-4">
                <div className="text-center">
                  <div className="text-gold font-bold text-xl mb-2">📦 КЕЙСЫ 📦</div>
                  <div className="text-white mb-4">У вас: {cases} кейсов</div>
                  
                  <Button
                    onClick={() => openCase(false)}
                    disabled={cases < 1 || isSpinning}
                    className="bg-gold hover:bg-yellow-600 text-brown font-bold text-lg px-8 py-6 border-4 border-brown mb-4"
                  >
                    {isSpinning ? '🎁 Открываем...' : '🎁 Открыть кейс'}
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {DONAT_CASES.map(caseItem => (
                    <Card key={caseItem.id} className="bg-card/50 p-3 flex items-center justify-between">
                      <div className="text-white">
                        <div className="font-bold">{caseItem.name}</div>
                        <div className="text-sm text-minecraftPurple">{caseItem.price} 💎</div>
                      </div>
                      <Button
                        onClick={() => buyCase(caseItem)}
                        disabled={donatCoins < caseItem.price}
                        className="bg-minecraftPurple hover:bg-purple-700 text-white font-bold"
                      >
                        Купить
                      </Button>
                    </Card>
                  ))}
                </div>
                <div className="text-white/60 text-xs text-center pt-2">
                  Выпадают предметы и привилегии (кроме Бога, Гидры, Читера)
                </div>
              </TabsContent>

              <TabsContent value="donat" className="space-y-4">
                <div className="text-center">
                  <div className="text-minecraftPurple font-bold text-xl mb-2">💎 ДОНАТ КЕЙС 💎</div>
                  <div className="text-white mb-4">У вас: {donatCases} донат-кейсов</div>
                  
                  <Button
                    onClick={() => openCase(true)}
                    disabled={donatCases < 1 || isSpinning}
                    className="bg-minecraftPurple hover:bg-purple-700 text-white font-bold text-lg px-8 py-6 border-4 border-purple-900 mb-4"
                  >
                    {isSpinning ? '✨ Открываем...' : '✨ Открыть донат-кейс'}
                  </Button>

                  <Card className="bg-card/50 p-4 mt-4">
                    <div className="text-white">
                      <div className="font-bold mb-2">Купить донат-кейс</div>
                      <div className="text-sm text-minecraftPurple mb-3">1000 💎 доната</div>
                      <Button
                        onClick={buyDonatCase}
                        disabled={donatCoins < 1000}
                        className="bg-gold hover:bg-yellow-600 text-brown font-bold w-full"
                      >
                        Купить за 1000 💎
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="text-white/60 text-xs text-center pt-2">
                  💎 Все привилегии от Нуба до Бога<br/>
                  🎯 Бог/Гидра/Хакер: 1% шанс каждый
                </div>
              </TabsContent>

              <TabsContent value="market" className="space-y-4">
                <div className="text-center text-gold font-bold text-xl mb-4">🏪 РЫНОК 🏪</div>
                
                {marketItems.length === 0 ? (
                  <div className="text-white/60 text-center py-8">
                    На рынке пока нет товаров
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {marketItems.map(marketItem => (
                      <Card key={marketItem.id} className="bg-card/50 p-3 flex items-center justify-between">
                        <div className="text-white">
                          <div className="font-bold">{marketItem.itemName}</div>
                          <div className="text-sm text-gold">{marketItem.price.toLocaleString()} 💰</div>
                          <div className="text-xs text-white/60">Продавец: {marketItem.seller}</div>
                        </div>
                        <Button
                          onClick={() => buyFromMarket(marketItem.id)}
                          disabled={coins < marketItem.price || marketItem.seller === nickname}
                          className="bg-minecraftGreen hover:bg-green-700 text-white font-bold"
                        >
                          {marketItem.seller === nickname ? 'Ваш' : 'Купить'}
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
                
                <div className="text-white/60 text-xs text-center pt-2">
                  Продавайте предметы из инвентаря и покупайте у других игроков
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div className="text-center text-gold font-bold text-xl mb-4">🏢 БИЗНЕСЫ 🏢</div>
                
                <div className="text-white text-sm mb-4 text-center">
                  Доход каждые 10 секунд автоматически
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {BUSINESSES.map(business => (
                    <Card key={business.id} className="bg-card/50 p-3 flex items-center justify-between">
                      <div className="text-white">
                        <div className="font-bold">{business.name}</div>
                        <div className="text-sm text-gold">{business.price.toLocaleString()} 💰</div>
                        <div className="text-xs text-minecraftGreen">+{business.income.toLocaleString()} 💰 каждые 10 сек</div>
                      </div>
                      <Button
                        onClick={() => buyBusiness(business)}
                        disabled={coins < business.price || businesses.includes(business.id)}
                        className="bg-minecraftGreen hover:bg-green-700 text-white font-bold"
                      >
                        {businesses.includes(business.id) ? '✓ Куплен' : 'Купить'}
                      </Button>
                    </Card>
                  ))}
                </div>

                {businesses.length > 0 && (
                  <div className="text-white text-center mt-4">
                    <div className="text-gold font-bold">Ваши бизнесы:</div>
                    <div className="text-sm">
                      Общий доход: +{businesses.reduce((sum, id) => {
                        const b = BUSINESSES.find(x => x.id === id);
                        return sum + (b?.income || 0);
                      }, 0).toLocaleString()} 💰 каждые 10 сек
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="autoclicker" className="space-y-4">
                <div className="text-center text-minecraftPurple font-bold text-xl mb-4">⚡ АВТОКЛИКЕР ⚡</div>
                
                <Card className="bg-card/50 p-6 text-center">
                  <div className="text-white mb-4">
                    <div className="text-lg font-bold">Автоматические клики</div>
                    <div className="text-sm text-white/60 mt-2">КД: 2 секунды</div>
                    <div className="text-sm text-white/60">Длительность: 10 минут</div>
                    <div className="text-sm text-white/60">Стоимость: 50 💎 доната</div>
                  </div>

                  {autoClicker ? (
                    <div className="space-y-3">
                      <div className="text-minecraftGreen font-bold text-lg">
                        ✅ АКТИВЕН
                      </div>
                      <div className="text-white/80 text-sm">
                        Осталось: {Math.ceil((autoClickerExpiry - Date.now()) / 1000 / 60)} мин
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={buyAutoClicker}
                      disabled={donatCoins < 50}
                      className="bg-minecraftPurple hover:bg-purple-700 text-white font-bold text-lg px-8 py-6"
                    >
                      Купить за 50 💎
                    </Button>
                  )}
                </Card>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="admin" className="space-y-4">
                  <div className="text-center text-minecraftRed font-bold text-xl mb-4">🔧 АДМИН ПАНЕЛЬ 🔧</div>
                  
                  <div className="space-y-3">
                    <Card className="bg-card/50 p-3">
                      <div className="text-white font-bold mb-2">Email аккаунта</div>
                      <input 
                        type="email" 
                        value={adminGiveEmail}
                        onChange={(e) => setAdminGiveEmail(e.target.value)}
                        placeholder="Оставьте пустым для себя"
                        className="w-full bg-brown/50 text-white px-2 py-1 rounded border border-gold mb-2"
                      />
                      <div className="text-xs text-white/60">
                        Если не указан - выдаст себе. Укажите email игрока для выдачи ему.
                      </div>
                    </Card>

                    <Card className="bg-card/50 p-3">
                      <div className="text-white font-bold mb-2">Выдать монеты</div>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="Количество" 
                          className="flex-1 bg-brown/50 text-white px-2 py-1 rounded border border-gold"
                          id="admin-coins"
                        />
                        <Button
                          onClick={() => {
                            const input = document.getElementById('admin-coins') as HTMLInputElement;
                            adminGiveItem('coins', parseInt(input.value || '1000'));
                            input.value = '';
                          }}
                          className="bg-gold hover:bg-yellow-600 text-brown font-bold"
                        >
                          Выдать
                        </Button>
                      </div>
                    </Card>

                    <Card className="bg-card/50 p-3">
                      <div className="text-white font-bold mb-2">Выдать донат</div>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="Количество" 
                          className="flex-1 bg-brown/50 text-white px-2 py-1 rounded border border-gold"
                          id="admin-donat"
                        />
                        <Button
                          onClick={() => {
                            const input = document.getElementById('admin-donat') as HTMLInputElement;
                            adminGiveItem('donat', parseInt(input.value || '100'));
                            input.value = '';
                          }}
                          className="bg-minecraftPurple hover:bg-purple-700 text-white font-bold"
                        >
                          Выдать
                        </Button>
                      </div>
                    </Card>

                    <Card className="bg-card/50 p-3">
                      <div className="text-white font-bold mb-2">Выдать кейсы</div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => adminGiveItem('cases', 10)}
                          className="flex-1 bg-minecraftGreen hover:bg-green-700 text-white"
                        >
                          +10 Кейсов
                        </Button>
                        <Button
                          onClick={() => adminGiveItem('donatCases', 5)}
                          className="flex-1 bg-minecraftPurple hover:bg-purple-700 text-white"
                        >
                          +5 Донат-кейсов
                        </Button>
                      </div>
                    </Card>

                    <Card className="bg-card/50 p-3">
                      <div className="text-white font-bold mb-2">Выдать привилегию</div>
                      <div className="grid grid-cols-2 gap-2">
                        {PRIVILEGES.map(priv => (
                          <Button
                            key={priv.id}
                            onClick={() => adminGiveItem('privilege', 1, priv.id)}
                            className="bg-minecraftPurple hover:bg-purple-700 text-white text-xs"
                          >
                            {priv.name}
                          </Button>
                        ))}
                      </div>
                    </Card>

                    <Card className="bg-card/50 p-3">
                      <div className="text-white font-bold mb-2">Выдать оружие</div>
                      <div className="grid grid-cols-2 gap-2">
                        {WEAPONS.map(weapon => (
                          <Button
                            key={weapon.id}
                            onClick={() => adminGiveItem('weapon', 1, weapon.id)}
                            className="bg-gold hover:bg-yellow-600 text-brown text-xs"
                          >
                            {weapon.name}
                          </Button>
                        ))}
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </Card>
        </div>

        <Card className="bg-brown/90 border-4 border-darkBrown p-4 mt-4">
          <div className="text-white text-center space-y-2">
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => window.open('https://t.me/av7272g', '_blank')}
                className="bg-minecraftGreen hover:bg-blue-600 text-white font-bold"
              >
                📱 Подписаться ТГК
              </Button>
              {!isAdmin && (
                <Button 
                  onClick={() => setShowAdminPanel(true)}
                  className="bg-minecraftRed hover:bg-red-700 text-white font-bold"
                >
                  🔧 Админ
                </Button>
              )}
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText('https://MINECRAFTCLICERBOT');
                  toast.success('Ссылка скопирована!');
                }}
                className="bg-minecraftPurple hover:bg-purple-700 text-white font-bold"
              >
                👥 Пригласить друга
              </Button>
              <Button 
                onClick={handleLogout}
                className="bg-brown hover:bg-yellow-900 text-white font-bold border-2 border-gold"
              >
                🚪 Выход
              </Button>
            </div>
            
            <div className="text-xs text-white/60 pt-2 border-t border-white/20">
              <div>Владелец сайта: KosmoCat (Никита)</div>
              <div>ТГ: @av7272g • Привилегия: {currentPrivilege}</div>
              <div>Аккаунт: {currentEmail}</div>
            </div>
          </div>
        </Card>
      </div>

      {showAdminPanel && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-brown border-4 border-darkBrown p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-gold font-bold text-2xl mb-4">🔧 ВХОД В АДМИН ПАНЕЛЬ</div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm block mb-1">Email</label>
                  <input 
                    type="email" 
                    value={adminLogin}
                    onChange={(e) => setAdminLogin(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full bg-brown/50 text-white px-3 py-2 rounded border-2 border-gold"
                  />
                </div>
                
                <div>
                  <label className="text-white text-sm block mb-1">Пароль</label>
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="w-full bg-brown/50 text-white px-3 py-2 rounded border-2 border-gold"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={adminLogin_func}
                    className="flex-1 bg-gold hover:bg-yellow-600 text-brown font-bold"
                  >
                    Войти
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAdminPanel(false);
                      setAdminLogin('');
                      setAdminPassword('');
                    }}
                    className="flex-1 bg-minecraftRed hover:bg-red-700 text-white font-bold"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
              
              <details className="mt-4">
                <summary className="text-white/60 text-xs cursor-pointer hover:text-white">
                  Показать данные для входа
                </summary>
                <div className="text-white/80 text-xs mt-2 bg-brown/50 p-2 rounded">
                  Email: admin@gmail.com<br/>
                  Пароль: KosmoCat
                </div>
              </details>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}