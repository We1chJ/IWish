'use client'

import { useEffect } from 'react'

export default function LandingEffects() {
  useEffect(() => {
    // Squigglevision: cycle turbulence seeds so hand-drawn lines wiggle
    const seeds = [2, 9, 15, 4, 11, 6]
    const slow = document.querySelector('#sq feTurbulence') as SVGFETurbulenceElement | null
    const fast = document.querySelector('#sqf feTurbulence') as SVGFETurbulenceElement | null
    let i = 0, j = 0
    const t1 = setInterval(() => { if (slow) slow.setAttribute('seed', String(seeds[i = (i + 1) % seeds.length])) }, 150)
    const t2 = setInterval(() => { if (fast) fast.setAttribute('seed', String(seeds[j = (j + 2) % seeds.length])) }, 85)

    // Pointer tilt on demo cards
    const cards = document.querySelectorAll<HTMLElement>('.demo-card')
    const handlers: Array<{ card: HTMLElement; move: (e: PointerEvent) => void; leave: () => void }> = []
    cards.forEach(card => {
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        card.style.setProperty('--ty', (px * 12).toFixed(2) + 'deg')
        card.style.setProperty('--tx', (-py * 12).toFixed(2) + 'deg')
      }
      const leave = () => {
        card.style.setProperty('--ty', '0deg')
        card.style.setProperty('--tx', '0deg')
      }
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerleave', leave)
      handlers.push({ card, move, leave })
    })

    // Scroll reveal
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const groups: [string, number][] = [
        ['.iw-hero h1', 0],
        ['.iw-hero .sub', 0],
        ['.iw-hero .actions', 0],
        ['.iw-hero-cards', 0],
        ['.iw-section .iw-kicker', 0],
        ['.iw-section h2', 0],
        ['.iw-steps .iw-step', 0.12],
        ['.iw-types .iw-type-box', 0.14],
        ['.iw-footer-cta h2', 0],
        ['.iw-footer-cta p', 0],
        ['.iw-footer-cta .iw-btn', 0],
      ]

      const pending: HTMLElement[] = []
      const vh = () => window.innerHeight || document.documentElement.clientHeight || 99999
      const fold = vh() * 0.92

      groups.forEach(([sel, step]) => {
        document.querySelectorAll<HTMLElement>(sel).forEach((el, idx) => {
          el.classList.add('reveal')
          el.style.setProperty('--rr', (idx % 2 ? 1.4 : -1.4) + 'deg')
          if (el.getBoundingClientRect().top > fold) {
            el.style.setProperty('--d', (step * idx).toFixed(2) + 's')
            el.classList.add('pre')
            pending.push(el)
          }
        })
      })

      let ticking = false
      const check = () => {
        const trigger = vh() * 0.9
        for (let k = pending.length - 1; k >= 0; k--) {
          if (pending[k].getBoundingClientRect().top < trigger) {
            pending[k].classList.remove('pre')
            pending.splice(k, 1)
          }
        }
        if (!pending.length) window.removeEventListener('scroll', onScroll)
      }
      const onScroll = () => {
        if (!ticking) { ticking = true; requestAnimationFrame(() => { check(); ticking = false }) }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      check()

      const fallback = setTimeout(() => {
        pending.slice().forEach(el => {
          el.classList.remove('pre')
          el.style.transition = 'none'
          el.style.opacity = '1'
          el.style.transform = 'none'
          void el.offsetWidth
          el.style.removeProperty('transition')
          el.style.removeProperty('opacity')
          el.style.removeProperty('transform')
        })
      }, 1800)

      return () => {
        clearInterval(t1)
        clearInterval(t2)
        handlers.forEach(({ card, move, leave }) => {
          card.removeEventListener('pointermove', move)
          card.removeEventListener('pointerleave', leave)
        })
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        clearTimeout(fallback)
      }
    }

    return () => {
      clearInterval(t1)
      clearInterval(t2)
      handlers.forEach(({ card, move, leave }) => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerleave', leave)
      })
    }
  }, [])

  return null
}
