import { defineStore } from 'pinia'

function generateUid(): string {
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

function generateAssetNumber(): string {
  let result = '#'
  for (let i = 0; i < 5; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

function generateNickname(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateWalletAddress(): string {
  const hex = '0123456789abcdef'
  let addr = '0x'
  for (let i = 0; i < 40; i++) {
    addr += hex.charAt(Math.floor(Math.random() * hex.length))
  }
  return addr
}

export interface User {
  uid: string
  nickname: string
  phone: string
  walletAddress: string
  avatar: string
  address: string
  realName: string
  idNumber: string
}

export interface UserAsset {
  nftId: string
  name: string
  image: string
  price: number
  quantity: number
  purchaseDate: string
  numbers: string[]
  listedNumbers: string[]
}

export interface Listing {
  id: string
  nftId: string
  name: string
  image: string
  number: string
  price: number
  seller: string
  fee: number
  netAmount: number
}

export interface Order {
  id: string
  nftId: string
  name: string
  image: string
  number?: string
  price: number
  quantity: number
  type: 'sale' | 'market' | 'airdrop'
  status: 'paid' | 'cancelled' | 'airdrop'
  date: string
  // 获取方式：市场购买 / 首发购买 / 新用户空投 / 运营活动空投 / 合成空投 / 签到奖励...
  acquireMethod?: string
  // 空投获取时间（与 date 相同时间存一份，便于精确展示）
  airdropTime?: string
}

export interface PendingOrder {
  id: string
  kind: 'market' | 'sale'            // 市场挂单 / 首页发售
  nftId: string
  name: string
  image: string
  listingId: string          // 市场类：来源挂单 id（可能是静态 id）；发售类：''
  listingKey: string         // 市场类：nftId:number；发售类：nftId + ':sale:' + id
  number: string             // 市场类：该编号；发售类：''（购买后生成）
  price: number              // 单价
  quantity: number           // 份数（市场类固定 1，发售类 1-5）
  expireAt: number           // 过期时间戳(ms)，5 分钟
  paymentMethod: string
}

interface ToastState {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0

export const useStore = defineStore('cangfengart', {
  state: () => ({
    // UI 临时状态（不持久化）
    activeTab: 'home' as string,
    showAuthModal: false,
    showVerifyModal: false,
    toast: null as ToastState | null,
    pendingOrders: [] as PendingOrder[],       // 临时待支付订单（不持久化，刷新释放）
    lockedListingKeys: new Set<string>(),      // 当前锁定的挂单键（nftId:number）

    // 业务状态（持久化）
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
    } as User,
    userAssets: [] as UserAsset[],
    listings: [] as Listing[],
    orders: [] as Order[],
    walletBalance: 10000,
    checkInDays: 0,
    lastCheckInDate: '',
    lotteryCount: 3,
    lotteryDate: '',
    airdropInitialized: false, // 是否已初始化空投订单（避免重复发放）
  }),

  actions: {
    setActiveTab(tab: string) {
      this.activeTab = tab
    },
    setShowAuthModal(show: boolean) {
      this.showAuthModal = show
    },
    setShowVerifyModal(show: boolean) {
      this.showVerifyModal = show
    },
    showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
      const id = ++toastId
      this.toast = { id, message, type }
      setTimeout(() => {
        if (this.toast?.id === id) this.toast = null
      }, 2500)
    },

    setLoggedIn(loggedIn: boolean) {
      this.isLoggedIn = loggedIn
      // 登录时如果用户已实名且还没初始化空投，确保空投订单写入（兼容旧用户数据）
      if (loggedIn && this.isVerified) {
        this.ensureAirdropOrders()
      }
    },
    setVerified(verified: boolean) {
      this.isVerified = verified
      if (verified && !this.user.walletAddress) {
        this.user.walletAddress = generateWalletAddress()
      }
      if (verified) {
        this.ensureAirdropOrders()
      }
    },
    setHasOperationPassword(has: boolean) {
      this.hasOperationPassword = has
    },
    setOperationPassword(pwd: string) {
      this.operationPassword = pwd
      this.hasOperationPassword = true
    },
    verifyOperationPassword(pwd: string): boolean {
      if (!this.operationPassword) return false
      return pwd === this.operationPassword
    },
    updateUser(fields: Partial<User>) {
      this.user = { ...this.user, ...fields }
    },
    generateAndSetNickname() {
      this.user.nickname = generateNickname()
    },
    login() {
      this.isLoggedIn = true
      if (!this.user.uid) this.user.uid = generateUid()
      if (!this.user.nickname) this.user.nickname = generateNickname()
      if (!this.user.phone) this.user.phone = '175****1293'
    },
    logout() {
      this.isLoggedIn = false
      this.isVerified = false
      this.hasOperationPassword = false
      this.operationPassword = ''
      this.user = {
        uid: '',
        nickname: '',
        phone: '',
        walletAddress: '',
        avatar: '',
        address: '',
        realName: '',
        idNumber: '',
      }
      this.userAssets = []
      this.listings = []
      this.orders = []
      this.walletBalance = 10000
      this.checkInDays = 0
      this.lastCheckInDate = ''
      this.lotteryCount = 3
      this.lotteryDate = ''
      this.airdropInitialized = false
    },

    addAsset(
      asset: Omit<UserAsset, 'numbers' | 'purchaseDate' | 'listedNumbers'> & {
        numbers?: string[]
        purchaseDate?: string
      },
    ) {
      const quantity = asset.quantity
      // 优先使用传入的编号，不够则补齐；没有则全部自动生成
      const givenNumbers = (asset.numbers || []).slice(0, quantity)
      const remaining = quantity - givenNumbers.length
      const genNumbers = Array.from({ length: remaining }, () => generateAssetNumber())
      const numbers = [...givenNumbers, ...genNumbers]
      const purchaseDate = asset.purchaseDate || new Date().toISOString()
      const newAsset: UserAsset = {
        nftId: asset.nftId,
        name: asset.name,
        image: asset.image,
        price: asset.price,
        quantity,
        numbers,
        listedNumbers: [],
        purchaseDate,
      }
      const existing = this.userAssets.find((a) => a.nftId === asset.nftId)
      if (existing) {
        // 去重：避免相同编号重复入库
        const deduped = numbers.filter((n) => !existing.numbers.includes(n) && !existing.listedNumbers.includes(n))
        existing.quantity += deduped.length
        existing.numbers.push(...deduped)
        existing.purchaseDate = purchaseDate
      } else {
        this.userAssets.push(newAsset)
      }
    },

    consignAsset(nftId: string, number: string, price: number): boolean {
      const asset = this.userAssets.find((a) => a.nftId === nftId)
      if (!asset) return false
      if (!asset.numbers.includes(number)) return false
      if (asset.listedNumbers.includes(number)) return false

      const fee = Math.round(price * 0.03 * 100) / 100
      const netAmount = Math.round((price - fee) * 100) / 100

      asset.numbers = asset.numbers.filter((n) => n !== number)
      asset.listedNumbers.push(number)
      this.listings.push({
        id: generateUid(),
        nftId,
        name: asset.name,
        image: asset.image,
        number,
        price,
        seller: '汇付支付',
        fee,
        netAmount,
      })
      return true
    },

    buyListing(listingId: string, nftName: string, nftImage: string): boolean {
      const listing = this.listings.find((l) => l.id === listingId)
      if (!listing) return false

      this.listings = this.listings.filter((l) => l.id !== listingId)
      const existing = this.userAssets.find((a) => a.nftId === listing.nftId)
      if (existing) {
        existing.quantity += 1
        existing.numbers.push(listing.number)
      } else {
        this.userAssets.push({
          nftId: listing.nftId,
          name: nftName,
          image: nftImage,
          price: listing.price,
          quantity: 1,
          purchaseDate: new Date().toISOString(),
          numbers: [listing.number],
          listedNumbers: [],
        })
      }
      this.walletBalance -= listing.price
      return true
    },

    cancelListing(listingId: string) {
      const listing = this.listings.find((l) => l.id === listingId)
      if (!listing) return

      this.listings = this.listings.filter((l) => l.id !== listingId)
      const asset = this.userAssets.find((a) => a.nftId === listing.nftId)
      if (asset) {
        asset.numbers.push(listing.number)
        asset.listedNumbers = asset.listedNumbers.filter((n) => n !== listing.number)
      }
    },

    addOrder(order: Omit<Order, 'id' | 'date'>) {
      const iso = new Date().toISOString()
      // 注入默认「获取方式」描述
      let acquireMethod = order.acquireMethod
      if (!acquireMethod) {
        if (order.type === 'airdrop') acquireMethod = '藏品空投'
        else if (order.type === 'sale') acquireMethod = '首发购买'
        else if (order.type === 'market') acquireMethod = '市场购买'
      }
      this.orders.unshift({
        ...order,
        acquireMethod,
        id: generateUid(),
        date: iso,
        // 空投订单若无 airdropTime，则与下单时间对齐
        airdropTime: order.type === 'airdrop' ? (order.airdropTime || iso) : undefined,
      })
    },

    /**
     * 直接插入一条空投订单（支持自定义时间/编号/获取方式）
     */
    addAirdropOrder(input: {
      nftId: string
      name: string
      image: string
      number?: string
      price?: number
      quantity?: number
      acquireMethod: string
      airdropTime: string // ISO 字符串
    }) {
      const iso = input.airdropTime
      const quantity = input.quantity ?? 1
      const numbers = input.number ? [input.number] : undefined
      this.orders.unshift({
        id: generateUid(),
        nftId: input.nftId,
        name: input.name,
        image: input.image,
        number: input.number,
        price: input.price ?? 0,
        quantity,
        type: 'airdrop',
        status: 'airdrop',
        date: iso,
        airdropTime: iso,
        acquireMethod: input.acquireMethod,
      })
      // 空投藏品同时入库到用户资产（我的仓库）
      this.addAsset({
        nftId: input.nftId,
        name: input.name,
        image: input.image,
        price: input.price ?? 0,
        quantity,
        numbers,
        purchaseDate: iso,
      })
    },

    /**
     * 首次实名认证后发放「空投订单」（新用户注册空投 + 运营活动空投各 1 条）
     * 同时确保空投对应的藏品已入库到用户资产（兼容历史老数据）
     */
    ensureAirdropOrders() {
      const now = Date.now()
      // 老数据兼容：已初始化过空投但可能未入库资产 → 扫描空投订单补全入库
      if (this.airdropInitialized) {
        const airdropOrders = this.orders.filter((o) => o.type === 'airdrop')
        for (const o of airdropOrders) {
          const existingAsset = this.userAssets.find((a) => a.nftId === o.nftId)
          if (o.number) {
            // 按编号维度判断：该编号不在资产里就补入
            const hasNumber =
              existingAsset &&
              (existingAsset.numbers.includes(o.number) || existingAsset.listedNumbers.includes(o.number))
            if (!hasNumber) {
              this.addAsset({
                nftId: o.nftId,
                name: o.name,
                image: o.image,
                price: o.price,
                quantity: 1,
                numbers: [o.number],
                purchaseDate: o.airdropTime || o.date,
              })
            }
          } else if (!existingAsset) {
            // 无编号字段的老空投：按 nftId 维度兜底补入
            this.addAsset({
              nftId: o.nftId,
              name: o.name,
              image: o.image,
              price: o.price,
              quantity: o.quantity || 1,
              purchaseDate: o.airdropTime || o.date,
            })
          }
        }
        return
      }

      this.airdropInitialized = true
      const d1 = new Date(now - 3 * 86400000 - 7 * 3600 * 1000 - 22 * 60 * 1000).toISOString()
      const d2 = new Date(now - 1 * 86400000 - 13 * 3600 * 1000 - 45 * 60 * 1000).toISOString()
      // 空投 1：新用户注册空投
      this.addAirdropOrder({
        nftId: 'airdrop-genesis',
        name: '创世纪念徽章',
        image: 'nft-badge',
        number: '#A0001',
        price: 0,
        quantity: 1,
        acquireMethod: '新用户注册空投',
        airdropTime: d1,
      })
      // 空投 2：平台运营活动空投
      this.addAirdropOrder({
        nftId: 'airdrop-opening',
        name: '开服限定头像',
        image: 'nft-avatar',
        number: '#OP088',
        price: 0,
        quantity: 1,
        acquireMethod: '平台运营活动空投',
        airdropTime: d2,
      })
    },

    checkIn() {
      const today = new Date().toISOString().split('T')[0]
      if (this.lastCheckInDate === today) return
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const isContinuous = this.lastCheckInDate === yesterday
      this.checkInDays = isContinuous ? this.checkInDays + 1 : 1
      this.lastCheckInDate = today
    },

    drawLottery(): boolean {
      const today = new Date().toISOString().split('T')[0]
      const count = this.lotteryDate === today ? this.lotteryCount : 3
      if (count <= 0) return false
      this.lotteryCount = count - 1
      this.lotteryDate = today
      return true
    },

    updateWalletBalance(amount: number) {
      this.walletBalance += amount
    },

    // ===== 订单支付页：临时待支付订单（5 分钟锁定） =====
    isListingLocked(nftId: string, number: string): boolean {
      return this.lockedListingKeys.has(`${nftId}:${number}`)
    },

    createPendingOrder(input: {
      kind: 'market' | 'sale'
      nftId: string
      name: string
      image: string
      listingId: string
      number: string
      price: number
      quantity: number
    }): PendingOrder | null {
      const id = generateUid()
      const key =
        input.kind === 'market'
          ? `${input.nftId}:${input.number}`
          : `${input.nftId}:sale:${id}`
      // 市场挂单需防并发锁定；发售类不与编号绑定
      if (input.kind === 'market' && this.lockedListingKeys.has(key)) return null
      const order: PendingOrder = {
        id,
        kind: input.kind,
        nftId: input.nftId,
        name: input.name,
        image: input.image,
        listingId: input.listingId,
        listingKey: key,
        number: input.number,
        price: input.price,
        quantity: Math.max(1, Math.min(5, input.quantity || 1)),
        expireAt: Date.now() + 5 * 60 * 1000,
        paymentMethod: 'huifu',
      }
      this.pendingOrders.push(order)
      this.lockedListingKeys.add(key)
      return order
    },

    getPendingOrder(orderId: string): PendingOrder | undefined {
      return this.pendingOrders.find((o) => o.id === orderId)
    },

    updateSalePendingQuantity(orderId: string, quantity: number) {
      const order = this.pendingOrders.find((o) => o.id === orderId)
      if (!order || order.kind !== 'sale') return
      order.quantity = Math.max(1, Math.min(5, quantity))
    },

    setPendingPaymentMethod(orderId: string, method: string) {
      const order = this.pendingOrders.find((o) => o.id === orderId)
      if (order) order.paymentMethod = method
    },

    // 超时/手动取消：释放挂单锁 + 移除 pending
    expirePendingOrder(orderId: string) {
      const idx = this.pendingOrders.findIndex((o) => o.id === orderId)
      if (idx < 0) return
      const order = this.pendingOrders[idx]
      this.lockedListingKeys.delete(order.listingKey)
      this.pendingOrders.splice(idx, 1)
    },

    // 支付成功
    payPendingOrder(orderId: string): boolean {
      const order = this.pendingOrders.find((o) => o.id === orderId)
      if (!order) return false
      if (Date.now() > order.expireAt) {
        this.expirePendingOrder(orderId)
        return false
      }
      const total = order.price * order.quantity
      if (order.kind === 'market') {
        const ok = this.buyListing(order.listingId, order.name, order.image)
        if (!ok) {
          const existing = this.userAssets.find((a) => a.nftId === order.nftId)
          if (existing) {
            existing.quantity += 1
            existing.numbers.push(order.number)
          } else {
            this.userAssets.push({
              nftId: order.nftId,
              name: order.name,
              image: order.image,
              price: order.price,
              quantity: 1,
              purchaseDate: new Date().toISOString(),
              numbers: [order.number],
              listedNumbers: [],
            })
          }
          this.walletBalance -= total
        }
        this.addOrder({
          nftId: order.nftId,
          name: order.name,
          image: order.image,
          number: order.number,
          price: order.price,
          quantity: 1,
          type: 'market',
          status: 'paid',
        })
      } else {
        // 发售类：多份入库 + 扣余额
        this.addAsset({
          nftId: order.nftId,
          name: order.name,
          image: order.image,
          price: order.price,
          quantity: order.quantity,
        })
        this.walletBalance -= total
        this.addOrder({
          nftId: order.nftId,
          name: order.name,
          image: order.image,
          price: order.price,
          quantity: order.quantity,
          type: 'sale',
          status: 'paid',
        })
      }
      this.lockedListingKeys.delete(order.listingKey)
      this.pendingOrders = this.pendingOrders.filter((o) => o.id !== orderId)
      return true
    },
  },

  persist: {
    key: 'cangfengart-storage',
    paths: [
      'isLoggedIn',
      'isVerified',
      'hasOperationPassword',
      'operationPassword',
      'user',
      'userAssets',
      'listings',
      'orders',
      'walletBalance',
      'checkInDays',
      'lastCheckInDate',
      'lotteryCount',
      'lotteryDate',
      'airdropInitialized',
    ],
  },
})
