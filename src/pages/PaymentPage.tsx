import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Check, Diamond, Home } from 'lucide-react';
import { getNftById, getImageUrl, formatPrice } from '@/data/nfts';
import { useStore } from '@/store/useStore';

const paymentMethods = [
  { id: 'huifu', name: '汇付支付', desc: '汇付钱包余额支付', color: 'linear-gradient(145deg, #d4758a, #c44569)', label: '汇' },
  { id: 'yibao', name: '易宝支付', desc: '易宝钱包余额支付', color: 'linear-gradient(145deg, #70b080, #90cfa0)', label: '易' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const nft = getNftById(id);

  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isVerified = useStore((s) => s.isVerified);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);
  const addAsset = useStore((s) => s.addAsset);
  const addOrder = useStore((s) => s.addOrder);
  const updateWalletBalance = useStore((s) => s.updateWalletBalance);
  const hasOperationPassword = useStore((s) => s.hasOperationPassword);
  const verifyOperationPassword = useStore((s) => s.verifyOperationPassword);
  const showToast = useStore((s) => s.showToast);

  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('huifu');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState(['', '', '', '', '', '']);
  const [paying, setPaying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 权限校验
  useEffect(() => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      navigate(-1);
    } else if (!isVerified) {
      setShowVerifyModal(true);
      navigate(-1);
    }
  }, []);

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

  const unitPrice = nft.price ?? 0;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    // 交易密码前置检查
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
    // 6位输入完成自动提交
    if (value && index === 5) {
      submitPayment(next.join(''));
    } else if (!value && index === 5) {
      // 最后一位清空时不自动提交
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !password[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitPayment = (pwd: string) => {
    if (pwd.length < 6) return;
    // 校验交易密码
    if (!verifyOperationPassword(pwd)) {
      showToast('交易密码错误', 'error');
      setPassword(['', '', '', '', '', '']);
      setShowPasswordModal(false);
      return;
    }
    setPaying(true);
    // 模拟支付请求
    setTimeout(() => {
      setPaying(false);
      setShowPasswordModal(false);
      // 入库
      addAsset({
        nftId: nft.id,
        name: nft.name,
        image: nft.image,
        price: unitPrice,
        quantity,
      });
      // 创建订单
      addOrder({
        nftId: nft.id,
        name: nft.name,
        image: nft.image,
        price: unitPrice,
        quantity,
        type: 'sale',
        status: 'paid',
      });
      // 扣减钱包余额
      updateWalletBalance(-totalPrice);
      showToast('交易成功', 'success');
      setTimeout(() => {
        navigate('/assets', { replace: true });
      }, 1000);
    }, 1500);
  };

  const handlePasswordSubmit = () => {
    const pwd = password.join('');
    if (pwd.length === 6) {
      submitPayment(pwd);
    }
  };

  return (
    <div className="min-h-screen bg-neu-bg pb-24">
      {/* 顶部导航 */}
      <div className="flex items-center px-4 h-navbar sticky top-0 bg-neu-bg z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center"
        >
          <ChevronLeft size={18} className="text-accent-blue" />
        </button>
        <h1 className="text-lg font-bold text-neu-text-primary absolute left-1/2 -translate-x-1/2">
          确认订单
        </h1>
      </div>

      {/* 藏品信息卡片 */}
      <div className="mx-4 mt-3">
        <div className="neu-raised rounded-lg-card p-4 flex items-center gap-3">
          <div
            className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url(${getImageUrl(nft.image, 'cover')})` }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-neu-text-primary truncate">{nft.name}</h3>
            <p className="text-xs text-neu-text-muted mt-1">发行 {nft.issue} 份 · 流通 {nft.circulation} 份</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-accent-blue">{formatPrice(nft.price)}</p>
            <p className="text-[10px] text-neu-text-muted">单价</p>
          </div>
        </div>
      </div>

      {/* 购买份数 */}
      <div className="mx-4 mt-3">
        <div className="neu-raised rounded-lg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-neu-text-primary">购买份数</span>
              <p className="text-xs text-neu-text-muted mt-0.5">每人限购 5 份</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus size={16} className="text-neu-text-secondary" />
              </button>
              <span className="text-xl font-bold text-neu-text-primary w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(5, quantity + 1))}
                className="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center disabled:opacity-40"
                disabled={quantity >= 5}
              >
                <Plus size={16} className="text-neu-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 支付方式 */}
      <div className="mx-4 mt-3">
        <div className="neu-raised rounded-lg-card p-4">
          <span className="text-sm font-bold text-neu-text-primary">支付方式</span>
          <div className="mt-3 space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: method.color }}
                >
                  <span className="text-white font-bold text-sm">{method.label}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-neu-text-primary">{method.name}</div>
                  <div className="text-xs text-neu-text-muted">{method.desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === method.id
                    ? 'border-accent-blue bg-accent-blue'
                    : 'border-neu-text-muted/40'
                }`}>
                  {paymentMethod === method.id && <Check size={12} className="text-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 费用明细 */}
      <div className="mx-4 mt-3">
        <div className="neu-raised rounded-lg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neu-text-muted">藏品单价</span>
            <span className="text-sm font-semibold text-neu-text-primary">{formatPrice(nft.price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neu-text-muted">购买数量</span>
            <span className="text-sm font-semibold text-neu-text-primary">× {quantity}</span>
          </div>
          <div className="neu-divider my-1" />
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-neu-text-primary">实付金额</span>
            <span className="text-xl font-bold text-accent-blue">¥{totalPrice}</span>
          </div>
        </div>
      </div>

      {/* 底部确认按钮 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-neu-bg px-4 py-3 z-50 border-t border-neu-text-muted/10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-neu-text-primary">¥{totalPrice}</span>
            <span className="text-[10px] text-neu-text-muted">合计 {quantity} 份</span>
          </div>
          <button
            onClick={handleConfirm}
            className="flex-1 h-12 rounded-full neu-accent-blue text-white text-base font-bold"
          >
            确认订单
          </button>
        </div>
      </div>

      {/* 交易密码输入弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={() => !paying && setShowPasswordModal(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-8 px-4 animate-[flapIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽指示器 */}
            <div className="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

            <h2 className="text-center text-base font-bold text-neu-text-primary mb-1">输入交易密码</h2>
            <p className="text-center text-xs text-neu-text-muted mb-5">
              {paymentMethods.find((m) => m.id === paymentMethod)?.name} · 支付 ¥{totalPrice}
            </p>

            {/* 密码输入框 */}
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

            {/* 提交按钮 */}
            <button
              onClick={handlePasswordSubmit}
              disabled={password.join('').length < 6 || paying}
              className="w-full h-12 rounded-full neu-accent-blue text-white font-bold text-base disabled:opacity-50"
            >
              {paying ? '支付中...' : '确认支付'}
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
