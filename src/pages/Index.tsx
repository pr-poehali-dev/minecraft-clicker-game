import { useState, useEffect } from 'react';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const [nickname, setNickname] = useState('Игрок');
  const [clan, setClan] = useState('Нет');
  const [coins, setCoins] = useState(0);
  const [donateBalance, setDonateBalance] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [friendsInvited, setFriendsInvited] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [casesOpened, setCasesOpened] = useState(0);
  
  const [privilege, setPrivilege] = useState('Выживший');
  const [inventory, setInventory] = useState<string[]>([]);
  
  const [activeTab, setActiveTab] = useState('game');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnSite(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const saved = localStorage.getItem('minecraftClicker');
    if (saved) {
      const data = JSON.parse(saved);
      setNickname(data.nickname || 'Игрок');
      setClan(data.clan || 'Нет');
      setCoins(data.coins || 0);
      setDonateBalance(data.donateBalance || 0);
      setClicks(data.clicks || 0);
      setTimeOnSite(data.timeOnSite || 0);
      setFriendsInvited(data.friendsInvited || 0);
      setTotalEarned(data.totalEarned || 0);
      setCasesOpened(data.casesOpened || 0);
      setPrivilege(data.privilege || 'Выживший');
      setInventory(data.inventory || []);
    }
  }, []);
  
  useEffect(() => {
    const data = {
      nickname, clan, coins, donateBalance, clicks,
      timeOnSite, friendsInvited, totalEarned, casesOpened,
      privilege, inventory
    };
    localStorage.setItem('minecraftClicker', JSON.stringify(data));
  }, [nickname, clan, coins, donateBalance, clicks, timeOnSite, friendsInvited, totalEarned, casesOpened, privilege, inventory]);
  
  const handleHit = () => {
    setCoins(prev => prev + 1);
    setClicks(prev => prev + 1);
    setTotalEarned(prev => prev + 1);
  };
  
  const buyPrivilege = (name: string, price: number) => {
    if (donateBalance >= price) {
      setDonateBalance(prev => prev - price);
      setPrivilege(name);
      alert(`✅ Привилегия "${name}" куплена!`);
    } else {
      alert('❌ Недостаточно доната!');
    }
  };
  
  const buyItem = (name: string, price: number) => {
    if (coins >= price) {
      setCoins(prev => prev - price);
      setInventory(prev => [...prev, name]);
      alert(`✅ Куплено: ${name}`);
    } else {
      alert('❌ Недостаточно монет!');
    }
  };
  
  const buyCase = (count: number, price: number) => {
    if (donateBalance >= price) {
      setDonateBalance(prev => prev - price);
      setCasesOpened(prev => prev + count);
      
      const items = ['Деревянный меч', 'Железный меч', 'Алмазный меч', 'Незеритовый меч'];
      for (let i = 0; i < count; i++) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        setInventory(prev => [...prev, randomItem]);
      }
      alert(`✅ Открыто ${count} кейсов!`);
    } else {
      alert('❌ Недостаточно доната!');
    }
  };
  
  const playCasino = (bet: number) => {
    if (coins >= bet) {
      setCoins(prev => prev - bet);
      const win = Math.random() > 0.5;
      if (win) {
        const winAmount = bet * 2;
        setCoins(prev => prev + winAmount);
        setTotalEarned(prev => prev + bet);
        alert(`🎰 Выигрыш! +${winAmount.toLocaleString()} монет`);
      } else {
        alert('🎰 Проигрыш!');
      }
    } else {
      alert('❌ Недостаточно монет!');
    }
  };
  
  const handleAdminLogin = (login: string, password: string) => {
    if (login === 'KosmoCat' && password === 'KosmoCat') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      alert('✅ Вход выполнен!');
    } else {
      alert('❌ Неверный логин или пароль!');
    }
  };
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}ч ${m}м ${s}с`;
  };
  
  if (showSubscribe) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a472a 0%, #2d5016 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          💎 ПОДПИШИСЬ НА НАШ КАНАЛ
        </h1>
        <button
          onClick={() => {
            window.open('https://t.me/av7272g', '_blank');
            setShowSubscribe(false);
          }}
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            padding: '20px 50px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
            border: 'none',
            borderRadius: '15px',
            color: '#333',
            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
          }}
        >
          📱 ПОДПИСАТЬСЯ
        </button>
      </div>
    );
  }
  
  if (!gameStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a472a 0%, #2d5016 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          marginBottom: '40px',
          textAlign: 'center',
          letterSpacing: '3px'
        }}>
          <span style={{ color: '#ff0000' }}>M</span>
          <span style={{ color: '#ff7f00' }}>I</span>
          <span style={{ color: '#ffff00' }}>N</span>
          <span style={{ color: '#00ff00' }}>E</span>
          <span style={{ color: '#0000ff' }}>C</span>
          <span style={{ color: '#4b0082' }}>R</span>
          <span style={{ color: '#9400d3' }}>A</span>
          <span style={{ color: '#ff0000' }}>F</span>
          <span style={{ color: '#ff7f00' }}>T</span>
          {' '}
          <span style={{ color: '#ffd700' }}>CLICKER</span>
        </h1>
        <button
          onClick={() => setGameStarted(true)}
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            padding: '25px 80px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
            border: 'none',
            borderRadius: '15px',
            color: '#fff',
            boxShadow: '0 10px 30px rgba(0, 255, 0, 0.4)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          🎮 ИГРАТЬ
        </button>
      </div>
    );
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a472a 0%, #2d5016 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: '20px',
        letterSpacing: '2px'
      }}>
        <span style={{ color: '#ff0000' }}>M</span>
        <span style={{ color: '#ff7f00' }}>I</span>
        <span style={{ color: '#ffff00' }}>N</span>
        <span style={{ color: '#00ff00' }}>E</span>
        <span style={{ color: '#0000ff' }}>C</span>
        <span style={{ color: '#4b0082' }}>R</span>
        <span style={{ color: '#9400d3' }}>A</span>
        <span style={{ color: '#ff0000' }}>F</span>
        <span style={{ color: '#ff7f00' }}>T</span>
        {' '}
        <span style={{ color: '#ffd700' }}>CLICKER</span>
      </h1>
      
      <div style={{
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        color: '#fff'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', fontSize: '0.9rem' }}>
          <div>👤 <strong>Никнейм:</strong> {nickname}</div>
          <div>🛡️ <strong>Клан:</strong> {clan}</div>
          <div>💰 <strong>Баланс:</strong> {coins.toLocaleString()}</div>
          <div>💎 <strong>Донат:</strong> {donateBalance.toLocaleString()}</div>
          <div>🖱️ <strong>Кликов:</strong> {clicks.toLocaleString()}</div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '10rem', marginBottom: '20px' }}>🧟</div>
        <button
          onClick={handleHit}
          style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            padding: '20px 60px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
            border: 'none',
            borderRadius: '50px',
            color: '#333',
            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
          }}
        >
          ⚡Клик💰
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '20px',
        justifyContent: 'center'
      }}>
        {[
          { id: 'game', name: '🎮 Игра' },
          { id: 'privileges', name: '👑 Привилегии' },
          { id: 'shop', name: '🛒 Магазин' },
          { id: 'donate', name: '💎 Донат' },
          { id: 'casino', name: '🎰 Казино' },
          { id: 'inventory', name: '🎒 Инвентарь' },
          { id: 'stats', name: '📊 Статистика' },
          { id: 'invite', name: '📢 Пригласить' },
          { id: 'admin', name: '⚙️ Админ' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              background: activeTab === tab.id ? '#ffd700' : 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '10px',
              color: activeTab === tab.id ? '#333' : '#fff',
              fontWeight: '600'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
      
      <div style={{
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '15px',
        padding: '30px',
        color: '#fff',
        minHeight: '300px'
      }}>
        {activeTab === 'privileges' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>👑 Привилегии</h2>
            <div style={{ color: '#00ff00', marginBottom: '20px' }}>Текущая: {privilege}</div>
            <div style={{ display: 'grid', gap: '15px' }}>
              {[
                { name: 'Выживший', price: 0 },
                { name: 'Профессионал', price: 100 },
                { name: 'БедВарсер', price: 123 },
                { name: 'Хакер', price: 345 },
                { name: 'Читер', price: 567 },
                { name: 'Гидра', price: 1239 },
                { name: 'Бог', price: 12383 }
              ].map(priv => (
                <button
                  key={priv.name}
                  onClick={() => buyPrivilege(priv.name, priv.price)}
                  style={{
                    padding: '15px',
                    cursor: 'pointer',
                    background: privilege === priv.name ? '#00ff00' : '#444',
                    border: '2px solid #ffd700',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  {priv.name} - {priv.price === 0 ? 'Бесплатно' : `${priv.price} 💎`}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'shop' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>🛒 Магазин предметов</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {[
                { name: 'Деревянный меч', price: 0 },
                { name: 'Железный меч', price: 10000 },
                { name: 'Незеритовый меч', price: 100000 },
                { name: 'Меч Бога с силой х5', price: 34000000 }
              ].map(item => (
                <button
                  key={item.name}
                  onClick={() => buyItem(item.name, item.price)}
                  style={{
                    padding: '15px',
                    cursor: 'pointer',
                    background: '#8B4513',
                    border: '2px solid #ffd700',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  {item.name} - {item.price === 0 ? 'Бесплатно' : `${item.price.toLocaleString()} 💰`}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'donate' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>💎 Донат магазин</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {[
                { count: 1, price: 500 },
                { count: 3, price: 1500 },
                { count: 5, price: 2000 },
                { count: 10, price: 4500 }
              ].map(pack => (
                <button
                  key={pack.count}
                  onClick={() => buyCase(pack.count, pack.price)}
                  style={{
                    padding: '15px',
                    cursor: 'pointer',
                    background: '#9400d3',
                    border: '2px solid #ffd700',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  🎁 {pack.count} кейс(ов) - {pack.price} 💎
                </button>
              ))}
              <button
                onClick={() => {
                  if (donateBalance >= 50) {
                    setDonateBalance(prev => prev - 50);
                    alert('⚡ Автокликер активирован на 10 минут!');
                    let counter = 0;
                    const interval = setInterval(() => {
                      if (counter >= 600) {
                        clearInterval(interval);
                        alert('⚡ Автокликер закончился!');
                      } else {
                        setCoins(prev => prev + 1);
                        setClicks(prev => prev + 1);
                        setTotalEarned(prev => prev + 1);
                        counter++;
                      }
                    }, 1000);
                  } else {
                    alert('❌ Недостаточно доната!');
                  }
                }}
                style={{
                  padding: '15px',
                  cursor: 'pointer',
                  background: '#ff4500',
                  border: '2px solid #ffd700',
                  borderRadius: '10px',
                  color: '#fff',
                  fontWeight: '600',
                  textAlign: 'left'
                }}
              >
                ⚡ Автокликер (10 минут) - 50 💎
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'casino' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>🎰 Казино</h2>
            <p style={{ marginBottom: '20px' }}>Шанс выигрыша 50%. Выигрыш x2</p>
            <div style={{ display: 'grid', gap: '15px' }}>
              {[10000, 50000, 100000, 1000000, 10000000].map(bet => (
                <button
                  key={bet}
                  onClick={() => playCasino(bet)}
                  style={{
                    padding: '15px',
                    cursor: 'pointer',
                    background: '#dc143c',
                    border: '2px solid #ffd700',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: '600'
                  }}
                >
                  Ставка {bet.toLocaleString()} 💰
                </button>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>🎒 Инвентарь</h2>
            <p style={{ marginBottom: '15px' }}>Предметов: {inventory.length}</p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {inventory.length === 0 ? (
                <p>Пусто</p>
              ) : (
                inventory.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      background: '#444',
                      borderRadius: '8px',
                      border: '1px solid #ffd700'
                    }}
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>📊 Статистика</h2>
            <div style={{ display: 'grid', gap: '15px', fontSize: '1.1rem' }}>
              <div>⏱️ Время на сайте: {formatTime(timeOnSite)}</div>
              <div>👥 Приглашено друзей: {friendsInvited}</div>
              <div>💰 Заработано всего монет: {totalEarned.toLocaleString()}</div>
              <div>🎁 Открытие кейсов: {casesOpened}</div>
              <div>🎒 Предметов в инвентаре: {inventory.length}</div>
            </div>
          </div>
        )}
        
        {activeTab === 'invite' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>📢 Пригласить друга</h2>
            <p style={{ marginBottom: '15px' }}>Поделись ссылкой с друзьями!</p>
            <button
              onClick={() => {
                window.open('https://t.me/MINECRAFTCLICKERBOT', '_blank');
              }}
              style={{
                padding: '15px 30px',
                cursor: 'pointer',
                background: '#0088cc',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}
            >
              📱 Пригласить через Telegram
            </button>
          </div>
        )}
        
        {activeTab === 'admin' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#ffd700' }}>⚙️ Админ панель</h2>
            {!isAdmin ? (
              showAdminLogin ? (
                <div>
                  <input
                    type="text"
                    placeholder="Логин"
                    id="adminLogin"
                    style={{
                      padding: '10px',
                      marginBottom: '10px',
                      width: '100%',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    id="adminPassword"
                    style={{
                      padding: '10px',
                      marginBottom: '15px',
                      width: '100%',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    onClick={() => {
                      const login = (document.getElementById('adminLogin') as HTMLInputElement).value;
                      const password = (document.getElementById('adminPassword') as HTMLInputElement).value;
                      handleAdminLogin(login, password);
                    }}
                    style={{
                      padding: '12px 30px',
                      cursor: 'pointer',
                      background: '#00ff00',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontWeight: '600'
                    }}
                  >
                    Войти
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  style={{
                    padding: '15px 30px',
                    cursor: 'pointer',
                    background: '#ff4500',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: '600'
                  }}
                >
                  🔐 Войти в админ панель
                </button>
              )
            ) : (
              <div>
                <p style={{ color: '#00ff00', marginBottom: '20px' }}>✅ Вы вошли как администратор</p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const amount = prompt('Сколько монет добавить?');
                      if (amount) setCoins(prev => prev + parseInt(amount));
                    }}
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      background: '#444',
                      border: '1px solid #ffd700',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  >
                    💰 Добавить монеты
                  </button>
                  <button
                    onClick={() => {
                      const amount = prompt('Сколько доната добавить?');
                      if (amount) setDonateBalance(prev => prev + parseInt(amount));
                    }}
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      background: '#444',
                      border: '1px solid #ffd700',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  >
                    💎 Добавить донат
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '15px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#ffd700' }}>Наши соц.сети</h3>
        <div style={{ marginBottom: '15px' }}>
          Тг: @av7272g | YT: нет | DS: нет
        </div>
        <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
          Владелец сайта: KosmoCat (Никита)
        </div>
      </div>
    </div>
  );
};

export default Index;
