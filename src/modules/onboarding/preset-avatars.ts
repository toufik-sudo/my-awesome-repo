/**
 * Preset avatar catalogue surfaced in the onboarding avatar picker.
 *
 * Uses DiceBear's HTTPS API → no asset hosting required, deterministic per
 * seed. We deliberately request the **PNG** endpoint (not SVG) for two
 * reasons:
 *   1. SVG images don't have intrinsic dimensions when rendered into a
 *      <canvas>, which leaves DynamicImageCropper with a zero-sized image
 *      and a blank crop preview.
 *   2. PNG honours CORS headers (DiceBear sends `access-control-allow-origin: *`),
 *      so `<img crossOrigin="anonymous">` can paint to canvas without tainting it.
 */

export interface PresetAvatar {
  id: string;
  label: string;
  src: string;
  /** UI grouping shown on the picker. */
  group: string;
}

type StyleEntry = {
  style: string;
  group: string;
  seeds: string[];
};

const STYLE_CATALOG: StyleEntry[] = [
  {
    style: 'avataaars',
    group: 'People',
    seeds: ['Aurora', 'Phoenix', 'Atlas', 'Nova', 'Orion', 'Luna', 'Sirius', 'Vega', 'Lyra', 'Helios', 'Iris', 'Cosmo'],
  },
  {
    style: 'lorelei',
    group: 'Illustrated',
    seeds: ['Mila', 'Jules', 'Sasha', 'Noor', 'Ayla', 'Liam', 'Eloise', 'Marin', 'Tomas', 'Ines', 'Selma', 'Kian'],
  },
  {
    style: 'micah',
    group: 'Modern',
    seeds: ['Alex', 'Jamie', 'Riley', 'Casey', 'Morgan', 'Quinn', 'Dakota', 'Reese', 'Skyler', 'Avery', 'Drew', 'Sage'],
  },
  {
    style: 'notionists',
    group: 'Sketch',
    seeds: ['Felix', 'Charlie', 'Robin', 'Milo', 'Theo', 'Eli', 'Otto', 'Sol', 'Cal', 'Wren', 'Ash', 'Juno'],
  },
  {
    style: 'fun-emoji',
    group: 'Emoji',
    seeds: ['Spark', 'Glow', 'Ember', 'Flux', 'Pulse', 'Wave', 'Drift', 'Pixel', 'Echo', 'Rune', 'Halo', 'Zen'],
  },
  {
    style: 'bottts',
    group: 'Robots',
    seeds: ['R2', 'Mecha', 'Circuit', 'Volt', 'Nano', 'Quantum', 'Plasma', 'Helix', 'Cypher', 'Pixel', 'Synth', 'Astra'],
  },
  {
    style: 'thumbs',
    group: 'Friendly',
    seeds: ['Sun', 'Moon', 'Star', 'Comet', 'Cloud', 'Storm', 'Rain', 'Snow', 'Wind', 'Frost', 'Mist', 'Dawn'],
  },
  {
    style: 'shapes',
    group: 'Abstract',
    seeds: ['Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'Alpha', 'Beta', 'Gamma', 'Delta'],
  },
  {
    style: 'adventurer',
    group: 'Adventurer',
    seeds: ['Kai', 'Zara', 'Leo', 'Nia', 'Eden', 'Indra', 'Onyx', 'Rio', 'Vesper', 'Yuki', 'Zev', 'Cleo'],
  },
  {
    style: 'big-smile',
    group: 'Smiley',
    seeds: ['Joy', 'Bliss', 'Sunny', 'Happy', 'Bright', 'Lucky', 'Hope', 'Grace', 'Dream', 'Smile', 'Cheer', 'Glee'],
  },
];

const buildSrc = (style: string, seed: string) =>
  `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seed)}&size=256&backgroundType=gradientLinear`;

export const PRESET_AVATARS: PresetAvatar[] = STYLE_CATALOG.flatMap(({ style, group, seeds }) =>
  seeds.map((seed) => ({
    id: `${style}-${seed}`,
    label: seed,
    src: buildSrc(style, seed),
    group,
  })),
);

/** Distinct group order for the picker UI. */
export const AVATAR_GROUPS: string[] = STYLE_CATALOG.map((s) => s.group);
