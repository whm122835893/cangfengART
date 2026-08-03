import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Lock, ChevronRight } from 'lucide-react';
import { getNftById, getImageUrl, sellList } from '@/data/nfts';
import { useStore } from '@/store/useStore';

type MarketListing = {
  id: string;
  number: string;
  price: number;
  wallet: string;
  isMine: boolean;
};

export default function MarketDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const collection = getNftById(id);
  const [liked, setLiked] = useState(false);
  const userListings = useStore((s) => s.listings.filter((l) => l.nftId === id));

  const cancelListing = useStore((s) => s.cancelListing);
  const buyListing = useStore((s) => s.buyListing);
  const addOrder = useStore((s) => s.addOrder);
  const showToast = useStore((s) => s.showToast);
  const hasOperationPassword = useStore((s) => s.hasOperationPassword);
  const verifyOperationPassword = useStore((s) => s.verifyOperationPassword);

  // 购买流程状态
  const [purchaseListing, setPurchaseListing] = useState<MarketListing | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 合并静态挂单 + 用户寄售挂单
  const allListings: MarketListing[] = [
    ...userListings.map((l) => ({ id: l.id, number: l.number, price: l.price, wallet: l.seller, isMine: true })),
    ...sellList.map((l) => ({ ...l, isMine: false })),
  ];

  // getNftById 判空兜底：getNftById 未命中时会回退到 nfts[0]，通过 id 不一致判断藏品不存在
  if (!collection || collection.id !== id) {
    return (
      <div className="page-container bg-neu-bg flex flex-col min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-4 left-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
        >
          <ChevronLeft size={22} className="text-gray-700" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-neu-text-primary">藏品不存在</p>
          <p className="text-sm text-neu-text-muted mt-2">该藏品可能已下架或链接有误</p>
          <button
            onClick={() => navigate('/market')}
            className="mt-6 px-6 h-11 rounded-full neu-accent-blue text-white text-sm font-bold"
          >
            返回市场
          </button>
        </div>
      </div>
    );
  }

  // 取消寄售
  const handleCancelListing = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    if (window.confirm('确认取消寄售？')) {
      cancelListing(listingId);
      showToast('已取消寄售', 'success');
    }
  };

  // 点击挂单：自己的不可跳转，别人的进入购买流程
  const handleListingClick = (item: MarketListing) => {
    if (item.isMine) return;
    setPurchaseListing(item);
  };

  // 确认购买：校验是否已设置交易密码
  const handleConfirmPurchase = () => {
    if (!hasOperationPassword) {
      showToast('请先设置交易密码', 'error');
      navigate('/security');
      return;
    }
    setShowPasswordModal(true);
    setPassword(['', '', '', '', '', '']);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handlePasswordChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...password];
    next[index] = value;
    setPassword(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // 6 位输入完成自动校验
    if (value && index === 5) {
      submitPurchase(next.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !password[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitPurchase = (pwd: string) => {
    if (pwd.length < 6 || !purchaseListing) return;
    if (!verifyOperationPassword(pwd)) {
      showToast('密码错误', 'error');
      setPassword(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      return;
    }
    // 密码正确，执行购买
    buyListing(purchaseListing.id, collection.name, getImageUrl(collection.image, 'cover'));
    addOrder({
      nftId: id!,
      name: collection.name,
      image: collection.image,
      number: purchaseListing.number,
      price: purchaseListing.price,
      quantity: 1,
      type: 'market',
      status: 'paid',
    });
    showToast('购买成功', 'success');
    setShowPasswordModal(false);
    setPurchaseListing(null);
  };

  const handlePasswordSubmit = () => {
    const pwd = password.join('');
    if (pwd.length === 6) submitPurchase(pwd);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPassword(['', '', '', '', '', '']);
  };

  const closePurchaseModal = () => {
    setPurchaseListing(null);
  };

  return (
    <div className="page-container bg-neu-bg flex flex-col min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
      >
        <ChevronLeft size={22} className="text-gray-700" />
      </button>

      <button
        onClick={() => setLiked(!liked)}
        className={`fixed top-4 right-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50 ${
          liked ? 'bg-amber-50' : ''
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill={liked ? '#f59e0b' : 'none'}
          stroke={liked ? '#f59e0b' : '#374151'}
          strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      <div className="relative shrink-0">
        <div
          className="w-full h-[280px] bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl(collection.image, 'bg')})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neu-bg" />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-[120px] z-10">
          <div
            className="w-[120px] h-[120px] rounded-2xl bg-cover bg-center shadow-lg border-2 border-white"
            style={{ backgroundImage: `url(${getImageUrl(collection.image, 'cover')})` }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-12 px-4 -mt-[10px] relative z-20">
        <h1 className="text-xl font-bold text-gray-900">{collection.name}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <span>发行 {collection.issue} 份</span>
          <span>|</span>
          <span>流通 {collection.circulation} 份</span>
        </div>
      </div>

      <div className="flex items-center px-4 mt-6 border-b border-gray-100">
        {['挂单列表', '相关公告'].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`relative h-10 mr-6 text-base font-semibold ${
              i === activeTab ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {tab}
            {i === activeTab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center px-4 mt-3 gap-4">
        {['寄售', '求购'].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setSubTab(i)}
            className={`flex items-center gap-1 text-sm font-semibold ${
              i === subTab ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {tab}
            {i === 1 && <Lock size={14} />}
          </button>
        ))}
      </div>

      <div className="flex items-center px-4 mt-3 text-xs text-gray-400">
        <span className="flex-1 font-semibold">藏品名称 | 编号</span>
        <span className="w-16 text-right font-semibold">价格</span>
        <span className="w-14 text-right font-semibold">编号</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {allListings.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => handleListingClick(item)}
            className={`neu-raised rounded-xl flex items-center p-3 ${idx === 0 ? 'mt-2' : ''} mb-3 ${
              item.isMine ? 'ring-1 ring-accent-blue/30' : 'cursor-pointer'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{collection.name}</span>
                {item.isMine && (
                  <span className="text-[10px] text-white bg-accent-blue px-1.5 py-0.5 rounded font-bold">我的</span>
                )}
              </div>
              <span className="inline-block mt-1 px-3 py-1 text-xs font-bold text-blue-600 neu-inset rounded-lg border border-blue-200/50">
                {item.number}
              </span>
            </div>

            <div className="w-20 flex flex-col items-end">
              <span className="text-lg font-bold text-gray-900">¥ {item.price}</span>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
                <span>支付钱包:</span>
                <span className="px-1 py-0.5 bg-gray-100 rounded text-gray-500">{item.wallet}</span>
              </div>
            </div>

            {item.isMine ? (
              <button
                onClick={(e) => handleCancelListing(e, item.id)}
                className="ml-2 px-2.5 py-1.5 rounded-full neu-raised text-functional-danger text-xs font-bold whitespace-nowrap shrink-0"
              >
                取消寄售
              </button>
            ) : (
              <div className="w-8 flex items-center justify-end">
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-3 left-3 right-3 flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 z-50" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <button
          onClick={() => showToast('功能开发中', 'info')}
          className="flex-1 h-12 rounded-full neu-raised text-blue-500 text-base font-bold"
        >
          发布求购
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 h-12 rounded-full neu-raised text-gray-600 text-base font-bold"
        >
          前往发售
        </button>
      </div>

      {/* 购买信息弹窗 */}
      {purchaseListing && !showPasswordModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center"
          onClick={closePurchaseModal}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-8 px-4 animate-[flapIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />
            <h2 className="text-center text-base font-bold text-neu-text-primary mb-4">确认购买</h2>

            <div className="neu-raised rounded-card p-4 flex items-center gap-3 mb-5">
              <div
                className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${getImageUrl(collection.image, 'cover')})` }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-neu-text-primary truncate">{collection.name}</h3>
                <p className="text-xs text-neu-text-muted mt-1">编号 {purchaseListing.number}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-accent-blue">¥{purchaseListing.price}</p>
              </div>
            </div>

            <button
              onClick={handleConfirmPurchase}
              className="w-full h-12 rounded-full neu-accent-blue text-white font-bold text-base"
            >
              确认购买
            </button>
            <button
              onClick={closePurchaseModal}
              className="w-full h-10 mt-2 text-sm text-neu-text-muted"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 交易密码输入弹窗 */}
      {showPasswordModal && purchaseListing && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center"
          onClick={closePasswordModal}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-8 px-4 animate-[flapIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />
            <h2 className="text-center text-base font-bold text-neu-text-primary mb-1">输入交易密码</h2>
            <p className="text-center text-xs text-neu-text-muted mb-5">
              {collection.name} · 编号 {purchaseListing.number} · 支付 ¥{purchaseListing.price}
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {password.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePasswordChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 rounded-xl neu-inset text-center text-xl font-bold text-neu-text-primary outline-none focus:ring-2 focus:ring-accent-blue/40"
                />
              ))}
            </div>

            <button
              onClick={handlePasswordSubmit}
              disabled={password.join('').length < 6}
              className="w-full h-12 rounded-full neu-accent-blue text-white font-bold text-base disabled:opacity-50"
            >
              确认支付
            </button>
            <button
              onClick={closePasswordModal}
              className="w-full h-10 mt-2 text-sm text-neu-text-muted"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
