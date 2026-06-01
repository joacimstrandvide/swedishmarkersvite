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
    { value: 'all', label: 'All' },
    { value: 'boat.webp', label: 'Boat' },
    { value: 'food.webp', label: 'Food' },
    { value: 'swim.webp', label: 'Swimming' },
    { value: 'beach.webp', label: 'Beach' },
    { value: 'kayak.webp', label: 'Kayak' },
    { value: 'historic.webp', label: 'Historical' },
    { value: 'museum.webp', label: 'Museum' },
    { value: 'nature.webp', label: 'Nature' },
    { value: 'view.webp', label: 'Viewpoint' },
    { value: 'rest.webp', label: 'Rest Area' },
    { value: 'parking.webp', label: 'Parking' },
    { value: 'pier.webp', label: 'Pier' },
    { value: 'bunker.webp', label: 'Military' },
    { value: 'spa.webp', label: 'Spa' },
    { value: 'church.webp', label: 'Church' },
    { value: 'lighthouse.webp', label: 'Lighthouse' },
    { value: 'potato.webp', label: 'Potato' } /* Skämt */,
    { value: 'animal.webp', label: 'Animals' },
    { value: 'theme-park.webp', label: 'Theme Park' },
    { value: 'shipwreck.webp', label: 'Shipwreck' },
    { value: 'nuclear.webp', label: 'Nuclear Power' },
    { value: 'lake.webp', label: 'Lake' },
    { value: 'battery.webp', label: 'Charging' }
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
                        <span>{selected?.label ?? 'All'}</span>
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
                            <button className={styles.button}>Account</button>
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
                            <button className={styles.button}>Help</button>
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
