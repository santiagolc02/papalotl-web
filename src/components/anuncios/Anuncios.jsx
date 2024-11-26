import './Anuncios.css'
import ObjAnuncio from './ObjAnuncio';
import AnuncioModal from './AnuncioModal';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const Anuncios = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [anuncioState, setAnuncioState] = useState('view');
    const [editAnuncio, setEditAnuncio] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "anuncios")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(dataArray);
                console.log(data)
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addAnuncio = () => {
        setEditAnuncio(null)
        setAnuncioState("add")
        setShowModal(true);
    }

    const editAnuncioFunction = (anuncio) => {
        setEditAnuncio(anuncio)
        setAnuncioState("edit");
        setShowModal(true)
    }

    const deleteAnuncio = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, "anuncios", id));
                setData(data.filter(item => item.id !== id)); // Update local state
                console.log("Document deleted with ID: ", id);
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
        }
    }

    return (
        <>
        {showModal && (
            <AnuncioModal setShowModal={setShowModal} 
            setData={setData}
            editAnuncio={editAnuncio}
            anuncioState={anuncioState} 
            setAnuncioState={setAnuncioState} />
        )}
        <div className='anuncios'>
            <i class="bi bi-plus-circle-fill" onClick={() => addAnuncio()}></i>
            <br></br>
            <div className="anuncios-child">
                {loading && (
                    <div className="loading-spinner">
                        <i className="bi bi-arrow-clockwise"></i>
                    </div>
                )}
                <h1 className='anuncios-count'>Anuncios: {data.length}</h1>
                <br />
                {data.map(item => (
                    <div key={item.id}>
                        <ObjAnuncio item={item}
                        setData={setData}
                        editAnuncio={editAnuncioFunction}
                        deleteAnuncio={deleteAnuncio}
                        setAnuncioState={setAnuncioState}></ObjAnuncio>
                        <br></br>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default Anuncios
