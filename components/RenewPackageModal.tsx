"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Package } from "./CancelPackageModal";

interface RenewPackageModalProps {
	pkg: Package;
	onClose: () => void;
}

const RenewPackageModal = ({ pkg, onClose }: RenewPackageModalProps) => {
	const [renewDuration, setRenewDuration] = useState(1);
	const [newPaymentStatus, setNewPaymentStatus] = useState("");

	const discountData = [
		{ duration: 1, price: "10 QAR", discount: "0%" },
		{ duration: 3, price: "27 QAR", discount: "10%" },
		{ duration: 6, price: "50 QAR", discount: "15%" },
		{ duration: 12, price: "90 QAR", discount: "25%" },
	];

	return (
		<Dialog
			open={true}
			onOpenChange={onClose}>
			<DialogContent className="max-w-[340px] md:max-w-md">
				<DialogHeader>
					<DialogTitle>Renew Package</DialogTitle>
				</DialogHeader>
				<p>
					Renew the package for <b>{pkg.service}</b>
				</p>
				<div className="space-y-4 mt-4">
					<table className="w-full border-collapse">
						<thead>
							<tr>
								<th className="border p-2">Renew Duration</th>
								<th className="border p-2">Discounted Price</th>
								<th className="border p-2">
									Cumulative Discount %
								</th>
							</tr>
						</thead>
						<tbody>
							{discountData.map((data) => (
								<tr key={data.duration}>
									<td className="border p-2 text-center">
										{data.duration} month
										{data.duration > 1 ? "s" : ""}
									</td>
									<td className="border p-2 text-center">
										{data.price}
									</td>
									<td className="border p-2 text-center">
										{data.discount}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<select
						aria-label="Renew Duration"
						value={renewDuration}
						onChange={(e) =>
							setRenewDuration(parseInt(e.target.value))
						}
						className="w-full p-2 border rounded">
						<option value={1}>1 month</option>
						<option value={3}>3 months</option>
						<option value={6}>6 months</option>
						<option value={12}>12 months</option>
					</select>

					{/* Renew Duration should be dropdown - 1 /3 /6/ 12 months */}
					{/* Renew Duration should be dropdown - 1 /3 /6/ 12 months */}

					<Input
						type="text"
						value={newPaymentStatus}
						onChange={(e) => setNewPaymentStatus(e.target.value)}
						placeholder="New Payment Status"
					/>
				</div>
				<div className="flex justify-end gap-3 mt-4">
					<Button
						variant="outline"
						onClick={onClose}>
						Close
					</Button>
					<Button
						className="bg-green-500 text-white"
						onClick={() => {
							console.log(
								"Package renewed:",
								pkg.id,
								"Duration:",
								renewDuration,
								"Payment:",
								newPaymentStatus
							);
							onClose();
						}}>
						Confirm Renew
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default RenewPackageModal;
