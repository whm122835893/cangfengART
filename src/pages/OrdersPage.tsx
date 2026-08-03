import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import BackButton from '@/components/common/BackButton';
import EmptyState from '@/components/common/EmptyState';
import { useStore } from '@/store/useStore';
import { getImageUrl } from '@/data/nfts';
import type { Order } from '@/store/useStore';

const statusTabs = ['全部', '待付款', '已支付', '订单取消'];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function statusLabel(order: Order): string {
  return order.status === 'paid' ? '已支付' : '订单取消';
}

export default function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const [activeStatus, setActiveStatus] = useState(0);
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    let list = orders;
    // 状态过滤：0 全部 / 1 待付款(无) / 2 已支付 / 3 订单取消
    if (activeStatus === 1) {
      list = []; // 当前订单类型中不存在待付款状态
    } else if (activeStatus === 2) {
      list = list.filter((o) => o.status === 'paid');
    } else if (activeStatus === 3) {
      list = list.filter((o) => o.status === 'cancelled');
    }
    // 按藏品名称搜索
    const keyword = search.trim();
    if (keyword) {
      list = list.filter((o) => o.name.toLowerCase().includes(keyword.toLowerCase()));
    }
    return list;
  }, [orders, activeStatus, search]);

  return (
    <div className="page-container bg-neu-bg">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 px-4 h-navbar bg-neu-bg sticky top-0 z-50">
        <BackButton variant="gray" />
        <div className="flex-1 flex items-center h-8 neu-inset rounded-full px-3">
          <Search size={15} className="text-neu-text-muted" />
          <input
            type="text"
            placeholder="搜索订单"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 flex-1 text-sm bg-transparent outline-none placeholder:text-neu-text-muted"
          />
        </div>
        <button className="flex items-center gap-0.5 text-sm text-accent-blue font-semibold whitespace-nowrap">
          筛选
          <ChevronDown size={14} />
        </button>
      </div>

      {/* 状态标签栏 */}
      <div className="neu-divider" />
      <div className="flex gap-2 px-4 py-2.5">
        {statusTabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveStatus(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              activeStatus === i
                ? 'neu-pressed bg-accent-blue text-white'
                : 'neu-raised text-neu-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 订单列表 / 空状态 */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="暂无订单"
          subtitle="快去选购心仪的藏品吧"
        />
      ) : (
        <div className="px-4 pt-1 pb-4 flex flex-col gap-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="neu-raised rounded-card p-3 flex gap-3">
              {/* 藏品图片 */}
              <div className="w-20 h-20 rounded-xl neu-inset overflow-hidden shrink-0">
                <img
                  src={getImageUrl(order.image, 'thumb')}
                  alt={order.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neu-text-primary truncate">
                    {order.name}
                  </h3>
                  {order.number && (
                    <p className="text-xs text-neu-text-muted mt-0.5">编号：{order.number}</p>
                  )}
                  <p className="text-xs text-neu-text-muted mt-0.5">
                    数量：{order.quantity} · {formatDate(order.date)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-accent-blue">
                    ¥{order.price}
                  </span>
                  <span
                    className={`text-xs rounded px-2 py-0.5 font-semibold ${
                      order.status === 'paid'
                        ? 'neu-pressed bg-accent-blue/20 text-accent-blue'
                        : 'neu-pressed text-neu-text-muted'
                    }`}
                  >
                    {statusLabel(order)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
