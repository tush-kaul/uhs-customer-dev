import React, { useState, useEffect, useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "../ui/button";
import { useUserData } from "@/hooks/user-provider";
import CancelModal from "../CancelModal";
import RescheduleModal from "../RescheduleModal";
import { Package } from "../CancelPackageModal";
import ServiceWizard from "../service-wizard";
import { useAllBookings } from "@/hooks/booking";
import { formatDate } from "@/lib/utils";
import { BookingCard } from "./BookingCard";
import { TableShimmer, CardShimmer } from "./ShimmerComponents";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Add this style at the top of the file to force correct mobile/desktop display
const mobileStyles = `
  @media (max-width: 767px) {
    .desktop-only-table {
      display: none !important;
    }
    .mobile-only-cards {
      display: block !important;
    }
  }
  @media (min-width: 768px) {
    .desktop-only-table {
      display: block !important;
    }
    .mobile-only-cards {
      display: none !important;
    }
  }
`;

// Format time helper function
export const formatTime = (timeString: string) => {
	if (!timeString) return "";

	const [hours, minutes] = timeString.split(":");
	const hour = parseInt(hours, 10);
	const suffix = hour >= 12 ? "PM" : "AM";
	const displayHour = hour % 12 || 12;
	return `${displayHour}:${minutes} ${suffix}`;
};

// Helper functions moved to the top
const getStatusClassName = (item: any) => {
	return `px-2 py-0.5 inline-block rounded-full text-xs text-center break-words ${
		item.status === "completed"
			? "bg-green-200 text-green-800"
			: item.status === "active"
			? "bg-yellow-200 text-yellow-800"
			: item.status === "upcoming"
			? "bg-blue-200 text-blue-800"
			: item.status === "scheduled" && item.is_cancelled !== true
			? "bg-gray-200 text-gray-800"
			: item.status === "rescheduled"
			? "bg-purple-200 text-purple-800"
			: item.is_cancelled === true
			? "bg-red-200 text-red-800"
			: "bg-red-200 text-red-800"
	}`;
};

const getStatusText = (item: any) => {
	return item.is_cancelled === true && item.status === "scheduled"
		? "cancelled"
		: item.status.replace("_", " ");
};

const showActionButtons = (item: any) => {
	return (
		item.status !== "completed" &&
		item.status !== "cancelled" &&
		!item.is_cancelled
	);
};

// Calendar icon for empty state
const CalendarIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className || "w-6 h-6"}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</svg>
);

// Type for booking
export interface Booking {
	id: number;
	service: any;
	customer?: string;
	status: string;
	date: string;
	startTime: string;
	endTime: string;
	phoneNumber: string;
	apartmentType: string;
	team: {
		id: number;
		name: string;
		members: { id: number; name: string }[];
	};
	statusStyle?: string;
	serviceNumber?: string;
	serviceIcon?: string;
	property?: string | { name: string };
	apartment_number?: string;
	district?: string;
	area?: string;
	location?: string;
}

// Image path mapping
const ImagePathSetting: Record<string, string> = {
	"Deep Cleaning": "residential",
	"Car Wash": "car-wash",
	"Regular Cleaning": "residential",
	"Specialized Cleaning": "specialised",
};

