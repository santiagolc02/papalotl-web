import './Zonas.css'
import ObjZona from './ObjZona';
import ZonaModal from './ZonaModal';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const Zonas = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [zonaState, setZonaState] = useState('view')
    const [editZona, setEditZona] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "zona")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(dataArray);
                console.log(data)
                console.log(data.length)
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addZona = () => {
        setEditZona(null)
        setZonaState("add")
        setShowModal(true);
    }

    const editZonaFunction = (zona) => {
        setEditZona(zona)
        setZonaState("edit");
        setShowModal(true)
    }

    const deleteZona = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, "zona", id));
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
            <ZonaModal setShowModal={setShowModal} 
            data={data}
            setData={setData} 
            editZona={editZona}
            zonaState={zonaState} 
            setZonaState={setZonaState} />
        )}
        <div className='zonas'>
            <i class="bi bi-plus-circle-fill" onClick={() => addZona()}></i>
            <br></br>
            <div className="zonas-child">
                {loading && (
                    <div className="loading-spinner">
                        <i className="bi bi-arrow-clockwise"></i>
                    </div>
                )}
                <h1 className='zonas-count'>Zonas: {data.length}</h1>
                <br />
                {data.map(item => (
                    <div key={item.idZona}>
                        <ObjZona item={item}
                        setData={setData} 
                        editZona={editZonaFunction} 
                        deleteZona={deleteZona}
                        setZonaState={setZonaState}></ObjZona>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default Zonas
