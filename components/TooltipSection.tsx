import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react";

const TooltipSection = ({trigger, tooltip}: {trigger: ReactNode; tooltip: string}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-pointer">{trigger}</TooltipTrigger>
        <TooltipContent>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}
export default TooltipSection