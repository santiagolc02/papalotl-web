import './ObjUsuario.css'
import { motion } from 'framer-motion';

function ObjUsuario({ item, editUsuario, deleteUsuario, setUsuarioState }) {
    const handleEdit = () => {
        setUsuarioState('edit'); // Set to 'edit' when editing
        editUsuario(item);
    };

    const handleDelete = () => {
        setUsuarioState('delete'); // Set to 'delete' when deleting
        deleteUsuario(item.id);
    };

    return (
        <motion.div className='obj-usuario'
        initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}>
            <div className="obj-usuario-top">
                <h2>{item.name}</h2>
                <div className="obj-usuario-crud">
                    <i class="bi bi-pencil-square" onClick={handleEdit}></i>
                    <i class="bi bi-trash" onClick={handleDelete}></i>
                </div>
            </div>
            <br />
            <p className='obj-usuario-section'>{item.email}</p>
            <p className='obj-usuario-section'>{item.edad}</p>
        </motion.div>
    )
}

export default ObjUsuario
