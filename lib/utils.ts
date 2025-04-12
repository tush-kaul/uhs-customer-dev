import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale: string = "en-US") {
	let isoDate = dateString;
	// Check if the date string is in MM-DD-YYYY format.
	if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
		const [month, day, year] = dateString.split("-");
		isoDate = `${year}-${month}-${day}T00:00:00Z`; // ISO format in UTC
	}
	const date = new Date(isoDate);
	if (isNaN(date.getTime())) {
		return "Invalid Date";
	}
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(date);
}

export const packagedata = [
	{
		id: 1,
		service: "Deep Cleaning",
		days: ["Mon, Wed, Saturday"],
		startDate: "12-10-2023",
		endDate: "06-10-2024",
		payment: "Not Paid",
		duration: "6 months",
		team: {
			id: 1,
			name: "Team 1",
			members: [
				{
					id: 11,
					name: "Madhu",
				},
				{
					id: 21,
					name: "Vishnu",
				},
			],
		},
	},
	{
		id: 2,
		service: "Car Wash",
		days: ["Sunday"],
		startDate: "12-10-2023",
		endDate: "06-01-2024",
		payment: "Not Paid",
		duration: "1 months",
		team: {
			id: 1,
			name: "Team 1",
			members: [
				{
					id: 11,
					name: "Madhu",
				},
				{
					id: 21,
					name: "Vishnu",
				},
			],
		},
	},
	{
		id: 3,
		service: "Regular Cleaning",
		days: ["Tues, Thursday"],
		startDate: "12-13-2023",
		endDate: "03-13-2024",
		payment: "Paid",
		duration: "3 months",
		team: {
			id: 1,
			name: "Team 1",
			members: [
				{
					id: 11,
					name: "Madhu",
				},
				{
					id: 21,
					name: "Vishnu",
				},
			],
		},
	},
	{
		id: 4,
		service: "Specialized Cleaning",
		days: ["Sun, Tues, Thurs, Saturday"],
		startDate: "12-20-2023",
		endDate: "01-20-2024",
		payment: "Pending",
		duration: "1 months",
		team: {
			id: 1,
			name: "Team 1",
			members: [
				{
					id: 11,
					name: "Madhu",
				},
				{
					id: 21,
					name: "Vishnu",
				},
			],
		},
	},
];

export const data = [
	{
		id: 1,
		service: "Deep Cleaning",
		customer: "John Doe",
		status: "Canceled",
		date: "2024-03-05",
		startTime: "10:00 AM",
		endTime: "12:00 PM",
		phoneNumber: "1122 3344",
		apartmentType: "2BHK",
		team: {
			id: 1,
			name: "Team 1",
			members: [
				{
					id: 11,
					name: "Madhu",
				},
				{
					id: 21,
					name: "Vishnu",
				},
			],
		},
	},
	{
		id: 2,
		service: "Car Wash",
		customer: "Jane Smith",
		status: "Completed",
		date: "2024-03-04",
		startTime: "4:00 PM",
		endTime: "5:00 PM",
		phoneNumber: "1122 3344",
		apartmentType: "Sedan",
		team: {
			id: 2,
			name: "Team 2",
			members: [
				{ id: 12, name: "Deepak" },
				{ id: 22, name: "Laxami" },
			],
		},
	},
	{
		id: 3,
		service: "Regular Cleaning",
		customer: "Alice Johnson",
		status: "Pending",
		date: "2024-03-03",
		startTime: "12:30 PM",
		endTime: "1:30 PM",
		phoneNumber: "1122 3344",
		apartmentType: "1BHK",
		team: {
			id: 4,
			name: "Team 4",
			members: [
				{ id: 13, name: "Karan" },
				{ id: 23, name: "Bindu" },
			],
		},
	},
	{
		id: 4,
		service: "Specialized Cleaning",
		customer: "Alice Johnson",
		status: "Completed",
		date: "2024-03-03",
		startTime: "4:00 PM",
		endTime: "6:00 PM",
		phoneNumber: "1122 3344",
		apartmentType: "2BHK",
		team: {
			id: 10,
			name: "Team 10",
			members: [
				{ id: 14, name: "Ishwor" },
				{ id: 24, name: "Padma" },
			],
		},
	},
];
