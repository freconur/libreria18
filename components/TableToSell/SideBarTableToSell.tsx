import React, { useState } from 'react'
import { useGlobalContext } from '../../context/GlobalContext'


interface Props {
  totalAmountToCart: number,
  productToCart: ProductToCart[] | undefined,
  showTableSales: boolean,
  closeSidebarSale: () => void
}
const SideBarTableToSell = ({ totalAmountToCart, productToCart, showTableSales,closeSidebarSale }: Props) => {
  const { LibraryData, showGenerateSale } = useGlobalContext()
  const { showSaleModal } = LibraryData
  return (
      <div className={` grid grid-rows-gridRowsSalesPay rounded-md w-[350px] md:w-full shadow-md ml-2 p-3 z-[500] top-[60px] bottom-0 md:top-0 fixed md:relative md:right-0 duration-300 -right-[900px] bg-white  ${showTableSales && "right-[0px] duration-300"}`}>
        {/* <div className={`z-[900] fixed duration-300 drop-shadow-xl -left-[300px] h-full w-[250px] bg-white  ${showSidebar && "left-0 duration-300"}`}> */}
        <div className='text-lg'>
          <div className='flex justify-end px-1 text-slate-200 '>
            <p onClick={closeSidebarSale} className='flex md:hidden justify-center items-center cursor-pointer hover:rounded-full hover:bg-slate-100 h-[30px] w-[30px] duration-300'>X</p>
          </div>
          <div className='flex justify-between p-1 py-[15px] border-b-[1px] border-slate-300 text-slate-600 font-jp'>
            <span className='font-nunito'>Subtotal</span>
            <span>S/ {(totalAmountToCart * 0.82).toFixed(2)}</span>
          </div>
          <div className='flex justify-between p-1 py-[15px] border-b-[1px] border-slate-300 text-slate-600 font-jp'>
            <span className='font-nunito'>I.G.V. 18%</span>
            <span>S/ {(totalAmountToCart * 0.18).toFixed(2)}</span>
          </div>
          <div className='flex justify-between items-center p-1 py-[15px] border-b-[1px] border-slate-300 text-slate-600 font-jp'>
            <span className='text-red-500 font-bold font-nunito'>TOTAL</span>
            <span className='font-bold text-2xl'>S/{totalAmountToCart.toFixed(2)}</span>
          </div>
        </div>
        <button disabled={productToCart && productToCart?.length > 0 ? false : true} onClick={() => showGenerateSale(showSaleModal)} className={`${productToCart && productToCart.length === 0 ? 'bg-gray-300' : 'bg-blue-400 duration-300 text-md   hover:hover:bg-blue-500'} capitalize font-semibold  rounded-md text-white duration-300 font-nunito shadow-lg w-full p-3 m-auto`}>
          generar venta
        </button>
      </div>
  )
}

export default SideBarTableToSell