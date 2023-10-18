import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import styles from '../../styles/SaleModal.module.css'
import { useGlobalContext } from '../../context/GlobalContext';
import { RiLoader4Line } from "react-icons/ri";

interface Props {
  generateSold: boolean;
}

const SaleModal = ({ generateSold }: Props) => {
  const { soldProducts, LibraryData, showGenerateSale } = useGlobalContext()
  const { productToCart, showSaleModal } = LibraryData
  let container;
  if (typeof window !== "undefined") {
    container = document.getElementById("portal-modal");
  }
  const handleSubmit = () => {
    soldProducts(productToCart)
  }
  return container
    ? createPortal(
      <div className={styles.containerModal}>
        <div className={styles.containerSale}>
          {
            generateSold
              ?
              <div className="flex w-full mt-5 items-center m-auto justify-center">
                <RiLoader4Line className="animate-spin text-3xl text-amber-500 " />
                <p className="text-white">generando venta...</p>
              </div>
              :
              <>
                <h3 className={styles.title}>Genial estas a un click de generar una venta, dale a <span className='font-semibold'>SI</span> para continuar.</h3>
                <div className={styles.options}>
                  <div className={styles.optionButtonCancel} onClick={() => showGenerateSale(showSaleModal)}>cancelar</div>
                  <div onClick={handleSubmit} className={styles.optionButtonAgree} >
                    si
                  </div>
                </div>
              </>
          }
        </div>
      </div>,
      container
    )
    : null
}

export default SaleModal