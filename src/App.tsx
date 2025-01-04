import { useState } from 'react';
import './App.css';

function App() {
  // 手元の画像ファイルパスをリスト化
  const images = [
    './assets/image1.png',
    './assets/image2.png',
    './assets/image3.png', // 必要に応じてパスを追加
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="App">
      <h1>画像表示アプリ</h1>
      <div className="image-container">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="displayed-image"
        />
      </div>
      <div className="controls">
        <button onClick={prevImage}>前へ</button>
        <button onClick={nextImage}>次へ</button>
      </div>
    </div>
  );
}

export default App;
