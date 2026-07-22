import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Bell, Smile, AlertCircle, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

const tabs = [
  { key: 'home', label: '首页', icon: Home, path: '/', restricted: false },
  { key: 'market', label: '市场', icon: ShoppingBag, path: '/market', restricted: false },
  { key: 'discover', label: '公告', icon: Bell, path: '/discover', badge: true, restricted: false },
  { key: 'profile', label: '我的', icon: Smile, path: '/profile', restricted: false },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isVerified = useStore((s) => s.isVerified);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path.startsWith('/market')) return 'market';
    if (path.startsWith('/discover')) return 'discover';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.restricted && !isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    navigate(tab.path);
  };

  // Show auth prompt when not logged in or not verified (only on main tabs)
  const showAuthPrompt = !isLoggedIn || (isLoggedIn && !isVerified);
  const isMainPage = ['/', '/market', '/discover'].includes(location.pathname) || 
                     location.pathname.startsWith('/market') || 
                     location.pathname.startsWith('/discover');

  return (
    <>
      {/* Auth Prompt above BottomNav */}
      {showAuthPrompt && isMainPage && (
        <div className="fixed bottom-[74px] left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4">
          <div
            className="neu-raised rounded-card p-3 flex items-center gap-3 cursor-pointer bg-neu-bg"
            onClick={() => {
              if (!isLoggedIn) {
                navigate('/login');
              } else {
                navigate('/verification');
              }
            }}
          >
            <AlertCircle size={20} className="text-accent-blue" />
            <span className="text-sm font-semibold text-accent-blue flex-1">
              {!isLoggedIn ? '您还未登录，点击去登录' : '您还未实名认证，点击去实名'}
            </span>
            <ChevronRight size={18} className="text-accent-blue" />
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-bottom-nav neu-raised flex items-center justify-around z-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-all duration-150 ${
                isActive ? '' : ''
              }`}
            >
              <div className="relative">
                {isActive ? (
                  <div className="p-1.5 rounded-xl neu-pressed">
                    <Icon size={22} className="text-accent-blue" strokeWidth={2.5} />
                  </div>
                ) : (
                  <Icon size={22} className="text-accent-blue/40" strokeWidth={2} />
                )}
                {tab.badge && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-functional-danger rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? 'text-accent-blue' : 'text-accent-blue/50'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}