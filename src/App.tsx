import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Home = lazy(() => import('./pages/Home'));
const Classroom = lazy(() => import('./pages/Classroom'));
const Jobs = lazy(() => import('./pages/Jobs'));
const MyPage = lazy(() => import('./pages/MyPage'));

function RouteFallback() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FDCB35',
        color: '#1F1F1F',
        fontFamily: "'LaundryGothic', sans-serif",
        fontSize: 24,
      }}
    >
      로딩중...
    </div>
  );
}

const Manage = lazy(() => import('./pages/teacher/Manage'));
const TeacherNotices = lazy(() => import('./pages/teacher/Notices'));
const TeacherJobs = lazy(() => import('./pages/teacher/Jobs'));

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/manage/notices" element={<TeacherNotices />} />
            <Route path="/manage/jobs" element={<TeacherJobs />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
