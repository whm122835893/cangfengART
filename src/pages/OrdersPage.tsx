import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import BackButton from '@/components/common/BackButton';
import EmptyState from '@/components/common/EmptyState';

const statusTabs = ['全部', '待付款', '已支付', '订单取消'];

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState(0);

  return (
    <div className="page-container bg-neu-bg">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 px-4 h-navbar bg-neu-bg sticky top-0 z-50">
        <BackButton variant="gray" />
        <div className="flex-1 flex items-center h-8 neu-inset rounded-full px-3">
          <Search size={15} className="text-neu-text-muted" />
          <input
            type="text"
            placeholder="搜索订单"
            className="ml-2 flex-1 text-sm bg-transparent outline-none placeholder:text-neu-text-muted"
          />
        </div>
        <button className="flex items-center gap-0.5 text-sm text-accent-blue font-semibold whitespace-nowrap">
          筛选
          <ChevronDown size={14} />
        </button>
      </div>

      {/* 状态标签栏 */}
      <div className="neu-divider" />
      <div className="flex gap-2 px-4 py-2.5">
        {statusTabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveStatus(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              activeStatus === i
                ? 'neu-pressed bg-accent-blue text-white'
                : 'neu-raised text-neu-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 空状态 */}
      <EmptyState
        title="暂无订单"
        subtitle="快去选购心仪的藏品吧"
      />
    </div>
  );
}