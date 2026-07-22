import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import EmptyState from '@/components/common/EmptyState';
import { useStore } from '@/store/useStore';

const tabs = ['数字资产', '盲盒', '寄售中', '已售出'];

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="page-container bg-neu-bg">
      <NavBar />

      {/* Tab 切换栏 */}
      <div className="flex h-11">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className="relative flex-1 flex items-center justify-center"
          >
            <span
              className={`text-sm ${
                activeTab === i
                  ? 'text-accent-blue font-bold'
                  : 'text-neu-text-muted'
              }`}
            >
              {tab}
            </span>
            {activeTab === i && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 neu-pressed rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 分隔线 */}
      <div className="neu-divider mx-4" />

      {/* 搜索筛选栏 */}
      <div className="flex items-center gap-3 px-4 h-12">
        <div className="flex-1 flex items-center h-9 neu-inset rounded-full px-3">
          <Search size={16} className="text-neu-text-muted" />
          <input
            type="text"
            placeholder="搜索藏品"
            className="ml-2 flex-1 text-sm bg-transparent outline-none placeholder:text-neu-text-muted"
          />
        </div>
        <button className="flex items-center gap-1 text-sm text-accent-blue font-semibold">
          <Filter size={16} />
          筛选
        </button>
      </div>

      {/* 空状态 */}
      <EmptyState
        title="暂无数字资产"
        subtitle="快去市场探索精彩藏品吧"
      />
    </div>
  );
}