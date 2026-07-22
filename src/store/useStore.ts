import { create } from 'zustand';

function generateUid(): string {
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

function generateNickname(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateWalletAddress(): string {
  const hex = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return addr;
}

interface User {
  uid: string;
  nickname: string;
  phone: string;
  walletAddress: string;
  avatar: string;
  address: string;
  realName: string;
  idNumber: string;
}

interface AppState {
  activeTab: string;
  checkInDays: number;
  isLoggedIn: boolean;
  isVerified: boolean;
  hasOperationPassword: boolean;
  showAuthModal: boolean;
  showVerifyModal: boolean;
  user: User;
  setActiveTab: (tab: string) => void;
  setCheckInDays: (days: number) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setVerified: (verified: boolean) => void;
  setHasOperationPassword: (has: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowVerifyModal: (show: boolean) => void;
  updateUser: (fields: Partial<User>) => void;
  generateAndSetNickname: () => void;
  login: () => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'home',
  checkInDays: 0,
  isLoggedIn: false,
  isVerified: false,
  hasOperationPassword: false,
  showAuthModal: false,
  showVerifyModal: false,
  user: {
    uid: '',
    nickname: '',
    phone: '',
    walletAddress: '',
    avatar: '',
    address: '',
    realName: '',
    idNumber: '',
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCheckInDays: (days) => set({ checkInDays: days }),
  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setVerified: (verified) =>
    set((state) => ({
      isVerified: verified,
      user: verified
        ? { ...state.user, walletAddress: state.user.walletAddress || generateWalletAddress() }
        : state.user,
    })),
  setHasOperationPassword: (has) => set({ hasOperationPassword: has }),
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setShowVerifyModal: (show) => set({ showVerifyModal: show }),
  updateUser: (fields) =>
    set((state) => ({ user: { ...state.user, ...fields } })),
  generateAndSetNickname: () =>
    set((state) => ({ user: { ...state.user, nickname: generateNickname() } })),
  login: () =>
    set((state) => ({
      isLoggedIn: true,
      user: {
        ...state.user,
        uid: state.user.uid || generateUid(),
        nickname: state.user.nickname || generateNickname(),
        phone: state.user.phone || '175****1293',
      },
    })),
  logout: () =>
    set({
      isLoggedIn: false,
      isVerified: false,
      hasOperationPassword: false,
      user: {
        uid: '',
        nickname: '',
        phone: '',
        walletAddress: '',
        avatar: '',
        address: '',
        realName: '',
        idNumber: '',
      },
    }),
}));