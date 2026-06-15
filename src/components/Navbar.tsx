import '../App.css';

type NavbarProps = {
	onToggleFilters: () => void;
	isDarkMode: boolean;
	onToggleDarkMode: () => void;
};

export function Navbar({
	onToggleFilters,
	isDarkMode,
	onToggleDarkMode,
}: NavbarProps) {
	return (
		<nav className="navbar">
			<div className="navbar__logo">Earthquake Tracker</div>
			<div className="navbar__menu">
				<button
					type="button"
					className="navbar__link navbar__link-btn"
					onClick={onToggleFilters}
					style={{ marginRight: '16px' }}
				>
					Filters
				</button>
				<button
					type="button"
					className="navbar__darkmode-btn"
					onClick={onToggleDarkMode}
				>
					{isDarkMode ? 'Light Mode' : 'Dark Mode'}
				</button>
			</div>
		</nav>
	);
}
