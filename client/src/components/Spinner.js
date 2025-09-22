import { Loader2 } from "lucide-react";

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin focus:ring-indigo-500" />
    </div>
  );
}

export default Spinner;
