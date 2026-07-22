import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Lock, ChevronRight } from 'lucide-react';

const marketList = [
  { id: '1', name: '圆明园羊首铜像', issue: 5000, circulation: 5000, price: '--', volume: 267, cover: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&h=200&fit=crop', bg: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=800&fit=crop' },
  { id: '2', name: '圆明园马首铜像', issue: 100000, circulation: 29238, price: '--', volume: 177, cover: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=200&h=200&fit=crop', bg: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600&h=800&fit=crop' },
  { id: '3', name: '圆明园虎首铜像', issue: 5000, circulation: 4821, price: '¥1888', volume: 89, cover: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=200&h=200&fit=crop', bg: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&h=800&fit=crop' },
  { id: '4', name: '圆明园猪首铜像', issue: 5000, circulation: 4502, price: '¥1666', volume: 64, cover: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=200&h=200&fit=crop', bg: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=800&fit=crop' },
  { id: '5', name: '圆明园猴首铜像', issue: 5000, circulation: 3980, price: '¥1999', volume: 52, cover: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=200&h=200&fit=crop', bg: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&h=800&fit=crop' },
  { id: '6', name: '圆明园牛首铜像', issue: 5000, circulation: 3205, price: '¥1388', volume: 41, cover: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=200&h=200&fit=crop', bg: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=800&fit=crop' },
  { id: '7', name: '十二生肖·辰龙', issue: 8000, circulation: 6210, price: '¥2999', volume: 156, cover: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200&h=200&fit=crop', bg: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=800&fit=crop' },
  { id: '8', name: '十二生肖·巳蛇', issue: 8000, circulation: 5480, price: '¥2688', volume: 112, cover: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=200&h=200&fit=crop', bg: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600&h=800&fit=crop' },
];

const sellList = [
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

export default function MarketDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const collection = marketList.find((item) => item.id === id) || marketList[0];
  const [liked, setLiked] = useState(false);

  return (
    <div className="page-container bg-neu-bg flex flex-col min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
      >
        <ChevronLeft size={22} className="text-gray-700" />
      </button>

      <button
        onClick={() => setLiked(!liked)}
        className={`fixed top-4 right-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50 ${
          liked ? 'bg-amber-50' : ''
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill={liked ? '#f59e0b' : 'none'}
          stroke={liked ? '#f59e0b' : '#374151'}
          strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      <div className="relative shrink-0">
        <div
          className="w-full h-[280px] bg-cover bg-center"
          style={{ backgroundImage: `url(${collection.bg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neu-bg" />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-40px] z-10">
          <div
            className="w-[120px] h-[120px] rounded-2xl bg-cover bg-center shadow-lg border-2 border-white"
            style={{ backgroundImage: `url(${collection.cover})` }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-12 px-4">
        <h1 className="text-xl font-bold text-gray-900">{collection.name}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <span>发行 {collection.issue} 份</span>
          <span>|</span>
          <span>流通 {collection.circulation} 份</span>
        </div>
      </div>

      <div className="flex items-center px-4 mt-6 border-b border-gray-100">
        {['挂单列表', '相关公告'].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`relative h-10 mr-6 text-base font-semibold ${
              i === activeTab ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {tab}
            {i === activeTab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center px-4 mt-3 gap-4">
        {['寄售', '求购'].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setSubTab(i)}
            className={`flex items-center gap-1 text-sm font-semibold ${
              i === subTab ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {tab}
            {i === 1 && <Lock size={14} />}
          </button>
        ))}
      </div>

      <div className="flex items-center px-4 mt-3 text-xs text-gray-400">
        <span className="flex-1 font-semibold">藏品名称 | 编号</span>
        <span className="w-16 text-right font-semibold">价格</span>
        <span className="w-14 text-right font-semibold">编号</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {sellList.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => navigate(`/nft/${id}?number=${item.number}`)}
            className={`neu-raised rounded-xl flex items-center p-3 ${idx === 0 ? 'mt-2' : ''} mb-3 cursor-pointer`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900">{collection.name}</div>
              <span className="inline-block mt-1 px-3 py-1 text-xs font-bold text-blue-600 neu-inset rounded-lg border border-blue-200/50">
                {item.number}
              </span>
            </div>

            <div className="w-20 flex flex-col items-end">
              <span className="text-lg font-bold text-gray-900">¥ {item.price}</span>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
                <span>支付钱包:</span>
                <span className="px-1 py-0.5 bg-gray-100 rounded text-gray-500">{item.wallet}</span>
              </div>
            </div>

            <div className="w-8 flex items-center justify-end">
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-3 left-3 right-3 flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 z-50" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <button className="flex-1 h-12 rounded-full neu-raised text-blue-500 text-base font-bold">
          批量下单
        </button>
        <button className="flex-1 h-12 rounded-full neu-raised text-gray-600 text-base font-bold">
          快捷下单
        </button>
      </div>
    </div>
  );
}