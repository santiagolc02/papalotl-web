import './App.css'
import { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Zonas from './components/zonas/Zonas';
import Actividades from './components/actividades/Actividades';
import Anuncios from './components/anuncios/Anuncios';
import Usuarios from './components/usuarios/Usuarios';
import Reseñas from './components/reseñas/Reseñas';
import Quiz from './components/quiz/Quiz';
import Insignias from './components/insignias/Insignias';

const App = () => {
  const [display, setDisplay] = useState("zonas")

  const renderComponent = () => {
    switch (display) {
      case 'zonas':
        return <Zonas/>;
      case 'actividades':
        return <Actividades/>;
      case 'anuncios':
        return <Anuncios/>
      case 'usuarios':
        return <Usuarios/>
      case 'reseñas':
        return <Reseñas/>
      case 'quiz':
        return <Quiz/>
      case 'insignias':
        return <Insignias/>
      default:
        return <div>WIP</div>;
    }
  };

  return (
    <div className='app'>
      <Navbar display={display} setDisplay={setDisplay}></Navbar>
      {renderComponent()}
    </div>
  )
};

export default App;
