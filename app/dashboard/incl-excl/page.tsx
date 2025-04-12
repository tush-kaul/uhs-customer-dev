import { Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InclusionsExclusions() {
	return (
		<div className="flex h-screen bg-gray-50 ">
			{/* Main Content */}
			<div className="flex-1 overflow-auto">
				<div className="max-w-full lg:max-w-7xl p-4 md:p-6 pl-4 overflow-x-auto">
					<div className="flex justify-between items-center mb-6">
						<div>
							<h1 className="text-2xl font-bold">
								Inclusions & Exclusions
							</h1>
							<p className="text-gray-500">
								{
									"Detailed information about what's included and excluded in our services"
								}
							</p>
						</div>
					</div>

					{/* Service Tabs */}
					<Tabs
						defaultValue="regular"
						className="mb-8 max-w-2xl overflow-x-auto">
						<TabsList className="flex justify-start max-w-2xl w-full overflow-x-auto whitespace-nowrap gap-2 pb-2 scrollbar-hide">
							<TabsTrigger
								value="regular"
								className="cursor-pointer  py-2">
								Regular Cleaning
							</TabsTrigger>
							<TabsTrigger
								value="deep"
								className="cursor-pointer py-2">
								Deep Cleaning
							</TabsTrigger>
							<TabsTrigger
								value="specialized"
								className="cursor-pointer py-2">
								Specialized Cleaning
							</TabsTrigger>
							<TabsTrigger
								value="car"
								className="cursor-pointer py-2">
								Car Wash
							</TabsTrigger>
						</TabsList>

						{/* Regular Cleaning */}
						<TabsContent
							value="regular"
							className="bg-white rounded-lg shadow p-6">
							<div className="grid md:grid-cols-2 gap-8">
								<div>
									<h2 className="text-xl font-bold mb-4 text-green-600">
										Inclusions
									</h2>
									<ul className="space-y-3">
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Dusting all accessible surfaces
												including furniture, shelves,
												and decor
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Vacuuming all carpets and rugs
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Mopping all hard floor surfaces
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning kitchen countertops and
												appliance exteriors
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning and sanitizing
												bathrooms including toilets,
												sinks, and showers
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Making beds with fresh linens
												(if provided)
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Emptying trash bins and
												replacing liners
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												General tidying of rooms
											</span>
										</li>
									</ul>
								</div>

								<div>
									<h2 className="text-xl font-bold mb-4 text-red-600">
										Exclusions
									</h2>
									<ul className="space-y-3">
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning inside appliances
												(ovens, refrigerators, etc.)
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Washing windows (interior or
												exterior)
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Moving heavy furniture to clean
												underneath
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning walls or ceilings
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning blinds or curtains
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Doing laundry or dishes</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning outdoor areas (patios,
												balconies)
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Handling biohazardous materials
												or extreme messes
											</span>
										</li>
									</ul>
								</div>
							</div>

							<div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h3 className="font-medium text-blue-800 mb-2">
									Note:
								</h3>
								<p className="text-blue-700 text-sm">
									Regular cleaning is designed for maintenance
									of already clean homes. If your home{" "}
									{"hasn't"} been professionally cleaned in
									the last month, we recommend starting with a
									deep cleaning service. Additional services
									can be added to your regular cleaning for an
									extra charge.
								</p>
							</div>
						</TabsContent>

						{/* Deep Cleaning */}
						<TabsContent
							value="deep"
							className="bg-white rounded-lg shadow p-6">
							<div className="grid md:grid-cols-2 gap-8">
								<div>
									<h2 className="text-xl font-bold mb-4 text-green-600">
										Inclusions
									</h2>
									<p className="text-gray-500 mb-4">
										Everything in Regular Cleaning, plus:
									</p>
									<ul className="space-y-3">
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning inside appliances
												(oven, microwave, refrigerator)
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Detailed cleaning of kitchen
												cabinets (exterior and interior)
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning window sills and tracks
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning baseboards and door
												frames
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning light fixtures and
												ceiling fans
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Detailed bathroom cleaning
												including grout and tile
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning under furniture (where
												accessible)
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning interior windows
											</span>
										</li>
									</ul>
								</div>

								<div>
									<h2 className="text-xl font-bold mb-4 text-red-600">
										Exclusions
									</h2>
									<ul className="space-y-3">
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Exterior window cleaning
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning walls or ceilings
												(except for spot cleaning)
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning blinds or curtains
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Doing laundry or dishes</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Cleaning outdoor areas (patios,
												balconies)
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Handling biohazardous materials
												or extreme messes
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Moving extremely heavy furniture
												or appliances
											</span>
										</li>
									</ul>
								</div>
							</div>

							<div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h3 className="font-medium text-blue-800 mb-2">
									Note:
								</h3>
								<p className="text-blue-700 text-sm">
									Deep cleaning takes approximately 1.5-2
									times longer than regular cleaning. We
									recommend deep cleaning for first-time
									customers, homes that {"haven't"} been
									professionally cleaned in a while, or as a
									seasonal service (every 3-6 months) in
									addition to regular cleaning.
								</p>
							</div>
						</TabsContent>

						{/* Specialized Cleaning */}
						<TabsContent
							value="specialized"
							className="bg-white rounded-lg shadow p-6">
							<div className="space-y-8">
								<div>
									<h2 className="text-xl font-bold mb-4">
										Move-In/Move-Out Cleaning
									</h2>
									<div className="grid md:grid-cols-2 gap-8">
										<div>
											<h3 className="font-medium mb-3 text-green-600">
												Inclusions
											</h3>
											<ul className="space-y-2">
												<li className="flex items-start">
													<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Everything in Deep
														Cleaning
													</span>
												</li>
												<li className="flex items-start">
													<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Cleaning inside all
														cabinets and drawers
													</span>
												</li>
												<li className="flex items-start">
													<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Cleaning inside all
														closets
													</span>
												</li>
												<li className="flex items-start">
													<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Detailed cleaning of all
														appliances
													</span>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-medium mb-3 text-red-600">
												Exclusions
											</h3>
											<ul className="space-y-2">
												<li className="flex items-start">
													<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Exterior cleaning
													</span>
												</li>
												<li className="flex items-start">
													<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Cleaning items that will
														be moved
													</span>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div>
									<h2 className="text-xl font-bold mb-4">
										Post-Construction Cleaning
									</h2>
									<div className="grid md:grid-cols-2 gap-8">
										<div>
											<h3 className="font-medium mb-3 text-green-600">
												Inclusions
											</h3>
											<ul className="space-y-2">
												<li className="flex items-start">
													<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Removing dust and debris
														from all surfaces
													</span>
												</li>
												<li className="flex items-start">
													<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Cleaning all fixtures
														and appliances
													</span>
												</li>
												<li className="flex items-start">
													<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Detailed cleaning of
														bathrooms and kitchens
													</span>
												</li>
											</ul>
										</div>
										<div>
											<h3 className="font-medium mb-3 text-red-600">
												Exclusions
											</h3>
											<ul className="space-y-2">
												<li className="flex items-start">
													<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Removing paint or
														construction materials
														from surfaces
													</span>
												</li>
												<li className="flex items-start">
													<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
													<span>
														Cleaning areas still
														under construction
													</span>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Car Wash */}
						<TabsContent
							value="car"
							className="bg-white rounded-lg shadow p-6">
							<div className="grid md:grid-cols-2 gap-8">
								<div>
									<h2 className="text-xl font-bold mb-4 text-green-600">
										Inclusions
									</h2>
									<ul className="space-y-3">
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Exterior wash and rinse</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Tire and rim cleaning</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Window cleaning (exterior and
												interior)
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Dashboard and console dusting
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Vacuuming seats and floor mats
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Door jamb cleaning</span>
										</li>
									</ul>
								</div>

								<div>
									<h2 className="text-xl font-bold mb-4 text-red-600">
										Exclusions
									</h2>
									<ul className="space-y-3">
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Engine cleaning</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Stain removal from upholstery
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Paint correction or polishing
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Headlight restoration</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Odor removal treatments</span>
										</li>
										<li className="flex items-start">
											<X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>Trunk cleaning</span>
										</li>
									</ul>
								</div>
							</div>

							<div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h3 className="font-medium text-blue-800 mb-2">
									Premium Add-ons Available:
								</h3>
								<ul className="text-blue-700 text-sm space-y-2">
									<li>• Waxing and polishing</li>
									<li>• Interior detailing</li>
									<li>• Leather conditioning</li>
									<li>• Engine bay cleaning</li>
									<li>• Headlight restoration</li>
								</ul>
							</div>
						</TabsContent>
					</Tabs>

					{/* Additional Information */}
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-bold mb-4">
							Additional Information
						</h2>

						<div className="space-y-6">
							<div>
								<h3 className="font-medium text-lg mb-2">
									Service Duration
								</h3>
								<p className="text-gray-600">
									The duration of each service depends on the
									size of your property and the specific
									service type:
								</p>
								<ul className="mt-2 space-y-1 text-gray-600">
									<li>• Regular Cleaning: 1-3 hours</li>
									<li>• Deep Cleaning: 3-6 hours</li>
									<li>• Specialized Cleaning: 4-8 hours</li>
									<li>• Car Wash: 1-2 hours</li>
								</ul>
							</div>

							<div>
								<h3 className="font-medium text-lg mb-2">
									Cleaning Supplies
								</h3>
								<p className="text-gray-600">
									Our professional cleaners bring all
									necessary cleaning supplies and equipment.
									We use high-quality, eco-friendly products
									as our standard. If you have specific
									products you prefer or if you have allergies
									to certain cleaning agents, please let us
									know in advance.
								</p>
							</div>

							<div>
								<h3 className="font-medium text-lg mb-2">
									Special Requests
								</h3>
								<p className="text-gray-600">
									{"We're"} happy to accommodate special
									requests whenever possible. Please note that
									some special requests may incur additional
									charges. Contact our customer support team
									to discuss your specific needs.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
