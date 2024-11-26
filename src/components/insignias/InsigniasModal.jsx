import { useState, useEffect } from 'react';
import './InsigniasModal.css';
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '../../firebase'; // Adjust the path as needed
import Select from 'react-select';

const InsigniasModal = ({ showModal, setShowModal, insigniasState }) => {
    const [idInsignia, setIdInsignia] = useState(0);
    const [descInsignia, setDescInsignia] = useState('');
    const [visitas, setVisitas] = useState('');
    const [urlIcono, setUrlIcono] = useState('');
    const [activities, setActivities] = useState([]);
    const [acts, setActs] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            const querySnapshot = await getDocs(collection(db, "actividad")); // Replace with your collection name
            const dataArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                idActividad: doc.data().idActividad,
                nombre: doc.data().nombre,
                ...doc.data()
            }));
            setActivities(dataArray);
        };

        const fetchInsignias = async () => {
            const querySnapshot = await getDocs(collection(db, "insignias"));
            const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIdInsignia(dataArray.length + 1);
        };

        fetchActivities();
        fetchInsignias();
    }, [showModal.state]);

    const handleDescChange = (e) => setDescInsignia(e.target.value);
    const handleVisitasChange = (e) => setVisitas(e.target.value);
    const handleActsChange = (selectedOptions) => setActs(selectedOptions.map(option => option.value));
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async () => {
        try {
            let fileUrl = '';

            if (file) {
                const storage = getStorage();
                const storageRef = ref(storage, `Insignias/${file.name}`);
                await uploadBytes(storageRef, file);
                fileUrl = await getDownloadURL(storageRef);
            }

            if (showModal.state === 'edit') {
                const docRef = doc(db, "insignias", idInsignia.toString());
                if (insigniasState === 'visitas') {
                    const insigniaData = {
                        idInsignia,
                        descInsignia,
                        urlIcono: fileUrl || urlIcono,
                        visitas: parseInt(visitas, 10)
                    };
                    await updateDoc(docRef, insigniaData);
                    alert("Insignia updated successfully!");
                } else if (insigniasState === 'acts') {
                    const insigniaData = {
                        idInsignia,
                        descInsignia,
                        urlIcono: fileUrl || urlIcono,
                        acts
                    };
                    await updateDoc(docRef, insigniaData);
                    alert("Insignia updated successfully!");
                }
            } else {
                const newIdInsignia = (await getDocs(collection(db, "insignias"))).docs.length + 1;
                if (insigniasState === 'visitas') {
                    const insigniaData = {
                        idInsignia: newIdInsignia,
                        descInsignia,
                        urlIcono: fileUrl,
                        visitas: parseInt(visitas, 10)
                    };
                    await addDoc(collection(db, "insignias"), insigniaData);
                    alert("Insignia added successfully!");
                } else if (insigniasState === 'acts') {
                    const insigniaData = {
                        idInsignia: newIdInsignia,
                        descInsignia,
                        urlIcono: fileUrl,
                        acts
                    };
                    await addDoc(collection(db, "insignias"), insigniaData);
                    alert("Insignia added successfully!");
                }
            }
            setShowModal({ show: false, index: null, state: null });
        } catch (error) {
            console.error("Error adding/updating document: ", error);
            alert("Error adding/updating insignia.");
        }
    };

    return (
        <div className='insignias-modal-overlay' onMouseDown={() => setShowModal({ show: false, index: null, state: null })}>
            <div className="insignias-modal" onMouseDown={(e) => e.stopPropagation()}>
                <h1>{showModal.state === "edit" ? "Editar insignia" : "Agregar insignia"}</h1>
                <div className="insignias-modal-section">
                    <p>Descripcion: </p>
                    <input type='text' 
                        className='insignias-modal-descripcion'
                        value={descInsignia}
                        onChange={handleDescChange}
                    />
                </div>
                <div className="insignias-modal-sectionmultiselect">
                    {insigniasState === 'acts' ? (
                        <>
                            <p>Actividades requeridas:</p>
                            <Select
                                options={activities.map(activity => ({
                                    value: activity.idActividad,
                                    label: activity.nombre
                                }))}
                                isMulti
                                onChange={handleActsChange}
                                className='insignias-modal-multiselect'
                            />
                        </>
                    ) : (
                        <>
                            <p>Visitas: </p>
                            <input type='number' 
                                className='insignias-modal-visitas'
                                value={visitas}
                                onChange={handleVisitasChange}
                            />
                        </>
                    )}
                </div>
                <br />
                <div className="insignias-modal-section">
                    <input type='file' onChange={handleFileChange}/>
                </div>
                <button className='insignias-modal-button' onClick={handleSubmit}>
                    {showModal.state === 'edit' ? "Actualizar" : "Agregar"}
                </button>
            </div>
        </div>
    );
};

export default InsigniasModal;
