/**
 * DTC (Diagnostic Trouble Code) database
 * P = Powertrain, B = Body, C = Chassis, U = Network
 */

export interface DTCDefinition {
  code: string;
  description: string;
  category: "powertrain" | "body" | "chassis" | "network";
  severity: "low" | "medium" | "high" | "critical";
  commonCauses: string[];
  symptoms: string[];
}

export const DTC_DATABASE: Record<string, DTCDefinition> = {
  // Powertrain - Engine
  P0100: {
    code: "P0100",
    description: "Mass Air Flow (MAF) Circuit Malfunction",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Dirty MAF sensor", "Damaged wiring", "Vacuum leak", "Air filter restriction"],
    symptoms: ["Poor fuel economy", "Rough idle", "Hesitation on acceleration"],
  },
  P0101: {
    code: "P0101",
    description: "Mass Air Flow (MAF) Circuit Range/Performance",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Contaminated MAF", "Air leaks after MAF", "Faulty MAF sensor"],
    symptoms: ["Stalling", "Hard starting", "Reduced power"],
  },
  P0171: {
    code: "P0171",
    description: "System Too Lean (Bank 1)",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Vacuum leak", "Weak fuel pump", "Clogged fuel filter", "Faulty O2 sensor"],
    symptoms: ["Rough idle", "Poor acceleration", "Engine misfires"],
  },
  P0172: {
    code: "P0172",
    description: "System Too Rich (Bank 1)",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Leaking fuel injectors", "Faulty fuel pressure regulator", "Stuck thermostat"],
    symptoms: ["Black exhaust smoke", "Poor fuel economy", "Spark plug fouling"],
  },
  P0300: {
    code: "P0300",
    description: "Random/Multiple Cylinder Misfire Detected",
    category: "powertrain",
    severity: "high",
    commonCauses: ["Worn spark plugs", "Bad ignition coils", "Vacuum leak", "Low fuel pressure"],
    symptoms: ["Engine shaking", "Loss of power", "Check engine light flashing"],
  },
  P0301: {
    code: "P0301",
    description: "Cylinder 1 Misfire Detected",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Bad spark plug", "Faulty ignition coil", "Low compression", "Fuel injector issue"],
    symptoms: ["Rough running", "Power loss", "Increased emissions"],
  },
  P0302: {
    code: "P0302",
    description: "Cylinder 2 Misfire Detected",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Bad spark plug", "Faulty ignition coil", "Low compression", "Fuel injector issue"],
    symptoms: ["Rough running", "Power loss", "Increased emissions"],
  },
  P0303: {
    code: "P0303",
    description: "Cylinder 3 Misfire Detected",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Bad spark plug", "Faulty ignition coil", "Low compression", "Fuel injector issue"],
    symptoms: ["Rough running", "Power loss", "Increased emissions"],
  },
  P0304: {
    code: "P0304",
    description: "Cylinder 4 Misfire Detected",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Bad spark plug", "Faulty ignition coil", "Low compression", "Fuel injector issue"],
    symptoms: ["Rough running", "Power loss", "Increased emissions"],
  },
  P0420: {
    code: "P0420",
    description: "Catalyst System Efficiency Below Threshold (Bank 1)",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Worn catalytic converter", "O2 sensor failure", "Exhaust leak", "Engine misfire damage"],
    symptoms: ["Reduced performance", "Failed emissions test", "Sulfur smell"],
  },
  P0430: {
    code: "P0430",
    description: "Catalyst System Efficiency Below Threshold (Bank 2)",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Worn catalytic converter", "O2 sensor failure", "Exhaust leak"],
    symptoms: ["Reduced performance", "Failed emissions test"],
  },
  P0440: {
    code: "P0440",
    description: "Evaporative Emission Control System Malfunction",
    category: "powertrain",
    severity: "low",
    commonCauses: ["Loose gas cap", "Faulty purge valve", "EVAP leak", "Charcoal canister issue"],
    symptoms: ["Fuel odor", "Check engine light"],
  },
  P0442: {
    code: "P0442",
    description: "Evaporative Emission Control System Leak Detected (Small Leak)",
    category: "powertrain",
    severity: "low",
    commonCauses: ["Loose gas cap", "Cracked EVAP hose", "Faulty purge valve"],
    symptoms: ["Check engine light", "Possible fuel smell"],
  },
  P0455: {
    code: "P0455",
    description: "Evaporative Emission Control System Leak Detected (Large Leak)",
    category: "powertrain",
    severity: "low",
    commonCauses: ["Missing gas cap", "Disconnected EVAP hose", "Cracked charcoal canister"],
    symptoms: ["Check engine light", "Fuel smell"],
  },
  P0500: {
    code: "P0500",
    description: "Vehicle Speed Sensor (VSS) Malfunction",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Faulty VSS", "Damaged wiring", "Transmission issues"],
    symptoms: ["Speedometer not working", "Erratic shifting", "ABS light on"],
  },
  P0505: {
    code: "P0505",
    description: "Idle Air Control System Malfunction",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Dirty IAC valve", "Vacuum leak", "Faulty IAC"],
    symptoms: ["Erratic idle", "Stalling", "High idle"],
  },
  P0562: {
    code: "P0562",
    description: "System Voltage Low",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Weak battery", "Failing alternator", "Poor ground connection"],
    symptoms: ["Dim lights", "Hard starting", "Battery warning light"],
  },
  P0700: {
    code: "P0700",
    description: "Transmission Control System Malfunction",
    category: "powertrain",
    severity: "high",
    commonCauses: ["TCM failure", "Wiring issue", "Internal transmission problem"],
    symptoms: ["Harsh shifting", "Transmission slip", "Limp mode"],
  },
  P0715: {
    code: "P0715",
    description: "Input/Turbine Speed Sensor Circuit Malfunction",
    category: "powertrain",
    severity: "medium",
    commonCauses: ["Faulty sensor", "Damaged wiring", "Low transmission fluid"],
    symptoms: ["Erratic shifting", "Speedometer issues"],
  },

  // Body codes
  B1000: {
    code: "B1000",
    description: "ECU Malfunction",
    category: "body",
    severity: "high",
    commonCauses: ["ECU failure", "Power supply issue", "Software corruption"],
    symptoms: ["Multiple warning lights", "System failures"],
  },
  B1318: {
    code: "B1318",
    description: "Battery Voltage Low",
    category: "body",
    severity: "medium",
    commonCauses: ["Weak battery", "Alternator issue", "Parasitic drain"],
    symptoms: ["Warning lights", "Accessory issues"],
  },

  // Chassis codes
  C0035: {
    code: "C0035",
    description: "Left Front Wheel Speed Sensor Circuit Malfunction",
    category: "chassis",
    severity: "medium",
    commonCauses: ["Damaged sensor", "Broken wire", "Corroded connector"],
    symptoms: ["ABS light on", "Traction control disabled"],
  },
  C0040: {
    code: "C0040",
    description: "Right Front Wheel Speed Sensor Circuit Malfunction",
    category: "chassis",
    severity: "medium",
    commonCauses: ["Damaged sensor", "Broken wire", "Corroded connector"],
    symptoms: ["ABS light on", "Traction control disabled"],
  },
  C0050: {
    code: "C0050",
    description: "Left Rear Wheel Speed Sensor Circuit Malfunction",
    category: "chassis",
    severity: "medium",
    commonCauses: ["Damaged sensor", "Broken wire", "Corroded connector"],
    symptoms: ["ABS light on", "Traction control disabled"],
  },
  C0055: {
    code: "C0055",
    description: "Right Rear Wheel Speed Sensor Circuit Malfunction",
    category: "chassis",
    severity: "medium",
    commonCauses: ["Damaged sensor", "Broken wire", "Corroded connector"],
    symptoms: ["ABS light on", "Traction control disabled"],
  },

  // Network codes
  U0100: {
    code: "U0100",
    description: "Lost Communication With ECM/PCM 'A'",
    category: "network",
    severity: "critical",
    commonCauses: ["CAN bus failure", "ECM failure", "Wiring issue", "Power loss to ECM"],
    symptoms: ["No start", "Multiple warning lights", "Loss of functions"],
  },
  U0101: {
    code: "U0101",
    description: "Lost Communication With TCM",
    category: "network",
    severity: "high",
    commonCauses: ["CAN bus issue", "TCM failure", "Wiring problem"],
    symptoms: ["Limp mode", "No shifting", "Warning lights"],
  },
  U0121: {
    code: "U0121",
    description: "Lost Communication With Anti-Lock Brake System (ABS) Control Module",
    category: "network",
    severity: "high",
    commonCauses: ["ABS module failure", "CAN bus issue", "Wiring damage"],
    symptoms: ["ABS disabled", "Warning lights"],
  },
  U0140: {
    code: "U0140",
    description: "Lost Communication With Body Control Module",
    category: "network",
    severity: "medium",
    commonCauses: ["BCM failure", "Wiring issue", "Power problem"],
    symptoms: ["Accessory failures", "Warning lights"],
  },
};

/**
 * Look up a DTC code and return its definition
 */
export function lookupDTC(code: string): DTCDefinition | null {
  const normalized = code.toUpperCase().trim();
  return DTC_DATABASE[normalized] || null;
}

/**
 * Look up multiple DTC codes
 */
export function lookupMultipleDTCs(codes: string[]): Array<{ code: string; definition: DTCDefinition | null }> {
  return codes.map((code) => ({
    code: code.toUpperCase().trim(),
    definition: lookupDTC(code),
  }));
}

/**
 * Get severity color class
 */
export function getSeverityColor(severity: DTCDefinition["severity"]): string {
  switch (severity) {
    case "critical":
      return "text-red-600 bg-red-100 dark:bg-red-900/30";
    case "high":
      return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
    case "medium":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    case "low":
      return "text-green-600 bg-green-100 dark:bg-green-900/30";
  }
}

/**
 * Get category icon name
 */
export function getCategoryLabel(category: DTCDefinition["category"]): string {
  switch (category) {
    case "powertrain":
      return "Powertrain (P)";
    case "body":
      return "Body (B)";
    case "chassis":
      return "Chassis (C)";
    case "network":
      return "Network (U)";
  }
}
