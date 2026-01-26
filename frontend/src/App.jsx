import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Feed from "./pages/Feed/Feed";
import Profile from "./pages/Profile/Profile";

function ProtectedRoute({ user, loading, children }) {
  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, setUser, loading, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Profile me={user} logout={logout}/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feed"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Feed user={user} logout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Explore me={user} logout={logout}/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
