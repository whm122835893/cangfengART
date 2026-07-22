import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import NavBar from '@/components/common/NavBar';
import { useStore } from '@/store/useStore';

interface FieldErrors {
  phone?: string;
  password?: string;
  code?: string;
  agreement?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loginMode, setLoginMode] = useState<'password' | 'code'>('password');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [codeCountdown, setCodeCountdown] = useState(0);

  const validatePhone = (v: string) => {
    if (!v.trim()) return '请输入手机号';
    if (!/^1[3-9]\d{9}$/.test(v)) return '请输入正确的11位手机号';
    return '';
  };

  const validatePassword = (v: string) => {
    if (!v) return '请输入密码';
    if (v.length < 8) return '密码至少8位';
    return '';
  };

  const validateCode = (v: string) => {
    if (!v.trim()) return '请输入验证码';
    if (!/^\d{6}$/.test(v)) return '请输入6位数字验证码';
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
    const timer = setInterval(() => {
      setCodeCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = () => {
    const newErrors: FieldErrors = {};

    if (loginMode === 'password') {
      newErrors.phone = validatePhone(phone);
      newErrors.password = validatePassword(password);
    } else {
      newErrors.phone = validatePhone(phone);
      newErrors.code = validateCode(code);
    }

    if (!agreed) {
      newErrors.agreement = '请先阅读并同意相关协议';
    }

    const hasError = Object.values(newErrors).some(Boolean);
    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    // 模拟登录请求
    setTimeout(() => {
      login();
      setLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="page-container-no-nav bg-neu-bg relative flex flex-col min-h-screen overflow-hidden">
      {/* 顶部导航栏 */}
      <NavBar
        transparent
        rightContent={
          <button
            onClick={() => navigate('/register')}
            className="text-neu-text-primary text-base font-semibold"
          >
            注册
          </button>
        }
      />

      {/* 品牌展示区 */}
      <div className="relative z-10 flex flex-col items-center mt-16">
        <div
          className="w-20 h-20 rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200&h=200&fit=crop)' }}
        />
        <h1 className="mt-3 text-[28px] font-bold text-neu-text-primary">
          藏锋ART
        </h1>
      </div>

      {/* 登录方式切换 */}
      <div className="relative z-10 flex mx-4 mt-6 rounded-2xl neu-inset p-1">
        <button
          onClick={() => { setLoginMode('password'); setErrors({}); }}
          className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all ${
            loginMode === 'password' ? 'neu-raised text-accent-blue' : 'text-neu-text-muted'
          }`}
        >
          密码登录
        </button>
        <button
          onClick={() => { setLoginMode('code'); setErrors({}); }}
          className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all ${
            loginMode === 'code' ? 'neu-raised text-accent-blue' : 'text-neu-text-muted'
          }`}
        >
          验证码登录
        </button>
      </div>

      {/* 表单输入区 */}
      <div className="relative z-10 flex flex-col px-4 mt-6" style={{ gap: '20px' }}>
        {/* 手机号 */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-neu-text-primary mb-2">
            手机号
          </label>
          <input
            type="tel"
            maxLength={11}
            value={phone}
            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, phone: '' })); }}
            placeholder="请输入手机号码"
            className={`w-full h-12 rounded-2xl bg-neu-bg px-4 text-base text-neu-text-primary placeholder-neu-text-muted outline-none ${
              errors.phone ? 'neu-inset ring-2 ring-red-400' : 'neu-inset'
            }`}
            style={{ border: 'none' }}
          />
          {errors.phone && (
            <span className="text-xs text-red-400 mt-1.5 ml-2">{errors.phone}</span>
          )}
        </div>

        {loginMode === 'password' ? (
          /* 密码 */
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-neu-text-primary mb-2">
              密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                placeholder="请输入密码"
                className={`w-full h-12 rounded-2xl bg-neu-bg pl-4 pr-12 text-base text-neu-text-primary placeholder-neu-text-muted outline-none ${
                  errors.password ? 'neu-inset ring-2 ring-red-400' : 'neu-inset'
                }`}
                style={{ border: 'none' }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neu-text-muted"
                type="button"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-400 mt-1.5 ml-2">{errors.password}</span>
            )}
          </div>
        ) : (
          /* 验证码 */
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-neu-text-primary mb-2">
              验证码
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center h-12 rounded-2xl neu-inset bg-neu-bg">
                <Shield size={18} className="ml-4 text-neu-text-muted flex-shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, code: '' })); }}
                  placeholder="请输入验证码"
                  className={`flex-1 bg-transparent ml-2.5 mr-4 text-base text-neu-text-primary placeholder-neu-text-muted outline-none ${
                    errors.code ? 'ring-0' : ''
                  }`}
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
                {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
              </button>
            </div>
            {errors.code && (
              <span className="text-xs text-red-400 mt-1.5 ml-2">{errors.code}</span>
            )}
          </div>
        )}
      </div>

      {/* 操作按钮区 */}
      <div className="relative z-10 flex flex-col items-center px-4 mt-8">
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full h-12 rounded-2xl text-white text-lg font-bold transition-all flex items-center justify-center gap-2 ${
            loading ? 'neu-inset opacity-70' : 'neu-accent'
          }`}
        >
          {loading && <Loader2 size={20} className="animate-spin" />}
          {loading ? '登录中...' : '登录'}
        </button>

        {loginMode === 'password' && (
          <button
            onClick={() => setLoginMode('code')}
            className="mt-4 text-base text-neu-text-primary font-semibold"
          >
            验证码登录
          </button>
        )}
      </div>

      {/* 弹性空间 */}
      <div className="flex-1" />

      {/* 底部协议区 */}
      <div className="relative z-10 flex flex-col px-4 pb-8">
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