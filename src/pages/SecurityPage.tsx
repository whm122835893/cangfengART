import { useState } from 'react';
import { ChevronRight, X, Shield } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

type ModalType = 'operation' | 'loginPassword' | null;

export default function SecurityPage() {
  const hasOpPassword = useStore((s) => s.hasOperationPassword);
  const setStoreOperationPassword = useStore((s) => s.setOperationPassword);
  const showToast = useStore((s) => s.showToast);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [operationPassword, setOperationPassword] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const closeModal = () => {
    setModalType(null);
    setCode('');
    setNewPassword('');
    setOperationPassword('');
    setConfirmCode('');
    setShowSuccess(false);
  };

  const handleSendCode = () => {
    setCode('123456');
  };

  const handleSubmitLoginPassword = () => {
    if (newPassword.length >= 8 && code) {
      setShowSuccess(true);
      setTimeout(closeModal, 1500);
    }
  };

  const handleSubmitOperationPassword = () => {
    if (operationPassword.length === 6 && /^\d{6}$/.test(operationPassword) && confirmCode === operationPassword) {
      setStoreOperationPassword(operationPassword);
      showToast('设置成功', 'success');
      setShowSuccess(true);
      setTimeout(closeModal, 1500);
    }
  };

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="安全设置" />

      <div className="mx-4 mt-4 neu-raised rounded-card overflow-hidden">
        {/* 设置操作密码 */}
        <div
          className="flex items-center justify-between h-14 px-4 cursor-pointer"
          onClick={() => setModalType('operation')}
        >
          <span className="text-base font-semibold text-neu-text-primary">
            {hasOpPassword ? '修改操作密码' : '设置操作密码'}
          </span>
          <ChevronRight size={18} className="text-neu-text-muted" />
        </div>
        <div className="neu-divider" />

        {/* 修改登录密码 */}
        <div
          className="flex items-center justify-between h-14 px-4 cursor-pointer"
          onClick={() => setModalType('loginPassword')}
        >
          <span className="text-base font-semibold text-neu-text-primary">修改登录密码</span>
          <ChevronRight size={18} className="text-neu-text-muted" />
        </div>
        <div className="neu-divider" />

        {/* 账号注销 */}
        <div
          className="flex items-center justify-between h-14 px-4 cursor-pointer"
          onClick={() => showToast('功能开发中', 'info')}
        >
          <span className="text-base font-semibold text-neu-text-primary">账号注销</span>
          <ChevronRight size={18} className="text-neu-text-muted" />
        </div>
      </div>

      {/* 弹窗遮罩 */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="neu-raised bg-neu-bg rounded-lg-card w-[320px] p-6 relative">
            <button onClick={closeModal} className="absolute top-4 right-4">
              <X size={20} className="text-neu-text-muted" />
            </button>

            {showSuccess ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-14 h-14 rounded-full neu-accent-green flex items-center justify-center mb-4">
                  <Shield size={28} className="text-white" />
                </div>
                <p className="text-base font-bold text-neu-text-primary">设置成功</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-neu-text-primary mb-4 text-center">
                  {modalType === 'operation' ? (hasOpPassword ? '修改操作密码' : '设置操作密码') : '修改登录密码'}
                </h3>

                {modalType === 'operation' ? (
                  <>
                    {/* 验证码 */}
                    <label className="text-sm font-semibold text-neu-text-primary mb-1 block">验证码</label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="请输入验证码"
                        maxLength={6}
                        className="flex-1 h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
                      />
                      <button
                        onClick={handleSendCode}
                        className="h-10 px-4 neu-accent-blue rounded-2xl text-white text-sm font-semibold shrink-0"
                      >
                        发送验证码
                      </button>
                    </div>

                    {/* 设置6位操作密码 */}
                    <label className="text-sm font-semibold text-neu-text-primary mb-1 block">设置6位操作密码</label>
                    <input
                      type="password"
                      value={operationPassword}
                      onChange={(e) => setOperationPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="请输入6位数字密码"
                      maxLength={6}
                      className="w-full h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none mb-4"
                    />

                    {/* 确认密码 */}
                    <label className="text-sm font-semibold text-neu-text-primary mb-1 block">确认操作密码</label>
                    <input
                      type="password"
                      value={confirmCode}
                      onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="请再次输入操作密码"
                      maxLength={6}
                      className="w-full h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none mb-6"
                    />

                    <button
                      onClick={handleSubmitOperationPassword}
                      disabled={!code || operationPassword.length !== 6 || confirmCode !== operationPassword}
                      className="w-full h-11 neu-accent-blue rounded-2xl text-white font-bold text-base disabled:opacity-50"
                    >
                      确认设置
                    </button>
                  </>
                ) : (
                  <>
                    {/* 验证码 */}
                    <label className="text-sm font-semibold text-neu-text-primary mb-1 block">验证码</label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="请输入验证码"
                        maxLength={6}
                        className="flex-1 h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
                      />
                      <button
                        onClick={handleSendCode}
                        className="h-10 px-4 neu-accent-blue rounded-2xl text-white text-sm font-semibold shrink-0"
                      >
                        发送验证码
                      </button>
                    </div>

                    {/* 新密码 */}
                    <label className="text-sm font-semibold text-neu-text-primary mb-1 block">新登录密码</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="至少8位，包含数字和字母"
                      className="w-full h-10 neu-inset rounded-2xl px-3 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none mb-6"
                    />

                    <button
                      onClick={handleSubmitLoginPassword}
                      disabled={!code || newPassword.length < 8}
                      className="w-full h-11 neu-accent-blue rounded-2xl text-white font-bold text-base disabled:opacity-50"
                    >
                      确认修改
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}