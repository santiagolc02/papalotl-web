import './ObjZona.css'
import { motion } from 'framer-motion';

function ObjZona({ item, editZona, deleteZona, setZonaState }) {
    const handleEdit = () => {
        setZonaState('edit'); // Set to 'edit' when editing
        editZona(item);
    };

    const handleDelete = () => {
        setZonaState('delete'); // Set to 'delete' when deleting
        deleteZona(item.id);
    };

    return (
        <motion.div className='obj-zona'
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}>
                
            <div className="obj-zona-top">
                <h2>{item.nombreZona}</h2>
                <div className="obj-zona-crud">
                    <i class="bi bi-pencil-square" onClick={handleEdit}></i>
                    <i class="bi bi-trash" onClick={handleDelete}></i>
                </div>
            </div>
            <p className='obj-zona-quote'>{item.quoteZona}</p>
            <br />
            <p>{item.descripcionZona}</p>
        </motion.div>
    )
}

export default ObjZona
