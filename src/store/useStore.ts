import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function generateUid(): string {
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

function generateAssetNumber(): string {
  let result = '#';
  for (let i = 0; i < 5; i++) {
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

/** 用户持有的藏品资产 */
export interface UserAsset {
  nftId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  purchaseDate: string;
  numbers: string[];
  listedNumbers: string[];
}

/** 市场挂单 */
export interface Listing {
  id: string;
  nftId: string;
  name: string;
  image: string;
  number: string;
  price: number;
  seller: string;
  fee: number;
  netAmount: number;
}

/** 订单 */
export interface Order {
  id: string;
  nftId: string;
  name: string;
  image: string;
  number?: string;
  price: number;
  quantity: number;
  type: 'sale' | 'market';
  status: 'paid' | 'cancelled';
  date: string;
}

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  // UI 临时状态（不持久化）
  activeTab: string;
  showAuthModal: boolean;
  showVerifyModal: boolean;
  toast: ToastState | null;

  // 业务状态（持久化）
  isLoggedIn: boolean;
  isVerified: boolean;
  hasOperationPassword: boolean;
  operationPassword: string;
  user: User;
  userAssets: UserAsset[];
  listings: Listing[];
  orders: Order[];
  walletBalance: number;
  checkInDays: number;
  lastCheckInDate: string;
  lotteryCount: number;
  lotteryDate: string;

  // UI 方法
  setActiveTab: (tab: string) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowVerifyModal: (show: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // 用户方法
  setLoggedIn: (loggedIn: boolean) => void;
  setVerified: (verified: boolean) => void;
  setHasOperationPassword: (has: boolean) => void;
  setOperationPassword: (pwd: string) => void;
  verifyOperationPassword: (pwd: string) => boolean;
  updateUser: (fields: Partial<User>) => void;
  generateAndSetNickname: () => void;
  login: () => void;
  logout: () => void;

  // 资产方法
  addAsset: (asset: Omit<UserAsset, 'numbers' | 'purchaseDate' | 'listedNumbers'>) => void;

  // 寄售方法
  consignAsset: (nftId: string, number: string, price: number) => boolean;
  buyListing: (listingId: string, nftName: string, nftImage: string) => boolean;
  cancelListing: (listingId: string) => void;

  // 订单方法
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;

  // 签到方法
  checkIn: () => void;

  // 扭蛋方法
  drawLottery: () => boolean;

  // 钱包方法
  updateWalletBalance: (amount: number) => void;
}

let toastId = 0;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: 'home',
      showAuthModal: false,
      showVerifyModal: false,
      toast: null,

      isLoggedIn: false,
      isVerified: false,
      hasOperationPassword: false,
      operationPassword: '',
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
      userAssets: [],
      listings: [],
      orders: [],
      walletBalance: 10000,
      checkInDays: 0,
      lastCheckInDate: '',
      lotteryCount: 3,
      lotteryDate: '',

      setActiveTab: (tab) => set({ activeTab: tab }),
      setShowAuthModal: (show) => set({ showAuthModal: show }),
      setShowVerifyModal: (show) => set({ showVerifyModal: show }),
      showToast: (message, type = 'success') => {
        const id = ++toastId;
        set({ toast: { id, message, type } });
        setTimeout(() => {
          if (get().toast?.id === id) set({ toast: null });
        }, 2500);
      },

      setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      setVerified: (verified) =>
        set((state) => ({
          isVerified: verified,
          user: verified
            ? { ...state.user, walletAddress: state.user.walletAddress || generateWalletAddress() }
            : state.user,
        })),
      setHasOperationPassword: (has) => set({ hasOperationPassword: has }),
      setOperationPassword: (pwd) => set({ operationPassword: pwd, hasOperationPassword: true }),
      verifyOperationPassword: (pwd) => {
        const stored = get().operationPassword;
        if (!stored) return false;
        return pwd === stored;
      },
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
          operationPassword: '',
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
          userAssets: [],
          listings: [],
          orders: [],
          walletBalance: 10000,
          checkInDays: 0,
          lastCheckInDate: '',
          lotteryCount: 3,
          lotteryDate: '',
        }),

      addAsset: (asset) =>
        set((state) => {
          const numbers = Array.from({ length: asset.quantity }, () => generateAssetNumber());
          const newAsset: UserAsset = {
            ...asset,
            numbers,
            listedNumbers: [],
            purchaseDate: new Date().toISOString(),
          };
          const existing = state.userAssets.find((a) => a.nftId === asset.nftId);
          if (existing) {
            return {
              userAssets: state.userAssets.map((a) =>
                a.nftId === asset.nftId
                  ? {
                      ...a,
                      quantity: a.quantity + asset.quantity,
                      numbers: [...a.numbers, ...numbers],
                      purchaseDate: newAsset.purchaseDate,
                    }
                  : a
              ),
            };
          }
          return { userAssets: [...state.userAssets, newAsset] };
        }),

      consignAsset: (nftId, number, price) => {
        const state = get();
        const asset = state.userAssets.find((a) => a.nftId === nftId);
        if (!asset) return false;
        if (!asset.numbers.includes(number)) return false;
        if (asset.listedNumbers.includes(number)) return false;

        const fee = Math.round(price * 0.03 * 100) / 100;
        const netAmount = Math.round((price - fee) * 100) / 100;

        set({
          userAssets: state.userAssets.map((a) =>
            a.nftId === nftId
              ? {
                  ...a,
                  numbers: a.numbers.filter((n) => n !== number),
                  listedNumbers: [...a.listedNumbers, number],
                }
              : a
          ),
          listings: [
            ...state.listings,
            {
              id: generateUid(),
              nftId,
              name: asset.name,
              image: asset.image,
              number,
              price,
              seller: '汇付支付',
              fee,
              netAmount,
            },
          ],
        });
        return true;
      },

      buyListing: (listingId, nftName, nftImage) => {
        const state = get();
        const listing = state.listings.find((l) => l.id === listingId);
        if (!listing) return false;

        set({
          listings: state.listings.filter((l) => l.id !== listingId),
          userAssets: (() => {
            const existing = state.userAssets.find((a) => a.nftId === listing.nftId);
            if (existing) {
              return state.userAssets.map((a) =>
                a.nftId === listing.nftId
                  ? {
                      ...a,
                      quantity: a.quantity + 1,
                      numbers: [...a.numbers, listing.number],
                    }
                  : a
              );
            }
            return [
              ...state.userAssets,
              {
                nftId: listing.nftId,
                name: nftName,
                image: nftImage,
                price: listing.price,
                quantity: 1,
                purchaseDate: new Date().toISOString(),
                numbers: [listing.number],
                listedNumbers: [],
              },
            ];
          })(),
          walletBalance: state.walletBalance - listing.price,
        });
        return true;
      },

      cancelListing: (listingId) => {
        const state = get();
        const listing = state.listings.find((l) => l.id === listingId);
        if (!listing) return;

        set({
          listings: state.listings.filter((l) => l.id !== listingId),
          userAssets: state.userAssets.map((a) =>
            a.nftId === listing.nftId
              ? {
                  ...a,
                  numbers: [...a.numbers, listing.number],
                  listedNumbers: a.listedNumbers.filter((n) => n !== listing.number),
                }
              : a
          ),
        });
      },

      addOrder: (order) =>
        set((state) => ({
          orders: [
            { ...order, id: generateUid(), date: new Date().toISOString() },
            ...state.orders,
          ],
        })),

      checkIn: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        if (state.lastCheckInDate === today) return;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const isContinuous = state.lastCheckInDate === yesterday;
        set({
          checkInDays: isContinuous ? state.checkInDays + 1 : 1,
          lastCheckInDate: today,
        });
      },

      drawLottery: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const count = state.lotteryDate === today ? state.lotteryCount : 3;
        if (count <= 0) return false;
        set({
          lotteryCount: count - 1,
          lotteryDate: today,
        });
        return true;
      },

      updateWalletBalance: (amount) =>
        set((state) => ({ walletBalance: state.walletBalance + amount })),
    }),
    {
      name: 'cangfengart-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        isVerified: state.isVerified,
        hasOperationPassword: state.hasOperationPassword,
        operationPassword: state.operationPassword,
        user: state.user,
        userAssets: state.userAssets,
        listings: state.listings,
        orders: state.orders,
        walletBalance: state.walletBalance,
        checkInDays: state.checkInDays,
        lastCheckInDate: state.lastCheckInDate,
        lotteryCount: state.lotteryCount,
        lotteryDate: state.lotteryDate,
      }),
    }
  )
);
