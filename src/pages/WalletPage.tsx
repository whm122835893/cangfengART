import { useState } from 'react';
import { X, Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

type ActionType = 'recharge' | 'withdraw' | null;

export default function WalletPage() {
  const isVerified = useStore((s) => s.isVerified);
  const setShowVerifyModal = useStore((s) => s.setShowVerifyModal);
  const walletBalance = useStore((s) => s.walletBalance);
  const updateWalletBalance = useStore((s) => s.updateWalletBalance);
  const showToast = useStore((s) => s.showToast);

  const [showBalanceSheet, setShowBalanceSheet] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [amount, setAmount] = useState('');

  const formattedBalance = `¥${walletBalance.toLocaleString('zh-CN')}`;

  const handleWalletClick = () => {
    if (!isVerified) {
      setShowVerifyModal(true);
      return;
    }
    setShowBalanceSheet(true);
  };

  const closeBalanceSheet = () => {
    setShowBalanceSheet(false);
  };

  const openAction = (type: 'recharge' | 'withdraw') => {
    setActionType(type);
    setAmount('');
  };

  const closeAction = () => {
    setActionType(null);
    setAmount('');
  };

  const handleConfirmAction = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      showToast('请输入有效金额', 'error');
      return;
    }
    if (actionType === 'recharge') {
      updateWalletBalance(value);
      showToast('充值成功', 'success');
    } else if (actionType === 'withdraw') {
      if (value > walletBalance) {
        showToast('提现金额不能超过余额', 'error');
        return;
      }
      updateWalletBalance(-value);
      showToast('提现成功', 'success');
    }
    closeAction();
  };

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="我的钱包" />

      {/* 卡片1 - 汇付支付 */}
      <div className="mx-4 my-3">
        <div
          className="neu-raised rounded-lg-card p-5 h-36 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #d4758a, #c44569)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-raised rounded-full bg-white flex items-center justify-center">
              <span className="text-base font-bold text-accent-blue">汇</span>
            </div>
            <span className="text-white font-bold">汇付支付</span>
          </div>
          <button onClick={handleWalletClick} className="absolute bottom-5 right-5 neu-accent rounded-full px-5 py-2 text-white font-semibold text-sm">
            进入钱包
          </button>
        </div>
      </div>

      {/* 卡片2 - 易宝支付 */}
      <div className="mx-4 my-3">
        <div
          className="neu-raised rounded-lg-card p-5 h-36 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #70b080, #90cfa0)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-raised rounded-full bg-white flex items-center justify-center">
              <span className="text-base font-bold text-accent-green">易</span>
            </div>
            <div>
              <span className="text-white font-bold">易宝支付</span>
              <span className="block text-xs text-white/70">YIBAOZHIFU</span>
            </div>
          </div>
          <button onClick={handleWalletClick} className="absolute bottom-5 right-5 neu-accent-green rounded-full px-5 py-2 text-white font-semibold text-sm">
            进入钱包
          </button>
        </div>
      </div>

      {/* 钱包余额卡片 */}
      <div className="mx-4 my-3">
        <div className="neu-raised rounded-lg-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 neu-raised rounded-full flex items-center justify-center">
              <WalletIcon size={20} className="text-accent-blue" />
            </div>
            <span className="text-neu-text-primary font-bold">钱包余额</span>
          </div>
          <p className="text-3xl font-bold text-accent-blue">{formattedBalance}</p>
          <p className="text-xs text-neu-text-muted mt-1">可用余额</p>
        </div>
      </div>

      {/* 余额明细底部弹窗 */}
      {showBalanceSheet && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center"
          onClick={closeBalanceSheet}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-[430px] bg-neu-bg rounded-t-2xl pt-4 pb-6 px-4 animate-[flapIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽指示器 */}
            <div className="w-10 h-1 bg-neu-text-muted/30 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neu-text-primary">余额明细</h3>
              <button onClick={closeBalanceSheet}>
                <X size={20} className="text-neu-text-muted" />
              </button>
            </div>

            {/* 余额展示 */}
            <div className="neu-inset rounded-2xl p-5 mb-5">
              <p className="text-xs text-neu-text-muted mb-1">钱包余额</p>
              <p className="text-3xl font-bold text-accent-blue">{formattedBalance}</p>
            </div>

            {/* 充值 / 提现 */}
            <div className="flex gap-3">
              <button
                onClick={() => openAction('recharge')}
                className="flex-1 h-12 neu-accent-blue rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
              >
                <ArrowDownToLine size={18} />
                充值
              </button>
              <button
                onClick={() => openAction('withdraw')}
                className="flex-1 h-12 neu-raised rounded-2xl text-accent-blue font-bold text-base flex items-center justify-center gap-2"
              >
                <ArrowUpFromLine size={18} />
                提现
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 充值 / 提现输入弹窗 */}
      {actionType && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center" onClick={closeAction}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative neu-raised bg-neu-bg rounded-lg-card w-[320px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeAction} className="absolute top-4 right-4">
              <X size={20} className="text-neu-text-muted" />
            </button>
            <h3 className="text-lg font-bold text-neu-text-primary mb-2 text-center">
              {actionType === 'recharge' ? '充值' : '提现'}
            </h3>
            <p className="text-xs text-neu-text-muted mb-4 text-center">
              当前余额：{formattedBalance}
            </p>
            <div className="neu-inset rounded-2xl px-4 h-12 flex items-center mb-6">
              <span className="text-base font-bold text-neu-text-primary mr-1">¥</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="请输入金额"
                className="flex-1 h-full bg-transparent outline-none text-sm text-neu-text-primary placeholder:text-neu-text-muted"
              />
            </div>
            <button
              onClick={handleConfirmAction}
              disabled={!amount}
              className="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base disabled:opacity-50"
            >
              确认{actionType === 'recharge' ? '充值' : '提现'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
