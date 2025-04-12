const WelcomeMessage = ({ name }: { name: string }) => (
	<div className="flex-1 justify-between items-center">
		<h1 className="text-md lg:text-xl font-semibold">Welcome, {name}</h1>
		<p className="text-gray-500">
			Monitor all of your service bookings and packages here
		</p>
	</div>
);

export default WelcomeMessage;
