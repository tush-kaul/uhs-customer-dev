/* eslint-disable @next/next/no-img-element */
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface ServiceButtonProps {
  title: string;
  color: string;
  onClick?: () => void;
}

const ServiceButton = ({ title, color, onClick }: ServiceButtonProps) => {
  return (
    <Button
      className={`${color} flex items-center justify-center gap-2 py-2 px-4 rounded-lg`}
      onClick={onClick}>
      <div className='bg-white/20 rounded-full p-1'>
        <Plus className='h-4 w-4' />
      </div>
      <img
        src='/icons/booking.svg'
        alt='booking'
        width={20}
        height={20}
        className='filter brightness-100'
        style={{ width: "auto" }}
      />
      <span className='text-sm md:text-base'>{title}</span>
    </Button>
  );
};

export default ServiceButton;
