export const VEHICLE_BRANDS = [
  "Acura","Alfa Romeo","Aston Martin","Audi","Bentley","BMW","Bugatti","Buick",
  "Cadillac","Chevrolet","Chrysler","Citroën","Dacia","Dodge","Ferrari","Fiat",
  "Ford","Genesis","GMC","Honda","Hyundai","Infiniti","Jaguar","Jeep","Kia",
  "Lamborghini","Land Rover","Lexus","Lincoln","Maserati","Mazda","McLaren",
  "Mercedes-Benz","Mini","Mitsubishi","Nissan","Opel","Peugeot","Porsche",
  "Ram","Renault","Rolls-Royce","SEAT","Skoda","Subaru","Tesla","Toyota",
  "Volkswagen","Volvo"
];

export const FUEL_TYPES = ["gasoline", "diesel", "hybrid", "electric"] as const;
export const TRANSMISSION_TYPES = ["manual", "automatic"] as const;

export const BRAND_MODELS: Record<string, string[]> = {
  "BMW": ["1 Series","2 Series","3 Series","4 Series","5 Series","6 Series","7 Series","8 Series","M3","M5","X1","X2","X3","X4","X5","X6","X7","Z4"],
  "Mercedes-Benz": ["A-Class","B-Class","C-Class","CLA","CLS","E-Class","G-Class","GLA","GLB","GLC","GLE","GLS","S-Class","SL","AMG GT"],
  "Volkswagen": ["Golf","Polo","Passat","Tiguan","Touareg","Arteon","T-Roc","T-Cross","ID.3","ID.4","ID.5","Caddy","Transporter"],
  "Toyota": ["Aygo","Yaris","Corolla","Camry","Prius","RAV4","C-HR","Highlander","Land Cruiser","4Runner","Tacoma","Tundra","Supra","GR86"],
  "Ford": ["Fiesta","Focus","Mustang","F-150","Explorer","Escape","Edge","Expedition","Bronco","Maverick","Ranger","EcoSport"],
  "Honda": ["Civic","Accord","Jazz","HR-V","CR-V","Pilot","Ridgeline","Odyssey","Insight","Fit"],
  "Audi": ["A1","A3","A4","A5","A6","A7","A8","Q2","Q3","Q5","Q7","Q8","TT","R8","e-tron"],
  "Chevrolet": ["Spark","Trax","Equinox","Traverse","Tahoe","Suburban","Silverado","Colorado","Camaro","Corvette","Blazer"],
  "Nissan": ["Micra","Juke","Qashqai","X-Trail","Murano","Pathfinder","Navara","Frontier","Titan","370Z","GT-R","Leaf","Ariya"],
  "Hyundai": ["i10","i20","i30","i40","Tucson","Santa Fe","Kona","Ioniq","Ioniq 5","Ioniq 6","Elantra","Sonata","Palisade"],
};

export function getModelsForBrand(brand: string): string[] {
  return BRAND_MODELS[brand] ?? [];
}

export const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);
