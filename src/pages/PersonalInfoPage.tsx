import { useNavigate } from 'react-router-dom';
import { Copy, ChevronRight } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

const listItems = [
  { label: '头像', type: 'avatar' as const },
  { label: '昵称', type: 'text' as const, valueKey: 'nickname' as const },
  { label: '手机号', type: 'text' as const, valueKey: 'phone' as const, clickable: false },
  { label: '区块链地址', type: 'copy' as const, clickable: false },
  { label: '收货地址', type: 'arrow' as const },
  { label: '平台交易细则', type: 'arrow' as const },
];

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const showToast = useStore((s) => s.showToast);

  const handleCopyWalletAddress = () => {
    if (!user.walletAddress) {
      showToast('暂无地址', 'info');
      return;
    }
    navigator.clipboard.writeText(user.walletAddress);
    showToast('已复制', 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="个人信息" />

      {/* 列表 */}
      <div className="mx-4 mt-4 neu-raised rounded-card overflow-hidden">
        {listItems.map((item, i) => {
          const isLast = i === listItems.length - 1;
          return (
            <div key={i}>
              <div
                className={`flex items-center justify-between h-14 px-4 ${
                  item.clickable !== false ? 'cursor-pointer' : ''
                }`}
              >
                <span className="text-base font-semibold text-neu-text-primary">{item.label}</span>
                <div className="flex items-center gap-1">
                  {item.type === 'avatar' && (
                    <div className="w-10 h-10 neu-raised rounded-full bg-black flex items-center justify-center">
                      <span className="text-[9px] font-bold text-yellow-400">藏锋</span>
                    </div>
                  )}
                  {item.type === 'text' && item.valueKey && (
                    <span className="text-sm text-neu-text-muted">
                      {user[item.valueKey]}
                    </span>
                  )}
                  {item.type === 'copy' && (
                    <button onClick={handleCopyWalletAddress} className="text-accent-blue">
                      <Copy size={18} />
                    </button>
                  )}
                  {item.clickable !== false && (
                    <ChevronRight size={18} className="text-neu-text-muted" />
                  )}
                </div>
              </div>
              {!isLast && <div className="neu-divider" />}
            </div>
          );
        })}
      </div>

      {/* 退出按钮 */}
      <div className="fixed bottom-8 left-0 right-0 px-4 max-w-[430px] mx-auto">
        <button
          onClick={handleLogout}
          className="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base"
        >
          退出账号
        </button>
      </div>
    </div>
  );
}