import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronRight, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface AuthPromptProps {
  /** 提示类型：'login' 未登录 | 'verify' 未实名 */
  type?: 'login' | 'verify';
}

export default function AuthPrompt({ type = 'login' }: AuthPromptProps) {
  const navigate = useNavigate();
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isVerified = useStore((s) => s.isVerified);

  if (type === 'login' && isLoggedIn) return null;
  if (type === 'verify' && isVerified) return null;

  const message = type === 'login'
    ? '您还未登录，点击去登录'
    : '您还未实名认证，点击去实名';
  const path = type === 'login' ? '/login' : '/verification';

  return (
    <div
      className="neu-raised rounded-card p-3 flex items-center gap-3 cursor-pointer"
      onClick={() => navigate(path)}
    >
      <AlertCircle size={20} className="text-accent-blue" />
      <span className="text-sm font-semibold text-accent-blue flex-1">{message}</span>
      <ChevronRight size={18} className="text-accent-blue" />
    </div>
  );
}

/** 全局登录/认证弹窗 */
export function AuthModal() {
  const showAuthModal = useStore((s) => s.showAuthModal);
  const showVerifyModal = useStore((s) => s.showVerifyModal);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);
  const navigate = useNavigate();

  if (!showAuthModal && !showVerifyModal) return null;

  const isAuth = showAuthModal;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center">
      <div className="neu-raised bg-neu-bg rounded-lg-card w-[300px] p-6 relative">
        <button
          onClick={() => { setShowAuthModal(false); setShowVerifyModal(false); }}
          className="absolute top-4 right-4"
        >
          <X size={20} className="text-neu-text-muted" />
        </button>
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="w-16 h-16 rounded-full neu-inset flex items-center justify-center mb-5">
            <AlertCircle size={32} className="text-accent-blue" />
          </div>
          <p className="text-lg font-bold text-neu-text-primary mb-2">
            {isAuth ? '请先登录' : '请先完成实名认证'}
          </p>
          <p className="text-sm text-neu-text-secondary mb-6 text-center">
            {isAuth ? '登录后即可使用完整功能' : '实名认证后可购买藏品'}
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => { setShowAuthModal(false); setShowVerifyModal(false); }}
              className="flex-1 h-11 neu-raised rounded-2xl text-neu-text-secondary font-semibold text-sm"
            >
              取消
            </button>
            <button
              onClick={() => {
                setShowAuthModal(false);
                setShowVerifyModal(false);
                navigate(isAuth ? '/login' : '/verification');
              }}
              className="flex-1 h-11 neu-accent-blue rounded-2xl text-white font-semibold text-sm"
            >
              {isAuth ? '去登录' : '去认证'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}