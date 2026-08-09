/**
 * 藏品统一数据源
 * 所有藏品数据集中管理，避免在各页面重复定义
 */

/** 图片尺寸用途 */
export type ImageSize = 'thumb' | 'cover' | 'bg' | 'avatar' | 'logo';

const SIZE_MAP: Record<ImageSize, { w: number; h: number }> = {
  thumb: { w: 200, h: 200 },   // 列表缩略图
  cover: { w: 600, h: 600 },   // 展示主图（正方形）
  bg: { w: 800, h: 1000 },     // 详情页背景图（竖版）
  avatar: { w: 100, h: 100 },  // 头像
  logo: { w: 100, h: 100 },    // 品牌Logo
};

/**
 * 根据原图 URL 和用途生成对应尺寸的图片 URL
 * 支持 Unsplash 图片（通过 query 参数控制尺寸）
 */
export function getImageUrl(rawUrl: string, size: ImageSize = 'cover'): string {
  const { w, h } = SIZE_MAP[size];
  // 特殊占位：空投类内部 key → 回退到真实藏品图，保证展示时能看到图
  if (rawUrl === 'nft-badge') {
    // 徽章 → 用十二生肖·辰龙的图片做占位
    const fallback = nfts.find((n) => n.id === '7') ?? nfts[0];
    rawUrl = fallback.image;
  } else if (rawUrl === 'nft-avatar') {
    // 头像 → 用牛首铜像图片做占位
    const fallback = nfts.find((n) => n.id === '6') ?? nfts[0];
    rawUrl = fallback.image;
  }
  // Unsplash 图片：替换/追加 w、h、fit 参数
  if (rawUrl.includes('images.unsplash.com')) {
    const base = rawUrl.split('?')[0];
    return `${base}?w=${w}&h=${h}&fit=crop`;
  }
  // 其他图片直接返回原 URL
  return rawUrl;
}

/** 藏品原始数据（仅存图片原始 URL，按需生成各尺寸） */
export interface Nft {
  id: string;
  name: string;
  /** 发行量 */
  issue: number;
  /** 流通量 */
  circulation: number;
  /** 单价（元）。null 表示未定价 */
  price: number | null;
  /** 24h 成交量 */
  volume: number;
  /** 是否默认收藏 */
  liked: boolean;
  /** 原始图片 URL（用于生成各尺寸） */
  image: string;
  /** 发售状态：onsale 正在发售 | ended 已结束 */
  saleStatus: 'onsale' | 'ended';
  /** 发售开始时间（ISO 字符串） */
  saleStart: string;
}

