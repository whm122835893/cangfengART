import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
    // 触发弹窗
    setTimeout(() => setShowAuthModal(true), 0);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthModal />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/market/:id" element={<MarketDetailPage />} />
        <Route path="/nft/:id" element={<NFTDetailPage />} />
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
    </Router>
  );
}