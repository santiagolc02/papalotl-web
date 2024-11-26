import './Quiz.css';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import Circle from './Circle';
import Option from './Option';
import QuizModal from './QuizModal';

const Quiz = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [questionId, setQuestionId] = useState(1);
    const [newOption, setNewOption] = useState('');
    const [showModal, setShowModal] = useState({ show: false, index: null });
    const [question, setQuestion] = useState(null);
    const [opciones, setOpciones] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const currentQuestion = data.find((item) => item.idPregunta === questionId);
            setQuestion(currentQuestion);
            setOpciones(currentQuestion?.opciones || []);
        }
    }, [questionId, data]);

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'quiz')); // Replace with your collection name
            const dataArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            dataArray.sort((a, b) => a.idPregunta - b.idPregunta);
            setData(dataArray);

            const currentQuestion = dataArray.find((item) => item.idPregunta === questionId);
            setQuestion(currentQuestion);
            setOpciones(currentQuestion?.opciones || []);
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setLoading(false);
        }
    };

    const addOption = async () => {
        if (newOption.trim() === '') return alert('Debe contener algo');

        const updatedOptions = [...opciones, newOption.trim()];

        try {
            const questionRef = doc(db, 'quiz', question.id); // Ensure to replace 'quiz' and question.id with your collection and document ID
            await updateDoc(questionRef, {
                opciones: updatedOptions
            });

            setOpciones(updatedOptions);
            setNewOption('');
            updateQuiz()
        } catch (error) {
            console.error('Error adding option: ', error);
        }
    };

    const deleteOption = async (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const updatedOptions = [...opciones];
            updatedOptions.splice(index, 1);

            try {
                const questionRef = doc(db, 'quiz', question.id); // Ensure to replace 'quiz' and question.id with your collection and document ID
                await updateDoc(questionRef, {
                    opciones: updatedOptions
                });

                setOpciones(updatedOptions);
                updateQuiz()
            } catch (error) {
                console.error('Error deleting option: ', error);
            }
        }
    };

    const updateQuiz = () => {
        fetchData();
    };

    return (
        <>
            {showModal.show && (
                <QuizModal
                    question={question}
                    setShowModal={setShowModal}
                    optionIndex={showModal.index}
                    opciones={opciones}
                    setOpciones={setOpciones}
                    questionId={questionId}
                    updateQuiz={updateQuiz}
                />
            )}
            <div className='quiz'>
                {loading && (
                    <div className="loading-spinner">
                        <i className="bi bi-arrow-clockwise"></i>
                    </div>
                )}
                <div className='quiz-circles'>
                    {data.map((circle) => (
                        <Circle
                            key={circle.id}
                            circle={circle}
                            questionId={questionId}
                            setQuestionId={setQuestionId}
                        />
                    ))}
                </div>
                <div className='quiz-middle'>
                    <div className='quiz-middle-middle'>
                        {question ? (
                            <h1>{question.pregunta}</h1>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className='quiz-options'>
                    {question ? (
                        question.opciones.map((option, index) => (
                            <Option
                                key={index}
                                option={option}
                                index={index}
                                setShowModal={setShowModal}
                                deleteOption={deleteOption}
                            />
                        ))
                    ) : (
                        <></>
                    )}
                    <div className="quiz-options-add">
                        <input
                            className='quiz-options-input'
                            placeholder='Escriba una nueva opcion...'
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}>
                        </input>
                        <button className='quiz-options-add-button' onClick={addOption}>+</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Quiz;
