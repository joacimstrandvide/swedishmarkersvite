import { useState } from 'react'
import './App.css'
// Komponenter
import Map from './components/Map'
import Navbar from './components/Navbar'

function App() {
    // Filtrering efter kategori
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <>
            <Navbar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSearch={setSearchQuery}
            />
            <Map
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
            />
        </>
    )
}

export default App
