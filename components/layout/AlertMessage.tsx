import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

interface AlertMessageProps {
  type: "error" | "success"; // Could be 'error' or 'success' based on your API response
  message: string;
}

const AlertMessage = ({ type, message }: AlertMessageProps) => {
  return (
    <Alert variant={type === "error" ? "destructive" : "default"}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{type === "error" ? "Oops!" : "Success!"}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>

  )
}
export default AlertMessage