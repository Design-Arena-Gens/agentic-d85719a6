"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import clsx from "clsx";

type ToneModule = typeof import("tone");

type ChordQuality =
  | "maj9"
  | "min9"
  | "min11"
  | "dom13"
  | "dom13b9"
  | "maj7sharp11"
  | "halfDim"
  | "dim7"
  | "altDom";

type MeasureCell = {
  degree: number;
  quality: ChordQuality;
  display: string;
  duration: string;
  bassApproach?: "chromaticUp" | "chromaticDown" | "scalar";
};

type SectionBlueprint = {
  label: string;
  measures: MeasureCell[][];
};

type GeneratedSection = {
  label: string;
  measures: string[][];
};

type PreparedArrangement = {
  sections: GeneratedSection[];
  chordEvents: PartEvent[];
  bassEvents: PartEvent[];
  melodyEvents: PartEvent[];
};

type PartEvent = {
  time: string;
  duration: string;
  notes: string[];
};

type ToneResources = {
  transport: ToneModule["Transport"];
  parts: import("tone").Part[];
  nodes: import("tone").ToneAudioNode[];
};

const NOTE_SEQUENCE = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
] as const;

const QUALITY_INTERVALS: Record<ChordQuality, number[]> = {
  maj9: [0, 4, 7, 11, 14],
  min9: [0, 3, 7, 10, 14],
  min11: [0, 3, 7, 10, 14, 17],
  dom13: [0, 4, 7, 10, 14, 17, 21],
  dom13b9: [0, 4, 7, 10, 13, 17, 21],
  maj7sharp11: [0, 4, 6, 11, 14],
  halfDim: [0, 3, 6, 10, 13],
  dim7: [0, 3, 6, 9],
  altDom: [0, 4, 7, 10, 13, 15]
};

const SECTION_BLUEPRINTS: SectionBlueprint[] = [
  {
    label: "Intro",
    measures: [
      [
        { degree: 0, quality: "maj9", display: "Imaj9", duration: "1m" }
      ],
      [
        {
          degree: 9,
          quality: "min9",
          display: "vi9",
          duration: "2n",
          bassApproach: "chromaticDown"
        },
        {
          degree: 2,
          quality: "min11",
          display: "ii11",
          duration: "2n",
          bassApproach: "scalar"
        }
      ],
      [
        {
          degree: 7,
          quality: "dom13",
          display: "V13sus",
          duration: "1m",
          bassApproach: "chromaticDown"
        }
      ]
    ]
  },
  {
    label: "A",
    measures: [
      [
        { degree: 0, quality: "maj9", display: "Imaj9", duration: "1m" }
      ],
      [
        {
          degree: 2,
          quality: "min9",
          display: "ii9",
          duration: "2n",
          bassApproach: "scalar"
        },
        {
          degree: 7,
          quality: "dom13b9",
          display: "V13♭9",
          duration: "2n",
          bassApproach: "chromaticDown"
        }
      ],
      [
        {
          degree: 9,
          quality: "min9",
          display: "vi9",
          duration: "2n",
          bassApproach: "scalar"
        },
        {
          degree: 5,
          quality: "maj7sharp11",
          display: "IVΔ♯11",
          duration: "2n"
        }
      ],
      [
        {
          degree: 0,
          quality: "maj9",
          display: "Imaj9",
          duration: "2n"
        },
        {
          degree: 10,
          quality: "halfDim",
          display: "viiø",
          duration: "2n",
          bassApproach: "chromaticUp"
        }
      ],
      [
        {
          degree: 2,
          quality: "min11",
          display: "ii11",
          duration: "2n"
        },
        {
          degree: 7,
          quality: "altDom",
          display: "Valt",
          duration: "2n",
          bassApproach: "chromaticDown"
        }
      ],
      [
        { degree: 0, quality: "maj9", display: "Imaj9", duration: "1m" }
      ]
    ]
  },
  {
    label: "B",
    measures: [
      [
        { degree: 3, quality: "min9", display: "iii9", duration: "2n" },
        {
          degree: 8,
          quality: "dom13",
          display: "VI13",
          duration: "2n",
          bassApproach: "chromaticDown"
        }
      ],
      [
        { degree: 1, quality: "min11", display: "♭iii11", duration: "2n" },
        {
          degree: 6,
          quality: "dom13b9",
          display: "♭VI13♭9",
          duration: "2n",
          bassApproach: "chromaticDown"
        }
      ],
      [
        {
          degree: 11,
          quality: "dim7",
          display: "vii°",
          duration: "2n"
        },
        {
          degree: 4,
          quality: "dom13",
          display: "III13",
          duration: "2n",
          bassApproach: "chromaticDown"
        }
      ],
      [
        { degree: 9, quality: "min9", display: "vi9", duration: "2n" },
        {
          degree: 2,
          quality: "min11",
          display: "ii11",
          duration: "2n"
        }
      ],
      [
        {
          degree: 7,
          quality: "altDom",
          display: "Valt",
          duration: "2n",
          bassApproach: "chromaticDown"
        },
        {
          degree: 0,
          quality: "maj9",
          display: "Imaj9",
          duration: "2n"
        }
      ]
    ]
  },
  {
    label: "A'",
    measures: [
      [
        { degree: 0, quality: "maj9", display: "Imaj9", duration: "1m" }
      ],
      [
        {
          degree: 2,
          quality: "min9",
          display: "ii9",
          duration: "2n"
        },
        {
          degree: 7,
          quality: "dom13",
          display: "V13",
          duration: "2n",
          bassApproach: "scalar"
        }
      ],
      [
        {
          degree: 9,
          quality: "min9",
          display: "vi9",
          duration: "2n"
        },
        {
          degree: 5,
          quality: "maj7sharp11",
          display: "IVΔ♯11",
          duration: "2n"
        }
      ],
      [
        {
          degree: 0,
          quality: "maj9",
          display: "Imaj9",
          duration: "2n"
        },
        {
          degree: 7,
          quality: "dom13b9",
          display: "V13♭9",
          duration: "2n",
          bassApproach: "chromaticDown"
        }
      ],
      [
        {
          degree: 0,
          quality: "maj9",
          display: "Imaj9",
          duration: "1m"
        }
      ]
    ]
  },
  {
    label: "Tag",
    measures: [
      [
        {
          degree: 9,
          quality: "min11",
          display: "vi11",
          duration: "2n",
          bassApproach: "chromaticDown"
        },
        {
          degree: 2,
          quality: "min11",
          display: "ii11",
          duration: "2n"
        }
      ],
      [
        {
          degree: 7,
          quality: "altDom",
          display: "Valt",
          duration: "2n",
          bassApproach: "chromaticDown"
        },
        {
          degree: 0,
          quality: "maj9",
          display: "Imaj9",
          duration: "2n"
        }
      ]
    ]
  }
];

