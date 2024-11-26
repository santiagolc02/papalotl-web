import './ObjReseña.css'

function ObjReseña({ reseña }) {
    return (
        <div className='obj-reseña'>
            <div className="obj-reseña-top">
                <p>{reseña.comment}</p>
                {/* <div className="obj-reseña-crud">
                    <i class="bi bi-pencil-square"></i>
                    <i class="bi bi-trash"></i>
                </div> */}
            </div>
            <br></br>
            <p className='obj-reseña-quote'>Calificación: {reseña.rating}/5</p>
        </div>
    )
}

export default ObjReseña
