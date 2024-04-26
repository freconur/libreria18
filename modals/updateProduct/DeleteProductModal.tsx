
import { createPortal } from 'react-dom';
import styles from '../../styles/AddNewCategoryModal.module.css'
import { deleteProduct } from '../../reducer/UpdateProducts';
import { useEffect, useState } from 'react';
import { useUser } from 'next-firebase-auth';
import { useGlobalContext } from '../../context/GlobalContext';

interface Props {
  showDeleteProductModal: boolean,
  setShowDeleteProductModal: React.Dispatch<React.SetStateAction<boolean>>,
  code: string
}
const DeleteProductModal = ({ code, showDeleteProductModal, setShowDeleteProductModal }: Props) => {
  // const dataUser = useUser()
  const userId = useUser().id
  const pin = { pin: 0 }
  const { validateUserPinContext,validateUserPinResetContext, LibraryData } = useGlobalContext()
  const [pinValue, setPinValue] = useState(pin)
  const { validatePin } = LibraryData
  let container
  if (typeof window !== "undefined") {
    container = document.getElementById("portal-modal");
  }
  const onChangePinValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPinValue({ ...pinValue, [e.target.name]: e.target.value })
  }

  const deleteItem = () => {
    deleteProduct(code as string)
  }

  const validatePins = async () => {
    userId && validateUserPinContext(userId, `${pinValue.pin}`)
  }
  useEffect(() => {
    validatePins()
  }, [pinValue.pin])

  return container
    ? createPortal(
      <div className={styles.containerModal}>
        {/* <div className="bg-modal  backdrop-blur-[0.5px] fixed inset-0 z-30 md:hidden"> */}
        <div className={styles.containerDelete}>
          <h3 className={styles.title}>Estas seguro que quieres eliminar este producto?, esto no se puede deshacer, si estas seguro dale a eliminar.</h3>
          <div className='w-full'>
            <input onChange={onChangePinValue} className='w-full rounded-md shadow-md p-3' type="number" name="pin" value={pinValue.pin} placeholder="pin de seguridad" />
          </div>
          <div className={styles.buttonContainer}>
            {
              validatePin ?
                <>
                  <button onClick={() => {setShowDeleteProductModal(!showDeleteProductModal), validateUserPinResetContext()}} className={styles.buttonCancel}>cancelar</button>
                  <button onClick={deleteItem} className={styles.buttonDelete}>eliminar</button>
                </>
                :
                null
            }
            {/* <button onClick={() => setShowModalDeleteFlashcard(!showModalDeleteFlashcard)} className={styles.buttonCancel}>cancelar</button> */}
            {/* <button onClick={handleDeleteFlashcard} className={styles.buttonDelete}>OK</button> */}
          </div>
        </div>
      </div>,
      container
    )
    : null;
}

export default DeleteProductModal