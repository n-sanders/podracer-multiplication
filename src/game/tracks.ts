export interface Track {
  id: string;
  name: string;
  /** Closed SVG path in an 800×340 viewBox. Length 0 is the start/finish line. */
  path: string;
  sky: [string, string];
  sand: [string, string];
}

export const TRACKS: readonly Track[] = [
  {
    id: 'kessari-canyon',
    name: 'Kessari Canyon Run',
    path: 'M 130 175 C 120 80 250 50 360 92 C 445 125 500 52 612 62 C 722 72 728 196 652 236 C 582 272 520 222 440 262 C 352 306 205 300 156 262 C 132 242 134 210 130 175 Z',
    sky: ['#2b1d3a', '#e0794a'],
    sand: ['#e3a35f', '#b86f38'],
  },
  {
    id: 'tharsun-flats',
    name: 'Tharsun Flats Loop',
    path: 'M 110 170 C 110 82 220 62 330 70 C 420 76 450 120 520 110 C 610 96 700 92 705 172 C 710 252 610 282 500 276 C 420 272 380 236 300 252 C 200 272 110 258 110 170 Z',
    sky: ['#1d2a4a', '#f0a35c'],
    sand: ['#e8b877', '#c48443'],
  },
  {
    id: 'mesa-spiral',
    name: 'Red Mesa Spiral',
    path: 'M 150 205 C 98 125 180 50 282 80 C 362 104 332 180 412 190 C 502 200 482 70 592 70 C 702 70 722 200 662 250 C 602 300 482 290 382 282 C 282 274 192 272 150 205 Z',
    sky: ['#3a1c2c', '#f08a4b'],
    sand: ['#d98b55', '#a2552d'],
  },
];

export const GRAND_PRIX_TRACK: Track = {
  id: 'grand-prix',
  name: 'Twin Suns Grand Prix',
  path: 'M 120 180 C 110 70 240 40 340 70 C 420 94 420 150 500 140 C 590 128 600 50 680 70 C 750 90 740 210 690 250 C 630 296 540 260 470 282 C 380 310 300 250 230 288 C 160 320 126 260 120 180 Z',
  sky: ['#1b1433', '#ff9c5b'],
  sand: ['#eab06a', '#bf7a3b'],
};

export function trackForFamily(family: number): Track {
  return TRACKS[family % TRACKS.length];
}
