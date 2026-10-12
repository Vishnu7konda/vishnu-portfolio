import { FadeIn, SplitText } from '../components/Anim';
import { usePortfolio } from '../lib/data';
import { pad } from '../lib/hooks';

export default function Skills() {
  const data = usePortfolio();
  const skills = data?.skills ?? [];

  return (
    <section id="skills" className="services">
      <div className="container">
        <FadeIn className="eyebrow-row">
          <span className="mono">( Services )</span>
          <span className="mono">What I bring</span>
        </FadeIn>

        <div className="section-head">
          <h2 className="display">
            <SplitText text="What I *do*" />
          </h2>
          <FadeIn as="p" className="section-intro" delay={0.2}>
            The disciplines and tools I use to take products from first idea to launch.
          </FadeIn>
        </div>

        <ul className="svc-list">
          {skills.map((s, i) => (
            <FadeIn as="li" key={s.id} className="svc-row" delay={i * 0.06} amount={0.4}>
              <span className="svc-num mono">{pad(i + 1)}</span>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
              <span className="svc-icon" aria-hidden="true"><i className={s.icon}></i></span>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
