import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Wallet,
  PiggyBank,
  Shield,
  Award,
  Lock,
  FileText,
  Info,
  Share2,
  UserPlus,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import BottomNav from '@/components/common/BottomNav';
import { useStore } from '@/store/useStore';

const menuItems1 = [
  { icon: Wallet, label: '我的资产', desc: '查看数字藏品资产', path: '/assets' },
  { icon: PiggyBank, label: '我的钱包', desc: '管理钱包与余额', path: '/wallet' },
];

const menuItems2 = [
  { icon: Shield, label: '藏锋ART订单', desc: '查看我的订单记录', path: '/orders' },
  { icon: Award, label: '我的认证', desc: '完成认证，解锁更多权益', path: '/verification' },
  { icon: Lock, label: '安全设置', desc: '管理账号安全与隐私', path: '/security' },
  { icon: FileText, label: '相关协议', desc: '查看平台相关协议', path: '' },
];

const moreItems = [
  { icon: Info, label: '关于藏锋ART', desc: '了解关于藏锋ART', path: '' },
  { icon: Share2, label: '分享藏锋ART', desc: '分享给好友', path: '' },
  { icon: UserPlus, label: '邀请好友', desc: '邀请好友，领取奖励', path: '/invite' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isVerified = useStore((s) => s.isVerified);
  const logout = useStore((s) => s.logout);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const [copied, setCopied] = useState<'uid' | 'wallet' | null>(null);

  const handleMenuClick = (path: string) => {
    if (!path) return;
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserAreaClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  const handleCopy = (text: string, type: 'uid' | 'wallet') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="page-container bg-neu-bg">
      {/* 顶部导航 */}
      <div className="flex items-center justify-center h-navbar px-4 sticky top-0 bg-neu-bg z-50">
        <h1 className="text-lg font-bold text-neu-text-primary">我的</h1>
        <button
          onClick={() => navigate('/settings')}
          className="absolute right-4 w-9 h-9 neu-raised rounded-full flex items-center justify-center neu-interactive"
        >
          <Settings size={22} className="text-accent-blue" />
        </button>
      </div>

      {/* 用户信息卡片 */}
      <div
        className="mx-4 neu-raised rounded-lg-card p-5 overflow-hidden cursor-pointer"
        style={{ background: 'linear-gradient(145deg, #6DB3F2, #4A90D9)' }}
        onClick={handleUserAreaClick}
      >
        <div className="flex items-center gap-4">
          {/* 头像 */}
          <div className="w-14 h-14 neu-raised rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-yellow-400">藏锋</span>
          </div>

          {/* 昵称 + UID */}
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold text-white truncate">
              {isLoggedIn ? user.nickname : '未登录'}
            </span>
            {isLoggedIn && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm text-white/70">UID: {user.uid}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(user.uid, 'uid');
                  }}
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  {copied === 'uid' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 钱包地址 - 头像和UID下方 */}
        {isLoggedIn && (
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-[13px] text-white/70 truncate flex-1">
              {isVerified && user.walletAddress ? (
                <>
                  钱包地址：{user.walletAddress.length > 16
                    ? `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-6)}`
                    : user.walletAddress}
                </>
              ) : (
                '实名后生成地址'
              )}
            </span>
            {isVerified && user.walletAddress && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(user.walletAddress, 'wallet');
                }}
                className="text-white/60 hover:text-white/90 transition-colors flex-shrink-0"
              >
                {copied === 'wallet' ? <Check size={15} /> : <Copy size={15} />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 资产服务模块 */}
      <div className="mx-4 mt-4">
        <h2 className="text-base font-bold text-neu-text-primary mb-1">资产服务</h2>
        {menuItems1.map((item, i) => (
          <div
            key={i}
            className="neu-raised rounded-card p-4 mb-3 flex items-center cursor-pointer"
            onClick={() => handleMenuClick(item.path)}
          >
            <item.icon size={20} className="text-accent-blue" />
            <div className="ml-3 flex-1">
              <div className="text-sm text-neu-text-primary">{item.label}</div>
              <div className="text-xs text-neu-text-muted">{item.desc}</div>
            </div>
            <ChevronRight size={18} className="text-neu-text-muted" />
          </div>
        ))}
      </div>

      {/* 订单与认证模块 */}
      <div className="mx-4 mt-4">
        <h2 className="text-base font-bold text-neu-text-primary mb-1">订单与认证</h2>
        {menuItems2.map((item, i) => (
          <div
            key={i}
            className="neu-raised rounded-card p-4 mb-3 flex items-center cursor-pointer"
            onClick={() => handleMenuClick(item.path)}
          >
            <item.icon size={20} className="text-accent-blue" />
            <div className="ml-3 flex-1">
              <div className="text-sm text-neu-text-primary">{item.label}</div>
              <div className="text-xs text-neu-text-muted">{item.desc}</div>
            </div>
            {item.label === '我的认证' && (
              <span className={`text-xs rounded px-2 py-0.5 mr-2 font-semibold ${
                isVerified
                  ? 'neu-pressed bg-accent-blue/20 text-accent-blue'
                  : 'neu-raised text-accent-blue'
              }`}>
                {isVerified ? '已认证' : '去认证'}
              </span>
            )}
            <ChevronRight size={18} className="text-neu-text-muted" />
          </div>
        ))}
      </div>

      {/* 更多功能 */}
      <div className="mx-4 mt-4 pb-4">
        <h2 className="text-base font-bold text-neu-text-primary mb-3">更多功能</h2>
        <div className="grid grid-cols-3 gap-3">
          {moreItems.map((item, i) => (
            <div
              key={i}
              className="neu-raised rounded-card p-3 flex flex-col items-center cursor-pointer"
              onClick={() => handleMenuClick(item.path)}
            >
              <item.icon size={22} className="text-neu-text-secondary mb-2" />
              <span className="text-xs text-neu-text-primary">{item.label}</span>
              <span className="text-[10px] text-neu-text-muted mt-0.5">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 退出登录 - 仅登录后显示 */}
      {isLoggedIn && (
        <div className="mx-4 mt-4 mb-4">
          <button
            onClick={handleLogout}
            className="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base"
          >
            退出登录
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}