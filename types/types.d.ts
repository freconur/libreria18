
interface UserData {
  user?: string,
  password?:string,
  id?:string
}
interface SaveUserData {
  displayName?:string,
  photoURL?:string,
  email?:string,
}
interface User {
  id?:string,
  dni?:string,
  acc?:string,
  fechaNacimiento?:Date,
  name?:string,
  lastname?:string,
  pin?:number,
  rol?:string,
  picture?:string
}
interface GeneralStatisticsPerDay {
  date?: number,
  dailySales?: number,
  tickets?: number,
  averageTicket?: number,
  growthTicket?: Number,
  growthSales?: Number,
  growthAverageTicket?: Number,
}
interface FormProductValues {
  code?: string,
  description?: string,
  price?: string,
  category?: string,
  brand?: string,
  stock?: number,
  marcaSocio?: string

}
interface StatisticsData {
  averageTickets?: number,
  dailySales?: number,
  growthAverageTickets?: number,
  growthDailySales?: number,
  growthTickets?: number,
  tickets?: number,
}
interface LibraryAllData {
  loader: boolean,
  newProduct?: FormProductValues,
  brands?: Brands[],
  category?: Category[],
  productToCart?: ProductToCart[],
  totalAmountToCart: number,
  currentlyDate: string,
  loaderToSell: boolean,
  productNotFound: string,
  generateSold: boolean,
  loaderRegisterProduct: boolean,
  dailySale?: number,
  dailyTicket?: number,
  averageTicket?: number,
  addStockProduct?: ProductToCart | string,
  loaderChargerStock: boolean,
  loaderChargerStockAdd: boolean,
  marcaSocio: MarcaSocio[],
  dataSales: number[],
  dataSalesLabel: string[],
  dataTotalSalesPerMonth: number,
  totalSalesYear: number,
  productsFromFilterByStock: ProductToCart[],
  productToUpdate: ProductToCart,
  showSaleModal: boolean,
  tostifyNotificationSales: number,
  getProductsSales: ProductToCart[],
  resetToastifyNotificationAddProduct: number,
  toastifyNotificationAddProduct: number,
  dataStatistics: GeneralStatisticsPerDay[],
  getTickets:Ticket[],
  showCancellationOfsaleModal: boolean,
  saveDataUser:SaveUserData,
  getDataUser:User,
  validatePin:boolean,
  showSidebar: boolean,
  getUser: User
}
interface DateData {
  date: number,
  month:string,
  year:number
}
interface Brands {
  id?: string
  name?: string
}
interface Category {
  id?: string
  name?: string
}
interface Brand {
  id?: string
  name?: string
}
interface ProductToCart {
  code?: string,
  description?: string,
  price?: string,
  category?: string,
  brand?: string,
  stock?: string,
  amount?: number,
  warning?: string,
  active?: boolean,
  marcaSocio?: string,
  id?: string,
  totalAmountSale?: number,
  warningAmount?:boolean,
  cancelAmount?:number,
  dateLastModified?:Date | toDate
}
interface Ticket {
  id?: string,
  date?: Date | string,
  timestamp: Date | string | toDate,
  product: ProductsFromTicket[] | undefined | ProductToCart[],
  library18: boolean
}
interface ProductsFromTicket {
  code?: string,
  amount?: number,
  description?: string,
  price?:string,
  brand?:string,
  stock?:number,
  warning?:string,
  marcaSocio?:string,
  category?:string,
  cancelAmount?:number,
  warningAmount?:boolean,
  dateLastModified?:Date | toDate
}

interface NumberTicket {
  ticket?: number
}

interface StockProductCharger {
  stock: number
}
interface MarcaSocio {
  id?: string
  name?: string
}
interface DailySales {
  amount?: number,
  id?: string | number
}
interface FilterProdyctBySTock {
  stock: number,
  marcaSocio: string,
  brand: string
}
interface CodeProduct {
  code: string
}