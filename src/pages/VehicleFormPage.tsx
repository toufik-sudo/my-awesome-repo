import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Search, Loader2 } from "lucide-react";
import { useStore, Vehicle } from "../store";
import { VEHICLE_BRANDS, FUEL_TYPES, TRANSMISSION_TYPES, getModelsForBrand, YEARS } from "../data/vehicles";
import { toast } from "sonner";

export default function VehicleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, setActiveVehicle } = useStore();
  const existing = id ? vehicles.find((v) => v.id === id) : null;

  const [form, setForm] = useState({
    brand: existing?.brand ?? "",
    model: existing?.model ?? "",
    year: existing?.year ?? new Date().getFullYear(),
    engine: existing?.engine ?? "",
    fuelType: existing?.fuelType ?? undefined,
    transmission: existing?.transmission ?? undefined,
    vin: existing?.vin ?? "",
    mileage: existing?.mileage ?? undefined,
    color: existing?.color ?? "",
    notes: existing?.notes ?? "",
  });

  const [vinLookup, setVinLookup] = useState(false);
  const [vinResult, setVinResult] = useState<null | { make: string; model: string; year: string; trim?: string; engine?: string; fuelType?: string; transmission?: string }>(null);

  const models = getModelsForBrand(form.brand);

  const handleVinLookup = async () => {
    if (!form.vin || form.vin.length !== 17) {
      toast.error("VIN must be exactly 17 characters");
      return;
    }
    setVinLookup(true);
    setVinResult(null);
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${form.vin}?format=json`
      );
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      const r = json.Results?.[0];
      if (!r || r.ErrorCode !== "0") {
        toast.error(r?.AdditionalErrorText || "Could not decode VIN");
        setVinLookup(false);
        return;
      }

      const make = r.Make ? r.Make.charAt(0) + r.Make.slice(1).toLowerCase() : "";
      const model = r.Model ? r.Model : "";
      const year = r.ModelYear ? Number(r.ModelYear) : form.year;
      const engine = r.DisplacementL && r.EngineConfiguration
        ? `${parseFloat(r.DisplacementL).toFixed(1)}L ${r.EngineConfiguration}`
        : r.DisplacementL
        ? `${parseFloat(r.DisplacementL).toFixed(1)}L`
        : "";
      const rawFuel = (r.FuelTypePrimary ?? "").toLowerCase();
      const fuelType: typeof form.fuelType =
        rawFuel.includes("gasoline") ? "gasoline"
        : rawFuel.includes("diesel") ? "diesel"
        : rawFuel.includes("electric") ? "electric"
        : rawFuel.includes("hybrid") ? "hybrid"
        : undefined;
      const rawTx = (r.TransmissionStyle ?? "").toLowerCase();
      const transmission: typeof form.transmission =
        rawTx.includes("manual") ? "manual"
        : rawTx.includes("automatic") ? "automatic"
        : undefined;

      const decoded = { make, model, year: String(year), engine, fuelType: fuelType as string, transmission: transmission as string };
      setVinResult({ make, model, year: String(year), engine, fuelType: fuelType as string, transmission: transmission as string });

      // Auto-fill
      setForm((prev) => ({
        ...prev,
        brand: make || prev.brand,
        model: model || prev.model,
        year: year || prev.year,
        engine: engine || prev.engine,
        fuelType: fuelType ?? prev.fuelType,
        transmission: transmission ?? prev.transmission,
      }));

      toast.success(`Decoded: ${year} ${make} ${model}`);
    } catch (e) {
      toast.error("Failed to reach NHTSA — check your connection");
    } finally {
      setVinLookup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.year) {
      toast.error("Brand, Model, and Year are required");
      return;
    }

    const data: Omit<Vehicle, "id" | "createdAt"> = {
      brand: form.brand,
      model: form.model,
      year: form.year,
      engine: form.engine || undefined,
      fuelType: form.fuelType as Vehicle["fuelType"],
      transmission: form.transmission as Vehicle["transmission"],
      vin: form.vin || undefined,
      mileage: form.mileage,
      color: form.color || undefined,
      notes: form.notes || undefined,
    };

    try {
      if (existing) {
        await updateVehicle(existing.id, data);
        toast.success("Vehicle updated");
      } else {
        const vehicle = await addVehicle(data);
        setActiveVehicle(vehicle.id);
        toast.success("Vehicle added");
      }
      navigate("/garage");
    } catch (error: any) {
      toast.error(error.message || "Failed to save vehicle");
    }
  };

  const handleDelete = () => {
    if (existing && confirm("Delete this vehicle?")) {
      deleteVehicle(existing.id);
      toast.success("Vehicle deleted");
      navigate("/garage");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-semibold">{existing ? "Edit Vehicle" : "Add Vehicle"}</h1>
        {existing && (
          <button onClick={handleDelete} className="ml-auto p-2 text-destructive hover:bg-destructive/10 rounded-lg transition">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* VIN Lookup */}
        <div className="p-4 bg-card border rounded-xl space-y-3">
          <label className="text-sm font-medium text-muted-foreground">VIN (Optional)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.vin}
              onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className="flex-1 px-3 py-2 bg-background border rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleVinLookup}
              disabled={vinLookup}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium flex items-center gap-2 transition disabled:opacity-50"
            >
              {vinLookup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Decode
            </button>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand *</label>
            <select
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value, model: "" })}
              className="w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select brand</option>
              {VEHICLE_BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Model *</label>
            <select
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select model</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="__other">Other</option>
            </select>
            {form.model === "__other" && (
              <input
                type="text"
                placeholder="Enter model name"
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="mt-2 w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Year *</label>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className="w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Engine</label>
              <input
                type="text"
                value={form.engine}
                onChange={(e) => setForm({ ...form, engine: e.target.value })}
                placeholder="e.g., 2.0L Turbo"
                className="w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <select
                value={form.fuelType ?? ""}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value as any || undefined })}
                className="w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f} className="capitalize">{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Transmission</label>
              <select
                value={form.transmission ?? ""}
                onChange={(e) => setForm({ ...form, transmission: e.target.value as any || undefined })}
                className="w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                {TRANSMISSION_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mileage (km)</label>
            <input
              type="number"
              value={form.mileage ?? ""}
              onChange={(e) => setForm({ ...form, mileage: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Current mileage"
              className="w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional info..."
              rows={3}
              className="w-full px-3 py-3 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg mt-6 hover:opacity-90 transition"
        >
          {existing ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}
