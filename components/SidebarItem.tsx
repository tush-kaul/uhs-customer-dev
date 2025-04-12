import Link from "next/link";
import { cn } from "../lib/utils";
import Image from "next/image";

const SidebarItem = ({
	id,
	href,
	iconSrc,
	label,
	active,
}: {
	id: number;
	href: string;
	iconSrc: string;
	label: string;
	active: boolean;
}) => (
	<li key={id}>
		<Link
			href={href}
			className={cn(
				"flex items-center space-x-2 p-2 rounded-lg transition-colors",
				active ? "sidebar-active" : "hover:bg-gray-100"
			)}>
			<Image
				src={iconSrc}
				alt={label}
				width={20}
				height={20}
				className="w-auto"
			/>
			<span
				className={cn(
					"text-sm font-medium sidebar-text",
					active ? "sidebar-active" : ""
				)}>
				{label}
			</span>
		</Link>
	</li>
);

export default SidebarItem;
