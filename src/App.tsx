import { useState } from 'react';
import './App.css';
import { MapContainer } from './components/MapContainer';
import SideBar from './components/SideBar';
import type { FilterParams } from './types/FilterParams';

function App() {
	const [filters, setFilters] = useState<FilterParams | null>(null);

	return (
		<>
			<MapContainer filters={filters} />
			<SideBar onFilter={setFilters} />
		</>
	);
}

export default App;
