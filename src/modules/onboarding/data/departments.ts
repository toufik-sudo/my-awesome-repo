/**
 * Administrative subdivisions per country (Department / State / Wilaya / Province).
 * Used as an extra cascading step in the onboarding address flow when available.
 *
 * Cities are then linked to a department via `cities.ts`. Countries that don't
 * appear here skip the department step and go straight to City selection.
 */

export interface DepartmentEntry {
  /** Stable code (number for FR, ISO subdivision for others). */
  code: string;
  name: string;
}

export const DEPARTMENTS_BY_COUNTRY: Record<string, DepartmentEntry[]> = {
  // ─── France — 96 metropolitan departments ──────────────────────────────
  FR: [
    { code: '01', name: 'Ain' }, { code: '02', name: 'Aisne' }, { code: '03', name: 'Allier' },
    { code: '04', name: 'Alpes-de-Haute-Provence' }, { code: '05', name: 'Hautes-Alpes' },
    { code: '06', name: 'Alpes-Maritimes' }, { code: '07', name: 'Ardèche' }, { code: '08', name: 'Ardennes' },
    { code: '09', name: 'Ariège' }, { code: '10', name: 'Aube' }, { code: '11', name: 'Aude' },
    { code: '12', name: 'Aveyron' }, { code: '13', name: 'Bouches-du-Rhône' }, { code: '14', name: 'Calvados' },
    { code: '15', name: 'Cantal' }, { code: '16', name: 'Charente' }, { code: '17', name: 'Charente-Maritime' },
    { code: '18', name: 'Cher' }, { code: '19', name: 'Corrèze' }, { code: '21', name: 'Côte-d\'Or' },
    { code: '22', name: 'Côtes-d\'Armor' }, { code: '23', name: 'Creuse' }, { code: '24', name: 'Dordogne' },
    { code: '25', name: 'Doubs' }, { code: '26', name: 'Drôme' }, { code: '27', name: 'Eure' },
    { code: '28', name: 'Eure-et-Loir' }, { code: '29', name: 'Finistère' }, { code: '30', name: 'Gard' },
    { code: '31', name: 'Haute-Garonne' }, { code: '32', name: 'Gers' }, { code: '33', name: 'Gironde' },
    { code: '34', name: 'Hérault' }, { code: '35', name: 'Ille-et-Vilaine' }, { code: '36', name: 'Indre' },
    { code: '37', name: 'Indre-et-Loire' }, { code: '38', name: 'Isère' }, { code: '39', name: 'Jura' },
    { code: '40', name: 'Landes' }, { code: '41', name: 'Loir-et-Cher' }, { code: '42', name: 'Loire' },
    { code: '43', name: 'Haute-Loire' }, { code: '44', name: 'Loire-Atlantique' }, { code: '45', name: 'Loiret' },
    { code: '46', name: 'Lot' }, { code: '47', name: 'Lot-et-Garonne' }, { code: '48', name: 'Lozère' },
    { code: '49', name: 'Maine-et-Loire' }, { code: '50', name: 'Manche' }, { code: '51', name: 'Marne' },
    { code: '52', name: 'Haute-Marne' }, { code: '53', name: 'Mayenne' }, { code: '54', name: 'Meurthe-et-Moselle' },
    { code: '55', name: 'Meuse' }, { code: '56', name: 'Morbihan' }, { code: '57', name: 'Moselle' },
    { code: '58', name: 'Nièvre' }, { code: '59', name: 'Nord' }, { code: '60', name: 'Oise' },
    { code: '61', name: 'Orne' }, { code: '62', name: 'Pas-de-Calais' }, { code: '63', name: 'Puy-de-Dôme' },
    { code: '64', name: 'Pyrénées-Atlantiques' }, { code: '65', name: 'Hautes-Pyrénées' },
    { code: '66', name: 'Pyrénées-Orientales' }, { code: '67', name: 'Bas-Rhin' }, { code: '68', name: 'Haut-Rhin' },
    { code: '69', name: 'Rhône' }, { code: '70', name: 'Haute-Saône' }, { code: '71', name: 'Saône-et-Loire' },
    { code: '72', name: 'Sarthe' }, { code: '73', name: 'Savoie' }, { code: '74', name: 'Haute-Savoie' },
    { code: '75', name: 'Paris' }, { code: '76', name: 'Seine-Maritime' }, { code: '77', name: 'Seine-et-Marne' },
    { code: '78', name: 'Yvelines' }, { code: '79', name: 'Deux-Sèvres' }, { code: '80', name: 'Somme' },
    { code: '81', name: 'Tarn' }, { code: '82', name: 'Tarn-et-Garonne' }, { code: '83', name: 'Var' },
    { code: '84', name: 'Vaucluse' }, { code: '85', name: 'Vendée' }, { code: '86', name: 'Vienne' },
    { code: '87', name: 'Haute-Vienne' }, { code: '88', name: 'Vosges' }, { code: '89', name: 'Yonne' },
    { code: '90', name: 'Territoire de Belfort' }, { code: '91', name: 'Essonne' }, { code: '92', name: 'Hauts-de-Seine' },
    { code: '93', name: 'Seine-Saint-Denis' }, { code: '94', name: 'Val-de-Marne' }, { code: '95', name: 'Val-d\'Oise' },
  ],

  // ─── Algeria — 58 wilayas (selected most populous first) ───────────────
  DZ: [
    { code: '01', name: 'Adrar' }, { code: '02', name: 'Chlef' }, { code: '03', name: 'Laghouat' },
    { code: '04', name: 'Oum El Bouaghi' }, { code: '05', name: 'Batna' }, { code: '06', name: 'Béjaïa' },
    { code: '07', name: 'Biskra' }, { code: '08', name: 'Béchar' }, { code: '09', name: 'Blida' },
    { code: '10', name: 'Bouira' }, { code: '11', name: 'Tamanrasset' }, { code: '12', name: 'Tébessa' },
    { code: '13', name: 'Tlemcen' }, { code: '14', name: 'Tiaret' }, { code: '15', name: 'Tizi Ouzou' },
    { code: '16', name: 'Algiers' }, { code: '17', name: 'Djelfa' }, { code: '18', name: 'Jijel' },
    { code: '19', name: 'Sétif' }, { code: '20', name: 'Saïda' }, { code: '21', name: 'Skikda' },
    { code: '22', name: 'Sidi Bel Abbès' }, { code: '23', name: 'Annaba' }, { code: '24', name: 'Guelma' },
    { code: '25', name: 'Constantine' }, { code: '26', name: 'Médéa' }, { code: '27', name: 'Mostaganem' },
    { code: '28', name: 'M\'Sila' }, { code: '29', name: 'Mascara' }, { code: '30', name: 'Ouargla' },
    { code: '31', name: 'Oran' }, { code: '32', name: 'El Bayadh' }, { code: '33', name: 'Illizi' },
    { code: '34', name: 'Bordj Bou Arréridj' }, { code: '35', name: 'Boumerdès' }, { code: '36', name: 'El Tarf' },
    { code: '37', name: 'Tindouf' }, { code: '38', name: 'Tissemsilt' }, { code: '39', name: 'El Oued' },
    { code: '40', name: 'Khenchela' }, { code: '41', name: 'Souk Ahras' }, { code: '42', name: 'Tipaza' },
    { code: '43', name: 'Mila' }, { code: '44', name: 'Aïn Defla' }, { code: '45', name: 'Naâma' },
    { code: '46', name: 'Aïn Témouchent' }, { code: '47', name: 'Ghardaïa' }, { code: '48', name: 'Relizane' },
  ],

  // ─── United States — 50 states + DC ────────────────────────────────────
  US: [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'DC', name: 'District of Columbia' },
    { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' }, { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' }, { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' }, { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' }, { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
  ],

  // ─── Morocco — main regions ────────────────────────────────────────────
  MA: [
    { code: '01', name: 'Tanger-Tétouan-Al Hoceïma' }, { code: '02', name: 'L\'Oriental' },
    { code: '03', name: 'Fès-Meknès' }, { code: '04', name: 'Rabat-Salé-Kénitra' },
    { code: '05', name: 'Béni Mellal-Khénifra' }, { code: '06', name: 'Casablanca-Settat' },
    { code: '07', name: 'Marrakech-Safi' }, { code: '08', name: 'Drâa-Tafilalet' },
    { code: '09', name: 'Souss-Massa' }, { code: '10', name: 'Guelmim-Oued Noun' },
    { code: '11', name: 'Laâyoune-Sakia El Hamra' }, { code: '12', name: 'Dakhla-Oued Ed-Dahab' },
  ],

  // ─── Tunisia — 24 governorates ─────────────────────────────────────────
  TN: [
    { code: '11', name: 'Tunis' }, { code: '12', name: 'Ariana' }, { code: '13', name: 'Ben Arous' },
    { code: '14', name: 'Manouba' }, { code: '21', name: 'Nabeul' }, { code: '22', name: 'Zaghouan' },
    { code: '23', name: 'Bizerte' }, { code: '31', name: 'Béja' }, { code: '32', name: 'Jendouba' },
    { code: '33', name: 'Le Kef' }, { code: '34', name: 'Siliana' }, { code: '41', name: 'Kairouan' },
    { code: '42', name: 'Kasserine' }, { code: '43', name: 'Sidi Bouzid' }, { code: '51', name: 'Sousse' },
    { code: '52', name: 'Monastir' }, { code: '53', name: 'Mahdia' }, { code: '61', name: 'Sfax' },
    { code: '71', name: 'Gafsa' }, { code: '72', name: 'Tozeur' }, { code: '73', name: 'Kébili' },
    { code: '81', name: 'Gabès' }, { code: '82', name: 'Médenine' }, { code: '83', name: 'Tataouine' },
  ],

  // ─── Spain — 17 autonomous communities ────────────────────────────────
  ES: [
    { code: 'AN', name: 'Andalucía' }, { code: 'AR', name: 'Aragón' }, { code: 'AS', name: 'Asturias' },
    { code: 'IB', name: 'Islas Baleares' }, { code: 'CN', name: 'Canarias' }, { code: 'CB', name: 'Cantabria' },
    { code: 'CL', name: 'Castilla y León' }, { code: 'CM', name: 'Castilla-La Mancha' },
    { code: 'CT', name: 'Cataluña' }, { code: 'EX', name: 'Extremadura' }, { code: 'GA', name: 'Galicia' },
    { code: 'MD', name: 'Madrid' }, { code: 'MC', name: 'Murcia' }, { code: 'NC', name: 'Navarra' },
    { code: 'PV', name: 'País Vasco' }, { code: 'RI', name: 'La Rioja' }, { code: 'VC', name: 'Valencia' },
  ],

  IT: [
    { code: 'ABR', name: 'Abruzzo' }, { code: 'BAS', name: 'Basilicata' }, { code: 'CAL', name: 'Calabria' },
    { code: 'CAM', name: 'Campania' }, { code: 'EMR', name: 'Emilia-Romagna' }, { code: 'FVG', name: 'Friuli-Venezia Giulia' },
    { code: 'LAZ', name: 'Lazio' }, { code: 'LIG', name: 'Liguria' }, { code: 'LOM', name: 'Lombardia' },
    { code: 'MAR', name: 'Marche' }, { code: 'MOL', name: 'Molise' }, { code: 'PIE', name: 'Piemonte' },
    { code: 'PUG', name: 'Puglia' }, { code: 'SAR', name: 'Sardegna' }, { code: 'SIC', name: 'Sicilia' },
    { code: 'TOS', name: 'Toscana' }, { code: 'TAA', name: 'Trentino-Alto Adige' }, { code: 'UMB', name: 'Umbria' },
    { code: 'VDA', name: 'Valle d\'Aosta' }, { code: 'VEN', name: 'Veneto' },
  ],

  DE: [
    { code: 'BW', name: 'Baden-Württemberg' }, { code: 'BY', name: 'Bayern' }, { code: 'BE', name: 'Berlin' },
    { code: 'BB', name: 'Brandenburg' }, { code: 'HB', name: 'Bremen' }, { code: 'HH', name: 'Hamburg' },
    { code: 'HE', name: 'Hessen' }, { code: 'MV', name: 'Mecklenburg-Vorpommern' }, { code: 'NI', name: 'Niedersachsen' },
    { code: 'NW', name: 'Nordrhein-Westfalen' }, { code: 'RP', name: 'Rheinland-Pfalz' }, { code: 'SL', name: 'Saarland' },
    { code: 'SN', name: 'Sachsen' }, { code: 'ST', name: 'Sachsen-Anhalt' }, { code: 'SH', name: 'Schleswig-Holstein' },
    { code: 'TH', name: 'Thüringen' },
  ],

  CA: [
    { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' }, { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' }, { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' }, { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' }, { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' }, { code: 'YT', name: 'Yukon' },
  ],

  GB: [
    { code: 'ENG', name: 'England' }, { code: 'SCT', name: 'Scotland' },
    { code: 'WLS', name: 'Wales' }, { code: 'NIR', name: 'Northern Ireland' },
  ],

  BE: [
    { code: 'VLG', name: 'Flanders' }, { code: 'WAL', name: 'Wallonia' }, { code: 'BRU', name: 'Brussels-Capital' },
  ],

  CH: [
    { code: 'ZH', name: 'Zürich' }, { code: 'BE', name: 'Bern' }, { code: 'GE', name: 'Genève' },
    { code: 'VD', name: 'Vaud' }, { code: 'BS', name: 'Basel-Stadt' }, { code: 'TI', name: 'Ticino' },
    { code: 'VS', name: 'Valais' }, { code: 'LU', name: 'Luzern' }, { code: 'AG', name: 'Aargau' },
    { code: 'SG', name: 'St. Gallen' },
  ],
};

export const getDepartmentsFor = (countryCode: string): DepartmentEntry[] =>
  DEPARTMENTS_BY_COUNTRY[countryCode] || [];

export const hasDepartments = (countryCode: string): boolean =>
  !!DEPARTMENTS_BY_COUNTRY[countryCode]?.length;
