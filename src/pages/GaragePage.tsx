import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, Fuel, Settings2, Calendar, Loader2 } from "lucide-react";
import { useStore } from "../store";
import { motion } from "framer-motion";

export default function GaragePage() {
  const { vehicles, activeVehicleId, setActiveVehicle, initialize, initialized } = useStore();
  const navigate = useNavigate();

  useEffect(() => { initialize(); }, []);

  if (!initialized) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">My Garage</h1>
        <button
          onClick={() => navigate("/garage/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-2">No vehicles yet</p>
          <p className="text-sm">Add your first vehicle to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeVehicleId === v.id
                  ? "border-primary bg-accent ring-2 ring-primary/20"
                  : "bg-card hover:border-primary/30"
              }`}
              onClick={() => setActiveVehicle(v.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{v.brand} {v.model}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {v.year}
                    </span>
                    {v.fuelType && (
                      <span className="flex items-center gap-1 capitalize">
                        <Fuel className="w-4 h-4" />
                        {v.fuelType}
                      </span>
                    )}
                    {v.transmission && (
                      <span className="flex items-center gap-1 capitalize">
                        <Settings2 className="w-4 h-4" />
                        {v.transmission}
                      </span>
                    )}
                  </div>
                  {v.vin && (
                    <p className="mt-2 text-xs font-mono text-muted-foreground">VIN: {v.vin}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/garage/${v.id}/edit`);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeVehicleId && (
        <div className="fixed bottom-20 left-4 right-4 safe-bottom">
          <button
            onClick={() => navigate("/diagnose")}
            className="w-full py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg shadow-lg hover:opacity-90 transition"
          >
            Start Diagnosis →
          </button>
        </div>
      )}
    </div>
  );
}
