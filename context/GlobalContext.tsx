import { createContext, useContext, useReducer, useState } from "react";
import { addNewProduct, addStockToProduct, addStockToProductUpdate, dailySale, dailyTicket, deleteProductToCart, findToAddProductCart, generateSold, getBrands, getCategory, getFilterProductByStock, getIncomePerDay, getMarcaSocio, getProductsSales, getTotalSalesPerYear, validateUserPin } from "../reducer/Product";
import { Library, ProductsReducer } from "../reducer/Product.reducer";
import { getProductByCodeToUpdateContext } from "../reducer/UpdateProducts";
import { dataToStatistics } from "../reducer/Statistics";
import { cancelTicket, getTickets } from "../reducer/ventas";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { authApp } from "../firebase/firebase.config";
import { User, loginWithEmail, signin } from "../reducer/google";
import { getUser } from "../reducer/user";

interface Props {
  children: React.ReactNode
}
type GlobalContextProps = {
  LibraryData: LibraryAllData,
  addProduct: (productData: FormProductValues) => void,
  showCategory: () => void,
  showBrands: () => void,
  showModalCategory: boolean,
  showModalUpdateCategory: boolean,
  showModalDeleteCategory: boolean,
  showModalBrands: boolean,
  showModalUpdateBrands: boolean,
  showModalDeleteBrands: boolean,
  showUpdateCategory: () => void,
  showDeleteCategory: () => void,
  showDeleteBrands: () => void,
  showUpdateBrands: () => void,
  category: () => void,
  brands: () => void,
  addProductRegisterToSell: (id: string, cart: ProductToCart[] | undefined) => void,
  deleteProductCart: (cart: ProductToCart[], codeFromProduct: string | undefined) => void,
  soldProducts: (cart: ProductToCart[] | undefined) => void,
  stateLoader: (state: boolean) => void,
  stateGenerateSoldLoader: (state: boolean) => void,
  loaderRegisterProducts: (state: boolean) => void,
  dailySaleContext: () => void,
  dailyTicketContext: () => void,
  addStockToProductContext: (codeProduct: string) => void,
  stateLoaderFromChargerStock: (state: boolean) => void,
  stateLoaderFromChargerStockAdd: (state: boolean) => void,
  addStockToProductUpdateContext: (codeProduct: ProductToCart, stock: StockProductCharger) => void,
  marcaSocio: () => void,
  incomePerDay: () => void,
  totalSalesPerYearContext: () => void,
  filterProductByStock: (paramsFilter: FilterProdyctBySTock) => void,
  productByCodeToUpdateContext: (code: string) => void,
  showGenerateSale: (boolean: boolean) => void,
  resetValueToastify: () => void,
  incrementAmountToItemFromCart: (amount: number, code: string) => void,
  getProductsSalesContext: () => void,
  resetToastifyNotificationAddProduct: () => void,
  getDataToStatistics: () => void,
  getTicketsContext: (dateData: DateData) => void,
  setModalCancellationOfSale: (value: boolean) => void,
  cancelTicketContext: (ticket: Ticket) => void,
  loginWithEmailContext: (userDate: UserData) => void,
  signinWithEmailContext: (userDate: UserData) => void,
  saveDataUser: (saveDataUser: SaveUserData) => void,
  getDataUser: (idUser: string) => void,
  validateUserPinContext: (idUser: string, pin: string) => void,
  resetPin: () => void,
  loaderState: (boolean:boolean) => void,
  showSidebarContext : (state:boolean) => void,
  getDataUserContext: (id:string) => void
}


export const GlobalContext = createContext<GlobalContextProps>({} as GlobalContextProps)

