import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export type MediaAttachment = {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  name: string;
  size: number;
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  engine?: string;
  fuelType?: "gasoline" | "diesel" | "hybrid" | "electric";
  transmission?: "manual" | "automatic";
  vin?: string;
  mileage?: number;
  color?: string;
  notes?: string;
  createdAt: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: MediaAttachment[];
  vehicleContext?: Vehicle;
  timestamp: string;
  isStreaming?: boolean;
};

export type Session = {
  id: string;
  vehicleId: string;
  messages: Message[];
  createdAt: string;
  title: string;
};

type AppStore = {
  vehicles: Vehicle[];
  sessions: Session[];
  activeVehicleId: string | null;
  activeSessionId: string | null;
  theme: "light" | "dark";
  initialized: boolean;

  initialize: () => Promise<void>;
  addVehicle: (v: Omit<Vehicle, "id" | "createdAt">) => Promise<Vehicle>;
  updateVehicle: (id: string, v: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  setActiveVehicle: (id: string | null) => void;

  createSession: (vehicleId: string) => Promise<Session>;
  addMessage: (sessionId: string, msg: Omit<Message, "id" | "timestamp">) => Promise<void>;
  updateMessage: (sessionId: string, msgId: string, patch: Partial<Message>) => void;
  setActiveSession: (id: string | null) => void;

  toggleTheme: () => void;
};

const getTheme = (): "light" | "dark" => {
  try {
    const raw = localStorage.getItem("mechdiag-theme");
    return raw === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const useStore = create<AppStore>((set, get) => ({
  vehicles: [],
  sessions: [],
  activeVehicleId: null,
  activeSessionId: null,
  theme: getTheme(),
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load vehicles
    const { data: vehiclesData } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    const vehicles: Vehicle[] = (vehiclesData ?? []).map((v: any) => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      engine: v.engine,
      fuelType: v.fuel_type as Vehicle["fuelType"],
      transmission: v.transmission as Vehicle["transmission"],
      vin: v.vin,
      mileage: v.mileage,
      color: v.color,
      notes: v.notes,
      createdAt: v.created_at,
    }));

    // Load sessions with messages
    const { data: sessionsData } = await supabase
      .from("diagnostic_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    const sessions: Session[] = [];
    for (const s of sessionsData ?? []) {
      const { data: messagesData } = await supabase
        .from("diagnostic_messages")
        .select("*")
        .eq("session_id", s.id)
        .order("created_at", { ascending: true });

      sessions.push({
        id: s.id,
        vehicleId: s.vehicle_id,
        title: s.title,
        createdAt: s.created_at,
        messages: (messagesData ?? []).map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.created_at,
        })),
      });
    }

    set({ vehicles, sessions, initialized: true, activeVehicleId: vehicles[0]?.id ?? null });
  },

  addVehicle: async (v) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        user_id: user.id,
        brand: v.brand,
        model: v.model,
        year: v.year,
        engine: v.engine,
        fuel_type: v.fuelType,
        transmission: v.transmission,
        vin: v.vin,
        mileage: v.mileage,
        color: v.color,
        notes: v.notes,
      })
      .select()
      .single();

    if (error) throw error;

    const vehicle: Vehicle = {
      id: data.id,
      brand: data.brand,
      model: data.model,
      year: data.year,
      engine: data.engine ?? undefined,
      fuelType: (data.fuel_type as Vehicle["fuelType"]) ?? undefined,
      transmission: (data.transmission as Vehicle["transmission"]) ?? undefined,
      vin: data.vin ?? undefined,
      mileage: data.mileage ?? undefined,
      color: data.color ?? undefined,
      notes: data.notes ?? undefined,
      createdAt: data.created_at,
    };

    set((s) => ({ vehicles: [vehicle, ...s.vehicles] }));
    return vehicle;
  },

  updateVehicle: async (id, v) => {
    const updateData: any = {};
    if (v.brand !== undefined) updateData.brand = v.brand;
    if (v.model !== undefined) updateData.model = v.model;
    if (v.year !== undefined) updateData.year = v.year;
    if (v.engine !== undefined) updateData.engine = v.engine;
    if (v.fuelType !== undefined) updateData.fuel_type = v.fuelType;
    if (v.transmission !== undefined) updateData.transmission = v.transmission;
    if (v.vin !== undefined) updateData.vin = v.vin;
    if (v.mileage !== undefined) updateData.mileage = v.mileage;
    if (v.color !== undefined) updateData.color = v.color;
    if (v.notes !== undefined) updateData.notes = v.notes;

    const { error } = await supabase
      .from("vehicles")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    set((s) => ({
      vehicles: s.vehicles.map((x) => (x.id === id ? { ...x, ...v } : x)),
    }));
  },

  deleteVehicle: async (id) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) throw error;

    set((s) => ({
      vehicles: s.vehicles.filter((x) => x.id !== id),
      activeVehicleId: s.activeVehicleId === id ? null : s.activeVehicleId,
    }));
  },

  setActiveVehicle: (id) => set({ activeVehicleId: id }),

  createSession: async (vehicleId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const vehicle = get().vehicles.find((v) => v.id === vehicleId);
    const title = vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : "New Session";

    const { data, error } = await supabase
      .from("diagnostic_sessions")
      .insert({ user_id: user.id, vehicle_id: vehicleId, title })
      .select()
      .single();

    if (error) throw error;

    const session: Session = {
      id: data.id,
      vehicleId: data.vehicle_id,
      messages: [],
      createdAt: data.created_at,
      title: data.title,
    };

    set((s) => ({ sessions: [session, ...s.sessions], activeSessionId: session.id }));
    return session;
  },

  addMessage: async (sessionId, msg) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // For streaming assistant messages, add locally first (no DB yet)
    if (msg.isStreaming) {
      const message: Message = {
        ...msg,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
      set((s) => ({
        sessions: s.sessions.map((sess) =>
          sess.id === sessionId ? { ...sess, messages: [...sess.messages, message] } : sess
        ),
      }));
      return;
    }

    // Save to DB
    const { data, error } = await supabase
      .from("diagnostic_messages")
      .insert({
        session_id: sessionId,
        user_id: user.id,
        role: msg.role,
        content: msg.content,
      })
      .select()
      .single();

    if (error) throw error;

    const message: Message = {
      id: data.id,
      role: data.role as Message["role"],
      content: data.content,
      attachments: msg.attachments,
      vehicleContext: msg.vehicleContext,
      timestamp: data.created_at,
    };

    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, messages: [...sess.messages, message] } : sess
      ),
    }));
  },

  updateMessage: (sessionId, msgId, patch) => {
    // Update locally (used for streaming). When streaming ends, persist to DB.
    set((s) => ({
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId
          ? { ...sess, messages: sess.messages.map((m) => (m.id === msgId ? { ...m, ...patch } : m)) }
          : sess
      ),
    }));

    // When streaming is done, save the final message to DB
    if (patch.isStreaming === false) {
      const sess = get().sessions.find((s) => s.id === sessionId);
      const msg = sess?.messages.find((m) => m.id === msgId);
      if (msg && msg.role === "assistant" && msg.content) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (!user) return;
          supabase
            .from("diagnostic_messages")
            .insert({
              session_id: sessionId,
              user_id: user.id,
              role: "assistant",
              content: msg.content,
            })
            .then(({ error }) => {
              if (error) console.error("Failed to persist assistant message:", error);
            });
        });
      }
    }
  },

  setActiveSession: (id) => set({ activeSessionId: id }),

  toggleTheme: () =>
    set((s) => {
      const theme = s.theme === "light" ? "dark" : "light";
      if (theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      localStorage.setItem("mechdiag-theme", theme);
      return { theme };
    }),
}));
