import { useState, useEffect } from 'react';
import './AnuncioModal.css';
import { motion } from 'framer-motion';
import { db, auth, storage, signInAnonymously } from '../../firebase'; // Adjust the path as needed
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AnuncioModal = ({ setShowModal, setData, editAnuncio, anuncioState, setAnuncioState }) => {
    const [tituloAnuncio, setTituloAnuncio] = useState("");
    const [descripcionAnuncio, setDescripcionAnuncio] = useState("");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                await signInAnonymously(auth);
                console.log("User signed in anonymously");
            } catch (error) {
                console.error("Error signing in anonymously: ", error);
            }
        };

        authenticateUser();
    }, []);

    useEffect(() => {
        if (anuncioState === "edit" && editAnuncio) {
            setTituloAnuncio(editAnuncio.tituloAnuncio);
            setDescripcionAnuncio(editAnuncio.descripcionAnuncio);
        }
    }, [anuncioState, editAnuncio]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let urlAnuncio = '';
            if (imageFile) {
                const imageRef = ref(storage, `anuncios/${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                urlAnuncio = await getDownloadURL(imageRef);
            }

            if (anuncioState === 'edit') {
                const anuncioRef = doc(db, "anuncios", editAnuncio.id);
                await updateDoc(anuncioRef, {
                    tituloAnuncio,
                    descripcionAnuncio,
                    urlAnuncio,
                });
                setData(prevData => prevData.map(anuncio => anuncio.id === editAnuncio.id ? { ...anuncio, tituloAnuncio, descripcionAnuncio, urlAnuncio } : anuncio));
            } else if (anuncioState === 'add') {
                const docRef = await addDoc(collection(db, "anuncios"), {
                    tituloAnuncio,
                    descripcionAnuncio,
                    urlAnuncio,
                });
                setData(prevData => [...prevData, { id: docRef.id, tituloAnuncio, descripcionAnuncio, urlAnuncio }]);
            }
        } catch (error) {
            console.error("Error saving document: ", error);
        } finally {
            setShowModal(false);
            setAnuncioState('view'); // Reset to view state after submission
        }
    };

    return (
        <div className="anuncio-modal-overlay" onMouseDown={() => setShowModal(false)}>
            <motion.div
                className="anuncio-modal"
                onMouseDown={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}>
                <form onSubmit={handleSubmit} className='anuncio-form'>
                    <h1>{anuncioState === "edit" ? `Editar anuncio: ${tituloAnuncio}` : "Agregar anuncio"}</h1>
                    <br />
                    <div className="anuncio-form-section">
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={tituloAnuncio}
                                onChange={(e) => setTituloAnuncio(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <br />
                    <div className="zona-form-section">
                        <label>
                            Descripcion:
                            <input
                                type="text"
                                value={descripcionAnuncio}
                                onChange={(e) => setDescripcionAnuncio(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="anuncio-form-section">
                        <input
                            type="file"
                            onChange={handleImageChange}
                        />
                    </div>
                    <br />
                    <button type="submit" className='anuncio-form-button'>{anuncioState === "edit" ? "Actualizar" : "Agregar"}</button>
                </form>
            </motion.div>
        </div>
    );
};

export default AnuncioModal;
