"use client";

import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { validateAllSteps, validateRenewalStep } from "@/utils/validation";
import { FormValuesType, ServiceWizardProps } from "@/types";
import ServicePackageModal from "@/components/ServicePackageModal";
import { useServiceWizard } from "@/hooks/use-service-wizard";
import BundleStep from "./BundleStep";
import LocationStep from "./LocationSteps";
import ServiceDetailsStep from "./ServiceDetailsStep";
import TimeSlotStep from "./TimeslotStep";
import CustomerDetailsStep from "./CustomerDetailStep";
import ReviewStep from "./ReviewStep";
import { useBookings } from "@/hooks/booking";

export default function ServiceWizard({
	type,
	open,
	onClose,
	initialData,
	initialStep = 0,
	bookingData,
	isFromBooking = false,
	openRenew,
}: ServiceWizardProps) {
	const {
		form,
		currentStep,
		setCurrentStep,
		loading,
		globalLoading,
		areas,
		districts,
		properties,
		residences,
		services,
		subServices,
		frequencies,
		bundles,
		timeSlots,
		pricings,
		selectedSlots,
		selectedSlotsData,
		blockTimer,
		blockId,
		userSelectedDate,
		setUserSelectedDate,
		calendar,
		alreadyExistsModal,
		setAlreadyExistsModal,
		slotsBlocked,
		handleTimeSlotSelect,
		blockTimeSlot,
		handleClose,
		onSubmit,
		fetchBundles,
		checkExistingBooking,
	} = useServiceWizard(
		type,
		open,
		onClose,
		initialData,
		initialStep,
		bookingData,
		openRenew
	);

	const { data, isLoading: dataLoading, error, refetch } = useBookings("all");

	// Get form values
	const formValues = form.getValues();
	const { frequency, startDate, residenceType, months, service, subService } =
		formValues;

	// Selected subservice info
	const selectedSubservice = subServices.find(
		(s: any) => s.id === subService
	);

	const handleNext = async () => {
		console.log("handleNext clicked", currentStep, "type:", type);
		console.log("Current form values:", formValues);
		console.log("userSelectedDate:", userSelectedDate);

		if (currentStep < steps.length - 1) {
			// First step validation with existing booking check
			if (type === "new" && currentStep === 0) {
				try {
					if (!subService) {
						form.trigger(["service", "subService"]);
						return;
					}

					// Check for existing bookings at same location for Regular Cleaning
					const hasSameLocationBooking =
						checkExistingBooking(formValues);
					if (
						hasSameLocationBooking &&
						selectedSubservice?.name === "Regular Cleaning"
					) {
						setAlreadyExistsModal(true);
						return;
					}

					setCurrentStep((prev) => prev + 1);
				} catch (error: any) {
					console.error(error);
					return;
				}
				return;
			}

			// For service details step, fetch bundles before moving forward
			if (
				(type === "new" && currentStep === 1) ||
				(type === "renew" && currentStep === 0)
			) {
				console.log("Service details step:", {
					frequency,
					startDate,
					residenceType,
					userSelectedDate,
				});

				// For renew type, we don't need to check residenceType as it comes from bookingData
				const canProceed =
					type === "renew"
						? !!frequency && !!startDate && !!userSelectedDate
						: !!frequency &&
						  !!startDate &&
						  !!residenceType &&
						  !!userSelectedDate;

				if (canProceed) {
					try {
						console.log(
							"Fetching bundles for",
							frequency,
							startDate
						);
						await fetchBundles(
							frequency as string,
							startDate as Date
						);
						form.setValue("bundleId", "");
						form.setValue("timeSlotId", "");
						setCurrentStep((prev) => prev + 1);
					} catch (error) {
						console.error("Error fetching bundles:", error);
					}
				} else {
					console.log("Cannot proceed, missing required fields");
					// Trigger validation to show which fields are missing
					form.trigger(["frequency", "startDate", "residenceType"]);
				}
				return;
			}

			setCurrentStep((prev) => prev + 1);
		} else {
			// Submit the form on last step
			// Validate all form fields at once
			try {
				// Log form state for debugging
				console.log("Current form state before submission:", {
					values: form.getValues(),
					errors: form.formState.errors,
					isValid: form.formState.isValid,
					timeSlots: selectedSlots ? selectedSlots.length : 0,
					blockId,
				});

				// Validate the entire form using all fields
				const allFields = [
					"service",
					"subService",
					"area",
					"district",
					"property",
					"residenceType",
					"frequency",
					"startDate",
					"bundleId",
					"timeSlotId",
					"name",
					"email",
					"phone",
				];
				const isValid = await form.trigger(allFields);

				// We need to check both form validity and if time slots are selected
				const hasSelectedSlots =
					selectedSlots !== undefined &&
					selectedSlots !== null &&
					Array.isArray(selectedSlots) &&
					selectedSlots.length !== 0;

				if (isValid && hasSelectedSlots && blockId) {
					console.log("Form is valid, proceeding with submission");
					onSubmit();
				} else {
					console.error(
						"Form validation failed or missing required data"
					);
					// We don't need to show a toast here as the form validation will highlight the errors
					console.error("Form errors:", form.formState.errors);
					console.error(
						"Selected slots:",
						selectedSlots ? selectedSlots.length : 0
					);
					console.error("Block ID present:", !!blockId);
				}
			} catch (error) {
				console.error("Error during form validation:", error);
			}
		}
	};

	const handleBack = () => {
		if (currentStep === 1) {
			setUserSelectedDate(false);
		}
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	// Reset dialog when closed externally
	const handleDialogClose = () => {
		handleClose();
	};

	// Steps configuration
	const STEPS: Record<
		"new" | "renew",
		Array<{
			title: string;
			component: React.ReactNode;
		}>
	> = {
		new: [
			{
				title: "Service & Select Location",
				component: (
					<LocationStep
						watch={form.watch}
						setValue={form.setValue}
						areas={areas}
						districts={districts}
						properties={properties}
						residences={residences}
						services={services}
						subServices={subServices}
						loading={{
							areas: loading.areas,
							districts: loading.districts,
							properties: loading.properties,
							residence: loading.residence,
							service: loading.service,
							subService: loading.subService,
						}}
						onServiceChange={(value) => {
							form.setValue("service", value, {
								shouldValidate: true,
							});
							form.setValue("subService", "", {
								shouldValidate: true,
							});
						}}
						onSubServiceChange={(value) => {
							form.setValue("subService", value, {
								shouldValidate: true,
							});
						}}
					/>
				),
			},
			{
				title: "Service Details",
				component: (
					<ServiceDetailsStep
						watch={form.watch}
						setValue={form.setValue}
						frequencies={frequencies}
						pricings={pricings}
						loading={{
							frequencies: loading.frequencies,
							calendar: loading.calendar,
						}}
						calendar={calendar}
						months={months as number}
						userSelectedDate={userSelectedDate}
						setUserSelectedDate={setUserSelectedDate}
						selectedSubServiceName={selectedSubservice?.name}
					/>
				),
			},
			{
				title: "Select Bundle",
				component: (
					<BundleStep
						watch={form.watch}
						setValue={form.setValue}
						bundles={bundles}
						loading={loading.bundles}
					/>
				),
			},
			{
				title: "Select Time Slot",
				component: (
					<TimeSlotStep
						watch={form.watch}
						timeSlots={timeSlots}
						selectedSlots={selectedSlots}
						frequency={frequency as string}
						loading={loading.timeSlots}
						handleTimeSlotSelect={handleTimeSlotSelect}
					/>
				),
			},
			{
				title: "Customer Details",
				component: (
					<CustomerDetailsStep
						watch={form.watch}
						setValue={form.setValue}
						blockTimer={blockTimer}
						bookingData={bookingData}
					/>
				),
			},
			{
				title: "Review & Confirm",
				component: (
					<ReviewStep
						watch={form.watch}
						areas={areas}
						districts={districts}
						properties={properties}
						residences={residences}
						frequencies={frequencies}
						selectedSlotsData={selectedSlotsData}
						blockTimer={blockTimer}
						pricings={pricings}
						bookingData={bookingData}
					/>
				),
			},
		],
		renew: [
			{
				title: "Select duration and service start date",
				component: (
					<ServiceDetailsStep
						watch={form.watch}
						setValue={form.setValue}
						frequencies={frequencies}
						pricings={pricings}
						loading={{
							frequencies: loading.frequencies,
							calendar: loading.calendar,
						}}
						calendar={calendar}
						months={months as number}
						userSelectedDate={userSelectedDate}
						setUserSelectedDate={setUserSelectedDate}
						selectedSubServiceName={bookingData?.service?.name}
						startDateMin={
							bookingData?.end_date
								? new Date(
										new Date(bookingData.end_date).setDate(
											new Date(
												bookingData.end_date
											).getDate() + 1
										)
								  )
								: new Date()
						}
						startDateMax={
							months
								? new Date(
										new Date(
											bookingData?.end_date || new Date()
										).setMonth(
											new Date(
												bookingData?.end_date ||
													new Date()
											).getMonth() + months
										)
								  )
								: undefined
						}
						bookingData={bookingData}
					/>
				),
			},
			{
				title: "Select Bundle",
				component: (
					<BundleStep
						watch={form.watch}
						setValue={form.setValue}
						bundles={bundles}
						loading={loading.bundles}
					/>
				),
			},
			{
				title: "Select Time Slot",
				component: (
					<TimeSlotStep
						watch={form.watch}
						timeSlots={timeSlots}
						selectedSlots={selectedSlots}
						frequency={bookingData?.recurrence_plan || frequency}
						loading={loading.timeSlots}
						handleTimeSlotSelect={handleTimeSlotSelect}
						bookingData={bookingData}
					/>
				),
			},
			{
				title: "Extra Details",
				component: (
					<CustomerDetailsStep
						watch={form.watch}
						setValue={form.setValue}
						blockTimer={blockTimer}
						bookingData={bookingData}
					/>
				),
			},
			{
				title: "Review & Confirm",
				component: (
					<ReviewStep
						watch={form.watch}
						areas={areas}
						districts={districts}
						properties={properties}
						residences={residences}
						frequencies={frequencies}
						selectedSlotsData={selectedSlotsData}
						blockTimer={blockTimer}
						pricings={pricings}
						bookingData={bookingData}
					/>
				),
			},
		],
	};

	const steps = STEPS[type];
	const isLastStep = currentStep === steps.length - 1;

	// Validate if the current step is complete
	const isStepValid = () => {
		if (type === "new") {
			return validateAllSteps(
				currentStep,
				formValues,
				selectedSlots,
				blockId,
				userSelectedDate,
				bookingData,
				data
			);
		} else {
			return validateRenewalStep(
				currentStep,
				formValues,
				selectedSlots,
				blockId,
				userSelectedDate,
				bookingData
			);
		}
	};

	// Update button state based on specific conditions
	const getNextButtonState = () => {
		// For debugging
		console.log("Getting next button state:", {
			currentStep,
			type,
			blockId,
			userSelectedDate,
			isStepValid: isStepValid(),
			frequency,
			startDate,
		});

		// If it's the time slot selection step and the slots haven't been blocked yet
		if (
			((type === "new" && currentStep === 3) ||
				(type === "renew" && currentStep === 2)) &&
			!blockId
		) {
			return true; // Disable next button, use block button instead
		}

		// Date selection step needs special handling
		if (
			(type === "new" && currentStep === 1) ||
			(type === "renew" && currentStep === 0)
		) {
			// For renewal, we need frequency, startDate and userSelectedDate to proceed
			if (type === "renew") {
				return !(userSelectedDate && frequency && startDate);
			}
			// For new service
			return !userSelectedDate;
		}

		return !isStepValid();
	};

	// Debug useEffect to log important state changes
	useEffect(() => {
		console.log("Component re-rendered with:", {
			type,
			currentStep,
			userSelectedDate,
			formValues: {
				frequency: formValues.frequency,
				startDate: formValues.startDate,
				residenceType: formValues.residenceType,
				months: formValues.months,
			},
		});
	}, [type, currentStep, userSelectedDate, formValues]);

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={handleDialogClose}
			>
				<DialogContent
					aria-describedby="book-service"
					className="max-w-2xl max-h-[90vh] overflow-y-auto"
				>
					<DialogHeader>
						<DialogTitle className="flex items-center">
							<span>
								{type === "new"
									? "Book New Service"
									: "Renew Service"}
							</span>
							<span className="ml-2 text-sm font-normal text-gray-500">
								Step {currentStep + 1} of {steps.length}
							</span>
						</DialogTitle>
					</DialogHeader>

					{globalLoading ? (
						<div className="flex flex-col items-center justify-center py-12">
							<Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
							<p className="text-gray-500">
								Loading service information...
							</p>
						</div>
					) : (
						<div className="space-y-6">
							<div className="py-2">
								<h3 className="text-lg font-medium mb-4">
									{steps[currentStep].title}
								</h3>
								{steps[currentStep].component}
							</div>

							<div className="flex justify-between items-center gap-2 pt-4 border-t">
								{/* Back button */}
								<Button
									type="button"
									variant="outline"
									onClick={handleBack}
									disabled={
										currentStep === 0 ||
										loading.confirmBooking
									}
									className="min-w-[80px]"
								>
									<ChevronLeft className="h-4 w-4 mr-2" />
									Back
								</Button>

								<div className="flex gap-2">
									{/* Block Schedule button for time slot step */}
									{((type === "new" && currentStep === 3) ||
										(type === "renew" &&
											currentStep === 2)) &&
										!blockId && (
											<Button
												type="button"
												onClick={blockTimeSlot}
												disabled={
													!isStepValid() ||
													loading.blockingSlot ||
													slotsBlocked
												}
												className="min-w-[140px]"
											>
												{loading.blockingSlot ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Blocking...
													</>
												) : (
													"Block Schedule"
												)}
											</Button>
										)}

									{/* Next/Confirm button */}
									{loading.confirmBooking ? (
										<Button
											disabled
											className="min-w-[80px]"
										>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Confirming...
										</Button>
									) : (
										<Button
											disabled={getNextButtonState()}
											type="button"
											onClick={handleNext}
											className="min-w-[80px]"
										>
											{isLastStep ? "Confirm" : "Next"}
											{!isLastStep && (
												<ChevronRight className="h-4 w-4 ml-2" />
											)}
										</Button>
									)}
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Modal for existing booking warning */}
			<ServicePackageModal
				isOpen={alreadyExistsModal}
				onClose={() => setAlreadyExistsModal(false)}
				onBookNew={() => setAlreadyExistsModal(false)}
				onRenew={() => {
					onClose(null, 0);
					setAlreadyExistsModal(false);
					openRenew();
				}}
			/>
		</>
	);
}
