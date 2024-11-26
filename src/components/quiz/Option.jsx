import './Option.css';

const Option = ({ option, index, setShowModal, deleteOption }) => {
    return (
        <div className="option">
            <p>{option}</p>
            <div className="option-crud">
                <button
                    className="option-edit"
                    onClick={() => setShowModal({ show: true, index })}>
                    Editar
                </button>
                <button
                    className="option-delete"
                    onClick={() => deleteOption(index)}>
                    Borrar
                </button>
            </div>
        </div>
    );
};

export default Option;
