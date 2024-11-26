import './Usuarios.css'
import ObjUsuario from './ObjUsuario';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import UsuarioModal from './UsuarioModal';

const Usuarios = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [usuarioState, setUsuarioState] = useState('view');
    const [editUsuario, setEditUsuario] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(dataArray);
                console.log(dataArray)
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addUsuario = () => {
        setEditUsuario(null)
        setUsuarioState("add");
        setShowModal(true);
    }

    const editUsuarioFunction = (usuario) => {
        setEditUsuario(usuario)
        setUsuarioState("edit");
        setShowModal(true)
    }

    const deleteUsuario = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, "usuarios", id));
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
            <UsuarioModal setShowModal={setShowModal} 
            setData={setData} 
            editUsuario={editUsuario}
            usuarioState={usuarioState} 
            setUsuarioState={setUsuarioState} />
        )}
        <div className='usuarios'>
            <i class="bi bi-plus-circle-fill" onClick={() => addUsuario()}></i>
            <br></br>
            <div className="usuarios-child">
                {loading && (
                    <div className="loading-spinner">
                        <i className="bi bi-arrow-clockwise"></i>
                    </div>
                )}
                <h1 className='usuarios-count'>Usuarios: {data.length}</h1>
                <br />
                {data.map(item => (
                    <div key={item.uid}>
                        <ObjUsuario item={item}
                        setData={setData}
                        editUsuario={editUsuarioFunction}
                        deleteUsuario={deleteUsuario}
                        setUsuarioState={setUsuarioState}></ObjUsuario>
                        <br></br>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default Usuarios
