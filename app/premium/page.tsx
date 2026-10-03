'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  { name: 'Monthly', price: '$12', suffix: '/month', description: 'Flexible access while you find your rhythm.', featured: false },
  { name: 'Annual', price: '$89', suffix: '/year', description: 'The best value for consistent learners.', featured: true, note: 'Save 38%' },
]
const benefits = ['Unlimited access to premium courses', 'Certificates for completed courses', 'New courses added every month', 'Downloadable resources and templates', 'Priority learner support', 'Learn on any device, at your pace']

export default function PremiumPage() {
  const [selected, setSelected] = useState('Annual')
  const plan = plans.find((item) => item.name === selected) ?? plans[1]

  return (
    <main className="premium-page">
      <section className="premium-hero"><div className="premium-hero-copy"><p className="eyebrow">TORVAN PREMIUM</p><h1>Give your curiosity <em>room to grow.</em></h1><p>One membership. Every premium course, certificate, and resource you need to keep moving forward.</p><a className="premium-hero-link" href="#plans">See membership options <span aria-hidden="true">↓</span></a></div><div className="premium-orbit" aria-hidden="true"><span>LEARN</span><strong>WITHOUT<br />LIMITS</strong><small>COURSES · SKILLS · MOMENTUM</small></div></section>
      <section className="premium-content" id="plans"><div className="premium-benefits"><p className="eyebrow">WHAT&apos;S INCLUDED</p><h2>Everything you need to learn with intention.</h2><ul>{benefits.map((benefit) => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul></div><div className="pricing-panel"><div className="pricing-toggle" role="tablist" aria-label="Billing frequency">{plans.map((item) => <button key={item.name} className={selected === item.name ? 'active' : ''} type="button" role="tab" aria-selected={selected === item.name} onClick={() => setSelected(item.name)}>{item.name}{item.note && <small>{item.note}</small>}</button>)}</div><div className="selected-plan"><p className="eyebrow">{plan.name.toUpperCase()} MEMBERSHIP</p><div className="selected-price"><strong>{plan.price}</strong><span>{plan.suffix}</span></div><p>{plan.description}</p><button className="premium-join" type="button">Start learning premium</button><small className="fine-print">Cancel anytime. No hidden fees.</small></div></div></section><section className="premium-bottom"><p>Prefer to learn one course at a time?</p><Link href="/courses">Browse the course library <span aria-hidden="true">→</span></Link></section></main>
  )
}

