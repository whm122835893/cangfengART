import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Heart } from 'lucide-react';
import BottomNav from '@/components/common/BottomNav';
import EmptyState from '@/components/common/EmptyState';

const primaryTabs = ['平台公告', '新闻发布', '辟谣墙'];
const secondaryFilters = ['全部', '我的关注', '寄售公告', '上新公告'];

const announcements = [
  {
    id: 1,
    title: '【藏锋ART运营公告】关于藏锋ART平台数字资产迁移说明及第一阶段运营活动正式启动',
    tag: '运营公告',
    time: '2026/07/04 10:26:29',
    cover: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
  },
  {
    id: 2,
    title: '【藏锋ART运营公告】藏锋ART·焕新升级进展',
    tag: '运营公告',
    time: '2026/07/01 12:30:09',
    cover: 'linear-gradient(135deg, #1a1a2e, #2d1b69, #6b21a8)',
  },
];

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="page-container bg-neu-bg">
      {/* 顶部标题栏 */}
      <div className="h-12 flex items-center justify-center relative">
        <h1 className="text-[18px] font-bold text-neu-text-primary">发现</h1>
        <button className="absolute right-4 w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center">
          <RefreshCw size={18} className="text-neu-text-muted" />
        </button>
      </div>

      {/* 一级标签栏 */}
      <div className="h-[44px] flex items-end">
        {primaryTabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`relative flex-1 h-full flex items-center justify-center text-base font-semibold ${
              i === activeTab
                ? 'text-accent-blue font-bold'
                : 'text-neu-text-muted'
            }`}
          >
            {tab}
            {i === activeTab && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full neu-pressed" />
            )}
          </button>
        ))}
      </div>

      {/* 分隔线 */}
      <div className="neu-divider mx-4" />

      {/* 二级筛选栏 */}
      <div className="h-[44px] flex items-center px-4 gap-2 overflow-x-auto no-scrollbar">
        <Search size={18} className="text-neu-text-muted shrink-0" />
        {secondaryFilters.map((item, i) => (
          <button
            key={item}
            onClick={() => setActiveFilter(i)}
            className={`h-7 px-4 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 ${
              i === activeFilter
                ? 'neu-pressed text-white'
                : 'neu-raised text-neu-text-secondary'
            }`}
            style={i === activeFilter ? { backgroundColor: '#4A90D9' } : undefined}
          >
            {item}
          </button>
        ))}
      </div>

      {/* 公告列表 */}
      {activeTab === 0 ? (
        <div className="px-4 flex flex-col gap-3 pt-1 pb-4">
          {announcements.map((item) => {
            const isLiked = likedIds.has(item.id);
            return (
              <div
                key={item.id}
                className="neu-raised rounded-card p-3 flex gap-3 cursor-pointer"
                onClick={() => navigate(`/discover/${item.id}`)}
              >
                {/* 左侧文字区 */}
                <div className="flex-[6] flex flex-col gap-2 min-w-0">
                  <h3 className="text-sm font-semibold text-neu-text-primary leading-[1.5] line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="self-start text-xs text-accent-blue bg-neu-bg rounded px-2 py-0.5 font-semibold">
                    {item.tag}
                  </span>
                  <span className="text-xs text-neu-text-muted">{item.time}</span>
                </div>

                {/* 右侧封面图 */}
                <div
                  className="flex-[4] aspect-[4/3] rounded-xl neu-inset relative overflow-hidden shrink-0"
                  style={{ background: item.cover }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-white/15 text-base font-bold">
                    藏锋ART
                  </span>
                  <div
                    className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/30 rounded-full px-2 py-0.5 cursor-pointer"
                    onClick={(e) => toggleLike(e, item.id)}
                  >
                    <Heart
                      size={12}
                      className={isLiked ? 'text-red-500 fill-red-500' : 'text-white/80'}
                    />
                    <span className="text-xs text-white/80 font-semibold">
                      {isLiked ? '已关注' : '关注'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="暂无内容" subtitle="敬请期待更多精彩内容" />
      )}

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}