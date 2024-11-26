import './InsigniasObj.css'
import { useState, useEffect } from 'react';

const InsigniasObj = ({ item, handleInsigniaClick, selectedInsignia }) => {
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        setSelected(selectedInsignia?.id === item.id);
    }, [selectedInsignia, item.id]);

    const handleClick = (item) => {
        handleInsigniaClick(item);
    }

    return (
        <div className={`${selected ? 'insignias-obj-selected' : 'insignias-obj'}`} onClick={() => handleClick(item)}>
            <h3>{item.descInsignia}</h3>
        </div>
    )
}

export default InsigniasObj
