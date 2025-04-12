import Link from "next/link";

export default function FAQs() {
	return (
		<div className="flex  h-screen bg-gray-50 ">
			{/* Main Content */}
			<div className="flex">
				<div className="max-w-full lg:max-w-7xl  p-4 md:p-6 pl-4 ">
					<div className="flex justify-between items-center mb-6">
						<div>
							<h1 className="text-2xl font-bold">
								Frequently Asked Questions
							</h1>
							<p className="text-gray-500">
								Find answers to common questions about our
								services
							</p>
						</div>
					</div>

					{/* FAQ Categories */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="bg-white p-6 rounded-lg shadow">
							<div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							</div>
							<h3 className="font-bold text-lg mb-2">
								Booking & Scheduling
							</h3>
							<p className="text-gray-600 mb-4">
								Questions about booking services, rescheduling,
								and cancellations.
							</p>
							<Link
								href="#booking"
								className="text-blue-500 hover:underline">
								View 8 questions
							</Link>
						</div>

						<div className="bg-white p-6 rounded-lg shadow">
							<div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="font-bold text-lg mb-2">
								Pricing & Payments
							</h3>
							<p className="text-gray-600 mb-4">
								Questions about service pricing, payment
								methods, and billing.
							</p>
							<Link
								href="#pricing"
								className="text-green-500 hover:underline">
								View 6 questions
							</Link>
						</div>

						<div className="bg-white p-6 rounded-lg shadow">
							<div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-purple-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="font-bold text-lg mb-2">
								Services & Packages
							</h3>
							<p className="text-gray-600 mb-4">
								{
									"Questions about our different services, packages, and what's included."
								}
							</p>
							<Link
								href="#services"
								className="text-purple-500 hover:underline">
								View 10 questions
							</Link>
						</div>
					</div>

					{/* Booking & Scheduling FAQs */}
					<div
						id="booking"
						className="mb-10">
						<h2 className="text-xl font-bold mb-6 border-b pb-2">
							Booking & Scheduling
						</h2>

						<div className="space-y-6">
							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									How do I book a service?
								</h3>
								<p className="text-gray-600">
									You can book a service by logging into your
									account and clicking on the Book New Service
									button on your dashboard. Select the service
									type, preferred date and time, and complete
									the booking process. You will receive a
									confirmation email once your booking is
									confirmed.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									How far in advance should I book a service?
								</h3>
								<p className="text-gray-600">
									We recommend booking at least 48 hours in
									advance to ensure availability. However, for
									peak times or specialized services, booking
									a week in advance is recommended. For urgent
									services, you can contact our customer
									support to check for same-day or next-day
									availability.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									How do I reschedule a service?
								</h3>
								<p className="text-gray-600">
									You can reschedule a service up to 24 hours
									before the scheduled time without any fee.
									Go to your bookings, select the service you
									want to reschedule, and click on the
									Reschedule option. Choose a new date and
									time, and confirm the changes. You will
									receive a confirmation email with the
									updated schedule.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									What is your cancellation policy?
								</h3>
								<p className="text-gray-600">
									You can cancel a service up to 48 hours
									before the scheduled time without any
									cancellation fee. Cancellations made between
									24-48 hours before the service will incur a
									50% cancellation fee. Cancellations made
									less than 24 hours before the service will
									be charged the full service fee. To cancel a
									service, go to your bookings, select the
									service, and click on the Cancel option.
								</p>
							</div>
						</div>
					</div>

					{/* Pricing & Payments FAQs */}
					<div
						id="pricing"
						className="mb-10">
						<h2 className="text-xl font-bold mb-6 border-b pb-2">
							Pricing & Payments
						</h2>

						<div className="space-y-6">
							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									How is the price calculated for cleaning
									services?
								</h3>
								<p className="text-gray-600">
									The price for cleaning services is
									calculated based on the type of service,
									size of the property, and any additional
									services requested. Regular cleaning is
									priced based on the number of bedrooms and
									bathrooms. Deep cleaning and specialized
									cleaning services have a base price plus
									additional charges for specific areas or
									tasks.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									What payment methods do you accept?
								</h3>
								<p className="text-gray-600">
									We accept all major credit and debit cards
									(Visa, MasterCard, American Express,
									Discover), PayPal, and bank transfers. For
									recurring services, you can set up automatic
									payments through your account. We do not
									accept cash payments for security reasons.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									When am I charged for a service?
								</h3>
								<p className="text-gray-600">
									For one-time services, you are charged at
									the time of booking. For recurring services,
									you are charged 24 hours before each
									scheduled service. If you have a
									subscription package, you are charged on the
									same day each month according to your
									subscription start date.
								</p>
							</div>
						</div>
					</div>

					{/* Services & Packages FAQs */}
					<div id="services">
						<h2 className="text-xl font-bold mb-6 border-b pb-2">
							Services & Packages
						</h2>

						<div className="space-y-6">
							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									{
										"What's included in the regular cleaning service?"
									}
								</h3>
								<p className="text-gray-600">
									Regular cleaning includes dusting all
									accessible surfaces, vacuuming and mopping
									floors, cleaning kitchen countertops and
									appliance exteriors, cleaning and sanitizing
									bathrooms, making beds, and general tidying.
									It does not include deep cleaning tasks like
									cleaning inside appliances, washing windows,
									or moving furniture to clean underneath.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									{
										"What's the difference between regular and deep cleaning?"
									}
								</h3>
								<p className="text-gray-600">
									Deep cleaning is a more thorough service
									that includes everything in regular cleaning
									plus detailed cleaning of kitchen appliances
									(inside and out), bathroom fixtures, window
									sills, baseboards, and other areas that{" "}
									{"aren't"} covered in regular cleaning. Deep
									cleaning takes longer and is recommended
									every 3-6 months in addition to regular
									cleaning.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									What specialized cleaning services do you
									offer?
								</h3>
								<p className="text-gray-600">
									Our specialized cleaning services include
									move-in/move-out cleaning, post-construction
									cleaning, carpet cleaning, upholstery
									cleaning, window cleaning, and eco-friendly
									green cleaning. Each specialized service has
									specific tasks and equipment designed for
									that particular need.
								</p>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<h3 className="font-medium text-lg mb-2">
									Do you provide cleaning supplies and
									equipment?
								</h3>
								<p className="text-gray-600">
									Yes, our professional cleaners bring all
									necessary cleaning supplies and equipment.
									We use high-quality, eco-friendly products
									as our standard. If you have specific
									products you prefer or if you have allergies
									to certain cleaning agents, you can let us
									know in advance, and we can accommodate your
									preferences.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
