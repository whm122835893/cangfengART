import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Copy, Check } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const isVerified = useStore((s) => s.isVerified);
  const updateUser = useStore((s) => s.updateUser);

  const [nickname, setNickname] = useState(user.nickname);
  const [address, setAddress] = useState(user.address || '');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    updateUser({ nickname, address });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = () => {
    const colors = ['#4A90D9', '#d4758a', '#70b080', '#e09060', '#a855f7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    updateUser({ avatar: randomColor });
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="设置" />

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* 头像 */}
        <div
          className="neu-raised rounded-card p-4 flex items-center cursor-pointer"
          onClick={handleAvatarChange}
        >
          <span className="text-sm font-semibold text-neu-text-primary flex-1">
            头像
          </span>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
            style={{ background: user.avatar || '#1a1a1a' }}
          >
            {!user.avatar ? (
              <span className="text-[10px] font-bold text-yellow-400">藏锋</span>
            ) : null}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* 昵称 - 可修改 */}
        <div className="neu-raised rounded-card p-4">
          <label className="text-sm font-semibold text-neu-text-primary block mb-2">
            昵称
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="请输入昵称"
            maxLength={16}
            className="w-full h-11 neu-inset rounded-2xl px-4 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
            style={{ border: 'none' }}
          />
        </div>

        {/* UID - 只读 */}
        <div className="neu-raised rounded-card p-4">
          <label className="text-sm font-semibold text-neu-text-primary block mb-2">
            UID
          </label>
          <div className="flex items-center h-11 neu-inset rounded-2xl px-4">
            <span className="flex-1 text-sm text-neu-text-primary font-mono">
              {user.uid || '—'}
            </span>
            <span className="text-xs text-neu-text-muted">不可修改</span>
          </div>
        </div>

        {/* 钱包地址 - 只读 + 可复制 */}
        <div className="neu-raised rounded-card p-4">
          <label className="text-sm font-semibold text-neu-text-primary block mb-2">
            钱包地址
          </label>
          <div className="flex items-center gap-2 h-11 neu-inset rounded-2xl px-4">
            <span className="flex-1 text-sm text-neu-text-primary truncate">
              {isVerified && user.walletAddress ? `钱包地址：${user.walletAddress}` : '实名后生成地址'}
            </span>
            {isVerified && user.walletAddress && (
              <button
                onClick={handleCopyWallet}
                className="text-accent-blue hover:text-accent-blue/80 transition-colors flex-shrink-0"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            )}
          </div>
          <span className="text-xs text-neu-text-muted mt-1.5 block">实名认证后自动生成，不可修改</span>
        </div>

        {/* 收货地址 */}
        <div className="neu-raised rounded-card p-4">
          <label className="text-sm font-semibold text-neu-text-primary block mb-2">
            收货地址
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="请输入收货地址"
            rows={3}
            className="w-full neu-inset rounded-2xl px-4 py-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none resize-none"
            style={{ border: 'none' }}
          />
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          className="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base mt-2"
        >
          {saved ? '已保存' : '保存修改'}
        </button>
      </div>
    </div>
  );
}