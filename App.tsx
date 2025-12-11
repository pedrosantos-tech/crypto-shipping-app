import React, { useState, useEffect, createContext, useContext } from 'react';
import { User } from './types';
import { mockGetUser, mockLogin, mockRegister } from './services/mockBackend';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateLabel from './pages/CreateLabel';
import History from './pages/History';
import Settings from './pages/Settings';
import { Input, Button, Card } from './components/Components';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (e: string, p: string) => Promise<void>;
  register: (e: string, p: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// --- Main App Component ---
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Simple Router
  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'create-label': return <CreateLabel />;
      case 'history': return <History />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const u = await mockGetUser();
      setUser(u);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await mockLogin(email, pass);
    setUser(res.user);
  };

  const register = async (email: string, pass: string) => {
    const res = await mockRegister(email, pass);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading ShipCrypto...</div>;
  }

  if (!user) {
    return <AuthScreen onLogin={login} onRegister={register} />;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser: checkAuth }}>
      <Layout activePage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AuthContext.Provider>
  );
};

// --- Login/Register Screen ---
const AuthScreen: React.FC<{ onLogin: any, onRegister: any }> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) await onLogin(email, password);
      else await onRegister(email, password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">ShipCrypto Pro</h1>
          <p className="text-gray-500 mt-2">Logistics for the decentralized world</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            required 
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-accent hover:underline font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-xs text-gray-400">
           Demo Login: demo@example.com / password
        </div>
      </Card>
    </div>
  );
};

export default App;
