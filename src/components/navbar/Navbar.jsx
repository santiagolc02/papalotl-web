import './Navbar.css';

const Navbar = ({ display, setDisplay }) => {
    return (
        <div className="navbar">
            <div className='navbar-top'>
                <img src="/assets/logoPapalote.png" alt="Description of image" className='navbar-img' />
            </div>
            <div className="navbar-ps">
                <div className={`navbar-section ${display === "zonas" ? "selected" : ""}`} onClick={() => setDisplay("zonas")}>
                    <p className='navbar-p'>Zonas</p>
                </div>
                <div className={`navbar-section ${display === "actividades" ? "selected" : ""}`} onClick={() => setDisplay("actividades")}>
                    <p className='navbar-p'>Actividades</p>
                </div>
                <div className={`navbar-section ${display === "anuncios" ? "selected" : ""}`} onClick={() => setDisplay("anuncios")}>
                    <p className='navbar-p'>Anuncios</p>
                </div>
                <div className={`navbar-section ${display === "usuarios" ? "selected" : ""}`} onClick={() => setDisplay("usuarios")}>
                    <p className='navbar-p'>Usuarios</p>
                </div>
                <div className={`navbar-section ${display === "reseñas" ? "selected" : ""}`} onClick={() => setDisplay("reseñas")}>
                    <p className='navbar-p'>Reseñas</p>
                </div>
                <div className={`navbar-section ${display === "quiz" ? "selected" : ""}`} onClick={() => setDisplay("quiz")}>
                    <p className='navbar-p'>Quiz</p>
                </div>
                <div className={`navbar-section ${display === "insignias" ? "selected" : ""}`} onClick={() => setDisplay("insignias")}>
                    <p className='navbar-p'>Insignias</p>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
