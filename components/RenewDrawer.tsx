import { BookingAction } from "@/actions/booking";
import { Booking } from "@/app/dashboard/home/page";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { SearchIcon, X } from "lucide-react";
import { toast } from "sonner";
import Loader from "./ui/loader";
import SearchBar from "@/components/SearchBar";

export const RenewDrawer = ({
	isOpen,
	onClose,
	onSelectBooking,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSelectBooking: (booking: Booking) => void;
}) => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	// Filter bookings to show only active, scheduled, and upcoming
	const filteredBookings = data.filter((booking) =>
		["active", "scheduled", "upcoming"].includes(booking.status)
	);

	// Format date for display
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Search functionality
	const [searchTerm, setSearchTerm] = useState("");
	const searchedBookings = filteredBookings.filter(
		(booking) =>
			booking.service.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			booking.booking_number
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const result = await BookingAction(
					`recurrence_plan=once&recurrence_plan=twice&recurrence_plan=three&recurrence_plan=four&recurrence_plan=five&recurrence_plan=six`
				);

				setData(result);
			} catch (error: any) {
				console.error("Failed to fetch bookings:", error);
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gray-800/40 bg-opacity-50 z-50 flex justify-end">
			<div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-lg">
				<div className="p-4 border-b flex justify-between items-center">
					<h2 className="text-xl font-bold text-[#1e293b]">
						Select Booking to Renew
					</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
					>
						<X className="h-5 w-5" />
					</Button>
				</div>

				<div className="p-4">
					<div className="relative mb-4 flex border gap-2 items-center rounded-md px-2 py-2">
						<SearchIcon />
						<input
							type="text"
							placeholder="Search bookings..."
							className="w-full focus:ring-0 focus:outline-0"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{loading ? (
						<div className="flex space-y-3 items-center justify-center">
							<Loader />
						</div>
					) : (
						<div className="space-y-3">
							{searchedBookings.length > 0 ? (
								searchedBookings.map((booking) => {
									console.log(booking, "booking");
									return (
										<div
											key={booking.id}
											className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
											onClick={() =>
												onSelectBooking(booking)
											}
										>
											<div className="flex justify-between items-center mb-1">
												<span className="font-medium">
													{booking.service.name}
												</span>
												<span
													className={`text-sm px-2 py-1 rounded-full ${
														booking.status ===
														"active"
															? "bg-green-100 text-green-800"
															: booking.status ===
															  "upcoming"
															? "bg-blue-100 text-blue-800"
															: "bg-yellow-100 text-yellow-800"
													}`}
												>
													{booking.status
														.charAt(0)
														.toUpperCase() +
														booking.status.slice(1)}
												</span>
											</div>

											<div className="flex justify-between text-sm text-gray-600 pb-2">
												<span>
													{booking.appartment_number}
												</span>
												<span>
													{booking.property.name}
												</span>
											</div>
											<div className="flex justify-between text-sm text-gray-600">
												<span>
													#{booking.booking_number}
												</span>
												<span>
													{formatDate(booking.date)} -{" "}
													{formatDate(
														booking.end_date
													)}
												</span>
											</div>
										</div>
									);
								})
							) : (
								<div className="text-center py-4 text-gray-500">
									No matching bookings found
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
