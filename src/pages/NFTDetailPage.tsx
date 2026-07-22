import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Copy, Diamond } from 'lucide-react';

const nftList = [
  { id: '1', name: '圆明园羊首铜像', issue: 5000, circulation: 5000, price: 3, cover: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=600&fit=crop', bg: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=1000&fit=crop' },
  { id: '2', name: '圆明园马首铜像', issue: 100000, circulation: 29238, price: 4, cover: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600&h=600&fit=crop', bg: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=1000&fit=crop' },
  { id: '3', name: '圆明园虎首铜像', issue: 5000, circulation: 4821, price: 5, cover: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&h=600&fit=crop', bg: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&h=1000&fit=crop' },
  { id: '4', name: '圆明园猪首铜像', issue: 5000, circulation: 4502, price: 4, cover: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=600&fit=crop', bg: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&h=1000&fit=crop' },
  { id: '5', name: '圆明园猴首铜像', issue: 5000, circulation: 3980, price: 5, cover: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&h=600&fit=crop', bg: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&h=1000&fit=crop' },
  { id: '6', name: '圆明园牛首铜像', issue: 5000, circulation: 3205, price: 5, cover: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=600&fit=crop', bg: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=1000&fit=crop' },
  { id: '7', name: '十二生肖·辰龙', issue: 8000, circulation: 6210, price: 6, cover: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=600&fit=crop', bg: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=1000&fit=crop' },
  { id: '8', name: '十二生肖·巳蛇', issue: 8000, circulation: 5480, price: 5, cover: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600&h=600&fit=crop', bg: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&h=1000&fit=crop' },
];

const storyText = '圆明园十二生肖兽首铜像原为圆明园海晏堂外的喷泉的一部分，是清乾隆年间的红铜铸像。1860年英法联军侵略中国，火烧圆明园，兽首铜像开始流失海外。\n\n羊首铜像造型生动，铸工精细，是清代宫廷造办处的杰作。铜像采用精炼红铜铸造，色泽深沉，历经岁月而不锈蚀，展现了清代高超的铸造工艺。';

const creatorInfo = {
  name: '宫廷造办处',
  avatar: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=100&h=100&fit=crop',
  bio: '清代宫廷造办处是专门负责制造皇家御用品的官方机构，汇集了当时全国最顶尖的工匠与艺术家。造办处的作品以工艺精湛、用料考究著称，代表了清代工艺美术的最高水平。\n\n十二生肖兽首铜像便是由宫廷造办处的匠师们精心铸造，每一尊都倾注了匠人心血，是中西合璧的艺术珍品。',
};

const brandInfo = {
  name: '圆明园文化',
  logo: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=100&h=100&fit=crop',
  desc: '圆明园文化致力于传承和弘扬圆明园的历史文化价值，通过数字藏品的形式让更多人了解和感受这座万园之园的艺术魅力。\n\n我们的使命是：让沉睡的文物活起来，让优秀传统文化走进千家万户。',
};

