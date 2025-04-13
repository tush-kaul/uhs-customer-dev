/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/utils/base-api";
import { NextRequest, NextResponse } from "next/server";

// Function to fetch a user by ID
async function fetchUserById(userId: string) {
	const response = await api.get(
		`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`,
		{}
	);

	return await response.data;
}

// Function to fetch area by ID
async function fetchAreaById(areaId: string) {
	const response = await api(
		`${process.env.NEXT_PUBLIC_BASE_URL}/areas/${areaId}`,
		{}
	);
	return await response.data;
}

// Function to fetch district by ID
async function fetchDistrictById(districtId: string) {
	const response = await api(
		`${process.env.NEXT_PUBLIC_BASE_URL}/districts/${districtId}`
	);

	return await response.data;
}

// Function to fetch property by ID
async function fetchPropertyById(propertyId: string) {
	const response = await api(
		`${process.env.NEXT_PUBLIC_BASE_URL}/properties/${propertyId}`
	);
	return await response.data;
}

// Function to fetch residence type by ID
async function fetchResidenceTypeById(residenceTypeId: string) {
	const response = await api(
		`${process.env.NEXT_PUBLIC_BASE_URL}/residences/${residenceTypeId}`
	);

	return await response.data;
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: any }> }
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "User ID is required" },
				{ status: 400 }
			);
		}

		// Fetch the user data first
		const userData = await fetchUserById(id);

		// Extract IDs for related data
		const areaId = userData.data.area;
		const districtId = userData.data.district;
		const propertyId = userData.data.property;
		const residenceTypeId = userData.data.residenceType;

		// Fetch all related data in parallel
		const [area, district, property, residenceType] = await Promise.all([
			areaId ? fetchAreaById(areaId) : null,
			districtId ? fetchDistrictById(districtId) : null,
			propertyId ? fetchPropertyById(propertyId) : null,
			residenceTypeId ? fetchResidenceTypeById(residenceTypeId) : null,
		]);

		// Combine all data into enhanced user object
		const enhancedUserData = {
			...userData.data,
			area: area,
			district: district,
			property: property,
			residence_type: residenceType,
		};

		return NextResponse.json({
			success: true,
			message: "User data fetched successfully",
			data: enhancedUserData,
		});
	} catch (error: any) {
		console.error("Error fetching user data:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
