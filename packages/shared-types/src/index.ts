// ─── Enums ────────────────────────────────────────────────────────

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPPLIER = 'SUPPLIER',      // Fornecedor
  RETAILER = 'RETAILER',      // Lojista
  ENTREPRENEUR = 'ENTREPRENEUR', // Empreendedor
  CUSTOMER = 'CUSTOMER',      // Cliente Final
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum StoreStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DELETED = 'DELETED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
  WALLET = 'WALLET',
}

export enum CampaignType {
  CASHBACK = 'CASHBACK',
  COUPON = 'COUPON',
  GIFT = 'GIFT',
  FLASH_SALE = 'FLASH_SALE',
}

export enum CashbackStatus {
  PENDING = 'PENDING',
  AVAILABLE = 'AVAILABLE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

export enum NotificationType {
  ORDER_NEW = 'ORDER_NEW',
  ORDER_STATUS = 'ORDER_STATUS',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  STORE_APPROVED = 'STORE_APPROVED',
  CAMPAIGN_STARTED = 'CAMPAIGN_STARTED',
  LOW_STOCK = 'LOW_STOCK',
  SYSTEM = 'SYSTEM',
}

export enum FavoriteType {
  PRODUCT = 'PRODUCT',
  STORE = 'STORE',
}

export enum ReviewTargetType {
  PRODUCT = 'PRODUCT',
  STORE = 'STORE',
  SUPPLIER = 'SUPPLIER',
}

// ─── Interfaces Base ──────────────────────────────────────────────

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Usuário ──────────────────────────────────────────────────────

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  profile?: UserProfile;
  wallet?: Wallet;
}

export interface Wallet extends BaseEntity {
  userId: string;
  balance: number;
}


export interface UserProfile {
  id: string;
  userId: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  document?: string;
  birthDate?: string;
}

export interface Address extends BaseEntity {
  userId: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// ─── Loja ─────────────────────────────────────────────────────────

export interface Store extends BaseEntity {
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  status: StoreStatus;
  rating: number;
  totalSales: number;
  owner?: User;
}

// ─── Produto ──────────────────────────────────────────────────────

export interface Product extends BaseEntity {
  storeId: string;
  supplierId?: string;
  name: string;
  slug: string;
  description?: string;
  priceRetail: number;
  priceWholesale?: number;
  wholesaleMinQty?: number;
  stock: number;
  images: string[];
  categoryId: string;
  status: ProductStatus;
  store?: Store;
  category?: Category;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  parentId?: string;
  icon?: string;
  children?: Category[];
}

// ─── Pedido ───────────────────────────────────────────────────────

export interface Order extends BaseEntity {
  buyerId: string;
  storeId: string;
  status: OrderStatus;
  total: number;
  paymentStatus: PaymentStatus;
  addressId: string;
  items: OrderItem[];
  payment?: Payment;
  buyer?: User;
  store?: Store;
  address?: Address;
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: Product;
}

export interface Payment extends BaseEntity {
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId?: string;
  paidAt?: string;
}

// ─── Campanhas ────────────────────────────────────────────────────

export interface Campaign extends BaseEntity {
  storeId: string;
  name: string;
  type: CampaignType;
  discount: number;
  startDate: string;
  endDate: string;
  active: boolean;
  coupons?: Coupon[];
}

export interface Coupon extends BaseEntity {
  campaignId: string;
  code: string;
  discount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  usageLimit?: number;
  usedCount: number;
  minOrderValue?: number;
  expiresAt: string;
}

export interface Transaction extends BaseEntity {
  walletId: string;
  orderId?: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description?: string;
}


// ─── Avaliação ────────────────────────────────────────────────────

export interface Review extends BaseEntity {
  authorId: string;
  targetId: string;
  targetType: ReviewTargetType;
  rating: number;
  comment?: string;
  author?: User;
}

// ─── Notificação ──────────────────────────────────────────────────

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  data?: Record<string, unknown>;
}

// ─── Favorito ─────────────────────────────────────────────────────

export interface Favorite extends BaseEntity {
  userId: string;
  targetId: string;
  targetType: FavoriteType;
}

// ─── Analytics ────────────────────────────────────────────────────

export interface AnalyticsOverview {
  totalUsers: number;
  totalStores: number;
  totalOrders: number;
  totalRevenue: number;
  pendingStores: number;
  activeProducts: number;
  newUsersToday: number;
  ordersToday: number;
}

export interface SalesData {
  date: string;
  total: number;
  count: number;
}

// ─── API Response ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// ─── Auth ─────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
