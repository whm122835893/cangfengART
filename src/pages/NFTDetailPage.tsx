import { useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Copy, Diamond, Home } from 'lucide-react';
import { getNftById, getImageUrl, formatPrice, creatorInfo, brandInfo, storyText } from '@/data/nfts';
import { useStore } from '@/store/useStore';

export default function NFTDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const number = searchParams.get('number') || '#79361';
  const nft = getNftById(id);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isVerified = useStore((s) => s.isVerified);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);
  const listings = useStore((s) => s.listings);
  const consignAsset = useStore((s) => s.consignAsset);
  const hasOperationPassword = useStore((s) => s.hasOperationPassword);
  const verifyOperationPassword = useStore((s) => s.verifyOperationPassword);
  const showToast = useStore((s) => s.showToast);

  // 通过 from 参数区分入口：assets=仓库藏品（立即寄售），其他=发售/市场（立即购买）
  const from = searchParams.get('from');
  const isOwned = from === 'assets';
  // 判断该编号是否已在寄售中
  const isListed = listings.some((l) => l.nftId === nft.id && l.number === number);

  // 寄售弹窗状态
  const [showConsignModal, setShowConsignModal] = useState(false);
  const [consignPrice, setConsignPrice] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState(['', '', '', '', '', '']);
  const [paying, setPaying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 藏品不存在兜底
  if (!nft || nft.id !== id) {
    return (
      <div className="min-h-screen bg-neu-bg flex flex-col items-center justify-center px-6">
        <div className="neu-raised rounded-2xl p-8 flex flex-col items-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full neu-inset flex items-center justify-center mb-4">
            <Diamond size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-neu-text-primary mb-2">藏品不存在</h2>
          <p className="text-sm text-neu-text-muted text-center mb-6">
            您访问的藏品可能已下架或链接无效
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 h-11 rounded-full neu-accent-blue text-white font-bold text-sm"
          >
            <Home size={16} />
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const FEE_RATE = 0.03;
  const consignPriceNum = parseFloat(consignPrice) || 0;
  const fee = Math.round(consignPriceNum * FEE_RATE * 100) / 100;
  const income = Math.round((consignPriceNum - fee) * 100) / 100;

  const contractAddress = '0xb' + '*'.repeat(4) + '62e02a';

  const handleBuy = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!isVerified) {
      setShowVerifyModal(true);
      return;
    }
    navigate(`/payment/${nft.id}`);
  };

  const handleConsign = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!isVerified) {
      setShowVerifyModal(true);
      return;
    }
    setShowConsignModal(true);
  };

  const handleConsignConfirm = () => {
    // 寄售价格校验
    if (!consignPrice || consignPriceNum <= 0) {
      showToast('请输入有效的寄售价格', 'error');
      return;
    }
    // 交易密码前置检查
    if (!hasOperationPassword) {
      showToast('请先设置交易密码', 'error');
      navigate('/security');
      return;
    }
    setShowConsignModal(false);
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
    if (value && index === 5) {
      submitConsign(next.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !password[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitConsign = (pwd: string) => {
    if (pwd.length < 6) return;
    // 校验交易密码
    if (!verifyOperationPassword(pwd)) {
      showToast('交易密码错误', 'error');
      setPassword(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }
    setPaying(true);
    setTimeout(() => {
      const ok = consignAsset(nft.id, number, consignPriceNum);
      setPaying(false);
      setShowPasswordModal(false);
      if (!ok) {
        showToast('寄售失败，请重试', 'error');
        return;
      }
      showToast('寄售成功', 'success');
      setTimeout(() => {
        navigate(`/market/${nft.id}`, { replace: true });
      }, 1000);
    }, 1500);
  };

  const handlePasswordSubmit = () => {
    const pwd = password.join('');
    if (pwd.length === 6) submitConsign(pwd);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-neu-bg text-gray-800">
      <div className="relative w-full h-[360px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-125 blur-xl"
          style={{ backgroundImage: `url(${getImageUrl(nft.image, 'bg')})` }}
        />
        <div className="absolute inset-0 bg-neu-bg/30" />
        
        <div className="absolute top-0 left-1/4 w-[300px] h-[200px] opacity-30"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] opacity-40"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }} />
        <div className="absolute top-0 right-1/4 w-[300px] h-[200px] opacity-30"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }} />

        <div className="absolute left-1/2 -translate-x-1/2 top-[50px] z-10" style={{ perspective: '1000px' }}>
          <div className="relative animate-swing">
            <div className="absolute -inset-3 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(200,200,200,0.2) 100%)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.4)',
                transform: 'translateZ(-10px)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.3)',
              }}
            />
            <div className="absolute -inset-1.5 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,200,200,0.2) 50%, rgba(180,180,180,0.3) 100%)',
                backdropFilter: 'blur(2px)',
                border: '1px solid rgba(255,255,255,0.5)',
                transform: 'translateZ(-5px)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 12px rgba(0,0,0,0.2)',
              }}
            />
            <div
              className="w-[200px] h-[200px] bg-cover bg-center rounded-sm"
              style={{
                backgroundImage: `url(${getImageUrl(nft.image, 'cover')})`,
                transform: 'translateZ(0)',
                border: '2px solid rgba(255,255,255,0.6)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2), 0 0 30px rgba(255,255,255,0.1)',
              }}
            />
            <div className="absolute inset-0 rounded-sm pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.15) 100%)',
                transform: 'translateZ(1px)',
              }}
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[80px]">
          <div className="absolute bottom-0 left-0 right-0 h-[72px]"
            style={{
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 40%, #050505 100%)',
              borderLeft: '3px solid #333',
              borderRight: '3px solid #333',
            }}
          />
          <div className="absolute bottom-[40px] left-0 right-0 h-[32px]"
            style={{
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(180deg, #252525 0%, #151515 100%)',
              borderLeft: '2px solid #444',
              borderRight: '2px solid #444',
            }}
          />
          <div className="absolute bottom-[64px] left-[8%] right-[8%] h-[16px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 80%, transparent 100%)',
              filter: 'blur(1px)',
            }}
          />
          <div className="absolute bottom-[60px] left-[25%] w-[20px] h-[20px] rounded-full opacity-35"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }}
          />
          <div className="absolute bottom-[58px] left-[45%] w-[16px] h-[16px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
          />
          <div className="absolute bottom-[56px] right-[25%] w-[18px] h-[18px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
          />
          <div className="absolute bottom-[36px] left-[6%] right-[6%] h-[3px]"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)',
              background: 'linear-gradient(90deg, #6b4c00 0%, #b8860b 20%, #ffd700 50%, #b8860b 80%, #6b4c00 100%)',
              boxShadow: '0 0 8px rgba(218,165,32,0.5)',
            }}
          />
        </div>

        <button
          onClick={() => navigate(-1)}
          className="fixed top-4 left-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        <button
          onClick={() => setLiked(!liked)}
          className="fixed top-4 right-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={liked ? '#f59e0b' : 'none'}
            stroke={liked ? '#f59e0b' : '#374151'}
            strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      <div className="relative pt-10 pb-28 px-4">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-gray-900">{nft.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span>发行 {nft.issue} 份</span>
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            <span>流通 {nft.circulation} 份</span>
          </div>
        </div>

        <div className="neu-raised rounded-2xl p-4 mt-5">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500 text-sm">藏品编号</span>
            <span className="text-gray-900 text-lg font-bold">{number}</span>
          </div>
          <div className="w-full h-px bg-gray-200/60" />
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500 text-sm">合约地址</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 text-sm font-semibold">{contractAddress}</span>
              <button onClick={handleCopy} className="text-gray-400">
                <Copy size={14} />
              </button>
            </div>
          </div>
          
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-gray-300" />
            <div className="px-4 text-center">
              <div className="text-gray-400 text-xs tracking-[0.2em] mb-0.5">STORY</div>
              <div className="text-gray-900 text-lg font-bold">藏品故事</div>
            </div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {storyText}
          </div>
        </div>

        <div className="mt-6 flex items-center border-b border-gray-200">
          {['藏品信息', '相关公告'].map((tab, i) => (
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

        {activeTab === 0 && (
          <div className="mt-4 space-y-3">
            <div className="neu-raised rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Diamond size={20} className="text-blue-500" />
                  <div>
                    <div className="text-base font-bold text-gray-900">创作者</div>
                    <div className="text-xs text-gray-400 tracking-wider">ARTIST</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${creatorInfo.avatar})` }}
                  />
                  <span className="text-sm font-semibold text-gray-700">{creatorInfo.name}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {creatorInfo.bio}
              </div>
            </div>

            <div className="neu-raised rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Diamond size={20} className="text-blue-500" />
                  <div>
                    <div className="text-base font-bold text-gray-900">品牌方</div>
                    <div className="text-xs text-gray-400 tracking-wider">BRAND</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center bg-blue-500"
                    style={{ backgroundImage: `url(${brandInfo.logo})` }}
                  />
                  <span className="text-sm font-semibold text-gray-700">{brandInfo.name}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {brandInfo.desc}
              </div>
            </div>

            <div className="neu-raised rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Diamond size={20} className="text-blue-500" />
                <div>
                  <div className="text-base font-bold text-gray-900">藏品须知</div>
                  <div className="text-xs text-gray-400 tracking-wider">NOTICE</div>
                </div>
              </div>
              <div className="text-gray-500 text-sm font-light leading-relaxed">
                数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁，并小于60周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。请勿对数字藏品进行炒作、场外交易、欺诈，或以任何其他非法方式进行使用。
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="mt-4">
            <div className="neu-raised rounded-2xl p-8">
              <div className="text-gray-400 text-center text-sm">暂无相关公告</div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-neu-bg px-4 py-3 flex items-center gap-4 z-50 border-t-2 border-gray-300/60 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900">{formatPrice(nft.price)}</span>
          <button
            onClick={() => navigate(`/market/${nft.id}`)}
            className="flex items-center text-gray-400 text-xs"
          >
            前往市场 <ChevronRight size={12} />
          </button>
        </div>
        {isOwned ? (
          isListed ? (
            <button
              disabled
              className="flex-1 h-11 rounded-full neu-inset text-gray-400 text-base font-bold"
            >
              寄售中
            </button>
          ) : (
            <button
              onClick={handleConsign}
              className="flex-1 h-11 rounded-full neu-accent-orange text-white text-base font-bold"
            >
              立即寄售
            </button>
          )
        ) : (
          <button
            onClick={handleBuy}
            className="flex-1 h-11 rounded-full neu-raised text-blue-500 text-base font-bold"
          >
            立即购买
          </button>
        )}
      </div>

      {/* 复制提示 */}
      {copied && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2 bg-gray-800/80 text-white text-sm rounded-lg z-50">
          已复制
        </div>
      )}

      {/* 寄售价格弹窗 */}
      {showConsignModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={() => setShowConsignModal(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-6 px-4 animate-[flapIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

            <h2 className="text-center text-base font-bold text-neu-text-primary mb-1">寄售藏品</h2>
            <p className="text-center text-xs text-neu-text-muted mb-4">
              {nft.name} · 编号 {number}
            </p>

            {/* 寄售价格输入 */}
            <div className="neu-inset rounded-xl px-4 py-3 mb-3">
              <label className="text-xs text-neu-text-muted">寄售价格（元）</label>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-neu-text-primary">¥</span>
                <input
                  type="number"
                  value={consignPrice}
                  onChange={(e) => setConsignPrice(e.target.value)}
                  placeholder="请输入寄售价格"
                  className="flex-1 bg-transparent text-lg font-bold text-neu-text-primary outline-none placeholder:text-neu-text-muted/50 placeholder:text-sm placeholder:font-normal"
                />
              </div>
            </div>

            {/* 手续费明细 */}
            <div className="neu-raised rounded-xl p-3 space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neu-text-muted">寄售价格</span>
                <span className="text-sm font-semibold text-neu-text-primary">¥{consignPriceNum || '--'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neu-text-muted">
                  手续费 <span className="text-accent-blue">(3%)</span>
                </span>
                <span className="text-sm font-semibold text-functional-danger">-¥{consignPriceNum > 0 ? fee : '--'}</span>
              </div>
              <div className="neu-divider my-1" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neu-text-primary">实际到账</span>
                <span className="text-base font-bold text-accent-blue">¥{consignPriceNum > 0 ? income : '--'}</span>
              </div>
            </div>

            <button
              onClick={handleConsignConfirm}
              disabled={consignPriceNum <= 0}
              className="w-full h-12 rounded-full neu-accent-orange text-white font-bold text-base disabled:opacity-50"
            >
              确认寄售
            </button>
            <button
              onClick={() => setShowConsignModal(false)}
              className="w-full h-10 mt-2 text-sm text-neu-text-muted"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 交易密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center" onClick={() => !paying && setShowPasswordModal(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-8 px-4 animate-[flapIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

            <h2 className="text-center text-base font-bold text-neu-text-primary mb-1">输入交易密码</h2>
            <p className="text-center text-xs text-neu-text-muted mb-5">
              寄售 {nft.name} · ¥{consignPriceNum}
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
                  disabled={paying}
                  className="w-11 h-12 rounded-xl neu-inset text-center text-xl font-bold text-neu-text-primary outline-none focus:ring-2 focus:ring-accent-blue/40"
                />
              ))}
            </div>

            <button
              onClick={handlePasswordSubmit}
              disabled={password.join('').length < 6 || paying}
              className="w-full h-12 rounded-full neu-accent-orange text-white font-bold text-base disabled:opacity-50"
            >
              {paying ? '提交中...' : '确认寄售'}
            </button>

            <button
              onClick={() => !paying && setShowPasswordModal(false)}
              className="w-full h-10 mt-2 text-sm text-neu-text-muted"
              disabled={paying}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
