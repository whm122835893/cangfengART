import NavBar from '@/components/common/NavBar';
import EmptyState from '@/components/common/EmptyState';
import { useStore } from '@/store/useStore';
import { Lightbulb, Gift } from 'lucide-react';

export default function SwapPage() {
  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="置换活动" />

      {/* Banner */}
      <div className="mx-4 mt-4">
        <div className="h-48 rounded-lg-card neu-raised overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-accent-orange to-accent-orange-light relative overflow-hidden">
            {/* 玻璃拟态装饰 */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-white/30" />
              </div>
            </div>

            {/* 光点 */}
            <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-white/60" />
            <div className="absolute top-12 right-8 w-1.5 h-1.5 rounded-full bg-white/40" />
            <div className="absolute bottom-8 left-10 w-1 h-1 rounded-full bg-white/50" />
            <div className="absolute bottom-6 right-10 w-2 h-2 rounded-full bg-white/40" />

            {/* 气泡 */}
            <div className="absolute bottom-4 left-1/4 w-4 h-4 rounded-full bg-white/10" />
            <div className="absolute top-16 right-1/4 w-3 h-3 rounded-full bg-white/15" />
            <div className="absolute bottom-10 left-1/3 w-5 h-5 rounded-full bg-white/8" />
          </div>
        </div>
      </div>

      {/* 空状态 */}
      <EmptyState
        icon={
          <div className="w-[120px] h-[120px] rounded-3xl neu-inset flex items-center justify-center mb-6">
            <Gift size={48} className="text-accent-blue" />
          </div>
        }
        title="暂无可参与置换活动"
        subtitle="敬请期待更多精彩活动"
      />

      {/* 小贴士卡片 */}
      <div className="mx-4 mb-4">
        <div className="neu-raised rounded-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full neu-inset flex items-center justify-center">
              <Lightbulb size={14} className="text-accent-blue" />
            </div>
            <span className="text-sm font-bold text-neu-text-primary">小贴士</span>
          </div>
          <p className="text-sm text-neu-text-secondary leading-relaxed font-semibold">
            参与置换活动可用已有物品兑换新物品或奖励，不定期上线，记得常来看看哦！
          </p>
        </div>
      </div>

      {/* 底部留白 */}
      <div className="h-4" />
    </div>
  );
}