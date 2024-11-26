import './Reseñas.css'
import ObjReseña from './ObjReseña';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs } from "firebase/firestore";

const Reseñas = () => {
    //const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [zonas, setZonas] = useState([]);
    const [actividades, setActividades] = useState([])
    const [reseñas, setReseñas] = useState([])
    const [selectedZonaId, setSelectedZonaId] = useState(4);
    const [selectedActId, setSelectedActId] = useState();

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "zona")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setZonas(dataArray);
            } catch (error) {
                console.error("Error fetching zones: ", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchActividades = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "actividad")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setActividades(dataArray);
            } catch (error) {
                console.error("Error fetching reviews: ", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchReseñas = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "reseñas")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReseñas(dataArray);
            } catch (error) {
                console.error("Error fetching reviews: ", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchZones();
        fetchActividades();
        fetchReseñas();
    }, []);

    useEffect(() => {
        setSelectedActId('')
    }, [selectedZonaId]);

    // Filter activities based on the selected zone
    const filteredActividades = selectedZonaId
        ? actividades.filter(act => act.idZona === selectedZonaId)
        : actividades; // Show all activities if no zone is selected

    const filteredReseñas = selectedActId
        ? reseñas.filter(reseña => reseña.actividadID === selectedActId)
        : reseñas; // Show all reviews if no activity is selected

    console.log(`Filtered activities: ${filteredActividades}`)
    return (
        <div className='reseñas'>
            <div className='reseñas-navbar'>
                {zonas.map((zona, index) => (
                    <div key={index}>
                        <button className={`${selectedZonaId === zona.idZona ? 
                                            'reseñas-navbar-button-selected' : 
                                            'reseñas-navbar-button'}`}
                        onClick={() => setSelectedZonaId(zona.idZona)}>
                            {zona.nombreZona}</button>
                    </div>
                ))}
            </div>
            <div className="reseñas-child">
                {loading && (
                    <div className="loading-spinner">
                          <i className="bi bi-arrow-clockwise"></i>
                    </div>
                )}
                <div className='reseñas-child-left'>
                    {selectedZonaId ? (
                        filteredActividades.map((actividad, index) => (
                            <div key={index} className={`${selectedActId === actividad.idActividad ?
                                                        'obj-reseña-act-selected' : 
                                                        'obj-reseña-act'}`}
                                onClick={() => setSelectedActId(actividad.idActividad)}>
                                <h2>{actividad.nombre}</h2>
                                <p>{actividad.descripcionActividad}</p>
                                <br />
                            </div>
                        ))
                    ) : (
                    <div className='reseñas-child-empty'>Porfavor seleccione una zona</div>
                    )}
                </div>
                <div className='reseñas-child-right'>
                    {selectedActId ? (
                        filteredReseñas.map((reseña) => (
                            <ObjReseña reseña={reseña}></ObjReseña>
                        ))
                    ) : (
                        <div className='reseñas-child-empty'>Porfavor seleccione una actividad</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reseñas
