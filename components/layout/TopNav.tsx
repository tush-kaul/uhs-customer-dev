// import WelcomeMessage from "../WelcomeMessage";
// import SearchBar from "../SearchBar";
import Image from "next/image";
import { SidebarTrigger } from "../ui/sidebar";

export const TopNav = () => {
	return (
		<nav className="md:hidden h-20 w-full ">
			<div className="flex">
				<div className=" fixed top-0 left-0 w-full mobile-nav-bg flex items-center justify-between p-4 z-50 shadow-md">
					<div className="flex items-center">
						<Image
							src="/icons/logo 1.svg"
							alt="uhs"
							width={50}
							height={50}
							className="bg-gray-300 border rounded-lg"
						/>
						<span className="text-xl lg:text-3xl font-semibold text-orange-500 ml-5">
							Urban
						</span>
						<span className="text-xl lg:text-3xl font-semibold text-white ml-2">
							{" "}
							Services
						</span>
					</div>

					<SidebarTrigger className="md:hidden" />
				</div>
			</div>
		</nav>
	);
};
