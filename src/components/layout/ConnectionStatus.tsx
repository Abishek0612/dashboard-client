import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import axios from "axios";

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get("http://localhost:5000/health");
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isConnected) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <WifiOff className="w-5 h-5" />
      <span className="text-sm font-medium">Backend Disconnected</span>
    </div>
  );
};

export default ConnectionStatus;
