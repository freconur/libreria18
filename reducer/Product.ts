
import { OrderByDirection, QuerySnapshot, Timestamp, addDoc, collection, deleteDoc, doc, endAt, endBefore, getDoc, getDocs, getFirestore, increment, limit, onSnapshot, orderBy, query, setDoc, startAfter, updateDoc, where } from "firebase/firestore";
import { app } from "../firebase/firebase.config";
import { currentDate, currentMonth, currentYear } from "../dates/date";

const db = getFirestore(app)
const YEAR_MONTH = `${currentMonth()}-${currentYear()}/${currentMonth()}-${currentYear()}`
const yearMonth = `${currentMonth()}-${currentYear()}`

export const addNewProduct = async (dispatch: (action: any) => void, productData: FormProductValues) => {

  console.log('productData', productData)
  const docRef = doc(db, "products", productData.code as string); // busco en la base de datos
  // const docSnap = await getDoc(docRef);
  // const prod = docSnap?.data()

  // if(prod) {
  //   console.log('ya existe el producto')
  // }
  await setDoc(doc(db, "products", `${productData.code}`), productData)
    .then(r => {
      dispatch({ type: "newProduct", payload: productData })
      dispatch({ type: "loaderRegisterProduct", payload: false })
    })
}

export const getDailySales = async () => {
  const ref = doc(db, `/dailysale/vAWFt15qlNVykhHvNno0/${currentMonth()}-${currentYear()}`, "15")
  // const ref = collection(db, `/dailysale/vAWFt15qlNVykhHvNno0/${currentMonth()}-${currentYear()}/${currentDate()}`)
  const snap = await getDoc(ref)
  console.log('snap.docs', snap.data())
  return snap.data()
}
export const getBrands = (dispatch: (action: any) => void) => {
  const res = collection(db, `marcas`);

  // const q = query(res, orderBy("name"));

  onSnapshot(res, (snapshot) => {
    const brands: Brands[] = [];
    snapshot.docs.forEach((doc) => {
      brands.push({ ...doc.data(), id: doc.id });
    });
    const rta = brands.sort((a, b) => {
      if (`${a.name}` > `${b.name}`) {
        return 1;
      }
      if (`${a.name}` < `${b.name}`) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
    dispatch({ type: "brands", payload: rta })
  })
}
export const getCategory = (dispatch: (action: any) => void) => {
  const res = collection(db, `categorias`);

  onSnapshot(res, (snapshot) => {
    const category: Category[] = [];
    snapshot.docs.forEach((doc) => {
      category.push({ ...doc.data(), id: doc.id });
    });
    const rta = category.sort((a, b) => {
      if (`${a.name}` > `${b.name}`) {
        return 1;
      }
      if (`${a.name}` < `${b.name}`) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
    dispatch({ type: "category", payload: rta })
  })
}
export const getMarcaSocio = (dispatch: (action: any) => void) => {
  const res = collection(db, 'marca-socio')

  onSnapshot(res, (snapshot) => {
    const marcaSocio: MarcaSocio[] = []
    snapshot.docs.forEach((doc) => {
      marcaSocio.push({ ...doc.data(), id: doc.id })
    })
    dispatch({ type: "marcaSocio", payload: marcaSocio })

  })
}
export const addNewCategory = async (categoryData: Category) => {
  await addDoc(collection(db, "categorias"), categoryData);
}

export const updateCategory = async (category: Category | undefined) => {
  const ref = doc(db, "categorias", category?.id as string);
  await updateDoc(ref, { name: category?.name })
}
export const updateBrand = async (brand: Brands | undefined) => {
  const ref = doc(db, "marcas", brand?.id as string);
  await updateDoc(ref, { name: brand?.name })
}

export const deleteCategory = async (category: Category | undefined) => {
  await deleteDoc(doc(db, "categorias", category?.id as string));
}
export const deleteBrand = async (brand: Brands | undefined) => {
  await deleteDoc(doc(db, "marcas", brand?.id as string));
}
export const addNewBrand = async (brandData: Brand) => {
  await addDoc(collection(db, "marcas"), brandData);
}

export const findToAddProductCart = async (dispatch: (action: any) => void, codeProduct: string, cart: ProductToCart[] | undefined) => {

  let rta: ProductToCart
  if (codeProduct === null || undefined) {
    return null
  } else {
    const docRef = doc(db, "products", codeProduct); // busco en la base de datos
    const docSnap = await getDoc(docRef);
    const prod = docSnap?.data()

    if (docSnap.exists()) {
      console.log('existe')
      dispatch({ type: "productNotFound" })
      dispatch({ type: "loaderToSell", payload: true })
      //compruebo si se encuentra en el array cart
      const productCartRepeat = cart?.find(prod => prod.code === codeProduct)
      if (productCartRepeat) {
        // console.log('no hacemos nada')
        //       dispatch({ type: "loaderToSell", payload: false })

        cart?.map(prod => {
          if (prod.code === productCartRepeat.code) {
            productCartRepeat.amount = productCartRepeat?.amount as number + 1
            if (Number(productCartRepeat.amount) < Number(prod.stock)) {
              dispatch({ type: "productToCart", payload: cart })
              dispatch({ type: "loaderToSell", payload: false })
              dispatch({ type: "toastifyNotificationAddProduct" })
            }
            if (Number(productCartRepeat.amount) === Number(prod.stock)) {
              dispatch({ type: "productToCart", payload: cart })
              dispatch({ type: "loaderToSell", payload: false })
              dispatch({ type: "toastifyNotificationAddProduct" })

            }
            if (Number(productCartRepeat.amount) > Number(prod.stock)) {
              console.log('se pasaron')
              productCartRepeat.amount = productCartRepeat?.amount as number - 1
              productCartRepeat.warning = "no puedes cargar mas productos"
              dispatch({ type: "productToCart", payload: cart })
              dispatch({ type: "loaderToSell", payload: false })
              dispatch({ type: "toastifyNotificationAddProduct" })

            }
          }
        })
      } else {
        if (prod?.stock === 0) {
          const amount = { amount: prod?.stock }
          rta = { ...prod, ...amount }
          cart?.unshift(rta)
          dispatch({ type: "productToCart", payload: cart })
          dispatch({ type: "loaderToSell", payload: false })
          dispatch({ type: "toastifyNotificationAddProduct" })

        }
        if (prod?.stock > 0) {
          console.log('hay stock')
          const amount = { amount: 1, warning: "" }
          rta = { ...prod, ...amount }
          cart?.unshift(rta)
          dispatch({ type: "productToCart", payload: cart })
          dispatch({ type: "loaderToSell", payload: false })
          dispatch({ type: "toastifyNotificationAddProduct" })

        }
      }
    } else {
      dispatch({ type: "loaderToSell", payload: false })
      dispatch({ type: "productNotFound", payload: "not found" })
    }
  }
}

export const deleteProductToCart = (dispatch: (action: any) => void, cart: ProductToCart[], codeFromProduct: string | undefined) => {
  console.log('cart', cart)
  console.log('codeFromProduct', codeFromProduct)
  const cartAfterToDelete = cart.filter(prod => prod.code !== codeFromProduct)
  console.log('cartAfterToDelete', cartAfterToDelete)
  return dispatch({ type: "productToCart", payload: cartAfterToDelete })

}



export const dailySale = async (dispatch: (action: any) => void) => {
  // const dailySaleRef = doc(db, "/dailysale", "vAWFt15qlNVykhHvNno0")
  // const dailySaleRef = doc(db, `/dailysale/vAWFt15qlNVykhHvNno0/${yearMonth}/`, currentDate() as string)
  const dailySaleRef = doc(db, `/dailysale/vAWFt15qlNVykhHvNno0/${yearMonth}/`, `${currentDate()}`)

  const docSnap = await getDoc(dailySaleRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    onSnapshot(dailySaleRef, (doc) => {
      // const data:number = doc.data()?.amount
      dispatch({ type: "dailySale", payload: doc.data()?.amount})
      // dispatch({ type: "dailySale", payload: docSnap.data()?.amount })

    })

  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  // onSnapshot(dailySaleRef, (snapshot) => {
  //   console.log("amount", snapshot.data()?.amount)
  //   dispatch({ type: "dailySale", payload: snapshot.data()?.amount })
  // })
}



export const dailyTicket = async (dispatch: (action: any) => void) => {
  // const q = query(collection(db, "cities")
  const res = query(collection(db, `/db-ventas/xB98zEEqUPU3LXiIf7rQ/${YEAR_MONTH}/${currentDate()}`));
  const docSnap = await getDocs(res)
  let totalAmountDailySale: number = 0
  let dailyTicket: number = 0
  docSnap.docs.forEach(ticket => {
    if (ticket.data().library18 === true) {
      dailyTicket = dailyTicket + 1
      const productsOfTicket = ticket.data().product
      productsOfTicket.map((item: ProductToCart) => {
        totalAmountDailySale = totalAmountDailySale + (Number(item.amount) * Number(item.price))
      })
    }
  })
  // console.log('totalAmountDailySale', totalAmountDailySale)
  // console.log('dailyTicket', docSnap)
  const averageTicket = totalAmountDailySale / dailyTicket
  dispatch({ type: "dailyTicket", payload: dailyTicket })
  dispatch({ type: "averageTicket", payload: averageTicket })
  // const dailySaleRef = doc(db, `/db-ventas/xB98zEEqUPU3LXiIf7rQ/${YEAR_MONTH}/${currentDate()}`)
  // const docSnap = await getDoc(dailySaleRef)
  // console.log('dailySaleRef', dailySaleRef)
  // console.log('docSnap', docSnap)
}
export const generateSold = async (dispatch: (action: any) => void, cart: ProductToCart[] | undefined, cero: number) => {
  dispatch({ type: "generateSold", payload: true })
  // let totalAmountOfCart: number = 0
  

  let library18 = true
  let totalAmountOfCartLibrary: number = 0
  let totalAmountOfCartWaliky: number = 0
  let totalAmountOfCartWalikySublimados: number = 0

  //aqui tengo que crear la funcionalidad de que sume el daily sale correspondiente para cada marca
  cart?.map(async (item) => {
    const refProduct = doc(db, "products", `${item?.code}`);
    //el codigo de abajo se hardcodeara ya que las marcas son estaticas.
    if (item.marcaSocio === "waliky") {
      console.log('marcasocio', item.marcaSocio)

      totalAmountOfCartWaliky = totalAmountOfCartWaliky + (Number(item.amount) * Number(item.price))
      library18 = false
    } else if (item.marcaSocio === "waliky-sublimados") {
      console.log('marcasocio', item.marcaSocio)

      totalAmountOfCartWalikySublimados = totalAmountOfCartWalikySublimados + (Number(item.amount) * Number(item.price))
      library18 = false
    } else if (item.marcaSocio === "libreria18") {
      console.log('marcasocio', item.marcaSocio)
      totalAmountOfCartLibrary = totalAmountOfCartLibrary + (Number(item.amount) * Number(item.price))
      // aqui debo crear la logica para crear un nuevo mes cada que se inicia uno nuevo antes de seguir con el codigo de abajo,
      // de lo contrario podria no registrar los nuevos datos con el siguiente mes.
      await setDoc(doc(db, `/salesPerMonth/EwszanTDNKpiCy4gMvSu/library18/${currentYear()}/month-${currentYear()}/${currentMonth()}`), { month: `${currentMonth()}`, totalSales: 0 })
      const ref = doc(db, `/salesPerMonth/EwszanTDNKpiCy4gMvSu/library18/${currentYear()}/month-${currentYear()}/${currentMonth()}`);
      const totalSaleMonth = await getDoc(ref)
      await updateDoc(ref, { totalSales: totalAmountOfCartLibrary + totalSaleMonth.data()?.totalSales })
      await updateDoc(ref, { totalSales: totalAmountOfCartLibrary + totalSaleMonth.data()?.totalSales })
      //estoy actualizando el stock de cada producto del cart

      await updateDoc(refProduct, { stock: increment(-Number(item.amount))})
      // .then(async r=> await addProductCartToProductSales(cart))

      // await updateDoc(refProduct, { stock: Number(item.stock) - Number(item.amount) }) 
    }
  })

  await addProductFromCartToTicket(
    {
      timestamp: Timestamp.fromDate(new Date()),
      product: cart,
      library18: library18
    }
  ).then(async (r) => {
    dispatch({ type: "resetAmountCart" })
    dispatch({ type: "generateSold", payload: false })
    dispatch({ type: "showSaleModal", payload: false })
    dispatch({ type: "tostifyNotificationSales", payload: cero + 1 })
    dispatch({ type: "cleanCart" })
    await updatedailySale(totalAmountOfCartLibrary)//esto se cambia provisionalmente
    await updateDailySaleWaliky(totalAmountOfCartWaliky)
    await updateDailySaleWalikySublimados(totalAmountOfCartWalikySublimados)
  })
  await addTicketDataToStatistics()
  await addProductCartToProductSales(cart)

}

const addTicketDataToStatistics = async () => {
  const ticketRef = collection(db, `/db-ventas/xB98zEEqUPU3LXiIf7rQ/${YEAR_MONTH}/${currentDate()}`)
  const statisticsRef = doc(db, `/statistics/${YEAR_MONTH}`, `${currentDate()}`)
  const snapTicket = await getDocs(ticketRef)

  if (snapTicket.size === 0) {
    console.log('addTicketDataToStatistics: no hacemos nada')
  } else {
    const dataStatistics = await getDoc(statisticsRef)
    if (dataStatistics.exists()) {
      const ticketsAmount = Number(dataStatistics.data().tickets) + 1
      await updateDoc(statisticsRef, { tickets: increment(1) })
    } else {
      await updateDoc(statisticsRef, { tickets: 1 })
    }

  }
}
export const addProductFromCartToTicket = async (ticket: Ticket) => {
  const docRef = doc(db, "/ticket", "1gZJTbl4yu6S8oD9a1En");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const numeroTicket = docSnap.data().ticket + 1
    // console.log('numeroTicket', numeroTicket)
    // await setDoc(doc(db, `/db-ventas/xB98zEEqUPU3LXiIf7rQ/${currentMonth()}-${currentYear()}`, `${numeroTicket}`), ticket)
    await setDoc(doc(db, `/db-ventas/xB98zEEqUPU3LXiIf7rQ/${currentMonth()}-${currentYear()}/${currentMonth()}-${currentYear()}`), { ticket: "ticket" })
    await setDoc(doc(db, `/db-ventas/xB98zEEqUPU3LXiIf7rQ/${currentMonth()}-${currentYear()}/${currentMonth()}-${currentYear()}/${currentDate()}`, `${numeroTicket}`), ticket)
    await updateDoc(docRef, {
      ticket: numeroTicket
    });
  }
  // await updatedailySale(totalAmountOfCartLibrary)

  //parece que aqui es donde deberia de colorcar todos los datos para las estadisticas
}

export const addProductCartToProductSales = async (cart: ProductToCart[] | undefined) => {
  const pathProductsSales = `/products-sales-library18/${currentYear()}/${currentMonth()}/${currentMonth()}/${currentDate()}`
  const pathQuery = collection(db, pathProductsSales)
  const querySnapshot = await getDocs(pathQuery)
  const productsFromCart: ProductToCart[] = []
  querySnapshot.docs.forEach(doc => { //agrego  todo los datos de la collection al arrat productsFromCart
    productsFromCart.push({ ...doc.data(), id: doc.id })
  })
  if (querySnapshot.size === 0) {
    await setDoc(doc(db, pathProductsSales, '1'), { product: "test" })
    cart?.map(async (item) => {
      await setDoc(doc(db, pathProductsSales, `${item.code}`), { ...item, totalAmountSale: increment(Number(item.amount)) })
      await deleteDoc(doc(db, pathProductsSales, "1"));
    })
  } else {
  // } else if (querySnapshot.size > 0) {//si la collection tiene mas de un producto entrara aqui

    if(productsFromCart.length === querySnapshot.size) { // si productsFromCart tiene el mismo tamanio que qiuerySanpshot.size entra 
      
      cart?.map(async (item) => {//recorro el array para comprobar si existe dentro de productsFromCart
        const findItem = productsFromCart?.find(i => i.code === item.code)
        console.log('findItem', findItem)
        if (findItem) {
          console.log('si existe el producto en la lista de productos vendidos')
          // const totalAmountSaleItem: number = Number(findItem?.totalAmountSale) + Number(item?.amount)
          // console.log('Number(item?.amount)',Number(item?.amount))
          const refItemUpdate = doc(db, pathProductsSales, `${findItem.code}`)
          await updateDoc(refItemUpdate, {
            // totalAmountSale: totalAmountSaleItem
            totalAmountSale: increment(Number(item?.amount))
          })
        } else {
          await setDoc(doc(db, pathProductsSales, `${item.code}`), { ...item, totalAmountSale: Number(item.amount)})
          // await setDoc(doc(db, pathProductsSales, `${item.code}`), { ...item, totalAmountSale: item.amount })
        }
      })
    }
  }
}

export const getProductsSales = async(dispatch: (action: any) => void) => {
  const pathProductsSales = `/products-sales-library18/${currentYear()}/${currentMonth()}/${currentMonth()}/${currentDate()}`
  const producstSalesRef = collection(db, pathProductsSales)
  const products: ProductToCart[] = []
  const getProductSale = await getDocs(producstSalesRef)

  getProductSale.forEach((doc) => {
    products.push(doc.data())
  })
  dispatch({ type: "getProductsSales", payload: products })

  // onSnapshot(producstSalesRef, querySnapshot => {
  //   querySnapshot.forEach((doc) => {
  //     products.push(doc.data())
  //   })
  //   dispatch({ type: "getProductsSales", payload: products })
  // })
//lo de arriba es lo que estaba funcional

  // onSnapshot(res, (snapshot) => {
  //   const marcaSocio: MarcaSocio[] = []
  //   snapshot.docs.forEach((doc) => {
  //     marcaSocio.push({ ...doc.data(), id: doc.id })
  //   })
  //   dispatch({ type: "marcaSocio", payload: marcaSocio })


}
export const updateDailySaleFromStatistics = async (totalAmountCart: number) => {
  const dailysaleRef = doc(db, `/dailysale/vAWFt15qlNVykhHvNno0/${yearMonth}`, `${currentDate()}`)
  const updateDailySaleFromStatistics = doc(db, `/statistics/${yearMonth}/${yearMonth}/`,`${currentDate()}`)
  const monthRef = doc(db, `/statistics/${yearMonth}/`)
  const statisticsSnap = await getDoc(updateDailySaleFromStatistics)
  const dailyData = await getDoc(dailysaleRef)
  if (dailyData.exists()) {
    if (statisticsSnap.exists()) {
      // const dailySales = Number(statisticsSnap.data().dailySales) + totalAmountCart
      // await updateDoc(updateDailySaleFromStatistics, { dailySales: dailySales })
      const totalAmount = Number(totalAmountCart.toFixed(2))
      await updateDoc(updateDailySaleFromStatistics, { dailySales: increment(totalAmount)})
    } else {
      await setDoc(monthRef, {month:currentMonth()});
      await setDoc(updateDailySaleFromStatistics, {dailySales:0, tickets:0});
      await updateDoc(updateDailySaleFromStatistics, { dailySales: totalAmountCart.toFixed(2) })
    }
  } else {
    console.log('updateDailySaleFromStatistics: no hacemos nada')
  }
}
export const updatedailySale = async (totalAmountOfCart: number) => {
  const updatedailySaleRef = doc(db, `/dailysale/vAWFt15qlNVykhHvNno0/${yearMonth}/${currentDate()}`);
  const docSnap = await getDoc(updatedailySaleRef)
  if (docSnap.exists()) {
    // const currentlyDailySale = Number(docSnap.data().amount) + totalAmountOfCart
    const currentlyDailySale = Number(totalAmountOfCart.toFixed(2) )
    await updateDoc(updatedailySaleRef, { amount: increment(currentlyDailySale) })
    await updateDailySaleFromStatistics(totalAmountOfCart)

  } else {
    await setDoc(doc(db, `/dailysale/vAWFt15qlNVykhHvNno0/${yearMonth}`, currentDate()), { amount: 0 });
    const updatedailySaleRef = doc(db, `/dailysale/vAWFt15qlNVykhHvNno0/${yearMonth}/${currentDate()}`);
    const docSnap = await getDoc(updatedailySaleRef)
    await updateDailySaleFromStatistics(totalAmountOfCart)
    if (docSnap.exists()) {
      // const currentlyDailySale = Number(docSnap.data().amount) + totalAmountOfCart
      const currentlyDailySale = Number(totalAmountOfCart.toFixed(2)) 
      await updateDoc(updatedailySaleRef, { amount: increment(currentlyDailySale) })
    }
  }
}
export const updateDailySaleWaliky = async (totalAmountOfCartWaliky: number) => {
  const updatedailySaleRef = doc(db, `/dailysale-waliky/NpSnaQZBbsFl7itbyKsy/${yearMonth}/${currentDate()}`);
  const docSnap = await getDoc(updatedailySaleRef)
  if (docSnap.exists()) {
    const currentlyDailySale = Number(docSnap.data().amount) + totalAmountOfCartWaliky
    await updateDoc(updatedailySaleRef, { amount: currentlyDailySale })
  } else {
    await setDoc(doc(db, `/dailysale-waliky/NpSnaQZBbsFl7itbyKsy/${yearMonth}`, currentDate()), { amount: 0 });
    const updatedailySaleRef = doc(db, `/dailysale-waliky/NpSnaQZBbsFl7itbyKsy/${yearMonth}/${currentDate()}`);
    const docSnap = await getDoc(updatedailySaleRef)
    if (docSnap.exists()) {
      const currentlyDailySale = Number(docSnap.data().amount) + totalAmountOfCartWaliky
      await updateDoc(updatedailySaleRef, { amount: currentlyDailySale })
    }
  }
}
export const updateDailySaleWalikySublimados = async (totalAmountOfCartWalikySublimados: number) => {
  const updatedailySaleRef = doc(db, `/dailysale-waliky-sublimados/01Tg0pJCQlY6yBRmLwuH/${yearMonth}/${currentDate()}`);
  const docSnap = await getDoc(updatedailySaleRef)
  if (docSnap.exists()) {
    const currentlyDailySale = Number(docSnap.data().amount) + totalAmountOfCartWalikySublimados
    await updateDoc(updatedailySaleRef, { amount: currentlyDailySale })
  } else {
    await setDoc(doc(db, `/dailysale-waliky-sublimados/01Tg0pJCQlY6yBRmLwuH/${yearMonth}`, currentDate()), { amount: 0 });
    const updatedailySaleRef = doc(db, `/dailysale-waliky-sublimados/01Tg0pJCQlY6yBRmLwuH/${yearMonth}/${currentDate()}`);
    const docSnap = await getDoc(updatedailySaleRef)
    if (docSnap.exists()) {
      const currentlyDailySale = Number(docSnap.data().amount) + totalAmountOfCartWalikySublimados
      await updateDoc(updatedailySaleRef, { amount: currentlyDailySale })
    }
  }
}
export const findProduct = async (codeProduct: string) => {
  const docRef = doc(db, "products", codeProduct);
  const docSnap = await getDoc(docRef);
  return docSnap
}
export const addStockToProduct = async (dispatch: (action: any) => void, codeProduct: string) => {
  if (codeProduct === "") {
    dispatch({ type: "addStockProduct", payload: null })
  } else {
    const product = await findProduct(codeProduct);
    if (product.exists()) {
      dispatch({ type: "addStockProduct", payload: product.data() })
      dispatch({ type: "loaderChargerStock", payload: false })

    } else {
      dispatch({ type: "addStockProduct", payload: "no se encontro producto" })
      dispatch({ type: "loaderChargerStock", payload: false })
    }
  }
}

export const searchProductByDescription = async () => {
  console.log('seach', "estamos buscando")
  const res = query(collection(db, `/products`));
  const docSnap = await getDocs(res)
  const allProducts: ProductToCart[] = []
  docSnap.docs.forEach(doc => {
    allProducts.push({ ...doc.data() });
  })

  // console.log('total de productos',docSnap.size)
  // console.log('total de productos',docSnap)
}

export const addStockToProductUpdate = async (dispatch: (action: any) => void, codeProduct: ProductToCart, stock: StockProductCharger) => {
  const ref = doc(db, "products", codeProduct.code as string);
  const docSnap = await getDoc(ref);
  const newStock: number = Number(codeProduct.stock) + Number(stock.stock)
  if (docSnap.exists()) {
    await updateDoc(ref, { stock: newStock })
      .then(r => {
        dispatch({ type: "loaderChargerStockAdd", payload: false })
      })
  }
}
export const getIncomePerDay = async (dispatch: (action: any) => void) => {

  const ref = collection(db, `/dailysale/vAWFt15qlNVykhHvNno0/${yearMonth}`)
  // const res = query(collection(db, `/products`));
  const dailySales: DailySales[] = []
  const dataSales: number[] = []
  const dataSalesLabel: string[] = []
  const docSnap = await getDocs(ref)
  let totalSalesPerMonth: number = 0
  if (docSnap) {
    docSnap.docs.forEach(perDay => {
      totalSalesPerMonth = totalSalesPerMonth + Number(perDay.data().amount.toFixed(2))
      dailySales.push({ ...perDay.data(), id: Number(perDay.id) })

    })
    const rta = dailySales.sort((a, b) => {
      const fe = Number(a.id)
      const se = Number(b.id)
      if (fe > se) {
        return 1;
      }
      if (fe < se) {
        return -1;
      }
      return 0;
    })
    rta.map(item => {
      if (item.amount) {
        const sale = Number(item.amount.toFixed(2))
        dataSales.push(sale)
        dataSalesLabel.push(item.id as string)
      }
    })
    dispatch({ type: "dataSales", payload: dataSales })
    dispatch({ type: "dataSalesLabel", payload: dataSalesLabel })
    dispatch({ type: "dataTotalSalesPerMonth", payload: totalSalesPerMonth })
  }
}

export const getTotalSalesPerYear = async (dispatch: (action: any) => void) => {
  const ref = collection(db, `/salesPerMonth/EwszanTDNKpiCy4gMvSu/library18/${currentYear()}/month-${currentYear()}`)
  const docSnap = await getDocs(ref)
  let totalSalesYear: number = 0
  if (docSnap) {
    docSnap.docs.forEach(month => {
      totalSalesYear = totalSalesYear + month.data().totalSales
    })
    // console.log('totalSalesYear', totalSalesYear)
    dispatch({ type: "totalSalesYear", payload: totalSalesYear })
  }
}

export const getFilterProductByStock = async (dispatch: (action: any) => void, paramsFilter: FilterProdyctBySTock) => {
  console.log('paramsFilter', paramsFilter)
  // const order = paramsFilter.orderBy as OrderByDirection
  const productRef = collection(db, '/products')
  const productsFilterByStock: ProductToCart[] = []
  if (paramsFilter.brand.length === 0) {
    console.log('busqueda sin brand')
    if (paramsFilter.stock === 0) {
      console.log('sin brand y en 0')
      const q = query(productRef, where("stock", "==", Number(paramsFilter.stock)), where("marcaSocio", "==", `${paramsFilter.marcaSocio}`), orderBy("stock"));
      const data = await getDocs(q)
      console.log('datasize', data.size)

      data.docs.forEach(item => {
        productsFilterByStock.push(item.data())
      })
      dispatch({ type: "productsFromFilterByStock", payload: productsFilterByStock })
    } else {
      const q = query(productRef, where("stock", "<=", Number(paramsFilter.stock)), where("stock", ">=", 1), where("marcaSocio", "==", `${paramsFilter.marcaSocio}`), orderBy("stock"));
      const data = await getDocs(q)
      console.log('datasize', data.size)

      data.docs.forEach(item => {
        productsFilterByStock.push(item.data())
      })
      dispatch({ type: "productsFromFilterByStock", payload: productsFilterByStock })
    }
  } else {
    console.log('entramos con marca')
    if (paramsFilter.stock === 0) {
      const q = query(productRef, where("stock", "==", Number(paramsFilter.stock)), where("brand", "==", `${paramsFilter.brand}`), where("marcaSocio", "==", `${paramsFilter.marcaSocio}`), orderBy("stock"));
      const data = await getDocs(q)
      console.log('datasize', data.size)
      data.docs.forEach(item => {
        productsFilterByStock.push(item.data())
      })
      dispatch({ type: "productsFromFilterByStock", payload: productsFilterByStock })
    } else {
      const q = query(productRef, where("stock", "<=", Number(paramsFilter.stock)), where("brand", "==", `${paramsFilter.brand}`), where("stock", ">=", 1), where("marcaSocio", "==", `${paramsFilter.marcaSocio}`), orderBy("stock"));
      const data = await getDocs(q)
      console.log('datasize', data.size)
      data.docs.forEach(item => {
        productsFilterByStock.push(item.data())
      })
      dispatch({ type: "productsFromFilterByStock", payload: productsFilterByStock })
    }
  }

}

export const validateUserPin = async (dispatch:(action:any) => void, idUser:string, pin:string) => {
  const userRef = doc(db, "users",idUser)
  const gueryUser = await getDoc(userRef)
  if(gueryUser.exists()) {

    if(gueryUser.data().pin === Number(pin)){
      dispatch({type:"validatePin", payload: true})
    }
  }
}

