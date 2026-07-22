import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

export default function WalletPage() {
  const isVerified = useStore((s) => s.isVerified);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);

  const handleWalletClick = () => {
    if (!isVerified) {
      setShowVerifyModal(true);
      return;
    }
  };

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="我的钱包" />

      {/* 卡片1 - 汇付支付 */}
      <div className="mx-4 my-3">
        <div
          className="neu-raised rounded-lg-card p-5 h-36 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #d4758a, #c44569)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-raised rounded-full bg-white flex items-center justify-center">
              <span className="text-base font-bold text-accent-blue">汇</span>
            </div>
            <span className="text-white font-bold">汇付支付</span>
          </div>
          <button onClick={handleWalletClick} className="absolute bottom-5 right-5 neu-accent rounded-full px-5 py-2 text-white font-semibold text-sm">
            进入钱包
          </button>
        </div>
      </div>

      {/* 卡片2 - 易宝支付 */}
      <div className="mx-4 my-3">
        <div
          className="neu-raised rounded-lg-card p-5 h-36 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #70b080, #90cfa0)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-raised rounded-full bg-white flex items-center justify-center">
              <span className="text-base font-bold text-accent-green">易</span>
            </div>
            <div>
              <span className="text-white font-bold">易宝支付</span>
              <span className="block text-xs text-white/70">YIBAOZHIFU</span>
            </div>
          </div>
          <button onClick={handleWalletClick} className="absolute bottom-5 right-5 neu-accent-green rounded-full px-5 py-2 text-white font-semibold text-sm">
            进入钱包
          </button>
        </div>
      </div>
    </div>
  );
}