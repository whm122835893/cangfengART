import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  variant?: 'white' | 'gray' | 'transparent';
}

export default function BackButton({ onClick, className = '', variant = 'white' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  const variantStyles = {
    white: 'neu-raised',
    gray: 'neu-inset',
    transparent: 'bg-white/20 backdrop-blur-sm',
  };

  return (
    <button
      onClick={handleClick}
      className={`w-9 h-9 rounded-full flex items-center justify-center neu-interactive ${variantStyles[variant]} ${className}`}
    >
      <ArrowLeft size={18} className="text-accent-blue" />
    </button>
  );
}