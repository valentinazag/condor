import '../App.css';
import type { SideBarProps } from '../types/SideBarProps';
import { Form } from './Form';

export default function SideBar({ onFilter }: SideBarProps) {
	return (
		<div className="side-bar">
			<Form onFilter={onFilter} />
		</div>
	);
}
