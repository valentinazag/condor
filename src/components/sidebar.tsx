import '../App.css';

export default function SideBar() {
	return (
		<div className="side-bar">
			<form action="POST">
				<input type="date" name="starttime" id="starttime" className="filter" />
				<input type="date" name="endtime" id="endtime" className="filter" />
				<input
					type="number"
					name="minmagnitude"
					id="minmagnitude"
					className="filter"
				/>
			</form>
		</div>
	);
}
