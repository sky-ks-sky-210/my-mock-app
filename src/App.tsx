import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const images = [
    './assets/image1.png',
    './assets/image2.png',
    './assets/image3.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  // 一定時間ごとに画像を切り替える
  useEffect(() => {
    const interval = setInterval(nextImage, 3000); // 3秒ごとに切り替え
    return () => clearInterval(interval); // クリーンアップ
  }, [currentIndex]); // currentIndexを依存関係に追加

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