export default function NFTDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const number = searchParams.get('number') || '#79361';
  const nft = nftList.find((item) => item.id === id) || nftList[0];
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const contractAddress = '0xb' + '*'.repeat(4) + '62e02a';
  

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-neu-bg text-gray-800">
      <div className="relative w-full h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-125 blur-xl"
          style={{ backgroundImage: `url(${nft.cover})` }}
        />
        <div className="absolute inset-0 bg-neu-bg/30" />
        
        <div className="absolute top-0 left-1/4 w-[300px] h-[200px] opacity-30"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] opacity-40"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }} />
        <div className="absolute top-0 right-1/4 w-[300px] h-[200px] opacity-30"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,230,200,0.4) 0%, transparent 70%)' }} />

        <div className="absolute left-1/2 -translate-x-1/2 top-[40px] z-10" style={{ perspective: '1000px' }}>
          <div className="relative animate-swing">
            <div className="absolute -inset-4 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(200,200,200,0.2) 100%)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.4)',
                transform: 'translateZ(-12px)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.3)',
              }}
            />
            <div className="absolute -inset-2 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,200,200,0.2) 50%, rgba(180,180,180,0.3) 100%)',
                backdropFilter: 'blur(2px)',
                border: '1px solid rgba(255,255,255,0.5)',
                transform: 'translateZ(-6px)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 12px rgba(0,0,0,0.2)',
              }}
            />
            <div
              className="w-[260px] h-[260px] bg-cover bg-center rounded-sm"
              style={{
                backgroundImage: `url(${nft.cover})`,
                transform: 'translateZ(0)',
                border: '2px solid rgba(255,255,255,0.6)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2), 0 0 30px rgba(255,255,255,0.1)',
              }}
            />
            <div className="absolute inset-0 rounded-sm pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.15) 100%)',
                transform: 'translateZ(1px)',
              }}
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[380px] h-[100px]">
          <div className="absolute bottom-0 left-0 right-0 h-[90px]"
            style={{
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 40%, #050505 100%)',
              borderLeft: '3px solid #333',
              borderRight: '3px solid #333',
            }}
          />
          <div className="absolute bottom-[50px] left-0 right-0 h-[40px]"
            style={{
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(180deg, #252525 0%, #151515 100%)',
              borderLeft: '2px solid #444',
              borderRight: '2px solid #444',
            }}
          />
          <div className="absolute bottom-[80px] left-[8%] right-[8%] h-[20px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 80%, transparent 100%)',
              filter: 'blur(1px)',
            }}
          />
          <div className="absolute bottom-[75px] left-[25%] w-[25px] h-[25px] rounded-full opacity-35"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }}
          />
          <div className="absolute bottom-[72px] left-[45%] w-[20px] h-[20px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
          />
          <div className="absolute bottom-[70px] right-[25%] w-[22px] h-[22px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
          />
          <div className="absolute bottom-[45px] left-[6%] right-[6%] h-[3px]"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)',
              background: 'linear-gradient(90deg, #6b4c00 0%, #b8860b 20%, #ffd700 50%, #b8860b 80%, #6b4c00 100%)',
              boxShadow: '0 0 8px rgba(218,165,32,0.5)',
            }}
          />
        </div>

        <button
          onClick={() => navigate(-1)}
          className="fixed top-4 left-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        <button
          onClick={() => setLiked(!liked)}
          className="fixed top-4 right-4 w-10 h-10 rounded-full neu-raised flex items-center justify-center z-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={liked ? '#f59e0b' : 'none'}
            stroke={liked ? '#f59e0b' : '#374151'}
            strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      <div className="relative pt-20 pb-28 px-4">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-gray-900">{nft.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span>发行 {nft.issue} 份</span>
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            <span>流通 {nft.circulation} 份</span>
          </div>
        </div>

        <div className="neu-raised rounded-2xl p-4 mt-5">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500 text-sm">藏品编号</span>
            <span className="text-gray-900 text-lg font-bold">{number}</span>
          </div>
          <div className="w-full h-px bg-gray-200/60" />
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500 text-sm">合约地址</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 text-sm font-semibold">{contractAddress}</span>
              <button onClick={handleCopy} className="text-gray-400">
                <Copy size={14} />
              </button>
            </div>
          </div>
          
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-gray-300" />
            <div className="px-4 text-center">
              <div className="text-gray-400 text-xs tracking-[0.2em] mb-0.5">STORY</div>
              <div className="text-gray-900 text-lg font-bold">藏品故事</div>
            </div>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {storyText}
          </div>
        </div>

        <div className="mt-6 flex items-center border-b border-gray-200">
          {['藏品信息', '相关公告'].map((tab, i) => (
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

        {activeTab === 0 && (
          <div className="mt-4 space-y-3">
            <div className="neu-raised rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Diamond size={20} className="text-blue-500" />
                  <div>
                    <div className="text-base font-bold text-gray-900">创作者</div>
                    <div className="text-xs text-gray-400 tracking-wider">ARTIST</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${creatorInfo.avatar})` }}
                  />
                  <span className="text-sm font-semibold text-gray-700">{creatorInfo.name}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {creatorInfo.bio}
              </div>
            </div>

            <div className="neu-raised rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Diamond size={20} className="text-blue-500" />
                  <div>
                    <div className="text-base font-bold text-gray-900">品牌方</div>
                    <div className="text-xs text-gray-400 tracking-wider">BRAND</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center bg-blue-500"
                    style={{ backgroundImage: `url(${brandInfo.logo})` }}
                  />
                  <span className="text-sm font-semibold text-gray-700">{brandInfo.name}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {brandInfo.desc}
              </div>
            </div>

            <div className="neu-raised rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Diamond size={20} className="text-blue-500" />
                <div>
                  <div className="text-base font-bold text-gray-900">藏品须知</div>
                  <div className="text-xs text-gray-400 tracking-wider">NOTICE</div>
                </div>
              </div>
              <div className="text-gray-500 text-sm font-light leading-relaxed">
                数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁，并小于60周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。请勿对数字藏品进行炒作、场外交易、欺诈，或以任何其他非法方式进行使用。
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="mt-4">
            <div className="neu-raised rounded-2xl p-8">
              <div className="text-gray-400 text-center text-sm">暂无相关公告</div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-neu-bg px-4 py-3 flex items-center gap-4 z-50 border-t-2 border-gray-300/60 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900">¥{nft.price}</span>
          <button
            onClick={() => navigate('/market')}
            className="flex items-center text-gray-400 text-xs"
          >
            前往市场 <ChevronRight size={12} />
          </button>
        </div>
        <button className="flex-1 h-11 rounded-full neu-raised text-blue-500 text-base font-bold">
          立即购买
        </button>
      </div>

      {copied && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2 bg-gray-800/80 text-white text-sm rounded-lg z-50">
          已复制
        </div>
      )}
    </div>
  );
}
