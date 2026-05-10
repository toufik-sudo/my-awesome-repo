/**
 * City dataset per country, optionally bound to a department/state code.
 *
 * Schema:
 *   { name, zipcode, department?, addresses? }
 *
 * `department` matches a `code` from `departments.ts`. When present, the UI
 * filters the city dropdown by selected department. When omitted, the city
 * shows up regardless.
 *
 * `addresses` are common districts/streets surfaced as suggestions — users
 * can always type a custom one.
 *
 * This list is intentionally pragmatic, not exhaustive. Free-text fallback
 * always works for missing entries.
 */

export interface CityEntry {
  name: string;
  zipcode: string;
  /** Department / state / wilaya code (matches departments.ts). */
  department?: string;
  addresses?: string[];
}

export const CITIES_BY_COUNTRY: Record<string, CityEntry[]> = {
  // ─── Algeria — main wilaya capitals + key towns ────────────────────────
  DZ: [
    { name: 'Algiers',         department: '16', zipcode: '16000', addresses: ['Rue Didouche Mourad', 'Boulevard Zighout Youcef', 'Rue Larbi Ben M\'hidi', 'Cité des Annassers', 'Bab Ezzouar', 'Hydra', 'El Biar', 'Bir Mourad Raïs', 'Kouba', 'Bab El Oued'] },
    { name: 'Bab Ezzouar',     department: '16', zipcode: '16311', addresses: ['Cité 1004 Logements', 'Cité Université', 'Cité USTHB'] },
    { name: 'Hydra',           department: '16', zipcode: '16035', addresses: ['Chemin Mackley', 'Rue des Frères Hocine'] },
    { name: 'El Biar',         department: '16', zipcode: '16030', addresses: ['Rue Ali Khodja', 'Rue Med Khemisti'] },
    { name: 'Cheraga',         department: '16', zipcode: '16002', addresses: ['Cité Aïn El Allak', 'Boulevard Colonel Amirouche'] },
    { name: 'Birkhadem',       department: '16', zipcode: '16005', addresses: ['Cité Garidi', 'Cité Diplomatique'] },
    { name: 'Oran',            department: '31', zipcode: '31000', addresses: ['Boulevard de l\'ALN', 'Rue Khemisti', 'Cité USTO', 'Front de Mer', 'Bir El Djir', 'Es Sénia'] },
    { name: 'Bir El Djir',     department: '31', zipcode: '31130', addresses: ['Cité AADL', 'Pôle Universitaire'] },
    { name: 'Es Sénia',        department: '31', zipcode: '31100', addresses: ['Cité Universitaire'] },
    { name: 'Constantine',     department: '25', zipcode: '25000', addresses: ['Rue Larbi Ben M\'hidi', 'Cité Boudraa Salah', 'Avenue Aouati Mostefa', 'Cité Daksi', 'Sidi Mabrouk'] },
    { name: 'Annaba',          department: '23', zipcode: '23000', addresses: ['Cours de la Révolution', 'Boulevard du 1er Novembre', 'Cité Seybouse', 'Plage Toche'] },
    { name: 'Blida',           department: '09', zipcode: '09000', addresses: ['Place du 1er Novembre', 'Rue des Frères Bouguettaya', 'Cité Bensalem', 'Boufarik'] },
    { name: 'Boufarik',        department: '09', zipcode: '09400', addresses: ['Rue Larbi Tebessi'] },
    { name: 'Sétif',           department: '19', zipcode: '19000', addresses: ['Avenue du 8 Mai 1945', 'Cité El Hidhab', 'Cité Yahyaoui', 'Cité Tlidjène'] },
    { name: 'Batna',           department: '05', zipcode: '05000', addresses: ['Rue de la République', 'Cité Kechida', 'Cité Z\'mala'] },
    { name: 'Tlemcen',         department: '13', zipcode: '13000', addresses: ['Boulevard Colonel Lotfi', 'Cité Sidi Saïd', 'Mansourah'] },
    { name: 'Béjaïa',          department: '06', zipcode: '06000', addresses: ['Boulevard de la Liberté', 'Rue de la Marine', 'Cité Tobbal'] },
    { name: 'Tizi Ouzou',      department: '15', zipcode: '15000', addresses: ['Boulevard Krim Belkacem', 'Cité Bekkar', 'Nouvelle Ville'] },
    { name: 'Skikda',          department: '21', zipcode: '21000', addresses: ['Boulevard 20 Août', 'Cité des Frères Saker', 'Cité Boulkroud'] },
    { name: 'Djelfa',          department: '17', zipcode: '17000', addresses: ['Rue Emir Abdelkader', 'Cité Bouzid'] },
    { name: 'Biskra',          department: '07', zipcode: '07000', addresses: ['Avenue Hakim Saadane', 'Cité El Alia', 'Cité 700 Logements'] },
    { name: 'Tiaret',          department: '14', zipcode: '14000', addresses: ['Rue des Martyrs', 'Cité Volani'] },
    { name: 'Bouira',          department: '10', zipcode: '10000', addresses: ['Rue Larbi Ben M\'hidi', 'Cité 700 Logements'] },
    { name: 'Mostaganem',      department: '27', zipcode: '27000', addresses: ['Boulevard Khemisti', 'Cité Khemisti'] },
    { name: 'Médéa',           department: '26', zipcode: '26000', addresses: ['Rue de l\'Indépendance', 'Cité M\'sallah'] },
    { name: 'Ghardaïa',        department: '47', zipcode: '47000', addresses: ['Rue de la Vallée', 'Bouhraoua'] },
    { name: 'Adrar',           department: '01', zipcode: '01000', addresses: ['Centre-ville', 'Cité 18 Février'] },
    { name: 'Tamanrasset',     department: '11', zipcode: '11000', addresses: ['Quartier Sersouf', 'Cité Tahaggart'] },
    { name: 'Béchar',          department: '08', zipcode: '08000', addresses: ['Rue de l\'ANP', 'Cité Boukaïs'] },
    { name: 'Chlef',           department: '02', zipcode: '02000', addresses: ['Rue de la République', 'Cité Bensouna'] },
    { name: 'Laghouat',        department: '03', zipcode: '03000', addresses: ['Boulevard Mohamed V', 'Cité Bouzid'] },
    { name: 'Jijel',           department: '18', zipcode: '18000', addresses: ['Boulevard Bourdghane', 'Cité Mezghitane'] },
    { name: 'Sidi Bel Abbès',  department: '22', zipcode: '22000', addresses: ['Rue Larbi Ben M\'hidi', 'Cité Boukhalfa'] },
    { name: 'Guelma',          department: '24', zipcode: '24000', addresses: ['Boulevard Souidani Boudjemaâ'] },
    { name: 'Mascara',         department: '29', zipcode: '29000', addresses: ['Rue de la Révolution'] },
    { name: 'Ouargla',         department: '30', zipcode: '30000', addresses: ['Boulevard de l\'ALN', 'Cité El Ksar'] },
    { name: 'Bordj Bou Arréridj', department: '34', zipcode: '34000', addresses: ['Boulevard Ben Boulaid'] },
    { name: 'Boumerdès',       department: '35', zipcode: '35000', addresses: ['Cité 1000 Logements', 'Boudouaou'] },
    { name: 'El Tarf',         department: '36', zipcode: '36000', addresses: ['Rue de l\'Indépendance'] },
    { name: 'El Oued',         department: '39', zipcode: '39000', addresses: ['Boulevard Taleb Larbi'] },
    { name: 'Khenchela',       department: '40', zipcode: '40000', addresses: ['Boulevard Houari Boumédiène'] },
    { name: 'Souk Ahras',      department: '41', zipcode: '41000', addresses: ['Boulevard Zighoud Youcef'] },
    { name: 'Tipaza',          department: '42', zipcode: '42000', addresses: ['Cité Kouali', 'Centre-ville'] },
    { name: 'Mila',            department: '43', zipcode: '43000', addresses: ['Cité Boussouf'] },
    { name: 'Aïn Defla',       department: '44', zipcode: '44000', addresses: ['Cité Khemis Miliana'] },
    { name: 'Aïn Témouchent',  department: '46', zipcode: '46000', addresses: ['Boulevard de l\'ALN'] },
    { name: 'Relizane',        department: '48', zipcode: '48000', addresses: ['Boulevard du 5 Juillet'] },
    { name: 'Tébessa',         department: '12', zipcode: '12000', addresses: ['Rue de l\'ALN'] },
    { name: 'Oum El Bouaghi',  department: '04', zipcode: '04000', addresses: ['Centre-ville'] },
    { name: 'M\'Sila',         department: '28', zipcode: '28000', addresses: ['Rue de la République'] },
    { name: 'Saïda',           department: '20', zipcode: '20000', addresses: ['Boulevard de la Wilaya'] },
    { name: 'El Bayadh',       department: '32', zipcode: '32000', addresses: ['Centre-ville'] },
    { name: 'Tissemsilt',      department: '38', zipcode: '38000', addresses: ['Rue de l\'Indépendance'] },
  ],

  // ─── France — major cities tagged by department ────────────────────────
  FR: [
    { name: 'Paris',           department: '75', zipcode: '75001', addresses: ['Rue de Rivoli', 'Avenue des Champs-Élysées', 'Boulevard Saint-Germain', 'Rue de la Paix', 'Rue du Faubourg Saint-Honoré', 'Avenue Montaigne', 'Rue Saint-Honoré'] },
    { name: 'Marseille',       department: '13', zipcode: '13001', addresses: ['La Canebière', 'Vieux-Port', 'Rue Saint-Ferréol', 'Cours Julien', 'Avenue du Prado'] },
    { name: 'Aix-en-Provence', department: '13', zipcode: '13100', addresses: ['Cours Mirabeau', 'Rue d\'Italie', 'Cours Sextius'] },
    { name: 'Lyon',            department: '69', zipcode: '69001', addresses: ['Rue de la République', 'Place Bellecour', 'Cours Lafayette', 'Rue Mercière', 'Quai Saint-Antoine'] },
    { name: 'Villeurbanne',    department: '69', zipcode: '69100', addresses: ['Cours Émile-Zola', 'Rue Hippolyte-Kahn'] },
    { name: 'Toulouse',        department: '31', zipcode: '31000', addresses: ['Place du Capitole', 'Allée Jean-Jaurès', 'Rue d\'Alsace-Lorraine', 'Rue Saint-Rome', 'Rue d\'Aubuisson'] },
    { name: 'Nice',            department: '06', zipcode: '06000', addresses: ['Promenade des Anglais', 'Avenue Jean-Médecin', 'Place Masséna', 'Rue de France'] },
    { name: 'Cannes',          department: '06', zipcode: '06400', addresses: ['Boulevard de la Croisette', 'Rue d\'Antibes', 'Rue Meynadier'] },
    { name: 'Antibes',         department: '06', zipcode: '06600', addresses: ['Boulevard Albert 1er', 'Rue de la République'] },
    { name: 'Nantes',          department: '44', zipcode: '44000', addresses: ['Cours des 50 Otages', 'Rue Crébillon', 'Place Royale', 'Quai de la Fosse'] },
    { name: 'Strasbourg',      department: '67', zipcode: '67000', addresses: ['Place Kléber', 'Grand Rue', 'Rue des Hallebardes'] },
    { name: 'Montpellier',     department: '34', zipcode: '34000', addresses: ['Place de la Comédie', 'Rue de la Loge', 'Rue Foch'] },
    { name: 'Bordeaux',        department: '33', zipcode: '33000', addresses: ['Place de la Bourse', 'Cours de l\'Intendance', 'Rue Sainte-Catherine', 'Quai des Chartrons'] },
    { name: 'Lille',           department: '59', zipcode: '59000', addresses: ['Grand Place', 'Rue de Béthune', 'Rue Faidherbe', 'Rue Esquermoise'] },
    { name: 'Roubaix',         department: '59', zipcode: '59100', addresses: ['Grand Place', 'Avenue Jean-Lebas'] },
    { name: 'Tourcoing',       department: '59', zipcode: '59200', addresses: ['Place Charles-Roussel'] },
    { name: 'Rennes',          department: '35', zipcode: '35000', addresses: ['Place de la Mairie', 'Rue Saint-Michel', 'Rue Le Bastard'] },
    { name: 'Reims',           department: '51', zipcode: '51100', addresses: ['Place Drouet d\'Erlon', 'Rue de Vesle'] },
    { name: 'Le Havre',        department: '76', zipcode: '76600', addresses: ['Avenue Foch', 'Rue de Paris'] },
    { name: 'Rouen',           department: '76', zipcode: '76000', addresses: ['Rue du Gros-Horloge', 'Rue Jeanne d\'Arc'] },
    { name: 'Saint-Étienne',   department: '42', zipcode: '42000', addresses: ['Place Jean-Jaurès', 'Rue des Martyrs-de-Vingré'] },
    { name: 'Toulon',          department: '83', zipcode: '83000', addresses: ['Avenue de la République', 'Place de la Liberté'] },
    { name: 'Grenoble',        department: '38', zipcode: '38000', addresses: ['Place Grenette', 'Rue Félix-Poulat', 'Rue de Bonne'] },
    { name: 'Dijon',           department: '21', zipcode: '21000', addresses: ['Place de la Libération', 'Rue de la Liberté'] },
    { name: 'Angers',          department: '49', zipcode: '49000', addresses: ['Place du Ralliement', 'Rue Saint-Laud'] },
    { name: 'Nîmes',           department: '30', zipcode: '30000', addresses: ['Boulevard Victor-Hugo', 'Place de la Maison-Carrée'] },
    { name: 'Saint-Denis',     department: '93', zipcode: '93200', addresses: ['Rue de la République', 'Place Jean-Jaurès'] },
    { name: 'Boulogne-Billancourt', department: '92', zipcode: '92100', addresses: ['Rue du Vieux-Pont-de-Sèvres', 'Avenue du Général-Leclerc'] },
    { name: 'Nanterre',        department: '92', zipcode: '92000', addresses: ['Avenue Joliot-Curie'] },
    { name: 'Versailles',      department: '78', zipcode: '78000', addresses: ['Avenue de Saint-Cloud', 'Rue Carnot'] },
    { name: 'Créteil',         department: '94', zipcode: '94000', addresses: ['Avenue du Général-de-Gaulle'] },
    { name: 'Vitry-sur-Seine', department: '94', zipcode: '94400', addresses: ['Avenue Maximilien-Robespierre'] },
    { name: 'Argenteuil',      department: '95', zipcode: '95100', addresses: ['Boulevard Héloïse'] },
    { name: 'Cergy',           department: '95', zipcode: '95000', addresses: ['Avenue du Centre'] },
    { name: 'Évry',            department: '91', zipcode: '91000', addresses: ['Avenue de l\'Université'] },
    { name: 'Metz',            department: '57', zipcode: '57000', addresses: ['Rue Serpenoise', 'Place Saint-Louis'] },
    { name: 'Nancy',           department: '54', zipcode: '54000', addresses: ['Place Stanislas', 'Rue Saint-Jean'] },
    { name: 'Brest',           department: '29', zipcode: '29200', addresses: ['Rue de Siam', 'Rue Jean-Jaurès'] },
    { name: 'Quimper',         department: '29', zipcode: '29000', addresses: ['Rue Kéréon'] },
    { name: 'Tours',           department: '37', zipcode: '37000', addresses: ['Rue Nationale', 'Place Plumereau'] },
    { name: 'Limoges',         department: '87', zipcode: '87000', addresses: ['Place de la République', 'Rue Jean-Jaurès'] },
    { name: 'Clermont-Ferrand', department: '63', zipcode: '63000', addresses: ['Place de Jaude', 'Rue des Gras'] },
    { name: 'Amiens',          department: '80', zipcode: '80000', addresses: ['Rue des Trois-Cailloux'] },
    { name: 'Caen',            department: '14', zipcode: '14000', addresses: ['Rue Saint-Pierre', 'Avenue du 6-Juin'] },
    { name: 'Le Mans',         department: '72', zipcode: '72000', addresses: ['Rue du Bourg-Belé', 'Place de la République'] },
    { name: 'Perpignan',       department: '66', zipcode: '66000', addresses: ['Place Arago', 'Rue de la Loge'] },
    { name: 'Pau',             department: '64', zipcode: '64000', addresses: ['Rue Serviez', 'Boulevard des Pyrénées'] },
    { name: 'Bayonne',         department: '64', zipcode: '64100', addresses: ['Rue Bourgneuf', 'Place de la Liberté'] },
    { name: 'Biarritz',        department: '64', zipcode: '64200', addresses: ['Avenue Édouard-VII', 'Place Clemenceau'] },
    { name: 'La Rochelle',     department: '17', zipcode: '17000', addresses: ['Rue du Palais', 'Quai Duperré'] },
    { name: 'Avignon',         department: '84', zipcode: '84000', addresses: ['Rue de la République', 'Place de l\'Horloge'] },
    { name: 'Annecy',          department: '74', zipcode: '74000', addresses: ['Rue Royale', 'Rue Sainte-Claire'] },
    { name: 'Chambéry',        department: '73', zipcode: '73000', addresses: ['Rue de Boigne', 'Place Saint-Léger'] },
    { name: 'Mulhouse',        department: '68', zipcode: '68100', addresses: ['Rue du Sauvage', 'Place de la Réunion'] },
    { name: 'Colmar',          department: '68', zipcode: '68000', addresses: ['Rue des Marchands', 'Grand-Rue'] },
    { name: 'Besançon',        department: '25', zipcode: '25000', addresses: ['Rue de Granvelle', 'Grande Rue'] },
    { name: 'Orléans',         department: '45', zipcode: '45000', addresses: ['Rue de la République', 'Place du Martroi'] },
    { name: 'Poitiers',        department: '86', zipcode: '86000', addresses: ['Rue Magenta', 'Place du Maréchal-Leclerc'] },
  ],

  // ─── Morocco ───────────────────────────────────────────────────────────
  MA: [
    { name: 'Casablanca',  department: '06', zipcode: '20000', addresses: ['Boulevard Mohammed V', 'Avenue Hassan II', 'Boulevard d\'Anfa', 'Maarif', 'Aïn Diab', 'Sidi Maârouf'] },
    { name: 'Mohammedia',  department: '06', zipcode: '28800', addresses: ['Boulevard Hassan II'] },
    { name: 'Settat',      department: '06', zipcode: '26000', addresses: ['Avenue Hassan II'] },
    { name: 'Rabat',       department: '04', zipcode: '10000', addresses: ['Avenue Mohammed V', 'Avenue Hassan II', 'Hay Riad', 'Agdal'] },
    { name: 'Salé',        department: '04', zipcode: '11000', addresses: ['Hay Salam', 'Sidi Moussa'] },
    { name: 'Kénitra',     department: '04', zipcode: '14000', addresses: ['Avenue Mohammed V'] },
    { name: 'Marrakech',   department: '07', zipcode: '40000', addresses: ['Avenue Mohammed VI', 'Place Jemaa el-Fna', 'Gueliz', 'Hivernage', 'Médina'] },
    { name: 'Safi',        department: '07', zipcode: '46000', addresses: ['Boulevard Mohammed V'] },
    { name: 'Fès',         department: '03', zipcode: '30000', addresses: ['Boulevard Hassan II', 'Avenue de France', 'Médina'] },
    { name: 'Meknès',      department: '03', zipcode: '50000', addresses: ['Avenue des FAR', 'Hamria'] },
    { name: 'Tanger',      department: '01', zipcode: '90000', addresses: ['Boulevard Mohammed V', 'Boulevard Pasteur'] },
    { name: 'Tétouan',     department: '01', zipcode: '93000', addresses: ['Avenue Mohammed V'] },
    { name: 'Al Hoceïma',  department: '01', zipcode: '32000', addresses: ['Boulevard Mohammed V'] },
    { name: 'Agadir',      department: '09', zipcode: '80000', addresses: ['Boulevard du 20 Août', 'Avenue Hassan II'] },
    { name: 'Oujda',       department: '02', zipcode: '60000', addresses: ['Boulevard Mohammed V'] },
    { name: 'Béni Mellal', department: '05', zipcode: '23000', addresses: ['Avenue Mohammed V'] },
  ],

  TN: [
    { name: 'Tunis',       department: '11', zipcode: '1000', addresses: ['Avenue Habib Bourguiba', 'Rue de Marseille', 'Avenue Mohamed V'] },
    { name: 'La Marsa',    department: '11', zipcode: '2070', addresses: ['Avenue Habib Bourguiba'] },
    { name: 'Carthage',    department: '11', zipcode: '2016', addresses: ['Avenue Habib Bourguiba'] },
    { name: 'Ariana',      department: '12', zipcode: '2080', addresses: ['Avenue de la République'] },
    { name: 'Ben Arous',   department: '13', zipcode: '2013', addresses: ['Rue de la République'] },
    { name: 'Sfax',        department: '61', zipcode: '3000', addresses: ['Avenue Habib Bourguiba'] },
    { name: 'Sousse',      department: '51', zipcode: '4000', addresses: ['Avenue Hédi Chaker', 'Boulevard du 14 Janvier'] },
    { name: 'Monastir',    department: '52', zipcode: '5000', addresses: ['Avenue Habib Bourguiba'] },
    { name: 'Mahdia',      department: '53', zipcode: '5100', addresses: ['Avenue Habib Bourguiba'] },
    { name: 'Bizerte',     department: '23', zipcode: '7000', addresses: ['Avenue Habib Bourguiba'] },
    { name: 'Kairouan',    department: '41', zipcode: '3100', addresses: ['Avenue de la République'] },
    { name: 'Gabès',       department: '81', zipcode: '6000', addresses: ['Avenue Habib Bourguiba'] },
    { name: 'Médenine',    department: '82', zipcode: '4100', addresses: ['Avenue Bourguiba'] },
    { name: 'Nabeul',      department: '21', zipcode: '8000', addresses: ['Avenue Habib Thameur'] },
    { name: 'Hammamet',    department: '21', zipcode: '8050', addresses: ['Avenue Habib Bourguiba'] },
  ],

  BE: [
    { name: 'Brussels',    department: 'BRU', zipcode: '1000', addresses: ['Grand Place', 'Avenue Louise', 'Rue Neuve', 'Boulevard Anspach', 'Avenue de la Toison d\'Or'] },
    { name: 'Antwerp',     department: 'VLG', zipcode: '2000', addresses: ['Meir', 'Grote Markt', 'De Keyserlei'] },
    { name: 'Ghent',       department: 'VLG', zipcode: '9000', addresses: ['Korenmarkt', 'Veldstraat'] },
    { name: 'Bruges',      department: 'VLG', zipcode: '8000', addresses: ['Markt', 'Steenstraat'] },
    { name: 'Leuven',      department: 'VLG', zipcode: '3000', addresses: ['Bondgenotenlaan', 'Grote Markt'] },
    { name: 'Mechelen',    department: 'VLG', zipcode: '2800', addresses: ['Bruul', 'Grote Markt'] },
    { name: 'Liège',       department: 'WAL', zipcode: '4000', addresses: ['Place Saint-Lambert', 'Rue Vinâve d\'Île'] },
    { name: 'Charleroi',   department: 'WAL', zipcode: '6000', addresses: ['Boulevard Tirou'] },
    { name: 'Namur',       department: 'WAL', zipcode: '5000', addresses: ['Rue de Fer', 'Place d\'Armes'] },
    { name: 'Mons',        department: 'WAL', zipcode: '7000', addresses: ['Grand-Place'] },
  ],

  CH: [
    { name: 'Zurich',      department: 'ZH', zipcode: '8001', addresses: ['Bahnhofstrasse', 'Limmatquai', 'Niederdorfstrasse'] },
    { name: 'Geneva',      department: 'GE', zipcode: '1201', addresses: ['Rue du Rhône', 'Quai du Mont-Blanc', 'Rue du Marché'] },
    { name: 'Bern',        department: 'BE', zipcode: '3011', addresses: ['Marktgasse', 'Spitalgasse'] },
    { name: 'Lausanne',    department: 'VD', zipcode: '1003', addresses: ['Rue de Bourg', 'Place Saint-François'] },
    { name: 'Basel',       department: 'BS', zipcode: '4001', addresses: ['Marktplatz', 'Freie Strasse'] },
    { name: 'Lucerne',     department: 'LU', zipcode: '6003', addresses: ['Schwanenplatz', 'Hertensteinstrasse'] },
    { name: 'Lugano',      department: 'TI', zipcode: '6900', addresses: ['Via Nassa'] },
    { name: 'St. Gallen',  department: 'SG', zipcode: '9000', addresses: ['Marktgasse'] },
  ],

  ES: [
    { name: 'Madrid',      department: 'MD', zipcode: '28001', addresses: ['Gran Vía', 'Calle de Alcalá', 'Paseo del Prado', 'Calle Mayor', 'Calle de Serrano'] },
    { name: 'Barcelona',   department: 'CT', zipcode: '08001', addresses: ['La Rambla', 'Passeig de Gràcia', 'Avinguda Diagonal', 'Carrer de Balmes'] },
    { name: 'Valencia',    department: 'VC', zipcode: '46001', addresses: ['Calle de Colón', 'Avenida del Puerto'] },
    { name: 'Seville',     department: 'AN', zipcode: '41001', addresses: ['Avenida de la Constitución', 'Calle Sierpes'] },
    { name: 'Málaga',      department: 'AN', zipcode: '29001', addresses: ['Calle Larios'] },
    { name: 'Granada',     department: 'AN', zipcode: '18001', addresses: ['Gran Vía de Colón'] },
    { name: 'Bilbao',      department: 'PV', zipcode: '48001', addresses: ['Gran Vía', 'Calle de Iparraguirre'] },
    { name: 'Zaragoza',    department: 'AR', zipcode: '50001', addresses: ['Paseo de la Independencia'] },
    { name: 'Palma',       department: 'IB', zipcode: '07001', addresses: ['Passeig del Born'] },
    { name: 'Las Palmas',  department: 'CN', zipcode: '35001', addresses: ['Calle Mayor de Triana'] },
    { name: 'Murcia',      department: 'MC', zipcode: '30001', addresses: ['Gran Vía Escultor Salzillo'] },
    { name: 'Pamplona',    department: 'NC', zipcode: '31001', addresses: ['Calle Estafeta'] },
  ],

  IT: [
    { name: 'Rome',        department: 'LAZ', zipcode: '00100', addresses: ['Via del Corso', 'Via Veneto', 'Via Condotti', 'Via Nazionale'] },
    { name: 'Milan',       department: 'LOM', zipcode: '20100', addresses: ['Via Montenapoleone', 'Corso Buenos Aires', 'Via Dante', 'Via della Spiga'] },
    { name: 'Naples',      department: 'CAM', zipcode: '80100', addresses: ['Via Toledo', 'Via Chiaia'] },
    { name: 'Turin',       department: 'PIE', zipcode: '10100', addresses: ['Via Roma', 'Via Po'] },
    { name: 'Florence',    department: 'TOS', zipcode: '50100', addresses: ['Via dei Calzaiuoli', 'Via Tornabuoni'] },
    { name: 'Venice',      department: 'VEN', zipcode: '30100', addresses: ['Strada Nuova', 'Calle Larga XXII Marzo'] },
    { name: 'Bologna',     department: 'EMR', zipcode: '40100', addresses: ['Via Indipendenza', 'Via Rizzoli'] },
    { name: 'Genoa',       department: 'LIG', zipcode: '16100', addresses: ['Via XX Settembre', 'Via Roma'] },
    { name: 'Bari',        department: 'PUG', zipcode: '70100', addresses: ['Via Sparano da Bari'] },
    { name: 'Palermo',     department: 'SIC', zipcode: '90100', addresses: ['Via della Libertà'] },
    { name: 'Catania',     department: 'SIC', zipcode: '95100', addresses: ['Via Etnea'] },
  ],

  DE: [
    { name: 'Berlin',      department: 'BE', zipcode: '10115', addresses: ['Unter den Linden', 'Kurfürstendamm', 'Friedrichstraße'] },
    { name: 'Munich',      department: 'BY', zipcode: '80331', addresses: ['Marienplatz', 'Maximilianstraße', 'Kaufingerstraße'] },
    { name: 'Hamburg',     department: 'HH', zipcode: '20095', addresses: ['Mönckebergstraße', 'Jungfernstieg'] },
    { name: 'Frankfurt',   department: 'HE', zipcode: '60311', addresses: ['Zeil', 'Goethestraße'] },
    { name: 'Cologne',     department: 'NW', zipcode: '50667', addresses: ['Hohe Straße', 'Schildergasse'] },
    { name: 'Düsseldorf',  department: 'NW', zipcode: '40213', addresses: ['Königsallee'] },
    { name: 'Stuttgart',   department: 'BW', zipcode: '70173', addresses: ['Königstraße'] },
    { name: 'Dresden',     department: 'SN', zipcode: '01067', addresses: ['Prager Straße'] },
    { name: 'Leipzig',     department: 'SN', zipcode: '04109', addresses: ['Grimmaische Straße'] },
    { name: 'Hannover',    department: 'NI', zipcode: '30159', addresses: ['Bahnhofstraße'] },
    { name: 'Bremen',      department: 'HB', zipcode: '28195', addresses: ['Sögestraße'] },
  ],

  GB: [
    { name: 'London',      department: 'ENG', zipcode: 'SW1A 1AA', addresses: ['Oxford Street', 'Regent Street', 'Piccadilly', 'Bond Street', 'King\'s Road'] },
    { name: 'Manchester',  department: 'ENG', zipcode: 'M1 1AE',   addresses: ['Deansgate', 'Market Street'] },
    { name: 'Birmingham',  department: 'ENG', zipcode: 'B1 1AA',   addresses: ['New Street', 'Corporation Street'] },
    { name: 'Liverpool',   department: 'ENG', zipcode: 'L1 1AA',   addresses: ['Bold Street', 'Church Street'] },
    { name: 'Leeds',       department: 'ENG', zipcode: 'LS1 1AA',  addresses: ['Briggate'] },
    { name: 'Bristol',     department: 'ENG', zipcode: 'BS1 4SP',  addresses: ['Park Street'] },
    { name: 'Edinburgh',   department: 'SCT', zipcode: 'EH1 1YZ',  addresses: ['Royal Mile', 'Princes Street'] },
    { name: 'Glasgow',     department: 'SCT', zipcode: 'G1 1AA',   addresses: ['Buchanan Street', 'Sauchiehall Street'] },
    { name: 'Cardiff',     department: 'WLS', zipcode: 'CF10 1AA', addresses: ['Queen Street'] },
    { name: 'Belfast',     department: 'NIR', zipcode: 'BT1 1AA',  addresses: ['Royal Avenue'] },
  ],

  US: [
    { name: 'New York',     department: 'NY', zipcode: '10001', addresses: ['5th Avenue', 'Broadway', 'Wall Street', 'Madison Avenue', 'Park Avenue'] },
    { name: 'Brooklyn',     department: 'NY', zipcode: '11201', addresses: ['Atlantic Avenue', 'Bedford Avenue'] },
    { name: 'Buffalo',      department: 'NY', zipcode: '14201', addresses: ['Main Street'] },
    { name: 'Los Angeles',  department: 'CA', zipcode: '90001', addresses: ['Sunset Boulevard', 'Hollywood Boulevard', 'Wilshire Boulevard', 'Santa Monica Boulevard'] },
    { name: 'San Francisco', department: 'CA', zipcode: '94102', addresses: ['Market Street', 'Mission Street', 'Castro Street'] },
    { name: 'San Diego',    department: 'CA', zipcode: '92101', addresses: ['Broadway', 'Harbor Drive'] },
    { name: 'Chicago',      department: 'IL', zipcode: '60601', addresses: ['Michigan Avenue', 'State Street'] },
    { name: 'Houston',      department: 'TX', zipcode: '77001', addresses: ['Westheimer Road', 'Main Street'] },
    { name: 'Austin',       department: 'TX', zipcode: '78701', addresses: ['Congress Avenue', 'South 1st Street'] },
    { name: 'Dallas',       department: 'TX', zipcode: '75201', addresses: ['Main Street', 'Elm Street'] },
    { name: 'Miami',        department: 'FL', zipcode: '33101', addresses: ['Ocean Drive', 'Collins Avenue', 'Lincoln Road'] },
    { name: 'Orlando',      department: 'FL', zipcode: '32801', addresses: ['Orange Avenue'] },
    { name: 'Boston',       department: 'MA', zipcode: '02108', addresses: ['Newbury Street', 'Boylston Street'] },
    { name: 'Seattle',      department: 'WA', zipcode: '98101', addresses: ['Pike Street', 'Pine Street'] },
    { name: 'Atlanta',      department: 'GA', zipcode: '30301', addresses: ['Peachtree Street'] },
    { name: 'Washington',   department: 'DC', zipcode: '20001', addresses: ['Pennsylvania Avenue', 'K Street'] },
    { name: 'Denver',       department: 'CO', zipcode: '80202', addresses: ['16th Street'] },
    { name: 'Phoenix',      department: 'AZ', zipcode: '85001', addresses: ['Central Avenue'] },
    { name: 'Las Vegas',    department: 'NV', zipcode: '89101', addresses: ['Las Vegas Boulevard'] },
    { name: 'Philadelphia', department: 'PA', zipcode: '19101', addresses: ['Market Street', 'Walnut Street'] },
  ],

  CA: [
    { name: 'Toronto',     department: 'ON', zipcode: 'M5H 2N2', addresses: ['Yonge Street', 'King Street', 'Queen Street'] },
    { name: 'Ottawa',      department: 'ON', zipcode: 'K1P 5G3', addresses: ['Sparks Street', 'Wellington Street'] },
    { name: 'Mississauga', department: 'ON', zipcode: 'L5B 1M3', addresses: ['Hurontario Street'] },
    { name: 'Montreal',    department: 'QC', zipcode: 'H2Y 1C6', addresses: ['Rue Sainte-Catherine', 'Boulevard Saint-Laurent'] },
    { name: 'Quebec City', department: 'QC', zipcode: 'G1R 4P3', addresses: ['Rue Saint-Jean'] },
    { name: 'Vancouver',   department: 'BC', zipcode: 'V6B 1A1', addresses: ['Robson Street', 'Granville Street'] },
    { name: 'Victoria',    department: 'BC', zipcode: 'V8W 1P6', addresses: ['Government Street'] },
    { name: 'Calgary',     department: 'AB', zipcode: 'T2P 1J9', addresses: ['Stephen Avenue', '17 Avenue SW'] },
    { name: 'Edmonton',    department: 'AB', zipcode: 'T5J 0R2', addresses: ['Whyte Avenue'] },
    { name: 'Winnipeg',    department: 'MB', zipcode: 'R3C 4A5', addresses: ['Portage Avenue'] },
    { name: 'Halifax',     department: 'NS', zipcode: 'B3J 1S9', addresses: ['Spring Garden Road'] },
  ],
};

export const getCitiesFor = (countryCode: string): CityEntry[] =>
  CITIES_BY_COUNTRY[countryCode] || [];

/** Filter cities by country + department code (returns all if no dept given). */
export const getCitiesForDepartment = (
  countryCode: string,
  departmentCode?: string,
): CityEntry[] => {
  const all = getCitiesFor(countryCode);
  if (!departmentCode) return all;
  return all.filter((c) => !c.department || c.department === departmentCode);
};