export function GlobalcontextProdiver({ children }: Props) {
  const auth = getAuth(authApp)
  const [LibraryData, dispatch] = useReducer(ProductsReducer, Library)
  const [showModalCategory, setShowModalCategory] = useState<boolean>(false)
  const [showModalUpdateCategory, setShowModalUpdateCategory] = useState<boolean>(false)
  const [showModalDeleteCategory, setShowModalDeleteCategory] = useState<boolean>(false)
  const [showModalBrands, setShowModalBrands] = useState<boolean>(false)
  const [showModalUpdateBrands, setShowModalUpdateBrands] = useState<boolean>(false)
  const [showModalDeleteBrands, setShowModalDeleteBrands] = useState<boolean>(false)
  // const [showSidebar, setShowSidebar] = useState<boolean>(false)

  const getDataUserContext = (id:string) => {
    getUser(dispatch, id as string)
  }
  const showSidebarContext = (state:boolean) => {
    dispatch({type:"showSidebar", payload:state})
  }
  const loaderState = (boolean: boolean) => {
    dispatch({ type: "loader", payload: boolean })
  }
  const resetPin = () => {
    dispatch({ type: "validatePin", payload: false })
  }
  const validateUserPinContext = (idUser: string, pin: string) => {
    validateUserPin(dispatch, idUser, pin)
  }
  const getDataUser = (idUser: string) => {
    User(dispatch, idUser)
  }
  const saveDataUser = (saveDataUser: SaveUserData) => {
    dispatch({ type: "saveDataUser", payload: saveDataUser })
  }
  const loginWithEmailContext = (userDate: UserData) => {
    loginWithEmail(userDate)
  }
  const signinWithEmailContext = (userDate: UserData) => {
    signin(userDate)
  }
  const cancelTicketContext = (ticket: Ticket) => {
    cancelTicket(ticket)
  }
  const setModalCancellationOfSale = (value: boolean) => {
    dispatch({ type: "showCancellationOfsaleModal", payload: !value })
  }
  const getTicketsContext = (dateData: DateData) => {
    getTickets(dispatch, dateData)
  }
  const getDataToStatistics = () => {
    dataToStatistics(dispatch)

  }
  const resetToastifyNotificationAddProduct = () => {
    dispatch({ type: "resetToastifyNotificationAddProduct" })
  }

  const getProductsSalesContext = () => {
    getProductsSales(dispatch)
  }

  const incrementAmountToItemFromCart = (amount: number, code: string) => {
    dispatch({ type: "incrementAmountToItemFromCart", payload: amount, payload2: code, payload3: LibraryData.productToCart })
  }
  const addProduct = (productData: FormProductValues) => {
    addNewProduct(dispatch, productData)
  }
  const resetValueToastify = () => {
    dispatch({ type: "tostifyNotificationSales", payload: 0 })
  }
  const showGenerateSale = (boolean: boolean) => {
    // setShowSaleModal(!showSaleModal)
    dispatch({ type: "showSaleModal", payload: !boolean })
  }
  const showCategory = () => {
    setShowModalCategory(!showModalCategory)
  }
  const showUpdateCategory = () => {
    setShowModalUpdateCategory(!showModalUpdateCategory)
  }
  const showDeleteCategory = () => {
    setShowModalDeleteCategory(!showModalDeleteCategory)
  }
  const showBrands = () => {
    setShowModalBrands(!showModalBrands)
  }
  const showUpdateBrands = () => {
    setShowModalUpdateBrands(!showModalUpdateBrands)
  }
  const showDeleteBrands = () => {
    setShowModalDeleteBrands(!showModalDeleteBrands)
  }
  const category = () => {
    getCategory(dispatch)
  }
  const brands = () => {
    getBrands(dispatch)
  }
  const addProductRegisterToSell = (id: string, cart: ProductToCart[] | undefined) => {
    findToAddProductCart(dispatch, id, cart)
  }
  const deleteProductCart = (cart: ProductToCart[], codeFromProduct: string | undefined) => {
    deleteProductToCart(dispatch, cart, codeFromProduct)
  }
  const soldProducts = (cart: ProductToCart[] | undefined) => {
    generateSold(dispatch, cart, 0)
  }
  const stateLoader = (state: boolean) => {
    dispatch({ type: "loaderToSell", payload: state })
  }
  const stateGenerateSoldLoader = (state: boolean) => {
    dispatch({ type: "generateSold", payload: state })
  }
  const loaderRegisterProducts = (state: boolean) => {
    dispatch({ type: "loaderRegisterProduct", payload: state })
  }
  const dailySaleContext = () => {
    dailySale(dispatch)
  }
  const dailyTicketContext = () => {
    dailyTicket(dispatch)
  }
  const addStockToProductContext = (codeProduct: string) => {
    addStockToProduct(dispatch, codeProduct)
  }
  const stateLoaderFromChargerStock = (state: boolean) => {
    dispatch({ type: "loaderChargerStock", payload: state })
  }
  const stateLoaderFromChargerStockAdd = (state: boolean) => {
    dispatch({ type: "loaderChargerStockAdd", payload: state })
  }
  const addStockToProductUpdateContext = (codeProduct: ProductToCart, stock: StockProductCharger) => {
    addStockToProductUpdate(dispatch, codeProduct, stock)
  }
  const marcaSocio = () => {
    getMarcaSocio(dispatch)
  }
  const incomePerDay = () => {
    getIncomePerDay(dispatch)
  }
  const totalSalesPerYearContext = () => {
    getTotalSalesPerYear(dispatch)
  }
  const filterProductByStock = (paramsFilter: FilterProdyctBySTock) => {
    getFilterProductByStock(dispatch, paramsFilter)
  }
  const productByCodeToUpdateContext = (code: string) => {
    getProductByCodeToUpdateContext(dispatch, code)
  }

  return (
    <GlobalContext.Provider value={{
      getDataUserContext,
      showSidebarContext,
      loaderState,
      resetPin,
      validateUserPinContext,
      getDataUser,
      saveDataUser,
      signinWithEmailContext,
      loginWithEmailContext,
      cancelTicketContext,
      setModalCancellationOfSale,
      getTicketsContext,
      getDataToStatistics,
      resetToastifyNotificationAddProduct,
      getProductsSalesContext,
      LibraryData,
      addProduct,
      showCategory,
      showBrands,
      showUpdateCategory,
      showDeleteCategory,
      showModalCategory,
      showModalUpdateCategory,
      showModalDeleteCategory,
      showUpdateBrands,
      showDeleteBrands,
      showModalBrands,
      showModalUpdateBrands,
      showModalDeleteBrands,
      category,
      brands,
      addProductRegisterToSell,
      deleteProductCart,
      soldProducts,
      stateLoader,
      stateGenerateSoldLoader,
      loaderRegisterProducts,
      dailySaleContext,
      dailyTicketContext,
      addStockToProductContext,
      stateLoaderFromChargerStock,
      addStockToProductUpdateContext,
      stateLoaderFromChargerStockAdd,
      marcaSocio,
      incomePerDay,
      totalSalesPerYearContext,
      filterProductByStock,
      productByCodeToUpdateContext,
      showGenerateSale,
      resetValueToastify,
      incrementAmountToItemFromCart
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)