const KEYS = [
  { id: "C", label: "C Major", tonic: "C" },
  { id: "F", label: "F Major", tonic: "F" },
  { id: "Bb", label: "B♭ Major", tonic: "A#" },
  { id: "Eb", label: "E♭ Major", tonic: "D#" },
  { id: "G", label: "G Major", tonic: "G" },
  { id: "D", label: "D Major", tonic: "D" }
] as const;

const LYRICAL_MOODS = {
  titleLeadIns: [
    "Midnight velvet whispers",
    "Smoky skyline shimmer",
    "Amber neon lullaby",
    "Silk and satin stillness"
  ],
  verses: [
    "Velvet curtains sway in time with the moonlit breeze.",
    "Footsteps lace the alley, lingering in seventh chords.",
    "Trumpets paint the twilight in copper-tinted dreams.",
    "A bass line walks the sidewalk, tracing tales of where we've been."
  ],
  choruses: [
    "Hold me in the hush of this midnight reprise.",
    "Sway slow, let the city lights harmonize.",
    "Breathe deep, every blue note is home tonight.",
    "Stay close, let the skyline keep us alight."
  ],
  bridges: [
    "We tumble through syncopated constellations.",
    "The skyline riffs, trading fours with our hearts.",
    "Each echoing horn is a promise we improvise.",
    "Brushes on brass, keeping time with destiny."
  ]
};

const tempoMarks = [
  { label: "Ballad", value: 90 },
  { label: "Medium", value: 120 },
  { label: "Up", value: 148 }
];

const swingToLabel = (value: number) => {
  if (value < 0.3) return "Light swing";
  if (value < 0.65) return "Classic swing";
  return "Hard swing";
};

