import Link from 'next/link'
import LandingEffects from '@/components/LandingEffects'

export default function Home() {
  return (
    <>
      {/* Squigglevision SVG filter */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="sq">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={2} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={2.6} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="sqf">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={2} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <LandingEffects />

      <header className="iw-header">
        <Link className="iw-logo" href="/">
          <span className="mark">★</span>IWish
        </Link>
        <nav className="iw-nav">
          <a href="#how">How it works</a>
          <a href="#types">The two cards</a>
          <a href="#wall">The wall</a>
          <Link className="iw-nav-cta" href="/auth/signup">Join →</Link>
        </nav>
      </header>

      <section className="iw-hero">
        <div>
          <h1>Say what you <span className="u">wish</span> for.<br />Show what you <span className="u">have</span>.</h1>
          <p className="sub">A little wall where people post the things they want in life — and the things they already have that someone else is dreaming of.</p>
          <div className="actions">
            <Link className="iw-btn primary" href="/auth/signup">Start posting</Link>
            <a className="iw-btn" href="#how">See how it works</a>
            <span className="iw-hint">set up your wall in a minute →</span>
          </div>
        </div>
        <div className="iw-hero-cards">
          <div className="demo-card card-wish rough">
            <span className="type-flag"><span className="ic">○</span> I WISH</span>
            <div className="pic"><span className="cap">a tiny cabin in the woods</span></div>
            <h4>A cabin to disappear to</h4>
            <p className="desc">Somewhere quiet with a wood stove and zero wifi. One day.</p>
            <div className="foot"><span className="iw-tag">travel</span><span>♡ 42 also wish this</span></div>
          </div>
          <div className="demo-card card-have rough">
            <span className="type-flag"><span className="ic">●</span> I HAVE</span>
            <div className="pic"><span className="cap">grandpa&apos;s old film camera</span></div>
            <h4>A 1973 film camera</h4>
            <p className="desc">Still works. Happy to teach someone how to load it.</p>
            <div className="foot"><span className="iw-tag">objects</span><span>● @mira · online</span></div>
          </div>
        </div>
      </section>

      <hr className="iw-rule" />

      <section className="iw-section" id="how">
        <p className="iw-kicker">HOW IT WORKS</p>
        <h2>Three steps. That&apos;s the whole thing.</h2>
        <div className="iw-steps">
          <div className="iw-step rough"><span className="n">1</span><h3>Post a wish</h3><p>Doodle it or describe it. The stuff you want in your life, big or small, silly or serious.</p></div>
          <div className="iw-step rough"><span className="n">2</span><h3>Post what you have</h3><p>The things you&apos;ve got that others don&apos;t — a skill, an object, a place, an experience to share.</p></div>
          <div className="iw-step rough"><span className="n">3</span><h3>Look at others</h3><p>Someone&apos;s wish is your have. Browse the wall, tap a card, and add any that you forget.</p></div>
        </div>
      </section>

      <hr className="iw-rule" />

      <section className="iw-section" id="types">
        <p className="iw-kicker">THE TWO CARDS</p>
        <h2>Everything here is one of two things.</h2>
        <div className="iw-types">
          <div className="iw-type-box dashed">
            <div className="iw-type-ic">○</div>
            <div>
              <h3>I wish</h3>
              <p>Dashed border = still a dream. The things you&apos;re hoping to find, learn, see, or be given someday.</p>
            </div>
          </div>
          <div className="iw-type-box">
            <div className="iw-type-ic">●</div>
            <div>
              <h3>I have</h3>
              <p>Solid border = it&apos;s real. The things already in your life that you&apos;d happily share, lend, teach, or pass on.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="iw-strip">
        <div className="iw-marquee">
          <span className="w">learn to sail</span><span>a spare bike</span><span className="w">a pen pal in Japan</span><span>homemade sourdough starter</span><span className="w">see the northern lights</span><span>vintage vinyl records</span><span className="w">someone to fix my fence</span><span>a quiet desk to write at</span>
          <span className="w">learn to sail</span><span>a spare bike</span><span className="w">a pen pal in Japan</span><span>homemade sourdough starter</span><span className="w">see the northern lights</span><span>vintage vinyl records</span><span className="w">someone to fix my fence</span><span>a quiet desk to write at</span>
        </div>
      </div>

      <section className="iw-footer-cta" id="wall">
        <h2>What do you wish for?</h2>
        <p>Add it to the wall. Someone out there might already have it.</p>
        <Link className="iw-btn primary" href="/auth/signup" style={{ fontSize: '24px', padding: '15px 40px' }}>Open the wall →</Link>
      </section>

      <footer className="iw-footer">
        <Link className="iw-logo" href="/">
          <span className="mark" style={{ width: '24px', height: '24px', fontSize: '15px' }}>★</span>IWish
        </Link>
        <span>
          built by <a className="iw-footer-link" href="https://github.com/We1chJ" target="_blank" rel="noopener noreferrer">@We1chJ</a>
          {' · '}
          <a className="iw-footer-link iw-star-link" href="https://github.com/We1chJ/IWish" target="_blank" rel="noopener noreferrer">★ star on GitHub</a>
        </span>
      </footer>
    </>
  )
}
