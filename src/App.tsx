import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

// 画像表示ページ
const ImagePage = () => {
  const images: string[] = [
    `${import.meta.env.BASE_URL}assets/image1.png`,  // BASE_URLを動的に取得
    `${import.meta.env.BASE_URL}assets/image2.png`,
    `${import.meta.env.BASE_URL}assets/image3.png`,
  ];
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="image-page">
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
};

// 新しいテーマのページ
interface ThemePageProps {
  theme: string;
}

const ThemePage: React.FC<ThemePageProps> = ({ theme }) => {
  return (
    <div className="theme-page">
      <h1>{theme}に関する情報</h1>
      <p>ここに{theme}に関する情報を記載します。</p>
    </div>
  );
};

// トップページ
const HomePage = () => {
  return (
    <div className="home-page">
      <h1>トップページ</h1>
      <p>以下のリンクから、各テーマに関する情報や画像表示アプリへアクセスできます。</p>
      <ul>
        <li>
          <Link to="/image">画像表示アプリ</Link>: 画像を表示し、切り替えができます。
        </li>
        <li>
          <Link to="/theme1">テーマ1</Link>: テーマ1に関する情報を表示します。
        </li>
        <li>
          <Link to="/theme2">テーマ2</Link>: テーマ2に関する情報を表示します。
        </li>
        <li>
          <Link to="/theme3">テーマ3</Link>: テーマ3に関する情報を表示します。
        </li>
      </ul>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">ホーム</Link>
            </li>
            <li>
              <Link to="/image">画像表示アプリ</Link>
            </li>
            <li>
              <Link to="/theme1">テーマ1</Link>
            </li>
            <li>
              <Link to="/theme2">テーマ2</Link>
            </li>
            <li>
              <Link to="/theme3">テーマ3</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/image" element={<ImagePage />} />
          <Route path="/theme1" element={<ThemePage theme="テーマ1" />} />
          <Route path="/theme2" element={<ThemePage theme="テーマ2" />} />
          <Route path="/theme3" element={<ThemePage theme="テーマ3" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
