import NavBar from '@/components/common/NavBar';
import EmptyState from '@/components/common/EmptyState';
import { useStore } from '@/store/useStore';
import { Clock, Gift, Shield, Package } from 'lucide-react';

export default function SupplyPage() {
  const isVerified = useStore((s) => s.isVerified);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);

  const handleSupply = () => {
    if (!isVerified) {
      setShowVerifyModal(true);
      return;
    }
  };

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="补给站" />

      {/* Banner */}
      <div className="mx-4 mt-4">
        <div className="h-56 rounded-lg-card neu-raised overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-accent-orange to-accent-magenta relative overflow-hidden">
            {/* 3D场景装饰 */}
            <div className="absolute inset-0">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm rotate-45" />
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm rotate-12" />
              <div className="absolute top-28 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm -rotate-6" />
            </div>
            {/* 光效 */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white/10 blur-xl" />
            <div className="absolute bottom-12 left-6 w-12 h-12 rounded-full bg-white/10 blur-xl" />

            {/* 文字内容 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <h2 className="text-[34px] font-black text-white mb-2">
                补给站
              </h2>
              <p className="text-white/90 text-sm font-semibold mb-1">补给资源·助力成长</p>
              <p className="text-white/60 text-xs font-semibold mb-4">每日领取补给，助力你的收藏之旅</p>
              <button onClick={handleSupply} className="px-6 py-2 rounded-full neu-accent-blue neu-interactive text-white text-sm font-bold">
                获取补给 →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 装饰分隔区 */}
      <div className="flex items-center justify-center gap-2 my-6">
        <div className="flex-1 h-px neu-divider" />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full neu-pressed" />
          <span className="text-sm text-neu-text-primary font-bold">补给礼包</span>
          <div className="w-1.5 h-1.5 rounded-full neu-pressed" />
        </div>
        <div className="flex-1 h-px neu-divider" />
      </div>

      {/* 空状态 */}
      <EmptyState
        icon={
          <div className="w-[120px] h-[120px] rounded-3xl neu-inset flex items-center justify-center mb-6">
            <Package size={48} className="text-accent-blue" />
          </div>
        }
        title="暂无更多补给"
        subtitle="更多补给正在路上，敬请期待~"
      />

      {/* 小贴士三栏 */}
      <div className="mx-4 mb-4">
        <div className="neu-raised rounded-card p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full neu-inset flex items-center justify-center mb-1.5">
                <Clock size={16} className="text-functional-tech" />
              </div>
              <p className="text-[10px] text-neu-text-secondary font-semibold leading-tight">每日定时</p>
              <p className="text-[10px] text-neu-text-secondary font-semibold leading-tight">发放补给</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full neu-inset flex items-center justify-center mb-1.5">
                <Gift size={16} className="text-accent-blue" />
              </div>
              <p className="text-[10px] text-neu-text-secondary font-semibold leading-tight">限量礼包</p>
              <p className="text-[10px] text-neu-text-secondary font-semibold leading-tight">先到先得</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full neu-inset flex items-center justify-center mb-1.5">
                <Shield size={16} className="text-functional-success" />
              </div>
              <p className="text-[10px] text-neu-text-secondary font-semibold leading-tight">官方正品</p>
              <p className="text-[10px] text-neu-text-secondary font-semibold leading-tight">品质保障</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}