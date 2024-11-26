import './Actividades.css'
import ObjActividad from './ObjActividad';
import ActividadModal from './ActividadModal';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const Actividades = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false)
    const [actividadState, setActividadState] = useState('view')
    const [editActividad, setEditActividad] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "actividad")); // Replace with your collection name
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

    const addActividad = () => {
        setEditActividad(null)
        setActividadState("add")
        setShowModal(true);
    }

    const editActividadFunction = (actividad) => {
        setEditActividad(actividad)
        setActividadState("edit");
        setShowModal(true)
    }

    const deleteActividad = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, "actividad", id));
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
            <ActividadModal setShowModal={setShowModal} 
            data={data}
            setData={setData} 
            editActividad={editActividad}
            actividadState={actividadState} 
            setActividadState={setActividadState} />
        )}
        <div className='actividades'>
            <i class="bi bi-plus-circle-fill" onClick={() => addActividad()}></i>
            <br></br>
            <div className="actividades-child">
                {loading && (
                    <div className="loading-spinner">
                        <i className="bi bi-arrow-clockwise"></i>
                    </div>
                )}
                <h1 className='actividades-count'>Actividades: {data.length}</h1>
                <br />
                {data.map(item => (
                    <div key={item.idActividad}>
                        <ObjActividad item={item}
                        setData={setData}
                        editActividad={editActividadFunction}
                        deleteActividad={deleteActividad}
                        setActividadState={setActividadState}></ObjActividad>
                        <br></br>
                    </div>
                ))}
            </div>
        </div>
    </>
    );
}

export default Actividades
