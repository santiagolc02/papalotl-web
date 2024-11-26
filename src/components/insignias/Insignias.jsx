import './Insignias.css';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import InsigniasObj from './InsigniasObj';
import InsigniasModal from './InsigniasModal';
import Select from 'react-select';

const Insignias = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataActs, setDataActs] = useState([]);
    const [dataVisitas, setDataVisitas] = useState([]);
    const [insigniasState, setInsigniasState] = useState('acts');
    const [selectedInsignia, setSelectedInsignia] = useState(null);
    const [activities, setActivites] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [imageLoading, setImageLoading] = useState(false); // Add this state for image loading
    const [showModal, setShowModal] = useState({ show: false, index: null, state: null });

    useEffect(() => {
        const fetchInsignias = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "insignias")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(dataArray);
                analyzeAttributes(dataArray);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } 
        };
        
        const fetchActividades = async() => {
            try {
                const querySnapshot = await getDocs(collection(db, "actividad")); // Replace with your collection name
                const dataArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setActivites(dataArray);
                console.log(dataArray)
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchInsignias();
        fetchActividades();
    }, [selectedInsignia]);

    const analyzeAttributes = (dataArray) => {
        const actsArray = [];
        const visitasArray = [];

        dataArray.forEach(item => {
            if ('visitas' in item) {
                visitasArray.push(item);
            } else if ('acts' in item) {
                actsArray.push(item);
            } else {
                console.log('Data does not have visitas or acts attribute');
            }
        });

        setDataActs(actsArray);
        setDataVisitas(visitasArray);
        console.log(dataActs);
        console.log(dataVisitas);
    };

    const handleInsigniaClick = (item) => {
        setLoading(true);
        setSelectedInsignia(item);
        setImageLoading(true); // Start loading the image

        if (insigniasState === 'acts' && item.acts) {
            const selectedActivities = item.acts.map(actId => {
                const activity = activities.find(activity => activity.idActividad === actId);
                return { value: activity.idActividad, label: activity.nombre };
            });
            setSelectedOptions(selectedActivities);
        } else {
            setSelectedOptions([]);
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;

        // Check if the input is empty, invalid, or less than 0
        if (newValue === '' || isNaN(newValue) || parseInt(newValue, 10) < 0) {
            setSelectedInsignia(prevState => ({
                ...prevState,
                visitas: 0 // or '' depending on your requirements
            }));
        } else {
            setSelectedInsignia(prevState => ({
                ...prevState,
                visitas: parseInt(newValue, 10)
            }));
        }
    };

    const handleButtonsChangePlus = () => {
        setSelectedInsignia(prevState => ({
            ...prevState,
            visitas: parseInt(prevState.visitas + 1)
        }));
    }

    const handleButtonsChangeMinus = () => {
        setSelectedInsignia(prevState => {
            const newValue = parseInt(prevState.visitas, 10) - 1;
            return {
                ...prevState,
                visitas: newValue < 0 ? 0 : newValue // Ensure visitas does not go below 0
            };
        });
    }

    const handleSubmit = async () => {
        try {
            const docRef = doc(db, "insignias", selectedInsignia.id); // Replace with your collection name and document id
            await updateDoc(docRef, {
                visitas: selectedInsignia.visitas
            });
            alert("Insignia updated successfully!");
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Error updating insignia.");
        }
    };

    const handleStateChange = (newState) => {
        setInsigniasState(newState);
        setSelectedInsignia(null);
        setSelectedOptions([]);
    }

    const activityOptions = activities.map(activity => ({
        value: activity.idActividad,
        label: activity.nombre
    }));

    const handleSubmitActs = async () => {
        try {
            // Extract the idActividad from the selected options
            // Update the 'acts' field in the selected document in the 'actividad' collection
            const docRef = doc(db, "insignias", selectedInsignia.id); // Ensure this targets the correct actividad document
            await updateDoc(docRef, {
                acts: selectedOptions.map(option => option.value) // Store the selected activities IDs
            });
            alert("Actividades updated successfully!");
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Error updating actividades.");
        }
    };

    const handleModalClick = ({ state, index }) => {
        setShowModal({ show: true, state, index })
    }

    return (
        <>
        {showModal.show && (
            <InsigniasModal showModal={showModal}
            setShowModal={setShowModal}
            insigniasState={insigniasState}/>
        )}
        <div className='insignias'>
            <div className="insignias-left">
                <div className="insignias-left-state">
                    <h1>Insignias por</h1>
                    <div className="insignias-left-buttons">
                        <button className={`${insigniasState === 'acts' ? 'insignias-left-button-selected' : 'insignias-left-button'}`} onClick={() => handleStateChange('acts')}>Actividades</button>
                        <button className={`${insigniasState === 'visitas' ? 'insignias-left-button-selected' : 'insignias-left-button'}`} onClick={() => handleStateChange('visitas')}>Visitas</button>
                    </div>
                </div>
                <div className="insignias-left-insignias">
                    <div>
                        {insigniasState === 'acts' && dataActs.map((item, index) => (
                            <InsigniasObj item={item} 
                            handleInsigniaClick={handleInsigniaClick}
                            selectedInsignia={selectedInsignia}></InsigniasObj>
                        ))}
                        {insigniasState === 'visitas' && dataVisitas.map((item, index) => (
                            <InsigniasObj item={item}
                            handleInsigniaClick={handleInsigniaClick}
                            selectedInsignia={selectedInsignia}></InsigniasObj>
                        ))}
                        <div className="insignias-left-add">
                            <button className='insignias-left-button-add' onClick={() => handleModalClick("add")}>+</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="insignias-right">
                <div className="insignia-right-img">
                    {/* {loading && imageLoading && ( // Show loader while image is loading
                        <div className="loading-spinner-insignias">
                            <i className="bi bi-arrow-clockwise"></i>
                        </div>
                    )} */}
                    {selectedInsignia && (
                        <img 
                            src={selectedInsignia.urlIcono} 
                            alt='' 
                            className='insignias-img'
                            onLoad={() => setImageLoading(false)} // Image has loaded
                        />
                    )}
                </div>
                <div className="insignia-right-logic">
                    {insigniasState === 'visitas' && selectedInsignia && (
                        <>
                        <div className="insignia-right-logic-up">
                            <button className='insignia-right-button'
                            onClick={handleButtonsChangeMinus}>-</button>
                            
                            <input type="text" 
                            value={selectedInsignia.visitas} 
                            className='insignia-right-input'
                            onChange={handleInputChange}/>
                            
                            <button className='insignia-right-button'
                            onClick={handleButtonsChangePlus}>+</button>
                        </div>

                        <button className='insignia-right-button-submit'
                        onClick={handleSubmit}>Actualizar</button>
                        </>
                    )} 
                    {insigniasState === 'acts' && selectedInsignia && selectedInsignia.id && (
                        <>
                            <Select
                            isMulti
                            options={activityOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            className='insignia-right-multiselect'
                            />
                        <br />
                        <br />
                        <button className='insignia-right-button-submit' onClick={handleSubmitActs}>Actualizar</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    </>
    );
};

export default Insignias;
