import { useState, useEffect } from 'react';

const Index = () => {
  const [gold, setGold] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  // Загрузка при монтировании
  useEffect(() => {
    const savedGold = localStorage.getItem('gold');
    if (savedGold !== null) {
      setGold(parseInt(savedGold, 10));
    }
  }, []);

  // Автосохранение при изменении gold
  useEffect(() => {
    localStorage.setItem('gold', gold.toString());
  }, [gold]);

  const handleClick = () => {
    setGold(prev => prev + 1);
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 200);
  };

  const handleSave = () => {
    localStorage.setItem('gold', gold.toString());
    alert('💾 Прогресс сохранен!');
  };

  const handleLoad = () => {
    const savedGold = localStorage.getItem('gold');
    if (savedGold !== null) {
      setGold(parseInt(savedGold, 10));
      alert('✅ Прогресс загружен!');
    } else {
      alert('❌ Нет сохраненных данных.');
    }
  };

  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить прогресс?')) {
      setGold(0);
      localStorage.setItem('gold', '0');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px'
    }}>
      {/* Заголовок */}
      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: '800',
        color: '#fff',
        marginBottom: '20px',
        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        letterSpacing: '2px'
      }}>
        💰 КЛИКЕР ГОЛДЫ
      </h1>

      {/* Карточка с золотом */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '30px',
        padding: '40px 60px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        marginBottom: '40px',
        minWidth: '300px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '10px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Ваше золото
        </div>
        <div style={{
          fontSize: '5rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'transform 0.2s',
          transform: isClicking ? 'scale(1.1)' : 'scale(1)'
        }}>
          {gold.toLocaleString()}
        </div>
      </div>

      {/* Кнопка клика */}
      <button 
        onClick={handleClick}
        style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          padding: '25px 60px',
          margin: '10px',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
          border: 'none',
          borderRadius: '50px',
          boxShadow: isClicking 
            ? '0 5px 20px rgba(255, 215, 0, 0.6)' 
            : '0 10px 30px rgba(255, 215, 0, 0.4)',
          transition: 'all 0.2s ease',
          transform: isClicking ? 'scale(0.95)' : 'scale(1)',
          color: '#333',
          textShadow: '0 1px 2px rgba(255,255,255,0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.4)';
        }}
      >
        ✨ Кликнуть за голду
      </button>

      {/* Кнопки управления */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginTop: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          onClick={handleSave}
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            padding: '15px 30px',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '15px',
            color: '#fff',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          💾 Сохранить
        </button>
        
        <button 
          onClick={handleLoad}
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            padding: '15px 30px',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '15px',
            color: '#fff',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          📥 Загрузить
        </button>

        <button 
          onClick={handleReset}
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            padding: '15px 30px',
            cursor: 'pointer',
            background: 'rgba(255, 59, 48, 0.3)',
            border: '2px solid rgba(255, 59, 48, 0.5)',
            borderRadius: '15px',
            color: '#fff',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.5)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔄 Сбросить
        </button>
      </div>

      {/* Футер */}
      <div style={{
        marginTop: '50px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>
        Прогресс сохраняется автоматически ✨
      </div>
    </div>
  );
};

export default Index;
