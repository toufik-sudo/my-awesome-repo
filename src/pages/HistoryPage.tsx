import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { MessageCircle, Car, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const { sessions, vehicles, setActiveSession, setActiveVehicle, initialize, initialized } = useStore();
  const navigate = useNavigate();

  useEffect(() => { initialize(); }, []);

  if (!initialized) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleOpenSession = (session: typeof sessions[0]) => {
    setActiveVehicle(session.vehicleId);
    setActiveSession(session.id);
    navigate(`/diagnose/${session.id}`);
  };

  return (
    <div className="p-4">
      <h1 className="font-display text-xl font-semibold mb-4">Session History</h1>

      {sortedSessions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No diagnostic sessions yet</p>
          <p className="text-sm mt-1">Start a diagnosis to see history here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => {
            const vehicle = vehicles.find((v) => v.id === session.vehicleId);
            const lastMessage = session.messages[session.messages.length - 1];
            const date = new Date(session.createdAt);

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleOpenSession(session)}
                className="p-4 bg-card border rounded-xl cursor-pointer hover:border-primary/30 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="w-4 h-4" />
                    <span>{vehicle ? `${vehicle.brand} ${vehicle.model}` : "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {date.toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm line-clamp-2">
                  {lastMessage?.content || "No messages"}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {session.messages.length} message{session.messages.length !== 1 ? "s" : ""}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
