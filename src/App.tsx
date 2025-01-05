import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const images = [
    './assets/image1.png',
    './assets/image2.png',
    './assets/image3.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true); // アニメーション制御

  const nextImage = () => {
    setTransition(true);
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setTransition(true);
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3000); // 3秒ごとに切り替え
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="App">
      <h1>とっぷぺーじ</h1>
      <div className="image-slider">
        <div
          className={`image-container ${transition ? 'slide' : ''}`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: transition ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              className="displayed-image"
            />
          ))}
        </div>
        <button className="slider-button left" onClick={prevImage}>
          &#10094;
        </button>
        <button className="slider-button right" onClick={nextImage}>
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default App;
