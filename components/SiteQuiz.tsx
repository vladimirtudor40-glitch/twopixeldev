'use client';

import { useState } from 'react';
import { site } from '@/site.config';
import { questions, recommend, templates, type TemplateId } from '@/lib/quiz';
import SitePreview from './SitePreview';
import WhatsAppIcon from './WhatsAppIcon';
import '@/app/quiz.css';

/**
 * "Ce site ți se potrivește?": a 4-question quiz that recommends one of 5 site templates.
 * The preview on the right follows the leading template while the visitor answers, and any
 * template can be browsed from the tabs under it. The result ends in a WhatsApp/email CTA
 * with the answers already written into the message. Nothing is sent or stored by the site.
 */
export default function SiteQuiz() {
  const [picks, setPicks] = useState<number[]>([]);
  const [shown, setShown] = useState<TemplateId | null>(null); // a template picked from the tabs

  const step = picks.length;
  const done = step >= questions.length;
  const best = picks.length ? recommend(picks) : null;
  const view = shown ?? best ?? templates[0].id;
  const tpl = templates.find((x) => x.id === (best ?? view))!;

  const answer = (i: number) => { setPicks([...picks, i]); setShown(null); };
  const back = () => { setPicks(picks.slice(0, -1)); setShown(null); };
  const restart = () => { setPicks([]); setShown(null); };

  const message = () => {
    const lines = questions.map((q, i) => `${q.q} ${q.answers[picks[i]]?.label ?? '-'}`);
    return `Bună! Am completat chestionarul de pe twopixeldev.com și mi se potrivește șablonul „${tpl.name}” (${tpl.genre}).\n\n${lines.join('\n')}\n\nAș vrea o ofertă.`;
  };
  const wa = () => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message())}`;
  const mail = () => `mailto:${site.email}?subject=${encodeURIComponent(`Ofertă site: șablonul ${tpl.name}`)}&body=${encodeURIComponent(message())}`;

  const q = questions[step];
  return (
    <div className="quiz">
      <div className="quiz-panel" aria-live="polite">
        <div className="quiz-progress" aria-label={`Pasul ${Math.min(step + 1, questions.length)} din ${questions.length}`}>
          {questions.map((x, i) => <i key={x.id} className={i < step ? 'done' : i === step ? 'now' : ''} />)}
        </div>

        {!done ? (
          <div key={q.id} className="quiz-step">
            <p className="quiz-n">Întrebarea {step + 1} din {questions.length}</p>
            <h3>{q.q}</h3>
            {q.hint && <p className="quiz-hint">{q.hint}</p>}
            <div className="quiz-answers">
              {q.answers.map((a, i) => (
                <button key={a.label} type="button" className="quiz-opt" onClick={() => answer(i)}>{a.label}</button>
              ))}
            </div>
            {step > 0 && <button type="button" className="quiz-link" onClick={back}>← Înapoi</button>}
          </div>
        ) : (
          <div className="quiz-step quiz-result">
            <p className="quiz-n">Recomandarea noastră</p>
            <h3>Șablonul <span>{tpl.name}</span></h3>
            <p className="quiz-genre">{tpl.genre}</p>
            <p className="quiz-pitch">{tpl.pitch}</p>
            <ul className="quiz-feat">{tpl.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <p className="quiz-hint">{tpl.from} Îl adaptăm la numele, culorile și conținutul tău.</p>
            <div className="cta">
              {site.whatsapp && (
                <a className="gbtn gbtn-wa" href={wa()} target="_blank" rel="noopener"><WhatsAppIcon /> Cere ofertă pe WhatsApp</a>
              )}
              <a className="gbtn gbtn-primary" href={mail()}>Cere ofertă pe email</a>
            </div>
            <p className="quiz-small">Mesajul se completează cu răspunsurile tale; îl poți modifica înainte să-l trimiți. <button type="button" className="quiz-link" onClick={restart}>Reia chestionarul</button></p>
          </div>
        )}
      </div>

      <div className="quiz-view">
        <div className="quiz-stage">
          <SitePreview key={view} id={view} />
        </div>
        <div className="quiz-tabs" role="group" aria-label="Vezi șabloanele">
          {templates.map((x) => (
            <button
              key={x.id}
              type="button"
              className={`quiz-tab${x.id === view ? ' on' : ''}${x.id === best ? ' best' : ''}`}
              aria-pressed={x.id === view}
              onClick={() => setShown(x.id)}
            >
              <b>{x.name}</b>
              <span>{x.genre.split(',')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
