import { useState } from 'react'
import './App.css'
// Komponenter
import Map from './components/Map'
import Navbar from './components/Navbar'

function App() {
    // Filtrering efter kategori
    const [selectedCategory, setSelectedCategory] = useState('all')
    return (
        <>
            <Navbar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            <Map selectedCategory={selectedCategory} />
        </>
    )
}

export default App
