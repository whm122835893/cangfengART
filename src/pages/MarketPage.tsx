import { useState } from 'react';
import { Search, Grid2X2, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { useStore } from '@/store/useStore';

const mainTabs = ['数字资产', '盲盒'];
const categoryFilters = ['全部', '我的关注'];

const marketList = [
  { id: '1', name: '圆明园羊首铜像', issue: 5000, circulation: 5000, price: '--', volume: 267, liked: false, cover: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&h=200&fit=crop' },
  { id: '2', name: '圆明园马首铜像', issue: 100000, circulation: 29238, price: '--', volume: 177, liked: false, cover: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=200&h=200&fit=crop' },
  { id: '3', name: '圆明园虎首铜像', issue: 5000, circulation: 4821, price: '¥1888', volume: 89, liked: true, cover: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=200&h=200&fit=crop' },
  { id: '4', name: '圆明园猪首铜像', issue: 5000, circulation: 4502, price: '¥1666', volume: 64, liked: false, cover: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=200&h=200&fit=crop' },
  { id: '5', name: '圆明园猴首铜像', issue: 5000, circulation: 3980, price: '¥1999', volume: 52, liked: false, cover: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=200&h=200&fit=crop' },
  { id: '6', name: '圆明园牛首铜像', issue: 5000, circulation: 3205, price: '¥1388', volume: 41, liked: false, cover: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=200&h=200&fit=crop' },
  { id: '7', name: '十二生肖·辰龙', issue: 8000, circulation: 6210, price: '¥2999', volume: 156, liked: true, cover: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200&h=200&fit=crop' },
  { id: '8', name: '十二生肖·巳蛇', issue: 8000, circulation: 5480, price: '¥2688', volume: 112, liked: false, cover: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=200&h=200&fit=crop' },
];

export default function MarketPage() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(
    new Set(marketList.filter((i) => i.liked).map((i) => i.id))
  );
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const isVerified = useStore((s) => s.isVerified);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBuy = () => {
    if (!isVerified) {
      setShowVerifyModal(true);
      return;
    }
  };

  return (
    <div className="page-container bg-neu-bg">
      {/* 搜索栏 */}
      <div className="h-[44px] flex items-center px-4 mt-3">
        <div className="flex items-center w-full h-9 rounded-full neu-inset px-4 gap-2">
          <Search size={18} className="text-neu-text-muted shrink-0" />
          <input
            type="text"
            placeholder="搜索数字资产、盲盒或专辑"
            className="flex-1 bg-transparent text-sm text-neu-text-primary outline-none placeholder:text-neu-text-muted"
          />
        </div>
      </div>

      {/* 主标签栏 */}
      <div className="h-[44px] flex items-end px-4 relative">
        <div className="flex items-center gap-6 h-full">
          {mainTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(i)}
              className={`relative h-full flex items-center text-base font-semibold ${
                i === activeMainTab
                  ? 'text-accent-blue font-bold'
                  : 'text-neu-text-muted'
              }`}
            >
              {tab}
              {i === activeMainTab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full neu-pressed" />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center h-full ml-auto">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="p-1"
          >
            {viewMode === 'list' ? (
              <Grid2X2 size={20} className="text-accent-blue" />
            ) : (
              <List size={20} className="text-accent-blue" />
            )}
          </button>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="neu-divider mx-4" />

      {/* 次级筛选栏 */}
      <div className="h-[44px] flex items-center px-4 gap-3">
        <Search size={18} className="text-neu-text-muted shrink-0" />
        {categoryFilters.map((item, i) => (
          <button
            key={item}
            onClick={() => setActiveFilter(i)}
            className={`h-7 px-4 rounded-full text-sm font-semibold ${
              i === activeFilter
                ? 'neu-pressed text-white'
                : 'neu-raised text-neu-text-secondary'
            }`}
            style={i === activeFilter ? { backgroundColor: '#4A90D9' } : undefined}
          >
            {item}
          </button>
        ))}
        <div className="flex-1 flex justify-end">
          <List size={20} className="text-accent-blue" />
        </div>
      </div>

      {/* 列表视图 */}
      {viewMode === 'list' && (
        <>
          {/* 分隔线 */}
          <div className="neu-divider mx-4" />

          {/* 列表表头 */}
          <div className="h-9 flex items-center px-4 mt-1">
            <span className="flex-1 text-xs text-neu-text-muted font-semibold text-left">
              藏品名称 | 发行流通
            </span>
            <span className="w-16 text-xs text-neu-text-muted font-semibold text-center">
              地板价
            </span>
            <span className="w-14 text-xs text-neu-text-muted font-semibold text-right">
              成交量
            </span>
          </div>

          {/* 列表 */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {marketList.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/market/${item.id}`)}
                className="neu-raised rounded-xl flex items-center p-3 mb-3 mt-2 active:bg-white/40 transition-colors cursor-pointer"
              >
                {/* 头像 */}
                <div
                  className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 overflow-hidden"
                  style={{ backgroundImage: `url(${item.cover})` }}
                />

                {/* 名称 + 发行/流通 */}
                <div className="flex-1 ml-3 min-w-0">
                  <h3 className="text-[15px] font-bold text-neu-text-primary truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-neu-text-muted">
                    <span>发行{item.issue}</span>
                    <span>流通{item.circulation}</span>
                  </div>
                </div>

                {/* 收藏 */}
                <button onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }} className="p-1 mx-2">
                  <svg width="16" height="16" viewBox="0 0 24 24"
                    fill={likedIds.has(item.id) ? '#f59e0b' : 'none'}
                    stroke={likedIds.has(item.id) ? '#f59e0b' : '#9ca3af'}
                    strokeWidth="1.8">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>

                {/* 地板价 */}
                <div className="w-16 flex flex-col items-center justify-center">
                  <span className="text-sm font-semibold text-neu-text-primary">
                    {item.price}
                  </span>
                </div>

                {/* 成交量 */}
                <button onClick={(e) => { e.stopPropagation(); handleBuy(); }} className="w-14 text-right">
                  <span className="text-sm font-bold text-accent-blue">
                    {item.volume}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 网格视图 */}
      {viewMode === 'grid' && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-2 gap-3 mt-3">
            {marketList.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/market/${item.id}`)}
                className="neu-raised rounded-xl p-3 active:bg-white/40 transition-colors cursor-pointer"
              >
                {/* 图片 */}
                <div
                  className="w-full aspect-square rounded-lg bg-cover bg-center mb-2"
                  style={{ backgroundImage: `url(${item.cover})` }}
                />

                {/* 名称 */}
                <h3 className="text-sm font-bold text-neu-text-primary truncate mb-1">
                  {item.name}
                </h3>

                {/* 发行/流通 */}
                <div className="flex items-center gap-2 text-[10px] text-neu-text-muted mb-2">
                  <span>发行{item.issue}</span>
                  <span>流通{item.circulation}</span>
                </div>

                {/* 价格 */}
                <div className="flex items-center">
                  <span className="text-xs font-semibold text-neu-text-primary">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}