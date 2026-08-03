import { useState } from 'react';
import { Search, Grid2X2, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { useStore } from '@/store/useStore';
import { nfts as marketList, getImageUrl, formatPrice } from '@/data/nfts';

const mainTabs = ['数字资产', '盲盒'];
const categoryFilters = ['全部', '我的关注'];

export default function MarketPage() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(
    new Set(marketList.filter((i) => i.liked).map((i) => i.id))
  );
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // 按名称模糊匹配过滤
  const filteredList = marketList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-base font-bold text-neu-text-primary">未找到相关藏品</p>
                <p className="text-sm text-neu-text-muted mt-2">试试其他关键词</p>
              </div>
            ) : (
              filteredList.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/market/${item.id}`)}
                className="neu-raised rounded-xl flex items-center p-3 mb-3 mt-2 active:bg-white/40 transition-colors cursor-pointer"
              >
                {/* 头像 */}
                <div
                  className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 overflow-hidden"
                  style={{ backgroundImage: `url(${getImageUrl(item.image, 'thumb')})` }}
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
                    {formatPrice(item.price)}
                  </span>
                </div>

                {/* 成交量 */}
                <button onClick={(e) => { e.stopPropagation(); handleBuy(); }} className="w-14 text-right">
                  <span className="text-sm font-bold text-accent-blue">
                    {item.volume}
                  </span>
                </button>
              </div>
            ))
            )}
          </div>
        </>
      )}

      {/* 网格视图 */}
      {viewMode === 'grid' && (
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-base font-bold text-neu-text-primary">未找到相关藏品</p>
              <p className="text-sm text-neu-text-muted mt-2">试试其他关键词</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/market/${item.id}`)}
                  className="neu-raised rounded-xl overflow-hidden active:bg-white/40 transition-colors cursor-pointer"
                >
                  {/* 图片区 */}
                  <div className="relative">
                    <div
                      className="w-full aspect-square bg-cover bg-center"
                      style={{ backgroundImage: `url(${getImageUrl(item.image, 'cover')})` }}
                    />
                    {item.saleStatus === 'onsale' && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow-sm">
                        发售中
                      </span>
                    )}
                  </div>
                  {/* 信息区 */}
                  <div className="px-2.5 py-2">
                    <h3 className="text-sm font-bold text-neu-text-primary truncate">
                      {item.name}
                    </h3>
                    <span className="inline-block mt-1 text-[10px] text-neu-text-muted bg-gray-100 px-1.5 py-0.5 rounded">
                      发行{item.issue}
                    </span>
                    <p className="mt-1.5 text-lg font-bold text-accent-blue">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}