const DataTable = () => {
	// States
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
		null
	);
	const [wizardOpen, setWizardOpen] = useState(false);
	const { setDataLoading } = useUserData();
	const [selectedPackage, setSelectedPackage] = useState<Package | null>(
		null
	);
	const [modalType, setModalType] = useState<
		"cancel" | "reschedule" | "renew" | null
	>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [bookings, setBookings] = useState<any[]>([]);
	const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

	// Filter states
	const [selectedProperty, setSelectedProperty] = useState<string>("all");
	const [selectedApartment, setSelectedApartment] = useState<string>("all");

	// Fetch bookings with React Query
	const { data, isLoading: dataLoading, error, refetch } = useAllBookings();

	// Update local bookings state when data changes
	useEffect(() => {
		if (data && !dataLoading) {
			setBookings(data);
		}
	}, [data, dataLoading]);

	// Helper function to safely get property name
	const getPropertyName = (property: any): string => {
		if (!property) return "N/A";
		if (typeof property === "string") return property;
		if (typeof property === "object" && property.name) return property.name;
		return "N/A";
	};

	// Extract unique properties and apartments
	const { properties, apartments } = useMemo(() => {
		const properties = new Set<string>();
		const apartments = new Set<string>();

		if (bookings && bookings.length > 0) {
			console.log("bookings", bookings);
			bookings.forEach((booking) => {
				const propertyName = getPropertyName(booking.property);
				if (propertyName !== "N/A") {
					properties.add(propertyName);
				}

				if (booking.apartment_number) {
					apartments.add(booking.apartment_number);
				}
			});
		}

		return {
			properties: Array.from(properties).sort(),
			apartments: Array.from(apartments).sort(),
		};
	}, [bookings]);

	// Filtered bookings
	const filteredBookings = useMemo(() => {
		return bookings.filter((booking) => {
			const bookingPropertyName = getPropertyName(booking.property);

			const matchesProperty =
				selectedProperty === "all" ||
				bookingPropertyName === selectedProperty;
			const matchesApartment =
				selectedApartment === "all" ||
				booking.apartment_number === selectedApartment;
			return matchesProperty && matchesApartment;
		});
	}, [bookings, selectedProperty, selectedApartment]);

	// Check screen size for responsive layout
	useEffect(() => {
		const checkIfMobile = () => {
			const width = window.innerWidth;
			const mobileBreakpoint = 768;
			const isMobileView = width < mobileBreakpoint;
			setIsMobile(isMobileView);
			console.log("Screen width:", width, "Is mobile:", isMobileView);

			// Force mobile view with a class on the body
			if (isMobileView) {
				document.body.classList.add("is-mobile-view");
			} else {
				document.body.classList.remove("is-mobile-view");
			}
		};

		// Check immediately
		checkIfMobile();

		// Then add listener for resize events
		window.addEventListener("resize", checkIfMobile);

		// Cleanup listener on component unmount
		return () => {
			window.removeEventListener("resize", checkIfMobile);
			document.body.classList.remove("is-mobile-view");
		};
	}, []);

	// Update global loading state
	useEffect(() => {
		setDataLoading(dataLoading);
	}, [dataLoading, setDataLoading]);

	// Modal handlers
	const handleOpenModal = (
		booking: any,
		type: "cancel" | "reschedule" | "renew"
	) => {
		setSelectedBooking(booking);
		setSelectedPackage(booking as any);
		setModalType(type);
		setWizardOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedBooking(null);
		setModalType(null);
		setWizardOpen(false);
	};

	// Handle row expansion
	const toggleRowExpansion = (rowId: number) => {
		setExpandedRowId(expandedRowId === rowId ? null : rowId);
	};

	// Handle reschedule success
	const handleRescheduleSuccess = (updatedBooking: any) => {
		// Update the specific booking in the local state
		const updatedBookings = bookings.map((booking) => {
			if (booking.id === updatedBooking.id) {
				return {
					...booking,
					date: updatedBooking.date,
					start_time: updatedBooking.start_time,
					end_time: updatedBooking.end_time,
					status: "upcoming",
					is_rescheduled: true,
				};
			}
			return booking;
		});

		setBookings(updatedBookings);
		handleCloseModal();
	};

	// Reset filters
	const resetFilters = () => {
		setSelectedProperty("all");
		setSelectedApartment("all");
	};

	// Expandable Row Component for Desktop View
	const ExpandableRow = ({
		item,
		isExpanded,
		onToggle,
	}: {
		item: any;
		isExpanded: boolean;
		onToggle: () => void;
	}) => {
		const propertyName = getPropertyName(item.property);

		return (
			<>
				<TableRow
					className="hover:bg-gray-50 cursor-pointer"
					onClick={onToggle}
				>
					<TableCell className="py-4 pl-2 w-10">
						<div className="flex items-center">
							{isExpanded ? (
								<ChevronDown size={16} />
							) : (
								<ChevronRight size={16} />
							)}
						</div>
					</TableCell>
					<TableCell className="py-4 w-1/5">
						<div className="flex items-center gap-3">
							<div className="flex-shrink-0">
								<Image
									src={`/icons/${
										ImagePathSetting[item?.service_name] ||
										"residential"
									}.svg`}
									alt={item.service_name || "Service"}
									className="w-10 h-10 rounded-full object-cover"
									width={40}
									height={40}
								/>
							</div>
							<div className="flex-grow min-w-0">
								<p className="font-medium break-words">
									{item.service_name || "Service"}
								</p>
								<p className="text-sm text-gray-500 break-words">
									#{item.booking_number || "N/A"}
								</p>
							</div>
						</div>
					</TableCell>
					<TableCell className="py-4 w-1/5">
						<p className="break-words">{formatDate(item.date)}</p>
						<p className="text-sm text-gray-500 break-words">
							{formatTime(item.start_time)} to{" "}
							{formatTime(item.end_time)}
						</p>
					</TableCell>
					<TableCell className="py-4 w-1/12">
						<p className="break-words">
							{item.apart_type || "N/A"}
						</p>
					</TableCell>
					<TableCell className="py-4 w-1/12">
						<p className="break-words">{item.team || "N/A"}</p>
					</TableCell>
					<TableCell className="py-4 w-1/6">
						<div className="flex flex-wrap gap-2">
							<span className={getStatusClassName(item)}>
								{getStatusText(item)}
							</span>

							{item.status === "upcoming" &&
								item.is_rescheduled === true && (
									<span className="px-2 py-0.5 inline-block rounded-full text-xs text-center break-words bg-purple-200 text-purple-800">
										rescheduled
									</span>
								)}
						</div>
					</TableCell>
					<TableCell className="py-4 w-1/6">
						{showActionButtons(item) && (
							<div className="flex flex-col sm:flex-row gap-2">
								{item.status !== "rescheduled" && (
									<Button
										onClick={(e) => {
											e.stopPropagation();
											handleOpenModal(item, "reschedule");
										}}
										variant="link"
										className="text-blue-500 p-0 h-auto whitespace-normal text-left justify-start"
									>
										Reschedule
									</Button>
								)}

								<Button
									onClick={(e) => {
										e.stopPropagation();
										handleOpenModal(item, "cancel");
									}}
									variant="link"
									className="text-red-500 p-0 h-auto whitespace-normal text-left justify-start"
								>
									Cancel
								</Button>
							</div>
						)}
					</TableCell>
				</TableRow>

				{isExpanded && (
					<TableRow className="bg-gray-50">
						<TableCell
							colSpan={7}
							className="py-4 px-6"
						>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<h4 className="font-medium text-gray-700 mb-2">
										Location Details
									</h4>
									<div className="space-y-1 text-sm">
										<p>
											<span className="text-gray-500">
												Property:
											</span>{" "}
											{propertyName}
										</p>
										<p>
											<span className="text-gray-500">
												Apartment:
											</span>{" "}
											{item.apartment_number || "N/A"}
										</p>
										<p>
											<span className="text-gray-500">
												District:
											</span>{" "}
											{item.district.name || "N/A"}
										</p>
										<p>
											<span className="text-gray-500">
												Area:
											</span>{" "}
											{item.area.name || "N/A"}
										</p>
										<p>
											<span className="text-gray-500">
												Full Address:
											</span>{" "}
											{item.apartment_number +
												" " +
												item.residence_type.type +
												", " +
												item.property.name +
												" " +
												item.district.name +
												" " +
												item.area.name || "N/A"}
										</p>
									</div>
								</div>

								<div>
									<h4 className="font-medium text-gray-700 mb-2">
										Service Details
									</h4>
									<div className="space-y-1 text-sm">
										<p>
											<span className="text-gray-500">
												Date:
											</span>{" "}
											{formatDate(item.date)}
										</p>
										<p>
											<span className="text-gray-500">
												Time:
											</span>{" "}
											{formatTime(item.start_time)} to{" "}
											{formatTime(item.end_time)}
										</p>
										<p>
											<span className="text-gray-500">
												Residence Type:
											</span>{" "}
											{item.apart_type || "N/A"}
										</p>
									</div>
								</div>

								<div>
									<h4 className="font-medium text-gray-700 mb-2">
										Team Information
									</h4>
									<div className="space-y-1 text-sm">
										<p>
											<span className="text-gray-500">
												Team Name:
											</span>{" "}
											{item.team || "N/A"}
										</p>
										{item.team_members &&
											item.team_members.length > 0 && (
												<div>
													<span className="text-gray-500">
														Team Members:
													</span>
													<ul className="pl-4 mt-1">
														{item.team_members.map(
															(
																member: any,
																idx: number
															) => (
																<li key={idx}>
																	{
																		member.name
																	}
																</li>
															)
														)}
													</ul>
												</div>
											)}
									</div>
								</div>
							</div>
						</TableCell>
					</TableRow>
				)}
			</>
		);
	};

	// Expanded content component for mobile card
	const ExpandedContent = ({ item }: { item: any }) => {
		const propertyName = getPropertyName(item.property);

		// Helper function to safely get property values
		const getSafeValue = (value: any, defaultValue: string = "N/A") => {
			if (value === null || value === undefined) return defaultValue;
			if (typeof value === "object" && value !== null) {
				return value.name || JSON.stringify(value);
			}
			return value;
		};

		return (
			<div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
				<div className="space-y-4">
					<div>
						<h4 className="font-medium text-gray-700 mb-2">
							Location Details
						</h4>
						<div className="space-y-1 text-sm">
							<p>
								<span className="text-gray-500">Property:</span>{" "}
								{propertyName}
							</p>
							<p>
								<span className="text-gray-500">
									Apartment:
								</span>{" "}
								{getSafeValue(item.apartment_number)}
							</p>
							<p>
								<span className="text-gray-500">District:</span>{" "}
								{getSafeValue(item.district)}
							</p>
							<p>
								<span className="text-gray-500">Area:</span>{" "}
								{getSafeValue(item.area)}
							</p>
							<p>
								<span className="text-gray-500">
									Full Address:
								</span>{" "}
								{getSafeValue(item.location)}
							</p>
						</div>
					</div>

					<div>
						<h4 className="font-medium text-gray-700 mb-2">
							Service Details
						</h4>
						<div className="space-y-1 text-sm">
							<p>
								<span className="text-gray-500">Date:</span>{" "}
								{formatDate(item.date)}
							</p>
							<p>
								<span className="text-gray-500">Time:</span>{" "}
								{formatTime(item.start_time)} to{" "}
								{formatTime(item.end_time)}
							</p>
							<p>
								<span className="text-gray-500">
									Residence Type:
								</span>{" "}
								{getSafeValue(item.apart_type)}
							</p>
						</div>
					</div>

					<div>
						<h4 className="font-medium text-gray-700 mb-2">
							Team Information
						</h4>
						<div className="space-y-1 text-sm">
							<p>
								<span className="text-gray-500">
									Team Name:
								</span>{" "}
								{getSafeValue(item.team)}
							</p>
							{item.team_members &&
								item.team_members.length > 0 && (
									<div>
										<span className="text-gray-500">
											Team Members:
										</span>
										<ul className="pl-4 mt-1">
											{item.team_members.map(
												(member: any, idx: number) => (
													<li key={idx}>
														{getSafeValue(
															member.name,
															member
														)}
													</li>
												)
											)}
										</ul>
									</div>
								)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	// Enhanced BookingCard with expandable functionality
	const EnhancedBookingCard = ({ item }: { item: any }) => {
		const [isExpanded, setIsExpanded] = useState(false);

		return (
			<div className="border rounded-lg shadow-sm mb-4 overflow-hidden bg-white">
				<div className="p-4">
					<div
						className="flex justify-between items-start cursor-pointer"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						<div className="flex items-start gap-3">
							<Image
								src={`/icons/${
									ImagePathSetting[item?.service_name] ||
									"residential"
								}.svg`}
								alt={item.service_name || "Service"}
								className="w-10 h-10 object-cover"
								width={40}
								height={40}
							/>
							<div>
								<h3 className="font-medium text-base">
									{item.service_name || "Service"}
								</h3>
								<p className="text-sm text-gray-500">
									#{item.booking_number || "N/A"}
								</p>
							</div>
						</div>
						{isExpanded ? (
							<ChevronDown
								size={18}
								className="text-gray-500"
							/>
						) : (
							<ChevronRight
								size={18}
								className="text-gray-500"
							/>
						)}
					</div>

					<div className="grid grid-cols-2 gap-y-3 mt-4">
						<div>
							<p className="text-sm text-gray-500">Date</p>
							<p className="font-normal">
								{formatDate(item.date)}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">Time</p>
							<p className="font-normal">
								{formatTime(item.start_time)} -{" "}
								{formatTime(item.end_time)}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">Status</p>
							<div className="mt-1">
								<span className={getStatusClassName(item)}>
									{getStatusText(item)}
								</span>
								{item.status === "upcoming" &&
									item.is_rescheduled === true && (
										<span className="ml-1 px-2 py-0.5 inline-block rounded-full text-xs text-center bg-purple-200 text-purple-800">
											rescheduled
										</span>
									)}
							</div>
						</div>
						<div>
							<p className="text-sm text-gray-500">Team</p>
							<p className="font-normal">
								{item.team || "Cleaning Team"}
							</p>
						</div>
					</div>

					{showActionButtons(item) && (
						<div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
							{item.status !== "rescheduled" && (
								<Button
									onClick={(e) => {
										e.stopPropagation();
										handleOpenModal(item, "reschedule");
									}}
									variant="link"
									className="text-blue-500 p-0 h-auto"
								>
									Reschedule
								</Button>
							)}
							<Button
								onClick={(e) => {
									e.stopPropagation();
									handleOpenModal(item, "cancel");
								}}
								variant="link"
								className="text-red-500 p-0 h-auto"
							>
								Cancel
							</Button>
						</div>
					)}
				</div>

				{isExpanded && <ExpandedContent item={item} />}
			</div>
		);
	};

	// Filter UI - Improved responsive design
	const renderFilterUI = () => (
		<div className="bg-white p-4 mb-4 rounded-lg shadow-sm border">
			<div className="flex items-center mb-3">
				<Filter
					size={18}
					className="text-gray-500 mr-2"
				/>
				<h3 className="font-medium">Filter Bookings</h3>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Property
					</label>
					<Select
						value={selectedProperty}
						onValueChange={setSelectedProperty}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="All properties" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All properties</SelectItem>
							{properties.map((property) => (
								<SelectItem
									key={property}
									value={property}
								>
									{property}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Apartment
					</label>
					<Select
						value={selectedApartment}
						onValueChange={setSelectedApartment}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="All apartments" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All apartments</SelectItem>
							{apartments.map((apartment) => (
								<SelectItem
									key={apartment}
									value={apartment}
								>
									{apartment}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-end">
					<Button
						variant="outline"
						onClick={resetFilters}
						className="ml-auto mt-auto h-10"
					>
						Reset Filters
					</Button>
				</div>
			</div>
		</div>
	);

	// Desktop table view - fixed to prevent overflow
	const renderDesktopView = () => (
		<div className="rounded-lg border border-gray-200 overflow-hidden">
			<div className="overflow-x-auto w-full">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-100">
							<TableHead className="w-10"></TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Service Date</TableHead>
							<TableHead>Aprt. Type</TableHead>
							<TableHead>Team</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{dataLoading ? (
							<TableShimmer rowCount={5} />
						) : (
							filteredBookings.map((item: any) => (
								<ExpandableRow
									key={item.id}
									item={item}
									isExpanded={expandedRowId === item.id}
									onToggle={() => toggleRowExpansion(item.id)}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);

	// Error state
	if (error) {
		return (
			<div className="p-4 flex flex-col items-center justify-center rounded-md bg-red-50 border border-red-200 text-red-800">
				<p className="mb-2">
					{error instanceof Error
						? error.message
						: "Failed to load bookings. Please try again."}
				</p>
				<Button
					onClick={() => refetch()}
					variant="outline"
					className="mt-2"
				>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full">
			{/* Add the inline styles */}
			<style dangerouslySetInnerHTML={{ __html: mobileStyles }} />

			{/* Filter UI */}
			{renderFilterUI()}

			{/* Empty state */}
			{!dataLoading && bookings.length === 0 && (
				<div className="py-10 text-center">
					<div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
						<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
							<CalendarIcon className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No bookings found
						</h3>
						<p className="text-gray-500 mb-6">
							You don't have any bookings scheduled at the moment.
						</p>
					</div>
				</div>
			)}

			{/* Responsive rendering based on screen size - mobile */}
			{bookings.length > 0 && (
				<>
					<div className="mobile-only-cards">
						{dataLoading ? (
							<CardShimmer cardCount={3} />
						) : (
							filteredBookings.map((item: any) => (
								<EnhancedBookingCard
									key={item.id}
									item={item}
								/>
							))
						)}
					</div>

					{/* Desktop table view */}
					<div className="desktop-only-table">
						{renderDesktopView()}
					</div>
				</>
			)}

			{/* No results after filtering */}
			{!dataLoading &&
				filteredBookings.length === 0 &&
				bookings.length > 0 && (
					<div className="py-8 text-center bg-gray-50 rounded-lg">
						<div className="max-w-md mx-auto">
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No matching bookings
							</h3>
							<p className="text-gray-500 mb-4">
								No bookings match your current filter criteria.
								Try adjusting your filters.
							</p>
							<Button
								onClick={resetFilters}
								variant="outline"
							>
								Reset Filters
							</Button>
						</div>
					</div>
				)}

			{/* Modals */}
			{modalType === "cancel" && selectedBooking && (
				<CancelModal
					booking={selectedBooking as any}
					onClose={handleCloseModal}
				/>
			)}
			{modalType === "reschedule" && selectedBooking && (
				<RescheduleModal
					booking={selectedBooking as any}
					onSuccess={handleRescheduleSuccess}
					onClose={handleCloseModal}
				/>
			)}
			{modalType === "renew" &&
				selectedPackage &&
				selectedPackage.recurrence_plan !== "one_time" && (
					<ServiceWizard
						type="renew"
						open={wizardOpen}
						onClose={() => {
							setWizardOpen(false);
						}}
						openRenew={() => {}}
						bookingData={selectedPackage}
						initialStep={0}
					/>
				)}
		</div>
	);
};

export default DataTable;
