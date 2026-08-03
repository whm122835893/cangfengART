import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Package, X, ChevronRight } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import EmptyState from '@/components/common/EmptyState';
import { useStore, UserAsset } from '@/store/useStore';
import { getImageUrl, formatPrice } from '@/data/nfts';

const tabs = ['数字资产', '盲盒', '寄售中', '已售出'];

export default function AssetsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const userAssets = useStore((s) => s.userAssets);
  const [selectedAsset, setSelectedAsset] = useState<UserAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNumberClick = (nftId: string, number: string) => {
    navigate(`/nft/${nftId}?number=${encodeURIComponent(number)}&from=assets`);
  };

  // 根据 Tab 和搜索关键词过滤资产
  const filteredAssets = userAssets.filter((asset) => {
    // 搜索过滤（按 name 模糊匹配）
    if (searchQuery && !asset.name.includes(searchQuery)) {
      return false;
    }
    // Tab 过滤
    if (activeTab === 2) {
      // 寄售中：只显示有寄售编号的资产
      return asset.listedNumbers.length > 0;
    }
    if (activeTab === 1 || activeTab === 3) {
      // 盲盒、已售出：暂无数据
      return false;
    }
    // 数字资产（全部）：显示所有
    return true;
  });

  // 是否展示列表（数字资产 + 寄售中 在有数据时展示列表，其余展示空状态）
  const showList = (activeTab === 0 || activeTab === 2) && filteredAssets.length > 0;

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="我的资产" />

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 flex-1 text-sm bg-transparent outline-none placeholder:text-neu-text-muted"
          />
        </div>
        <button className="flex items-center gap-1 text-sm text-accent-blue font-semibold">
          <Filter size={16} />
          筛选
        </button>
      </div>

      {/* 资产列表 / 空状态 */}
      {showList ? (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredAssets.map((asset) => (
              <div
                key={asset.nftId}
                onClick={() => setSelectedAsset(asset)}
                className="neu-raised rounded-xl overflow-hidden active:bg-white/40 transition-colors cursor-pointer"
              >
                {/* 图片区 */}
                <div className="relative">
                  <div
                    className="w-full aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${getImageUrl(asset.image, 'cover')})` }}
                  />
                  {asset.quantity > 1 && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                      ×{asset.quantity}
                    </span>
                  )}
                  {asset.listedNumbers.length > 0 && (
                    <span className="absolute top-2 left-2 bg-amber-500/90 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                      寄售中 {asset.listedNumbers.length} 件
                    </span>
                  )}
                </div>
                {/* 信息区 */}
                <div className="px-2.5 py-2">
                  <h3 className="text-sm font-bold text-neu-text-primary truncate">
                    {asset.name}
                  </h3>
                  <span className="inline-block mt-1 text-[10px] text-neu-text-muted bg-gray-100 px-1.5 py-0.5 rounded">
                    编号 {asset.numbers[0] ?? asset.listedNumbers[0]}
                  </span>
                  <p className="mt-1.5 text-sm font-bold text-accent-blue">
                    {formatPrice(asset.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Package size={48} className="text-neu-text-muted opacity-30" />}
          title={activeTab === 0 ? '暂无数字资产' : activeTab === 2 ? '暂无寄售中藏品' : '暂无数据'}
          subtitle={activeTab === 0 ? '快去市场探索精彩藏品吧' : '敬请期待更多精彩内容'}
        />
      )}

      {/* 藏品编号弹窗 */}
      {selectedAsset && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center"
          onClick={() => setSelectedAsset(null)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-6 px-4 animate-[flapIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽指示器 */}
            <div className="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${getImageUrl(selectedAsset.image, 'cover')})` }}
                />
                <div>
                  <h2 className="text-base font-bold text-neu-text-primary">{selectedAsset.name}</h2>
                  <p className="text-xs text-neu-text-muted">共 {selectedAsset.quantity} 个藏品</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="w-8 h-8 rounded-full neu-raised neu-interactive flex items-center justify-center shrink-0"
              >
                <X size={16} className="text-neu-text-muted" />
              </button>
            </div>

            {/* 分隔线 */}
            <div className="neu-divider my-3" />

            {/* 编号列表 */}
            <div className="max-h-[40vh] overflow-y-auto no-scrollbar">
              <div className="flex flex-wrap gap-2">
                {/* 可点击的编号 */}
                {selectedAsset.numbers.map((number, i) => (
                  <button
                    key={i}
                    onClick={() => handleNumberClick(selectedAsset.nftId, number)}
                    className="neu-raised neu-interactive rounded-lg px-3 py-2 flex items-center gap-1.5"
                  >
                    <span className="text-sm font-bold text-neu-text-primary">{number}</span>
                    <ChevronRight size={14} className="text-neu-text-muted" />
                  </button>
                ))}
                {/* 寄售中编号：灰色不可点击 */}
                {selectedAsset.listedNumbers.map((number, i) => (
                  <div
                    key={`listed-${i}`}
                    className="neu-inset rounded-lg px-3 py-2 flex items-center gap-1.5 opacity-60 cursor-not-allowed"
                  >
                    <span className="text-sm font-bold text-neu-text-muted">{number}</span>
                    <span className="text-[10px] text-neu-text-muted bg-gray-200 px-1 py-0.5 rounded">
                      寄售中
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
