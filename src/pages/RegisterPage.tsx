import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Phone, Shield, Loader2 } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

interface FieldErrors {
  phone?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
  agreement?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [codeCountdown, setCodeCountdown] = useState(0);

  // 清理倒计时
  useEffect(() => {
    if (codeCountdown <= 0) return;
    const timer = setInterval(() => {
      setCodeCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [codeCountdown]);

  const validatePhone = (v: string) => {
    if (!v.trim()) return '请输入手机号';
    if (!/^1[3-9]\d{9}$/.test(v)) return '请输入正确的11位手机号';
    return '';
  };

  const validateCode = (v: string) => {
    if (!v.trim()) return '请输入验证码';
    if (!/^\d{6}$/.test(v)) return '请输入6位数字验证码';
    return '';
  };

  const validatePassword = (v: string) => {
    if (!v) return '请设置登录密码';
    if (v.length < 8) return '密码至少8位';
    if (!/[a-zA-Z]/.test(v)) return '密码需包含字母';
    if (!/\d/.test(v)) return '密码需包含数字';
    return '';
  };

  const handleSendCode = () => {
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setErrors((prev) => ({ ...prev, phone: phoneErr }));
      return;
    }
    setErrors((prev) => ({ ...prev, phone: '' }));
    setCodeCountdown(60);
  };

  const handleRegister = () => {
    const newErrors: FieldErrors = {};

    newErrors.phone = validatePhone(phone);
    newErrors.code = validateCode(code);
    newErrors.password = validatePassword(password);

    if (!confirmPassword) {
      newErrors.confirmPassword = '请再次输入密码';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    if (!agreed) {
      newErrors.agreement = '请先阅读并同意相关协议';
    }

    const hasError = Object.values(newErrors).some(Boolean);
    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    // 模拟注册请求
    setTimeout(() => {
      login();
      setLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="page-container-no-nav bg-neu-bg flex flex-col min-h-screen">
      {/* 顶部导航栏 */}
      <NavBar title="注册" />

      {/* 表单区域 */}
      <div className="flex flex-col px-6 mt-4" style={{ gap: '22px' }}>
        {/* 1. 手机号 */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-neu-text-primary">
            请输入您的手机号
          </label>
          <span className="text-xs text-neu-text-muted mt-0.5">
            用于接收验证码和账户安全验证
          </span>
          <div className={`flex items-center h-12 mt-2 rounded-2xl bg-neu-bg ${errors.phone ? 'neu-inset ring-2 ring-red-400' : 'neu-inset'}`}>
            <Phone size={18} className="ml-4 text-neu-text-muted flex-shrink-0" />
            <input
              type="tel"
              maxLength={11}
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, phone: '' })); }}
              placeholder="请输入手机号"
              className="flex-1 bg-transparent ml-2.5 mr-4 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
              style={{ border: 'none' }}
            />
          </div>
          {errors.phone && (
            <span className="text-xs text-red-400 mt-1.5 ml-2">{errors.phone}</span>
          )}
        </div>

        {/* 2. 验证码 */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-neu-text-primary">
            发送验证码
          </label>
          <span className="text-xs text-neu-text-muted mt-0.5">
            验证码将发送至您的手机
          </span>
          <div className="flex items-center gap-3 mt-2">
            <div className={`flex-1 flex items-center h-12 rounded-2xl bg-neu-bg ${errors.code ? 'neu-inset ring-2 ring-red-400' : 'neu-inset'}`}>
              <Shield size={18} className="ml-4 text-neu-text-muted flex-shrink-0" />
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, code: '' })); }}
                placeholder="请输入验证码"
                className="flex-1 bg-transparent ml-2.5 mr-4 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
                style={{ border: 'none' }}
              />
            </div>
            <button
              onClick={handleSendCode}
              disabled={codeCountdown > 0}
              className={`h-12 px-4 rounded-2xl text-sm font-bold flex-shrink-0 transition-all ${
                codeCountdown > 0
                  ? 'neu-inset text-neu-text-muted'
                  : 'neu-raised text-accent-blue'
              }`}
              type="button"
            >
              {codeCountdown > 0 ? `${codeCountdown}s` : '发送验证码'}
            </button>
          </div>
          {errors.code && (
            <span className="text-xs text-red-400 mt-1.5 ml-2">{errors.code}</span>
          )}
        </div>

        {/* 3. 密码 */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-neu-text-primary">
            设置登录密码
          </label>
          <span className="text-xs text-neu-text-muted mt-0.5">
            密码至少8位，包含数字和字母，可选特殊符号
          </span>
          <div className={`flex items-center h-12 mt-2 rounded-2xl bg-neu-bg ${errors.password ? 'neu-inset ring-2 ring-red-400' : 'neu-inset'}`}>
            <Lock size={18} className="ml-4 text-neu-text-muted flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
              placeholder="请输入登录密码"
              className="flex-1 bg-transparent ml-2.5 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
              style={{ border: 'none' }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="mr-4 text-neu-text-muted flex-shrink-0"
              type="button"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-400 mt-1.5 ml-2">{errors.password}</span>
          )}
        </div>

        {/* 4. 确认密码 */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-neu-text-primary">
            再次确认登录密码
          </label>
          <div className={`flex items-center h-12 mt-2 rounded-2xl bg-neu-bg ${errors.confirmPassword ? 'neu-inset ring-2 ring-red-400' : 'neu-inset'}`}>
            <Lock size={18} className="ml-4 text-neu-text-muted flex-shrink-0" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })); }}
              placeholder="请再次输入登录密码"
              className="flex-1 bg-transparent ml-2.5 text-base text-neu-text-primary placeholder-neu-text-muted outline-none"
              style={{ border: 'none' }}
            />
            <button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="mr-4 text-neu-text-muted flex-shrink-0"
              type="button"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-red-400 mt-1.5 ml-2">{errors.confirmPassword}</span>
          )}
        </div>
      </div>

      {/* 主按钮 */}
      <div className="px-6 mt-8">
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full h-[52px] rounded-btn text-white text-lg font-bold transition-all flex items-center justify-center gap-2 ${
            loading ? 'neu-inset opacity-70' : 'neu-accent-blue'
          }`}
        >
          {loading && <Loader2 size={20} className="animate-spin" />}
          {loading ? '注册中...' : '立即注册'}
        </button>
      </div>

      {/* 底部协议区 */}
      <div className="flex flex-col px-6 mt-5 pb-8">
        {errors.agreement && (
          <span className="text-xs text-red-400 mb-2 ml-2">{errors.agreement}</span>
        )}
        <div className="flex items-start">
          <button
            onClick={() => { setAgreed(!agreed); setErrors((p) => ({ ...p, agreement: '' })); }}
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ border: 'none', background: 'none', padding: 0 }}
            type="button"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                agreed ? 'neu-inset' : 'neu-raised'
              }`}
            >
              {agreed && (
                <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
              )}
            </div>
          </button>
          <span className="ml-2 text-xs text-neu-text-primary leading-relaxed">
            已阅读并同意
            <span className="text-accent-blue cursor-pointer">《用户协议》</span>
            <span className="text-accent-blue cursor-pointer">《隐私政策》</span>
            <span className="text-accent-blue cursor-pointer">《平台交易细则》</span>
            <span className="text-accent-blue cursor-pointer">《风险揭示书》</span>
          </span>
        </div>
      </div>
    </div>
  );
}