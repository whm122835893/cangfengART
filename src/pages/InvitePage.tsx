import { useState } from 'react';
import { Link, Download, Copy, Check, Gift, Users, TrendingUp, Share2, ChevronRight } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

const rewards = [
  { count: 1, reward: '限量数字盲盒 x1', desc: '邀请1位好友注册' },
  { count: 3, reward: '稀有数字藏品 x1', desc: '邀请3位好友注册' },
  { count: 5, reward: '史诗数字藏品 x1', desc: '邀请5位好友注册' },
  { count: 10, reward: '传说级数字藏品 x1', desc: '邀请10位好友注册' },
];

const inviteRecords = [
  { name: '张**', time: '2026-07-10 14:30', status: '已注册' },
  { name: '李**', time: '2026-07-09 09:15', status: '已实名' },
  { name: '王**', time: '2026-07-08 16:42', status: '已注册' },
];

export default function InvitePage() {
  const user = useStore((s) => s.user);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'reward' | 'record'>('reward');

  const inviteCode = user.uid || '00000000';
  const inviteLink = `https://cangfeng.art/invite?code=${inviteCode}`;
  const invitedCount = inviteRecords.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="邀请好友" />

      {/* 顶部邀请统计 */}
      <div className="mx-4 mt-4">
        <div
          className="neu-raised rounded-lg-card p-5"
          style={{ background: 'linear-gradient(145deg, #6DB3F2, #4A90D9)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white/80 text-sm">已成功邀请</span>
              <span className="text-white text-4xl font-bold mt-1">{invitedCount}</span>
              <span className="text-white/70 text-xs mt-0.5">位好友</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 邀请码 */}
      <div className="mx-4 mt-4">
        <div className="neu-raised rounded-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-neu-text-primary">您的专属邀请码</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="text-accent-blue text-xs font-semibold flex items-center gap-0.5"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
          <div className="neu-inset rounded-2xl py-3 flex items-center justify-center">
            <span className="text-xl font-bold text-accent-blue font-mono tracking-widest">
              {inviteCode}
            </span>
          </div>
        </div>
      </div>

      {/* 邀请方式 */}
      <div className="mx-4 mt-4">
        <div className="neu-raised rounded-card p-4">
          <span className="text-sm font-semibold text-neu-text-primary block mb-3">
            邀请方式
          </span>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 neu-accent-blue rounded-2xl py-3 flex flex-col items-center gap-1 text-white"
            >
              <Link size={20} />
              <span className="text-xs font-semibold">{copied ? '已复制' : '复制链接'}</span>
            </button>
            <button className="flex-1 neu-raised rounded-2xl py-3 flex flex-col items-center gap-1 text-neu-text-primary">
              <Share2 size={20} />
              <span className="text-xs font-semibold">分享好友</span>
            </button>
            <button className="flex-1 neu-raised rounded-2xl py-3 flex flex-col items-center gap-1 text-neu-text-primary">
              <Download size={20} />
              <span className="text-xs font-semibold">下载海报</span>
            </button>
          </div>
        </div>
      </div>

      {/* 二维码 */}
      <div className="mx-4 mt-4">
        <div className="neu-raised rounded-card p-4 flex items-center gap-4">
          <div className="w-20 h-20 neu-raised rounded-2xl bg-white flex items-center justify-center relative shrink-0">
            <div className="grid grid-cols-5 gap-0.5">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i % 3 === 0 || i % 5 === 0 || i % 7 === 0 ? 'bg-black' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
            <div className="absolute w-6 h-6 rounded-full bg-black flex items-center justify-center">
              <span className="text-[6px] font-bold text-yellow-400">藏锋</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neu-text-primary">扫码下载藏锋ART</span>
            <span className="text-xs text-neu-text-muted mt-1">让好友扫描二维码注册</span>
            <span className="text-xs text-neu-text-muted">即可获得邀请奖励</span>
          </div>
        </div>
      </div>

      {/* 奖励/记录 Tab */}
      <div className="mx-4 mt-4">
        <div className="flex rounded-2xl neu-inset p-1 mb-3">
          <button
            onClick={() => setActiveTab('reward')}
            className={`flex-1 h-9 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reward' ? 'neu-raised text-accent-blue' : 'text-neu-text-muted'
            }`}
          >
            <Gift size={15} />
            邀请奖励
          </button>
          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 h-9 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'record' ? 'neu-raised text-accent-blue' : 'text-neu-text-muted'
            }`}
          >
            <TrendingUp size={15} />
            邀请记录
          </button>
        </div>

        {activeTab === 'reward' ? (
          /* 奖励列表 */
          <div className="flex flex-col gap-3">
            {rewards.map((item, i) => {
              const achieved = invitedCount >= item.count;
              return (
                <div
                  key={i}
                  className={`neu-raised rounded-card p-4 flex items-center gap-3 ${
                    achieved ? 'ring-2 ring-accent-blue/30' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      achieved ? 'neu-accent-blue' : 'neu-inset'
                    }`}
                  >
                    <Gift size={18} className={achieved ? 'text-white' : 'text-neu-text-muted'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-neu-text-primary block">
                      {item.reward}
                    </span>
                    <span className="text-xs text-neu-text-muted">{item.desc}</span>
                  </div>
                  {achieved ? (
                    <span className="text-xs text-accent-blue font-bold neu-pressed px-2 py-1 rounded-full">
                      已达成
                    </span>
                  ) : (
                    <span className="text-xs text-neu-text-muted">
                      {item.count - invitedCount}人待邀请
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* 邀请记录 */
          <div className="flex flex-col gap-2">
            {inviteRecords.length > 0 ? (
              inviteRecords.map((record, i) => (
                <div key={i} className="neu-raised rounded-card p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full neu-accent-blue flex items-center justify-center shrink-0">
                    <Users size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-neu-text-primary block">
                      {record.name}
                    </span>
                    <span className="text-xs text-neu-text-muted">{record.time}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      record.status === '已实名'
                        ? 'neu-pressed text-accent-blue'
                        : 'neu-raised text-neu-text-muted'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="neu-raised rounded-card p-8 flex flex-col items-center">
                <Users size={32} className="text-neu-text-muted mb-2" />
                <span className="text-sm text-neu-text-muted">暂无邀请记录</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 活动规则 */}
      <div className="mx-4 mt-4 mb-4">
        <div className="neu-raised rounded-card p-4">
          <div className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-semibold text-neu-text-primary">活动规则</span>
            <ChevronRight size={16} className="text-neu-text-muted" />
          </div>
          <div className="neu-divider my-3" />
          <div className="text-xs text-neu-text-secondary leading-relaxed space-y-1.5">
            <p>1. 邀请好友注册并完成实名认证，双方均可获得奖励。</p>
            <p>2. 奖励将在好友完成实名认证后自动发放至您的账户。</p>
            <p>3. 每个用户仅可被邀请一次，重复邀请无效。</p>
            <p>4. 活动最终解释权归藏锋ART平台所有。</p>
          </div>
        </div>
      </div>
    </div>
  );
}