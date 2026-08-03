import { useEffect, Component, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Toast from "@/components/common/Toast";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CheckInPage from "@/pages/CheckInPage";
import LotteryPage from "@/pages/LotteryPage";
import SynthesisPage from "@/pages/SynthesisPage";
import SwapPage from "@/pages/SwapPage";
import SupplyPage from "@/pages/SupplyPage";
import MarketPage from "@/pages/MarketPage";
import MarketDetailPage from "@/pages/MarketDetailPage";
import NFTDetailPage from "@/pages/NFTDetailPage";
import PaymentPage from "@/pages/PaymentPage";
import DiscoverPage from "@/pages/DiscoverPage";
import ProfilePage from "@/pages/ProfilePage";
import AssetsPage from "@/pages/AssetsPage";
import WalletPage from "@/pages/WalletPage";
import OrdersPage from "@/pages/OrdersPage";
import PersonalInfoPage from "@/pages/PersonalInfoPage";
import SecurityPage from "@/pages/SecurityPage";
import InvitePage from "@/pages/InvitePage";
import SettingsPage from "@/pages/SettingsPage";
import VerificationPage from "@/pages/VerificationPage";
import AnnouncementDetailPage from "@/pages/AnnouncementDetailPage";
import { AuthModal } from "@/components/common/AuthPrompt";
import { useStore } from "@/store/useStore";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** 路由守卫：未登录用户访问受限页面时弹出登录弹窗并重定向到首页 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);

  if (!isLoggedIn) {
    setTimeout(() => setShowAuthModal(true), 0);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/** 错误边界：捕获渲染异常，避免白屏 */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neu-bg flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-neu-text-primary mb-2">页面出错了</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 rounded-full neu-accent-blue text-white font-bold text-sm"
          >
            返回首页
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <AuthModal />
        <Toast />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/market/:id" element={<MarketDetailPage />} />
        <Route path="/nft/:id" element={<NFTDetailPage />} />
        <Route path="/payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/discover/:id" element={<AnnouncementDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkin" element={<ProtectedRoute><CheckInPage /></ProtectedRoute>} />
        <Route path="/lottery" element={<ProtectedRoute><LotteryPage /></ProtectedRoute>} />
        <Route path="/synthesis" element={<ProtectedRoute><SynthesisPage /></ProtectedRoute>} />
        <Route path="/swap" element={<ProtectedRoute><SwapPage /></ProtectedRoute>} />
        <Route path="/supply" element={<ProtectedRoute><SupplyPage /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><AssetsPage /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/personal-info" element={<ProtectedRoute><PersonalInfoPage /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
        <Route path="/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/verification" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}