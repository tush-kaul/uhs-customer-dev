import Image  from "next/image";

const LogoSection = () => (
  <div className="flex items-center space-x-2 mb-6">
    <Image src="/icons/logo 1.svg" alt="uhs" width={50} height={50} />
    <span className="text-lg font-semibold text-orange-500">Urban</span>
    <span className="text-lg font-semibold"> Services</span>
  </div>
);

export default LogoSection