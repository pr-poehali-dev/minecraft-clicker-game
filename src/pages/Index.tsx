import { useState, useEffect } from 'react';

const Index = () => {
  const [gold, setGold] = useState(0);

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
  };

  const handleSave = () => {
    localStorage.setItem('gold', gold.toString());
    alert('Прогресс сохранен!');
  };

  const handleLoad = () => {
    const savedGold = localStorage.getItem('gold');
    if (savedGold !== null) {
      setGold(parseInt(savedGold, 10));
      alert('Прогресс загружен!');
    } else {
      alert('Нет сохраненных данных.');
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>Кликер голды</h1>
      <div style={{
        fontSize: '48px',
        margin: '20px 0'
      }}>
        {gold}
      </div>
      <button 
        onClick={handleClick}
        style={{
          fontSize: '20px',
          padding: '10px 20px',
          margin: '10px',
          cursor: 'pointer'
        }}
      >
        Кликнуть за голду
      </button>
      <button 
        onClick={handleSave}
        style={{
          fontSize: '20px',
          padding: '10px 20px',
          margin: '10px',
          cursor: 'pointer'
        }}
      >
        Сохранить прогресс
      </button>
      <button 
        onClick={handleLoad}
        style={{
          fontSize: '20px',
          padding: '10px 20px',
          margin: '10px',
          cursor: 'pointer'
        }}
      >
        Загрузить прогресс
      </button>
    </div>
  );
};

export default Index;
