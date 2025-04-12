import Link from "next/link";

export default function TermsAndConditions() {
	return (
		<div className="flex h-screen bg-gray-50">
			{/* Main Content */}
			<div className="flex-1 overflow-auto">
				<div className="max-w-full lg:max-w-7xl  p-4 md:p-6 pl-4 ">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">
							Terms and Conditions
						</h1>
						<p className="text-gray-500">
							Last updated: December 1, 2023
						</p>
					</div>

					<div className="bg-white rounded-lg shadow p-6 space-y-8">
						<div>
							<h2 className="text-xl font-bold mb-4">
								1. Introduction
							</h2>
							<p className="text-gray-600">
								Welcome to Urban Services (Company, we, our,
								us). These Terms and Conditions govern your use
								of our website and services. By accessing or
								using our services, you agree to be bound by
								these Terms. If you disagree with any part of
								the terms, you may not access the service.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-4">
								2. Services
							</h2>
							<p className="text-gray-600 mb-4">
								Urban Services provides cleaning and maintenance
								services for residential and commercial
								properties. Our services include but are not
								limited to regular cleaning, deep cleaning,
								specialized cleaning, and car wash services.
							</p>
							<p className="text-gray-600">
								We reserve the right to modify, suspend, or
								discontinue any aspect of our services at any
								time, including the availability of any feature,
								database, or content. We may also impose limits
								on certain features and services or restrict
								your access to parts or all of the services
								without notice or liability.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-4">
								3. Booking and Scheduling
							</h2>
							<p className="text-gray-600 mb-4">
								3.1. By booking a service, you agree to provide
								accurate and complete information about your
								property and service needs.
							</p>
							<p className="text-gray-600 mb-4">
								3.2. Service availability is subject to our{" "}
								{"professionals'"} schedules. We will make
								reasonable efforts to accommodate your preferred
								date and time, but cannot guarantee availability
								for all requested times.
							</p>
							<p className="text-gray-600 mb-4">
								3.3. You may reschedule a service up to 24 hours
								before the scheduled time without any fee.
								Rescheduling with less than 24 {"hours'"} notice
								may incur a rescheduling fee.
							</p>
							<p className="text-gray-600">
								3.4. Our cancellation policy is as follows:
								<br />• Cancellations made 48+ hours before the
								service: No cancellation fee
								<br />• Cancellations made 24-48 hours before
								the service: 50% cancellation fee
								<br />• Cancellations made less than 24 hours
								before the service: 100% cancellation fee
							</p>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-4">
								4. Pricing and Payment
							</h2>
							<p className="text-gray-600 mb-4">
								4.1. The prices for our services are as listed
								on our website or as quoted to you. Prices may
								vary based on the size of your property, the
								type of service, and any additional services
								requested.
							</p>
							<p className="text-gray-600 mb-4">
								4.2. We accept payment via credit/debit cards,
								PayPal, and bank transfers. For recurring
								services, you may set up automatic payments
								through your account.
							</p>
							<p className="text-gray-600 mb-4">
								4.3. For one-time services, payment is due at
								the time of booking. For recurring services,
								payment is processed 24 hours before each
								scheduled service.
							</p>
							<p className="text-gray-600">
								4.4. All prices are exclusive of applicable
								taxes unless otherwise stated. Any taxes
								applicable will be added to your final bill.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-4">
								5. Service Guarantee
							</h2>
							<p className="text-gray-600 mb-4">
								5.1. We strive to provide high-quality services
								and customer satisfaction. If you are not
								satisfied with our service, please contact us
								within 24 hours of service completion, and we
								will address your concerns.
							</p>
							<p className="text-gray-600">
								5.2. If we fail to resolve the issue to your
								satisfaction, we may offer a partial or full
								refund, or a complimentary service, at our
								discretion.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-4">
								6. Liability
							</h2>
							<p className="text-gray-600 mb-4">
								6.1. While we take all reasonable care to
								prevent damage to your property, we are not
								liable for:
								<br />• Pre-existing damage or wear and tear
								<br />• Damage resulting from faulty equipment
								or fixtures in your property
								<br />• Damage caused by attempting to move
								heavy furniture or appliances
								<br />• Any indirect or consequential losses
							</p>
							<p className="text-gray-600">
								6.2. Our liability is limited to the cost of the
								service provided. We recommend that you have
								appropriate insurance coverage for your
								property.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-4">
								7. Privacy
							</h2>
							<p className="text-gray-600">
								We collect and process your personal information
								in accordance with our{" "}
								<Link
									href="/privacy"
									className="text-blue-500 hover:underline">
									Privacy Policy
								</Link>
								. By using our services, you consent to our
								collection and use of your personal information
								as described in the Privacy Policy.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-4">
								8. Changes to Terms
							</h2>
							<p className="text-gray-600">
								We reserve the right to modify these Terms at
								any time. We will provide notice of significant
								changes by updating the Last Updated date at the
								top of these Terms. Your continued use of our
								services after such changes constitutes your
								acceptance of the new Terms.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-4">
								9. Contact Us
							</h2>
							<p className="text-gray-600">
								If you have any questions about these Terms,
								please contact us at:
								<br />
								Email: legal@urbanservices.com
								<br />
								Phone: +1 (800) 123-4567
								<br />
								Address: 123 Main Street, Suite 456, Anytown,
								USA 12345
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