const noteToMidi = (note: string) => {
  const match = note.match(/^([A-G]#?)(-?\d)$/);
  if (!match) throw new Error(`Invalid note ${note}`);
  const [, pitchClass, octaveRaw] = match;
  const octave = Number(octaveRaw);
  const pitchIndex = NOTE_SEQUENCE.indexOf(pitchClass as (typeof NOTE_SEQUENCE)[number]);
  if (pitchIndex === -1) throw new Error(`Unknown pitch class ${pitchClass}`);
  return pitchIndex + (octave + 1) * 12;
};

const midiToNote = (midi: number) => {
  const octave = Math.floor(midi / 12) - 1;
  const pitch = NOTE_SEQUENCE[midi % 12];
  return `${pitch}${octave}`;
};

const transpose = (note: string, semitones: number) => {
  const midi = noteToMidi(note);
  return midiToNote(midi + semitones);
};

const buildChord = (tonic: string, degreeSemitone: number, quality: ChordQuality) => {
  const root = transpose(`${tonic}3`, degreeSemitone);
  const intervals = QUALITY_INTERVALS[quality];
  const notes = intervals.map((interval) => transpose(root, interval));
  return { root, notes };
};

const durationToBeats = (duration: string) => {
  switch (duration) {
    case "1m":
      return 4;
    case "2n":
      return 2;
    case "4n":
      return 1;
    default:
      return 4;
  }
};

const formatBeatOffset = (beat: number) => {
  const wholeBeats = Math.floor(beat);
  const sixteenths = Math.round((beat - wholeBeats) * 4);
  return `0:${wholeBeats}:${sixteenths}`;
};

const createTimeAt = (measureOffset: number, beat: number) =>
  `${measureOffset}m + ${formatBeatOffset(beat)}`;

const createBassPattern = (
  tonic: string,
  degreeSemitone: number,
  quality: ChordQuality,
  beats: number,
  measureOffset: number,
  beatStart: number,
  approach: MeasureCell["bassApproach"]
): PartEvent[] => {
  const root = transpose(`${tonic}2`, degreeSemitone);
  const rootMidi = noteToMidi(root);
  const colorInterval = QUALITY_INTERVALS[quality][1] ?? 3;
  const fifthInterval = QUALITY_INTERVALS[quality][2] ?? 7;

  const scalarPattern = [0, 2, 4, 5];
  const chordTonePattern = [0, colorInterval, fifthInterval, 10];
  const pattern = approach === "scalar" ? scalarPattern : chordTonePattern;

  return Array.from({ length: beats }).map((_, index) => {
    const isLastBeat = index === beats - 1;
    const semitone =
      pattern[index % pattern.length] +
      (isLastBeat
        ? approach === "chromaticDown"
          ? -1
          : approach === "chromaticUp"
          ? 1
          : 0
        : 0);

    const octaveLift = isLastBeat && beats >= 2 ? 12 : 0;
    const note = midiToNote(rootMidi + semitone + octaveLift);

    return {
      time: createTimeAt(measureOffset, beatStart + index),
      duration: "4n",
      notes: [note]
    };
  });
};

const buildArrangement = (tonic: string): PreparedArrangement => {
  let measureOffset = 0;
  const chordEvents: PartEvent[] = [];
  const bassEvents: PartEvent[] = [];
  const melodyEvents: PartEvent[] = [];
  const sections: GeneratedSection[] = [];

  SECTION_BLUEPRINTS.forEach((section) => {
    const sectionMeasures: string[][] = [];
    section.measures.forEach((cells) => {
      const labels: string[] = [];
      let beatCursor = 0;
      cells.forEach((cell) => {
        const { notes, root } = buildChord(tonic, cell.degree, cell.quality);
        const beats = durationToBeats(cell.duration);
        const startTime = createTimeAt(measureOffset, beatCursor);

        chordEvents.push({
          time: startTime,
          duration: cell.duration,
          notes
        });

        bassEvents.push(
          ...createBassPattern(
            tonic,
            cell.degree,
            cell.quality,
            beats,
            measureOffset,
            beatCursor,
            cell.bassApproach
          )
        );

        const melodyNote = transpose(
          root.replace(/\d$/, "4"),
          [0, 4, 7, 9][Math.floor(beatCursor) % 4] ?? 0
        );
        melodyEvents.push({
          time: createTimeAt(measureOffset, beatCursor + 0.5),
          duration: "4n.",
          notes: [melodyNote, transpose(melodyNote, -12)]
        });

        labels.push(cell.display);
        beatCursor += beats;
      });
      sectionMeasures.push(labels);
      measureOffset += 1;
    });

    sections.push({
      label: section.label,
      measures: sectionMeasures
    });
  });

  return { sections, chordEvents, bassEvents, melodyEvents };
};

const createSeededRandom = (seed: number) => {
  let currentSeed = seed;
  return () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
};

const generateLyrics = (tonicLabel: string, random: () => number) => {
  const titleLeadIn =
    LYRICAL_MOODS.titleLeadIns[Math.floor(random() * LYRICAL_MOODS.titleLeadIns.length)];
  const verse = pickUnique(LYRICAL_MOODS.verses, 2, random);
  const chorus = pickUnique(LYRICAL_MOODS.choruses, 2, random);
  const bridge = pickUnique(LYRICAL_MOODS.bridges, 1, random);

  return {
    title: `${titleLeadIn} in ${tonicLabel}`,
    verse,
    chorus,
    bridge
  };
};

const pickUnique = (collection: string[], count: number, random: () => number) => {
  const available = [...collection];
  const chosen: string[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(random() * available.length);
    chosen.push(available.splice(index, 1)[0]);
  }
  return chosen;
};

const formatTime = (bpm: number, measures: number) => {
  const beatsPerMeasure = 4;
  const totalBeats = measures * beatsPerMeasure;
  const minutes = totalBeats / bpm;
  const seconds = Math.round((minutes % 1) * 60);
  const minutesPart = Math.floor(minutes);
  return `${minutesPart}:${seconds.toString().padStart(2, "0")}`;
};

const totalMeasures = SECTION_BLUEPRINTS.reduce(
  (sum, section) => sum + section.measures.length,
  0
);

function JazzComposer() {
  const [selectedKey, setSelectedKey] = useState<(typeof KEYS)[number]>(KEYS[0]);
  const [tempo, setTempo] = useState(120);
  const [swing, setSwing] = useState(0.55);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const [lyricsSeed, setLyricsSeed] = useState(() => Math.random());

  const toneRef = useRef<ToneModule | null>(null);
  const resourcesRef = useRef<ToneResources | null>(null);

  const arrangement = useMemo(
    () => buildArrangement(selectedKey.tonic),
    [selectedKey]
  );

  const lyrics = useMemo(() => {
    const random = createSeededRandom(lyricsSeed);
    return generateLyrics(selectedKey.label, random);
  }, [lyricsSeed, selectedKey]);

  const durationEstimate = useMemo(
    () => formatTime(tempo, totalMeasures),
    [tempo]
  );

  const ensureTone = useCallback(async (): Promise<ToneModule> => {
    if (toneRef.current) {
      await toneRef.current.start();
      return toneRef.current;
    }

    setIsLoadingSound(true);
    const Tone = await import("tone");
    await Tone.start();
    toneRef.current = Tone;
    setIsLoadingSound(false);
    return Tone;
  }, []);

  const stopTransport = useCallback(() => {
    const Tone = toneRef.current;
    if (!Tone || !resourcesRef.current) return;

    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    resourcesRef.current.parts.forEach((part) => part.dispose());
    resourcesRef.current.nodes.forEach((node) => node.dispose());
    resourcesRef.current = null;
    setIsPlaying(false);
  }, []);

  const handlePlay = useCallback(async () => {
    const Tone = await ensureTone();
    if (!Tone) return;

    if (resourcesRef.current) {
      stopTransport();
    }

    const piano = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "fatsine" },
      envelope: { attack: 0.02, decay: 0.2, sustain: 0.5, release: 1.4 }
    }).toDestination();

    const bass = new Tone.MonoSynth({
      oscillator: { type: "fatsawtooth" },
      filter: { type: "lowpass", Q: 1 },
      envelope: { attack: 0.03, decay: 0.2, sustain: 0.6, release: 0.4 }
    }).connect(
      new Tone.Filter({
        type: "lowpass",
        frequency: 300,
        rolloff: -24,
        Q: 1
      }).toDestination()
    );

    const ride = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
      harmonicity: 5.1,
      modulationIndex: 24,
      resonance: 9000,
      octaves: 1.5
    }).toDestination();
    ride.frequency.value = 440;

    const melody = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.6 }
    })
      .connect(
        new Tone.Chorus({
          frequency: 1.8,
          delayTime: 3.5,
          depth: 0.6
        }).start()
      )
      .connect(
        new Tone.Reverb({
          decay: 4,
          wet: 0.25
        })
      )
      .toDestination();

    Tone.Transport.bpm.value = tempo;
    Tone.Transport.swing = swing;
    Tone.Transport.swingSubdivision = "8n";

    const pianoPart = new Tone.Part((time, event: PartEvent) => {
      piano.triggerAttackRelease(event.notes, event.duration, time);
    }, arrangement.chordEvents).start(0);

    const bassPart = new Tone.Part((time, event: PartEvent) => {
      bass.triggerAttackRelease(event.notes[0], event.duration, time);
    }, arrangement.bassEvents).start(0);

    const melodyPart = new Tone.Part((time, event: PartEvent) => {
      melody.triggerAttackRelease(event.notes, event.duration, time);
    }, arrangement.melodyEvents).start(0);

    const ridePart = new Tone.Part((time) => {
      ride.triggerAttackRelease("32n", time);
    }).start(0);

    for (let measure = 0; measure < totalMeasures * 2; measure++) {
      ridePart.add({
        time: `${measure / 2}m + 0:0:${measure % 2 === 0 ? "0" : "2"}`,
        value: null
      });
    }

    resourcesRef.current = {
      transport: Tone.Transport,
      parts: [pianoPart, bassPart, melodyPart, ridePart],
      nodes: [piano, bass, melody, ride]
    };

    Tone.Transport.position = "0:0:0";
    Tone.Transport.start("+0.2");
    setIsPlaying(true);
    setLyricsSeed(Math.random());
  }, [arrangement, ensureTone, stopTransport, swing, tempo]);

  const handleStop = useCallback(() => {
    stopTransport();
  }, [stopTransport]);

  return (
    <section className="relative z-10 grid gap-10 rounded-3xl border border-white/10 bg-midnight-900/40 p-8 shadow-xl backdrop-blur-xl md:grid-cols-[1.3fr_1fr] md:gap-12 md:p-12">
      <div className="space-y-7">
        <div className="flex flex-wrap items-center gap-4">
          {KEYS.map((key) => (
            <button
              key={key.id}
              type="button"
              onClick={() => setSelectedKey(key)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm uppercase tracking-wide transition",
                key.id === selectedKey.id
                  ? "border-brass-500 bg-brass-500/20 text-white shadow-glow"
                  : "border-white/10 text-slate-200/80 hover:border-white/30 hover:text-white"
              )}
            >
              {key.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-brass-400">
              Tempo
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-brass-500"
                type="range"
                min={84}
                max={162}
                value={tempo}
                onChange={(event) => setTempo(Number(event.target.value))}
              />
              <span className="text-lg font-medium">{tempo} BPM</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-300/80">
              {tempoMarks.map((mark) => (
                <span key={mark.label}>
                  {mark.value === tempo ? "●" : "○"} {mark.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-brass-400">
              Swing Ratio
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-brass-500"
                type="range"
                min={0.2}
                max={0.75}
                step={0.01}
                value={swing}
                onChange={(event) => setSwing(Number(event.target.value))}
              />
              <span className="text-lg font-medium">{swingToLabel(swing)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={isPlaying ? handleStop : handlePlay}
            disabled={isLoadingSound}
            className={clsx(
              "flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition",
              isPlaying
                ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "bg-brass-500 text-midnight-950 shadow-glow hover:bg-brass-400",
              isLoadingSound && "cursor-wait opacity-75"
            )}
          >
            {isPlaying ? "Stop" : "Play"} Arrangement
          </button>
          <p className="text-sm text-slate-300/80">
            Running time approx. {durationEstimate} at this tempo.
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
          {arrangement.sections.map((section) => (
            <div key={section.label}>
              <p className="text-xs uppercase tracking-[0.3em] text-brass-400">
                {section.label}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {section.measures.map((measure, index) => (
                  <div
                    key={`${section.label}-${index}`}
                    className="rounded-lg border border-white/10 bg-midnight-800/50 px-3 py-2 text-sm font-medium text-slate-100"
                  >
                    {measure.join("  •  ")}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-midnight-800/50 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-brass-400">
          Lounge Lyric Sheet
        </p>
        <h2 className="font-display text-2xl text-white">{lyrics.title}</h2>
        <div className="space-y-5 text-sm leading-relaxed text-slate-100/90">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass-400">
              Verse
            </p>
            {lyrics.verse.map((line, index) => (
              <p key={`verse-${index}`}>{line}</p>
            ))}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass-400">
              Chorus
            </p>
            {lyrics.chorus.map((line, index) => (
              <p key={`chorus-${index}`}>{line}</p>
            ))}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass-400">
              Bridge
            </p>
            {lyrics.bridge.map((line, index) => (
              <p key={`bridge-${index}`}>{line}</p>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

export default JazzComposer;
