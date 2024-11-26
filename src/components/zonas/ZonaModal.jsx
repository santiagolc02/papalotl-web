import { useState, useEffect } from 'react';
import './ZonaModal.css'
import { motion } from 'framer-motion';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

const ZonaModal = ({ setShowModal, data, setData, editZona, zonaState, setZonaState }) => {
    const [nombreZona, setNombreZona] = useState("");
    const [quoteZona, setQuoteZona] = useState("");
    const [descripcionZona, setDescripcionZona] = useState("");

    useEffect(() => {
        if (zonaState === "edit" && editZona) {
            setNombreZona(editZona.nombreZona);
            setQuoteZona(editZona.quoteZona);
            setDescripcionZona(editZona.descripcionZona);
        }
    }, [zonaState, editZona]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (zonaState === 'edit') {
                const zonaRef = doc(db, "zona", editZona.id);
                await updateDoc(zonaRef, {
                    nombreZona,
                    quoteZona,
                    descripcionZona
                });
                setData(prevData => prevData.map(zona => zona.id === editZona.id ? { ...zona, nombreZona, quoteZona, descripcionZona } : zona));
            } else if (zonaState === 'add') {
                const idZona = data.length + 1; // Calculate idZona here
                const docRef = await addDoc(collection(db, "zona"), {
                    nombreZona,
                    idZona,
                    quoteZona,
                    descripcionZona
                });
                setData(prevData => [...prevData, { id: docRef.id, nombreZona, idZona, quoteZona, descripcionZona }]);
            }
        } catch (error) {
            console.error("Error saving document: ", error);
        } finally {
            setShowModal(false);
            setZonaState('view'); // Reset to view state after submission
        }
    };

    return (
        <div className="zona-modal-overlay" onMouseDown={() => setShowModal(false)}>
            <motion.div 
            className="zona-modal"
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1}}
            transition={{ duration: 0.2 }}>
                <form onSubmit={handleSubmit} className='zona-form'>
                    <h1>{zonaState === "edit" ? `Editar zona a${nombreZona ? `: ${nombreZona}` : ''}` : 
                                                `Agregar zona${nombreZona ? `: ${nombreZona}` : ''}`}</h1>
                    <br />
                    <div className="zona-form-section">
                        <label>
                            Name:
                        </label>
                        <input 
                            type="text" 
                            value={nombreZona} 
                            onChange={(e) => setNombreZona(e.target.value)}
                            required
                        />
                        
                    </div>
                    <div className="zona-form-section-textarea">
                        <label>
                            Quote:
                        </label>
                        <textarea 
                            type="text" 
                            value={quoteZona} 
                            onChange={(e) => setQuoteZona(e.target.value)}
                            className='zona-textarea'
                            required 
                        />
                    </div>
                    <div className="zona-form-section-textarea">
                        <label>
                            Description:
                        </label>
                        <textarea 
                            type="text" 
                            value={descripcionZona} 
                            onChange={(e) => setDescripcionZona(e.target.value)} 
                            className='zona-textarea'
                            required 
                        />
                    </div>
                    <button type="submit" className='zona-form-button'>{zonaState === "edit" ? "Actualizar" : "Agregar"}</button>
                </form>
            </motion.div>
        </div>
    )
}

export default ZonaModal
