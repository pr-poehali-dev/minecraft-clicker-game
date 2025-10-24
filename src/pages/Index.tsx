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

export default function Index() {
  const [gameStarted, setGameStarted] = useState(false);
  const [coins, setCoins] = useState(0);
  const [donatCoins, setDonatCoins] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [nickname] = useState('KosmoCat');
  const [clan] = useState('⚔️ Легенды');
  const [inventory, setInventory] = useState<Inventory>({});
  const [currentPrivilege, setCurrentPrivilege] = useState('Выживший');
  const [clickMultiplier, setClickMultiplier] = useState(1);
  const [canClick, setCanClick] = useState(true);
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; x: number; y: number }[]>([]);
  const [cases, setCases] = useState(0);
  const [donatCases, setDonatCases] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const wood = inventory['wood-sword'] || 0;
    const iron = inventory['iron-sword'] || 0;
    const netherite = inventory['netherite-sword'] || 0;
    const god = inventory['god-sword'] || 0;
    
    const mult = 1 + (wood * 1) + (iron * 2) + (netherite * 5) + (god * 25);
    setClickMultiplier(mult);
  }, [inventory]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canClick) return;
    
    const earned = 1 * clickMultiplier;
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
      [item.id]: (prev[item.id] || 0) + 1
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
        
        <Button 
          onClick={() => setGameStarted(true)}
          className="bg-gold hover:bg-yellow-600 text-brown font-bold text-2xl px-12 py-8 border-4 border-brown shadow-lg hover:scale-105 transition-transform"
        >
          ⚡ ИГРАТЬ 💰
        </Button>
        
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
            </div>
          </Card>

          <Card className="bg-brown/90 border-4 border-darkBrown p-6">
            <Tabs defaultValue="weapons">
              <TabsList className="w-full bg-darkBrown mb-4 grid grid-cols-3 md:grid-cols-6">
                <TabsTrigger value="weapons">⚔️</TabsTrigger>
                <TabsTrigger value="privileges">👑</TabsTrigger>
                <TabsTrigger value="inventory">🎒</TabsTrigger>
                <TabsTrigger value="casino">🎰</TabsTrigger>
                <TabsTrigger value="cases">📦</TabsTrigger>
                <TabsTrigger value="donat">💎</TabsTrigger>
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
                {Object.entries(inventory).length === 0 ? (
                  <div className="text-white/60 text-center py-8">
                    Инвентарь пуст
                  </div>
                ) : (
                  Object.entries(inventory).map(([id, count]) => {
                    const item = [...WEAPONS, ...PRIVILEGES].find(i => i.id === id);
                    return (
                      <Card key={id} className="bg-card/50 p-3 flex items-center justify-between">
                        <div className="text-white">
                          <div className="font-bold">{item?.name}</div>
                          <div className="text-sm text-gold">Количество: {count}</div>
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
            </Tabs>
          </Card>
        </div>

        <Card className="bg-brown/90 border-4 border-darkBrown p-4 mt-4">
          <div className="text-white text-center space-y-2">
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => window.open('https://t.me/+QgiLIa1gFRY4Y2Iy', '_blank')}
                className="bg-minecraftGreen hover:bg-blue-600 text-white font-bold"
              >
                📱 Подписаться ТГК
              </Button>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText('https://MINECRAFTCLICERBOT');
                  toast.success('Ссылка скопирована!');
                }}
                className="bg-minecraftPurple hover:bg-purple-700 text-white font-bold"
              >
                👥 Пригласить друга
              </Button>
            </div>
            
            <div className="text-xs text-white/60 pt-2 border-t border-white/20">
              <div>Владелец сайта: KosmoCat (Никита)</div>
              <div>ТГ: @av7272g • Привилегия: {currentPrivilege}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}