/** 藏品列表（唯一数据源） */
export const nfts: Nft[] = [
  { id: '1', name: '圆明园羊首铜像', issue: 5000, circulation: 5000, price: null, volume: 267, liked: false, image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3', saleStatus: 'ended', saleStart: '2026-07-01T10:00:00' },
  { id: '2', name: '圆明园马首铜像', issue: 100000, circulation: 29238, price: null, volume: 177, liked: false, image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7', saleStatus: 'ended', saleStart: '2026-07-05T10:00:00' },
  { id: '3', name: '圆明园虎首铜像', issue: 5000, circulation: 4821, price: 1888, volume: 89, liked: true, image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5', saleStatus: 'ended', saleStart: '2026-07-10T10:00:00' },
  { id: '4', name: '圆明园猪首铜像', issue: 5000, circulation: 4502, price: 1666, volume: 64, liked: false, image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd', saleStatus: 'ended', saleStart: '2026-07-12T10:00:00' },
  { id: '5', name: '圆明园猴首铜像', issue: 5000, circulation: 3980, price: 1999, volume: 52, liked: false, image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50', saleStatus: 'ended', saleStart: '2026-07-15T10:00:00' },
  { id: '6', name: '圆明园牛首铜像', issue: 5000, circulation: 3205, price: 1388, volume: 41, liked: false, image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30', saleStatus: 'ended', saleStart: '2026-07-18T10:00:00' },
  { id: '7', name: '十二生肖·辰龙', issue: 8000, circulation: 6210, price: 2999, volume: 156, liked: true, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52', saleStatus: 'onsale', saleStart: '2026-07-22T20:00:00' },
  { id: '8', name: '十二生肖·巳蛇', issue: 8000, circulation: 5480, price: 2688, volume: 112, liked: false, image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f', saleStatus: 'ended', saleStart: '2026-07-20T10:00:00' },
  // 空投藏品（不在首页/市场列表展示，仅用于详情页数据支撑）
  { id: 'airdrop-genesis', name: '创世纪念徽章', issue: 1000, circulation: 1000, price: 0, volume: 0, liked: false, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52', saleStatus: 'ended', saleStart: '2026-08-01T10:00:00' },
  { id: 'airdrop-opening', name: '开服限定头像', issue: 2000, circulation: 2000, price: 0, volume: 0, liked: false, image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30', saleStatus: 'ended', saleStart: '2026-08-01T10:00:00' },
];

/** 价格格式化：null 显示 '--'，否则显示 '¥xxxx' */
export function formatPrice(price: number | null): string {
  return price === null ? '--' : `¥${price}`;
}

/** 根据 id 获取藏品 */
export function getNftById(id: string | undefined): Nft {
  return nfts.find((item) => item.id === id) || nfts[0];
}

/** 获取正在发售的藏品 */
export function getOnSaleNfts(): Nft[] {
  return nfts.filter((item) => item.saleStatus === 'onsale');
}

/** 计算距离发售开始的倒计时（已开始则返回 '已开售'） */
export function getSaleCountdown(saleStart: string): string {
  const start = new Date(saleStart).getTime();
  const now = Date.now();
  if (now >= start) return '已开售';
  const diff = start - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  if (days > 0) return `${days}天 ${hours}时 ${minutes}分`;
  return `${hours}时 ${minutes}分 ${seconds}秒`;
}

/** 创作者信息 */
export const creatorInfo = {
  name: '宫廷造办处',
  avatar: getImageUrl('https://images.unsplash.com/photo-1500595046743-cd271d694d30', 'avatar'),
  bio: '清代宫廷造办处是专门负责制造皇家御用品的官方机构，汇集了当时全国最顶尖的工匠与艺术家。造办处的作品以工艺精湛、用料考究著称，代表了清代工艺美术的最高水平。\n\n十二生肖兽首铜像便是由宫廷造办处的匠师们精心铸造，每一尊都倾注了匠人心血，是中西合璧的艺术珍品。',
};

/** 品牌信息 */
export const brandInfo = {
  name: '圆明园文化',
  logo: getImageUrl('https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3', 'logo'),
  desc: '圆明园文化致力于传承和弘扬圆明园的历史文化价值，通过数字藏品的形式让更多人了解和感受这座万园之园的艺术魅力。\n\n我们的使命是：让沉睡的文物活起来，让优秀传统文化走进千家万户。',
};

/** 藏品故事文案 */
export const storyText = '圆明园十二生肖兽首铜像原为圆明园海晏堂外的喷泉的一部分，是清乾隆年间的红铜铸像。1860年英法联军侵略中国，火烧圆明园，兽首铜像开始流失海外。\n\n羊首铜像造型生动，铸工精细，是清代宫廷造办处的杰作。铜像采用精炼红铜铸造，色泽深沉，历经岁月而不锈蚀，展现了清代高超的铸造工艺。';

/** 挂单列表（市场详情页用） */
export const sellList = [
  { id: '1', number: '#79361', price: 3, wallet: 'F' },
  { id: '2', number: '#6008', price: 4, wallet: 'F' },
  { id: '3', number: '#6087', price: 4, wallet: 'F' },
  { id: '4', number: '#6200', price: 4, wallet: 'F' },
  { id: '5', number: '#6351', price: 4, wallet: 'F' },
  { id: '6', number: '#6412', price: 5, wallet: 'F' },
  { id: '7', number: '#6589', price: 5, wallet: 'F' },
  { id: '8', number: '#6701', price: 5, wallet: 'F' },
  { id: '9', number: '#6823', price: 6, wallet: 'F' },
  { id: '10', number: '#6950', price: 6, wallet: 'F' },
];
