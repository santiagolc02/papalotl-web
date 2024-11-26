import './ObjActividad.css'
import { motion } from 'framer-motion';

function ObjActividad({ item, editActividad, deleteActividad, setActividadState }) {
    const handleEdit = () => {
        setActividadState('edit');
        editActividad(item);
    }

    const handleDelete = () => {
        setActividadState('delete');
        deleteActividad(item.id);
    }

    return (
        <motion.div className='obj-actividad'
        initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}>
            <div className="obj-actividad-top">
                <h2>{item.nombre}</h2>
                <div className="obj-actividad-crud">
                    <i class="bi bi-pencil-square" onClick={handleEdit}></i>
                    <i class="bi bi-trash" onClick={handleDelete}></i>
                </div>
            </div>
            <br />
            <p className='obj-actividad-section'>{item.descripcionActividad}</p>
            <p className='obj-actividad-section'>Duraction: {item.duracion}m</p>
            <p className='obj-actividad-section'>Habilidada: {item.habilitada ? "Si" : "No"}</p>
        </motion.div>
    )
}

export default ObjActividad
