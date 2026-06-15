import { useState } from 'react';
import './App.css';
import { MapContainer } from './components/MapContainer';
import { Navbar } from './components/Navbar';
import SideBar from './components/SideBar';
import type { FilterParams } from './types/FilterParams';

function App() {
	const [filters, setFilters] = useState<FilterParams | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [isDarkMode, setIsDarkMode] = useState(false);
	return (
		<>
			<Navbar
				onToggleFilters={() => setSidebarOpen((prev) => !prev)}
				isDarkMode={isDarkMode}
				onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
			/>
			<MapContainer filters={filters} isDarkMode={isDarkMode} />
			<SideBar
				onFilter={setFilters}
				isOpen={sidebarOpen}
				onToggle={() => setSidebarOpen((prev) => !prev)}
			/>
		</>
	);
}

export default App;
