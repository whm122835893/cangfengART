import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

export default function VerificationPage() {
  const navigate = useNavigate();
  const isVerified = useStore((s) => s.isVerified);
  const setVerified = useStore((s) => s.setVerified);
  const updateUser = useStore((s) => s.updateUser);
  const showToast = useStore((s) => s.showToast);

  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const isIdNumberValid = (value: string) => /^\d{17}[\dXx]$/.test(value);

  const handleSubmit = () => {
    if (!name || idNumber.length !== 18) return;
    if (!isIdNumberValid(idNumber)) {
      showToast('身份证号格式不正确', 'error');
      return;
    }
    updateUser({ realName: name, idNumber: idNumber.toUpperCase() });
    setVerified(true);
    showToast('认证成功', 'success');
    setTimeout(() => navigate(-1), 1200);
  };

  if (isVerified) {
    return (
      <div className="page-container bg-neu-bg">
        <NavBar title="实名认证" />
        <div className="flex flex-col items-center justify-center pt-24">
          <div className="w-20 h-20 rounded-full neu-accent-green flex items-center justify-center mb-6">
            <Shield size={36} className="text-white" />
          </div>
          <p className="text-lg font-bold text-neu-text-primary mb-2">已认证</p>
          <p className="text-sm text-neu-text-muted">您的账号已完成实名认证</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="实名认证" />

      <div className="px-4 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full neu-raised flex items-center justify-center">
            <Shield size={24} className="text-accent-blue" />
          </div>
          <div>
            <p className="text-base font-bold text-neu-text-primary">实名认证</p>
            <p className="text-xs text-neu-text-muted">完成认证，解锁更多权益</p>
          </div>
        </div>

        {/* 姓名 */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-neu-text-primary mb-2 block">真实姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入真实姓名"
            className="w-full h-12 neu-inset rounded-2xl px-4 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
          />
        </div>

        {/* 身份证号 */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-neu-text-primary mb-2 block">身份证号码</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="请输入18位身份证号码"
            maxLength={18}
            className="w-full h-12 neu-inset rounded-2xl px-4 text-sm text-neu-text-primary placeholder-neu-text-muted outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name || idNumber.length !== 18}
          className="w-full h-12 neu-accent-blue rounded-2xl text-white font-bold text-base disabled:opacity-50"
        >
          提交认证
        </button>
      </div>
    </div>
  );
}