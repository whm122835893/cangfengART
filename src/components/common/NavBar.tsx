import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface NavBarProps {
  title?: string;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  onBack?: () => void;
}

export default function NavBar({ title, rightContent, transparent, onBack }: NavBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 h-navbar sticky top-0 z-50 ${
        transparent ? 'bg-transparent' : 'neu-flat'
      }`}
    >
      <button
        onClick={handleBack}
        className="w-9 h-9 rounded-full neu-raised neu-interactive flex items-center justify-center"
      >
        <ArrowLeft size={18} className="text-accent-blue" />
      </button>
      {title && (
        <h1 className="text-lg font-bold text-neu-text-primary absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>
      )}
      <div className="min-w-[36px]">{rightContent}</div>
    </div>
  );
}