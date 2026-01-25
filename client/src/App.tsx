import React from 'react';
import WisdomButton from './components/WisdomButton';

const App: React.FC = () => {
  return (
    <div>
      <h1>Wisdom App</h1>
      <p>Нажми кнопку для получения мудрости!</p>
      <WisdomButton />
    </div>
  );
};

export default App;
