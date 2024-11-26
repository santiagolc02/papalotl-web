import './ObjAnuncio.css'
import { motion } from 'framer-motion';

function ObjAcuncio({ item, editAnuncio, deleteAnuncio, setAnuncioState }) {
    const handleEdit = () => {
        setAnuncioState('edit');
        editAnuncio(item);
    }

    const handleDelete = () => {
        setAnuncioState('delete');
        deleteAnuncio(item.id);
    }

    return (
        <motion.div className='obj-anuncio'
        initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}>
            <div className="obj-anuncio-top">
                <h2>{item.tituloAnuncio}</h2>
                <div className="obj-anuncio-crud">
                    <i class="bi bi-pencil-square" onClick={handleEdit}></i>
                    <i class="bi bi-trash" onClick={handleDelete}></i>
                </div>
            </div>
            <br></br>
            <p className='obj-anuncio-section'>{item.descripcionAnuncio}</p>
        </motion.div>
    )
}

export default ObjAcuncio
