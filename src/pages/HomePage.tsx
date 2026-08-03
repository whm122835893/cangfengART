import { useState, useEffect } from 'react';
import { Bell, Sparkles, Calendar, ArrowLeftRight, Vote, ChevronRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { useStore } from '@/store/useStore';
import { getOnSaleNfts, getImageUrl, formatPrice, getSaleCountdown } from '@/data/nfts';

const features = [
  { icon: Sparkles, label: '合成活动', color: 'text-accent-blue', path: '/synthesis' },
  { icon: Calendar, label: '签到活动', color: 'text-accent-blue', path: '/checkin' },
  { icon: ArrowLeftRight, label: '置换活动', color: 'text-accent-blue', path: '/swap' },
  { icon: Vote, label: '抽签活动', color: 'text-accent-blue', path: '/lottery' },
  { icon: UserPlus, label: '邀请好友', color: 'text-accent-blue', path: '/invite' },
];

const tabs = ['首发', '盲盒', '精选活动'];

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=400&fit=crop',
    desc: '经典老IP回归 · 重温热血经典 开启全新冒险',
  },
  {
    image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=400&fit=crop',
    desc: '限时合成活动 · 合成稀有藏品 赢取限定好礼',
  },
  {
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=400&fit=crop',
    desc: '新人专享福利 · 注册即送盲盒 开启收藏之旅',
  },
];

const announcementList = [
  '【运营公告】关于藏锋ART平台数字资产迁移说明及第一阶段运营活动正式启动',
  '【运营公告】藏锋ART·焕新升级进展',
  '【上新预告】限时稀有藏品即将上线，敬请期待',
  '【活动公告】每日签到积分翻倍，连续7天赢好礼',
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [announceIndex, setAnnounceIndex] = useState(0);
  const [, setTick] = useState(0);
  const navigate = useNavigate();
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isVerified = useStore((s) => s.isVerified);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);

  const onSaleNfts = getOnSaleNfts();

  const handleFeatureClick = (path: string) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!isVerified) {
      setShowVerifyModal(true);
      return;
    }
    navigate(path);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnounceIndex((prev) => (prev + 1) % announcementList.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // 倒计时每秒刷新
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-container bg-neu-bg">
      {/* Banner 轮播 */}
      <div className="px-4 mt-3 mb-3">
        <div className="w-full h-40 rounded-lg-card neu-raised overflow-hidden relative">
          {/* 轮播图片 */}
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
            style={{ backgroundImage: `url(${banners[bannerIndex].image})` }}
          />
          {/* 底部渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* 左下角描述 */}
          <p className="absolute bottom-3 left-3 text-white text-sm font-bold z-10 drop-shadow-lg">
            {banners[bannerIndex].desc}
          </p>
          {/* 轮播指示器 */}
          <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === bannerIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 公告流动栏 */}
      <div
        className="mx-4 mb-5 h-10 neu-raised rounded-card flex items-center px-3 cursor-pointer overflow-hidden"
        onClick={() => navigate('/discover')}
      >
        <span className="neu-pressed text-accent-blue text-[10px] px-2 py-0.5 rounded-full mr-2 shrink-0 font-semibold">
          公告
        </span>
        <Bell size={14} className="text-accent-blue mr-1.5 shrink-0" />
        <div className="flex-1 h-10 overflow-hidden relative">
          {announcementList.map((text, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center transition-all duration-500"
              style={{
                transform: `translateY(${(i - announceIndex) * 100}%)`,
                opacity: i === announceIndex ? 1 : 0,
              }}
            >
              <span className="text-sm text-neu-text-primary font-semibold truncate w-full">
                {text}
              </span>
            </div>
          ))}
        </div>
        <ChevronRight size={16} className="text-neu-text-muted ml-1 shrink-0" />
      </div>

      {/* 功能入口 */}
      <div className="px-4 mb-5">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-2 cursor-pointer shrink-0 w-16" onClick={() => handleFeatureClick(item.path)}>
                <div className={`w-12 h-12 rounded-full neu-raised neu-interactive flex items-center justify-center ${item.color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-semibold text-neu-text-secondary">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 内容Tab */}
      <div className="flex">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 h-11 text-sm font-semibold relative ${
              activeTab === i ? 'text-accent-blue font-bold' : 'text-neu-text-muted'
            }`}
          >
            {tab}
            {activeTab === i && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full neu-pressed" />
            )}
          </button>
        ))}
      </div>
      {/* Tab 内容 */}
      {activeTab === 0 && (
        <div className="flex-1 px-3 pt-3 pb-4">
          {onSaleNfts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {onSaleNfts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/nft/${item.id}`)}
                  className="neu-raised rounded-xl overflow-hidden active:bg-white/40 transition-colors cursor-pointer"
                >
                  {/* 图片区 */}
                  <div className="relative">
                    <div
                      className="w-full aspect-square bg-cover bg-center"
                      style={{ backgroundImage: `url(${getImageUrl(item.image, 'cover')})` }}
                    />
                    {/* 状态标签 */}
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow-sm">
                      发售中
                    </span>
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-neu-text-muted">
              <Sparkles size={32} className="mb-2 opacity-40" />
              <p className="text-sm">暂无发售中的藏品</p>
            </div>
          )}
        </div>
      )}

      {(activeTab === 1 || activeTab === 2) && (
        <div className="flex-1 h-40 flex items-center justify-center text-neu-text-muted text-sm">
          敬请期待
        </div>
      )}

      <BottomNav />
    </div>
  );
}