import { useState } from 'react'
/* Popup fönstret */
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
/* Komponenter */
import Help from './Help'
import Login from './Login'
import styles from './Navbar.module.css'

/* Kategorier */
const categories = [
    { value: 'all', label: 'Allt' },
    { value: 'boat.webp', label: 'Båt' },
    { value: 'food.webp', label: 'Mat' },
    { value: 'swim.webp', label: 'Simmning' },
    { value: 'kayak.webp', label: 'Kayak' },
    { value: 'historic.webp', label: 'Historiskt' },
    { value: 'nature.webp', label: 'Natur' },
    { value: 'parking.webp', label: 'Parkering' },
    { value: 'pier.webp', label: 'Brygga' },
    { value: 'bunker.webp', label: 'Militärt' },
    { value: 'spa.webp', label: 'Spa' },
    { value: 'church.webp', label: 'Kyrka' },
    { value: 'lighthouse.webp', label: 'Fyr' },
    { value: 'potato.webp', label: 'Potatis' },
    { value: 'animal.webp', label: 'Djur' },
    { value: 'theme-park.webp', label: 'Nöjespark' },
    { value: 'shipwreck.webp', label: 'Skeppsbrott' },
    { value: 'nuclear.webp', label: 'Kärnkraft' },
    { value: 'lake.webp', label: 'Sjö' },
    { value: 'battery.webp', label: 'Laddning' }
]

// Skicka några props
function Navbar({ selectedCategory, onCategoryChange }) {
    // States
    const [open, setOpen] = useState(false)
    const selected = categories.find((c) => c.value === selectedCategory)

    return (
        <nav className={styles.navbar}>
            <div className={styles.controls}>
                {/* Filtrering */}
                <div className={styles.filter}>
                    <div
                        className={styles.customSelect}
                        onClick={() => setOpen((o) => !o)}
                    >
                        <span>{selected?.label ?? 'Allt'}</span>
                    </div>
                    {open && (
                        <div className={styles.dropdown}>
                            {categories.map((cat) => (
                                <div
                                    key={cat.value}
                                    className={`${styles.option} ${selectedCategory === cat.value ? styles.optionActive : ''}`}
                                    onClick={() => {
                                        onCategoryChange(cat.value)
                                        setOpen(false)
                                    }}
                                >
                                    {cat.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.buttons}>
                    {/* Inloggning */}
                    <Popup
                        trigger={
                            <button className={styles.button}>Konto</button>
                        }
                        modal
                        nested
                    >
                        {(close) => (
                            <div className="modal">
                                <button className="close" onClick={close}>
                                    &times;
                                </button>
                                <div className="content">
                                    <Login />
                                </div>
                            </div>
                        )}
                    </Popup>

                    <Popup
                        trigger={
                            <button className={styles.button}>Hjälp</button>
                        }
                        modal
                        nested
                    >
                        {(close) => (
                            <div className="modal">
                                <button className="close" onClick={close}>
                                    &times;
                                </button>
                                <div className="content">
                                    <Help />
                                </div>
                            </div>
                        )}
                    </Popup>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
