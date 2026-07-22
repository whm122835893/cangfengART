import { useState, useEffect } from 'react';
import { Bell, Sparkles, Calendar, ArrowLeftRight, Vote, ChevronRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/common/BottomNav';
import { useStore } from '@/store/useStore';

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
    title: '经典老IP回归',
    subtitle: '重温热血经典 开启全新冒险',
    bg: 'linear-gradient(135deg, #4A90D9, #6DB3F2)',
    tag: 'HOT',
  },
  {
    title: '限时合成活动',
    subtitle: '合成稀有藏品 赢取限定好礼',
    bg: 'linear-gradient(135deg, #a855f7, #f472b6)',
    tag: 'NEW',
  },
  {
    title: '新人专享福利',
    subtitle: '注册即送盲盒 开启收藏之旅',
    bg: 'linear-gradient(135deg, #14b8a6, #22d3ee)',
    tag: '福利',
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
  const navigate = useNavigate();
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isVerified = useStore((s) => s.isVerified);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);

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

  return (
    <div className="page-container bg-neu-bg">
      {/* Banner 轮播 */}
      <div className="px-4 mt-3 mb-3">
        <div className="w-full h-40 rounded-lg-card neu-raised overflow-hidden relative">
          <div
            className="w-full h-full flex items-center px-6 relative transition-all duration-500 ease-in-out"
            style={{ background: banners[bannerIndex].bg }}
          >
            <div className="z-10">
              <p className="text-3xl font-bold text-white mb-1">
                {banners[bannerIndex].title}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">{banners[bannerIndex].subtitle}</span>
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                  {banners[bannerIndex].tag}
                </span>
              </div>
            </div>
            <span className="absolute right-3 top-2 text-white/20 text-xs font-bold rotate-12">
              藏锋ART
            </span>
            <span className="absolute right-8 bottom-3 text-white/15 text-4xl font-black">
              藏锋ART
            </span>
          </div>
          {/* 轮播指示器 */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === bannerIndex ? 'bg-white w-4' : 'bg-white/40'
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
      {/* 占位内容 */}
      <div className="flex-1 h-40" />

      <BottomNav />
    </div>
  );
}