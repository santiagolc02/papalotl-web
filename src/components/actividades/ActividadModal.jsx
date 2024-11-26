import { useState, useEffect } from 'react';
import './ActividadModal.css'
import { motion } from 'framer-motion';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const ActividadModal = ({ setShowModal, data, setData, editActividad, actividadState, setActividadState }) => {
    const [descripcionActividad, setDescripcionActividad] = useState("")
    const [duracion, setDuracion] = useState();
    const [habilitada, setHabilitada] = useState(Boolean)
    const [idZona, setIdZona] = useState()
    const [nombre, setNombre] = useState("");
    const [zonas, setZonas] = useState([]);
    
    useEffect(() => {
        const fetchZonas = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "zona")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setZonas(dataArray);
                console.log(zonas)
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchZonas();
    }, []);

    useEffect(() => {
        if (actividadState === "edit" && editActividad) {
            setDescripcionActividad(editActividad.descripcionActividad);
            setDuracion(editActividad.duracion);
            setHabilitada(editActividad.habilitada);
            setIdZona(editActividad.idZona);
            setNombre(editActividad.nombre);
        }
    }, [actividadState, editActividad]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!nombre || !descripcionActividad) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            // Convert duracionActividad to an integer
            const duracionInt = parseInt(duracion, 10);
            const idZonaInt = parseInt(idZona, 10);
    
            if (actividadState === 'edit') {
                const actividadRef = doc(db, "actividad", editActividad.id);
                await updateDoc(actividadRef, {
                    descripcionActividad,
                    duracion: duracionInt,
                    habilitada,
                    idZona: idZonaInt,
                    nombre,
                });
                setData(prevData => prevData.map(actividad => actividad.id === editActividad.id ? { ...actividad, descripcionActividad, duracion: duracionInt, habilitada, idZona, nombre } : actividad));
            } else if (actividadState === 'add') {
                const idActividad = data.length + 1; // Calculate idActividad
                const docRef = await addDoc(collection(db, "actividad"), {
                    descripcionActividad,
                    duracion: duracionInt,
                    habilitada,
                    idActividad,
                    idZona: idZonaInt,
                    nombre,
                });
                setData(prevData => [...prevData, { id: docRef.id, descripcionActividad, duracion: duracionInt, habilitada, idActividad, idZona, nombre }]);
            }
        } catch (error) {
            console.error("Error saving document: ", error);
        } finally {
            setShowModal(false);
            setActividadState('view'); // Reset to view state after submission
        }
    };
    
    return (
        <div className="actividad-modal-overlay" onMouseDown={() => setShowModal(false)}>
            <motion.div 
            className="actividad-modal"
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1}}
            transition={{ duration: 0.2 }}>
                <h1>{actividadState === "edit" ? `Editar actividad: ${nombre}` : "Agregar actividad"}</h1>
                <div className="actividad-form-container">
                    <form onSubmit={handleSubmit} className='actividad-form'>
                        <div className="actividad-form-section">
                            <label>
                                Name:
                                <input 
                                    type="text" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    required 
                                    />
                            </label>
                        </div>
                        <div className="actividad-form-section-textarea">
                            <label>
                                Descripcion:
                            </label>
                            <textarea 
                                type="text" 
                                value={descripcionActividad} 
                                className='actividad-textarea'
                                onChange={(e) => setDescripcionActividad(e.target.value)} 
                                required 
                                />
                        </div>
                        <div className="actividad-form-section">
                            <label>
                                Duracion(minutos):
                            </label>
                            <input 
                                type="text"
                                value={duracion} 
                                onChange={(e) => setDuracion(e.target.value)} 
                                required 
                                />
                        </div>
                        <div className="actividad-form-section">
                            <label>
                                Habilitada:
                            </label>
                            <input 
                                type="checkbox" 
                                checked={habilitada} 
                                onChange={(e) => setHabilitada(e.target.checked)} 
                                required 
                            />
                        </div>
                        <div className="actividad-form-section">
                            <label>
                                Zona:
                            </label>
                            <select 
                                className="actividad-select"
                                value={idZona} 
                                onChange={(e) => setIdZona(e.target.value)} 
                                required>
                                <option value="" disabled>Seleccione</option>
                                {zonas.map((zona) => (
                                    <option key={zona.id} value={zona.idZona}>{zona.nombreZona}</option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>
                <br />
                <button className='actividad-form-button' onClick={handleSubmit}>{actividadState === "edit" ? "Actualizar" : "Agregar"}</button>
            </motion.div>
        </div>
    )
}

export default ActividadModal
