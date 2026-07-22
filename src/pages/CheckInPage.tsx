import { useState, useEffect } from 'react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

export default function CheckInPage() {
  const [count, setCount] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const isVerified = useStore((s) => s.isVerified);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('checkin');
    if (saved) {
      const { date, days } = JSON.parse(saved);
      if (date === today) {
        setCheckedInToday(true);
        setCount(days);
      } else {
        // 检查是否连续签到（昨天）
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (date === yesterday) {
          setCount(days);
        }
        // 如果断签则重置为0
      }
    }
  }, []);

  const handleCheckIn = () => {
    if (!isVerified) {
      setShowVerifyModal(true);
      return;
    }
    if (animating || checkedInToday) return;
    setAnimating(true);
    const target = count + 1;
    let current = count;
    const timer = setInterval(() => {
      current += 1;
      if (current >= target) {
        clearInterval(timer);
        setCount(target);
        setAnimating(false);
        setCheckedInToday(true);
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('checkin', JSON.stringify({ date: today, days: target }));
      } else {
        setCount(current);
      }
    }, 100);
  };

  const digits = String(count).padStart(3, '0').split('');

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="签到活动" />

      {/* 主签到卡片 */}
      <div className="mx-4 mt-4">
        <div className="neu-raised rounded-lg-card p-6 flex flex-col items-center">
          <p className="text-sm text-neu-text-muted font-semibold mb-4">
            {checkedInToday ? '今日已签到' : '已连续签到'}
          </p>

          {/* 数字翻牌计数器 */}
          <div className="flex items-center gap-2 mb-6">
            {digits.map((d, i) => (
              <div
                key={i}
                className={`w-12 h-14 neu-inset rounded-xl flex items-center justify-center ${
                  animating ? 'flap-animate' : ''
                }`}
              >
                <span className="text-[32px] font-bold text-accent-blue">{d}</span>
              </div>
            ))}
            <span className="text-base text-neu-text-primary font-semibold ml-1">天</span>
          </div>

          {/* 签到按钮 */}
          <div className="neu-raised rounded-2xl p-1 w-full">
            <button
              onClick={handleCheckIn}
              disabled={checkedInToday}
              className={`w-full h-12 rounded-2xl text-white font-bold text-base transition-all ${
                checkedInToday
                  ? 'neu-inset text-neu-text-muted bg-neu-bg'
                  : 'neu-accent-blue neu-interactive'
              }`}
            >
              {checkedInToday ? '今日已签到' : '立即签到'}
            </button>
          </div>
        </div>
      </div>

      {/* 活动说明卡片 */}
      <div className="mx-4 mt-4">
        <div className="neu-raised rounded-lg-card p-5">
          <h3 className="text-base font-bold text-neu-text-primary mb-3">活动说明</h3>
          <div className="neu-divider mb-3" />
          <div className="text-sm text-neu-text-secondary leading-relaxed space-y-2 font-semibold">
            <p>1. 每日签到可获得积分奖励，连续签到天数越多奖励越丰厚。</p>
            <p>2. 签到获得的积分可在积分商城兑换精美数字藏品。</p>
            <p>3. 如中途断签，连续签到天数将重新计算。</p>
            <p>4. 每人每天仅可签到一次。</p>
            <p>5. 活动最终解释权归藏锋ART平台所有。</p>
          </div>
        </div>
      </div>
    </div>
  );
}