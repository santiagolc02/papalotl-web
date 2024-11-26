import './Circle.css'

const Circle = ({ circle, questionId, setQuestionId }) => {

    const handleCircleClick = () => {
        setQuestionId(circle.idPregunta)
    }

    return (
        <div className={`${questionId === circle.idPregunta ? 'circle-selected' : 'circle'}`} onClick={handleCircleClick}>
            <h1>{circle.idPregunta}</h1>
        </div>
    )
}

export default Circle

