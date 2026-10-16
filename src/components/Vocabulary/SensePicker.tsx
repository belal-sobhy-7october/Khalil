import { sameDefinition, type Sense } from '../../lib/senseRank';

const short = (text: string, max = 90) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

/**
 * Lets the user choose which dictionary sense a word should keep. Shows
 * "custom" when the definition was typed or edited by hand.
 */
export default function SensePicker({
  senses,
  definition,
  label,
  onPick,
}: {
  senses: Sense[];
  definition: string;
  label: string;
  onPick: (sense: Sense) => void;
}) {
  const current = senses.findIndex((s) => sameDefinition(s.definition, definition));
  return (
    <select
      value={current}
      onChange={(e) => {
        const sense = senses[Number(e.target.value)];
        if (sense) onPick(sense);
      }}
      aria-label={label}
      title={label}
      dir="ltr"
      className="w-full px-2 py-1 bg-card border border-border-subtle rounded text-xs text-ink-light focus:outline-none focus:border-clay-soft"
    >
      {current === -1 && <option value={-1}>{label}</option>}
      {senses.map((s, i) => (
        <option key={i} value={i}>
          {`${i + 1}. ${s.pos ? `(${s.pos}) ` : ''}${short(s.definition)}`}
        </option>
      ))}
    </select>
  );
}
