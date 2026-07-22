import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Tag, Eye, Heart, Share2 } from 'lucide-react';
import NavBar from '@/components/common/NavBar';

interface Announcement {
  id: number;
  title: string;
  tag: string;
  time: string;
  cover: string;
  views: number;
  likes: number;
  content: string;
}

const announcements: Announcement[] = [
  {
    id: 1,
    title: '【藏锋ART运营公告】关于藏锋ART平台数字资产迁移说明及第一阶段运营活动正式启动',
    tag: '运营公告',
    time: '2026/07/04 10:26:29',
    cover: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    views: 12580,
    likes: 326,
    content: `尊敬的藏锋ART用户：

为积极响应国家关于数字资产规范发展的政策号召，进一步提升平台服务能力与用户体验，藏锋ART平台已完成底层技术架构的全面升级。现将数字资产迁移说明及第一阶段运营活动安排公告如下：

一、数字资产迁移说明

1. 迁移范围：平台所有已发行的数字藏品资产，包括但不限于数字资产、盲盒、合成藏品等。

2. 迁移时间：2026年7月4日 10:00 至 2026年7月11日 24:00，迁移期间部分功能可能暂时不可用，敬请谅解。

3. 迁移方式：系统将自动完成资产数据的迁移工作，用户无需进行任何操作。迁移完成后，您的全部数字资产将完整保留，不受任何影响。

4. 迁移期间，平台将暂停以下功能：
   - 数字资产的购买与寄售
   - 合成活动参与
   - 盲盒开启
   - 置换活动参与

二、第一阶段运营活动

为庆祝平台焕新升级，我们将推出以下系列活动：

1. 新人专享福利：新注册用户可获得限量版数字盲盒一个，内含随机稀有藏品。

2. 签到翻倍活动：活动期间每日签到积分翻倍，连续签到7天可获得额外惊喜奖励。

3. 合成狂欢节：限时开放多款稀有合成配方，合成成功率提升20%。

4. 邀请有礼：邀请好友注册并完成实名认证，双方均可获得限量数字藏品。

三、注意事项

1. 请确保您的账户已完成实名认证，以便正常参与各项活动。
2. 迁移期间如遇问题，请联系平台客服获取帮助。
3. 活动最终解释权归藏锋ART平台所有。

感谢您一直以来对藏锋ART的支持与信任！我们将持续为您提供更优质的数字藏品服务。

藏锋ART运营团队
2026年7月4日`,
  },
  {
    id: 2,
    title: '【藏锋ART运营公告】藏锋ART·焕新升级进展',
    tag: '运营公告',
    time: '2026/07/01 12:30:09',
    cover: 'linear-gradient(135deg, #1a1a2e, #2d1b69, #6b21a8)',
    views: 8920,
    likes: 218,
    content: `尊敬的藏锋ART用户：

感谢各位用户长期以来对藏锋ART平台的支持与关注。自平台启动焕新升级计划以来，我们收到了大量宝贵的反馈与建议。现将升级进展及后续规划公告如下：

一、已完成升级内容

1. 技术架构升级：平台底层已全面迁移至新一代区块链基础设施，交易确认速度提升300%，Gas费用降低60%。

2. 用户体验优化：全新UI界面已上线，采用新拟态设计风格，交互更加流畅直观。

3. 安全体系强化：引入多重签名机制与冷热钱包分离方案，全方位保障用户资产安全。

4. 实名认证系统：对接国家级实名认证接口，认证流程更加便捷高效。

二、即将上线功能

1. 数字藏品3D展示：支持3D模型藏品的高清预览与交互展示。

2. 社交互动功能：用户间可互相关注、点赞、评论，打造数字藏品社区。

3. 创作者入驻：开放创作者入驻通道，支持个人艺术家发行原创数字藏品。

4. 跨链互通：实现与主流公链的跨链资产互通，拓展藏品流通场景。

三、运营计划

1. 每周二、四为固定上新日，精选优质数字藏品限量发行。
2. 每月举办一次大型合成活动，稀有藏品限时合成。
3. 季度末推出年度限定藏品，回馈活跃用户。

四、用户关怀

如在升级过程中遇到任何问题，请通过以下方式联系我们：
- 在线客服：平台内"帮助中心"
- 官方社群：关注藏锋ART官方公告获取最新动态

藏锋ART，让每一份收藏都有价值。

藏锋ART运营团队
2026年7月1日`,
  },
];

export default function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const announcement = announcements.find((a) => a.id === Number(id));

  if (!announcement) {
    return (
      <div className="page-container bg-neu-bg">
        <NavBar title="公告详情" />
        <div className="flex flex-col items-center justify-center pt-24">
          <p className="text-lg font-bold text-neu-text-primary">公告不存在</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-accent-blue font-semibold"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bg-neu-bg">
      <NavBar title="公告详情" />

      {/* 封面图 */}
      <div
        className="mx-4 mt-3 h-48 rounded-lg-card neu-raised relative overflow-hidden"
        style={{ background: announcement.cover }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/20 text-5xl font-black tracking-widest">
            藏锋ART
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="neu-pressed text-white text-xs px-2.5 py-1 rounded-full font-semibold bg-white/10 backdrop-blur-sm">
            {announcement.tag}
          </span>
        </div>
      </div>

      {/* 标题 */}
      <div className="px-4 mt-4">
        <h1 className="text-lg font-bold text-neu-text-primary leading-relaxed">
          {announcement.title}
        </h1>

        {/* 元信息 */}
        <div className="flex items-center gap-4 mt-3 text-xs text-neu-text-muted">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{announcement.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{announcement.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} />
            <span>{announcement.likes}</span>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="neu-divider mx-4 mt-4" />

      {/* 正文 */}
      <div className="px-4 py-4">
        <div className="text-sm text-neu-text-secondary leading-7 whitespace-pre-line font-medium">
          {announcement.content}
        </div>
      </div>

      {/* 底部操作 */}
      <div className="flex items-center justify-center gap-6 py-4 mb-4">
        <button className="flex items-center gap-1.5 text-sm text-neu-text-muted font-semibold">
          <Heart size={18} />
          点赞
        </button>
        <button className="flex items-center gap-1.5 text-sm text-neu-text-muted font-semibold">
          <Share2 size={18} />
          分享
        </button>
      </div>
    </div>
  );
}