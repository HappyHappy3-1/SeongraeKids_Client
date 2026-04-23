import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Classroom from './pages/Classroom';
import Jobs from './pages/Jobs'
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/mypage" element={<MyPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
