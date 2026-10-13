import Reveal, { ScrollWords, SplitWords } from './Reveal';

export default function SectionHead({ eyebrow, title, intro, scrub = false }) {
  return (
    <div className="section-head">
      <div>
        <Reveal as="p" className="eyebrow" blur={false} y={12}>{eyebrow}</Reveal>
        {scrub
          ? <ScrollWords as="h2" className="section-title section-title-lg" text={title} />
          : <SplitWords as="h2" className="section-title" segments={title} delay={0.08} />}
      </div>
      {intro && <Reveal as="p" className="section-intro" delay={0.25}>{intro}</Reveal>}
    </div>
  );
}
