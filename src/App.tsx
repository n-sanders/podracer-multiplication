import { useEffect, useState } from 'react';
import { setMuted, sfx } from './audio/sound';
import { applyResult, defaultSave, getFamily, loadSave, writeSave, type ProgressEvent, type RaceResult, type SaveData } from './game/progress';
import type { RaceSetup } from './game/race';
import { buildFamilySetup, buildGrandPrixSetup } from './game/setups';
import { RANK_ORDER, type FamilyActivity, type Launch, type Rank } from './game/types';
import { GrandPrixSetup } from './screens/GrandPrixSetup';
import { Hangar } from './screens/Hangar';
import { RaceScreen } from './screens/RaceScreen';
import { Results } from './screens/Results';

type View =
  | { name: 'hangar' }
  | { name: 'gp-setup' }
  | { name: 'race'; launch: Launch; setup: RaceSetup; runId: number; testRun: boolean }
  | { name: 'results'; launch: Launch; result: RaceResult; events: ProgressEvent[] };

const TEST_TOOLS_ENABLED = import.meta.env.DEV || new URLSearchParams(window.location.search).has('test');

function buildSetup(launch: Launch, save: SaveData, rankOverride: Rank | null): RaceSetup {
  return launch.kind === 'grandprix'
    ? buildGrandPrixSetup(launch.families)
    : buildFamilySetup(launch.activity, launch.family, rankOverride ?? getFamily(save, launch.family).rank);
}

export function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [view, setView] = useState<View>({ name: 'hangar' });
  const [rankOverride, setRankOverride] = useState<Rank | null>(null);

  useEffect(() => setMuted(save.settings.muted), [save.settings.muted]);

  const commit = (next: SaveData) => {
    setSave(next);
    writeSave(next);
  };

  const launch = (l: Launch) => {
    sfx.click();
    setView({
      name: 'race',
      launch: l,
      setup: buildSetup(l, save, rankOverride),
      runId: Date.now(),
      testRun: rankOverride !== null,
    });
  };

  const launchFamily = (family: number, activity: FamilyActivity) => launch({ kind: 'family', family, activity });

  const toHangar = () => setView({ name: 'hangar' });

  return (
    <div className="app">
      <nav className="top-nav">
        <button type="button" className="brand" onClick={toHangar}>
          <span className="brand-mark" aria-hidden>
            ✦
          </span>
          Multiplication Pod Racer
        </button>
        <div className="nav-tools">
          {TEST_TOOLS_ENABLED && (
            <label className={`test-rank ${rankOverride ? 'active' : ''}`}>
              {rankOverride ? `TEST RANK ${rankOverride}` : 'Test rank'}
              <select
                value={rankOverride ?? ''}
                onChange={(e) => setRankOverride((e.target.value || null) as Rank | null)}
              >
                <option value="">Off</option>
                {RANK_ORDER.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            type="button"
            className="btn ghost small"
            aria-pressed={!save.settings.muted}
            onClick={() => commit({ ...save, settings: { ...save.settings, muted: !save.settings.muted } })}
          >
            {save.settings.muted ? 'Sound: off' : 'Sound: on'}
          </button>
        </div>
      </nav>

      <main>
        {view.name === 'hangar' && (
          <Hangar
            save={save}
            onLaunch={launchFamily}
            onGrandPrix={() => setView({ name: 'gp-setup' })}
            onReset={() => {
              commit({ ...defaultSave(), settings: save.settings });
              toHangar();
            }}
          />
        )}

        {view.name === 'gp-setup' && (
          <GrandPrixSetup save={save} onBack={toHangar} onStart={(families) => launch({ kind: 'grandprix', families })} />
        )}

        {view.name === 'race' && (
          <RaceScreen
            key={view.runId}
            launch={view.launch}
            setup={view.setup}
            onQuit={toHangar}
            onFinish={(result) => {
              const out = applyResult(save, view.launch, result);
              if (!view.testRun) commit(out.save);
              setView({ name: 'results', launch: view.launch, result, events: out.events });
            }}
          />
        )}

        {view.name === 'results' && (
          <Results
            launch={view.launch}
            result={view.result}
            events={view.events}
            save={save}
            onRetry={() => launch(view.launch)}
            onNext={(activity) => view.launch.kind === 'family' && launchFamily(view.launch.family, activity)}
            onHangar={toHangar}
          />
        )}
      </main>
    </div>
  );
}
