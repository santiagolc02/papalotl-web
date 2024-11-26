import { useState, useEffect } from 'react';
import './UsuarioModal.css'
import { motion } from 'framer-motion';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

const UsuarioModal = ({ setShowModal, setData, editUsuario, usuarioState, setUsuarioState }) => {
    const [name, setName] = useState('');
    const [edad, setEdad] = useState();
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (usuarioState === "edit" && editUsuario) {
            setName(editUsuario.name);
            setEdad(editUsuario.edad);
            setEmail(editUsuario.email);
        }
    }, [usuarioState, editUsuario]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (usuarioState === 'edit') {
                const usuarioRef = doc(db, "usuarios", editUsuario.id);
                await updateDoc(usuarioRef, {
                    name,
                    edad,
                    email,
                    
                });
                setData(prevData => prevData.map(usuario => usuario.id === editUsuario.id ? { ...usuario, name, edad, email } : usuario));
            } else if (usuarioState === 'add') {
                const docRef = await addDoc(collection(db, "usuarios"), {
                    name,
                    edad,
                    email,
                    
                });
                setData(prevData => [...prevData, { id: docRef.id, name, edad, email}]);
            }
            console.log("exito")
        } catch (error) {
            console.error("Error saving document: ", error);
        } finally {
            setShowModal(false);
            setUsuarioState('view'); // Reset to view state after submission
        }
    };

    return (
        <div className="usuario-modal-overlay" onMouseDown={() => setShowModal(false)}>
            <motion.div 
            className="usuario-modal"
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1}}
            transition={{ duration: 0.2 }}>
                <form onSubmit={handleSubmit} className='usuario-form'>
                    <h1>{usuarioState === "edit" ? `Editar usuario: ${name}` : "Agregar usuario"}</h1>
                    <br />
                    <div className="usuario-form-section">
                        <label>
                            Nombre:
                        </label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                    </div>
                    <div className="usuario-form-section">
                        <label>
                            Edad:
                        </label>
                            <input 
                                type="text" 
                                value={edad} 
                                onChange={(e) => setEdad(e.target.value)} 
                                required 
                            />
                    </div>
                    <div className="usuario-form-section">
                        <label>
                            E-mail:
                        </label>
                            <input 
                                type="text" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                    </div>
                    <br />
                    <button type="submit" className='usuario-form-button'>{usuarioState === "edit" ? "Actualizar" : "Agregar"}</button>
                </form>
            </motion.div>
        </div>
    )
}

export default UsuarioModal
