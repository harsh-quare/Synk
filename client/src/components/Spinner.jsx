import { Loader2 } from "lucide-react";

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-15 h-15 animate-spin text-indigo-600" />
    </div>
  );
}

export default Spinner;
