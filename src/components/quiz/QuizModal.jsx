import './QuizModal.css';
import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { doc, updateDoc } from 'firebase/firestore';

const QuizModal = ({ question, setShowModal, optionIndex, setOpciones, updateQuiz }) => {
    const [option, setOption] = useState('');

    useEffect(() => {
        if (question && optionIndex !== null) {
            setOption(question.opciones[optionIndex]);
        }
    }, [question, optionIndex]);

    const handleOptionSubmit = async () => {
        // Create a copy of the current options
        const updatedOptions = [...question.opciones];
        // Update the specific option
        updatedOptions[optionIndex] = option;

        // Update the parent state to reflect changes
        setOpciones(updatedOptions);

        try {
            // Update Firestore document
            const questionRef = doc(db, 'quiz', question.id); // Ensure to replace 'quiz' and question.id with your collection and document ID
            await updateDoc(questionRef, {
                opciones: updatedOptions
            });

            setShowModal({ show: false, index: null });
            updateQuiz();
        } catch (error) {
                console.error('Error updating option: ', error);
            }
        };

    return (
        <div className="quiz-modal-overlay" onMouseDown={() => setShowModal({ show: false, index: null })}>
            <div className="quiz-modal" onMouseDown={(e) => e.stopPropagation()}>
                <input
                    type="text"
                    className='quiz-modal-input'
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                />
                <button className='quiz-modal-button' onClick={handleOptionSubmit}>Guardar</button>
            </div>
        </div>
    );
};

export default QuizModal;
