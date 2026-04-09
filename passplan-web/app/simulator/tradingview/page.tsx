'use client';

import { useState } from 'react';
import { LogoutButton } from '@/components/LogoutButton';

type RulesetKey = 'apex_50k_legacy' | 'apex_50k_eod' | 'alpha_futures_50k_zero';

const RULESETS: {
    key: RulesetKey;
    label: string;
    sublabel: string;
    logo: JSX.Element;
    accent: string;
    accentFaint: string;
    border: string;
    borderActive: string;
}[] = [
    {
        key: 'apex_50k_legacy',
        label: 'Apex 50K',
        sublabel: 'Legacy Rules',
        accent: '#4B8BFF',
        accentFaint: 'rgba(75, 139, 255, 0.12)',
        border: 'rgba(75, 139, 255, 0.22)',
        borderActive: 'rgba(75, 139, 255, 0.75)',
        logo: (
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                <path d="M14 1 L27 20 L1 20 Z" stroke="#4B8BFF" strokeWidth="2" fill="none" strokeLinejoin="round" />
                <path d="M14 7 L21 20 L7 20 Z" fill="#4B8BFF" fillOpacity="0.35" />
            </svg>
        ),
    },
    {
        key: 'apex_50k_eod',
        label: 'Apex 50K',
        sublabel: 'EOD Rules',
        accent: '#7B9FFF',
        accentFaint: 'rgba(123, 159, 255, 0.12)',
        border: 'rgba(123, 159, 255, 0.22)',
        borderActive: 'rgba(123, 159, 255, 0.75)',
        logo: (
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                <path d="M14 1 L27 20 L1 20 Z" stroke="#7B9FFF" strokeWidth="2" fill="none" strokeLinejoin="round" />
                <path d="M14 7 L21 20 L7 20 Z" fill="#7B9FFF" fillOpacity="0.35" />
                <circle cx="23" cy="6" r="4" fill="#7B9FFF" fillOpacity="0.25" stroke="#7B9FFF" strokeWidth="1.2" />
                <path d="M21.5 6 L23 7.5 L25 5" stroke="#7B9FFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        key: 'alpha_futures_50k_zero',
        label: 'Alpha Futures',
        sublabel: '50K Zero',
        accent: '#00C47A',
        accentFaint: 'rgba(0, 196, 122, 0.12)',
        border: 'rgba(0, 196, 122, 0.22)',
        borderActive: 'rgba(0, 196, 122, 0.75)',
        logo: (
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                <path d="M14 2 L24 19 L4 19 Z" stroke="#00C47A" strokeWidth="2" fill="none" strokeLinejoin="round" />
                <path d="M14 2 L19 11 L9 11 Z" fill="#00C47A" fillOpacity="0.4" />
                <line x1="14" y1="11" x2="14" y2="19" stroke="#00C47A" strokeWidth="1.5" />
            </svg>
        ),
    },
];

export default function TradingViewSimulator() {
    const [activeRuleset, setActiveRuleset] = useState<RulesetKey>('apex_50k_legacy');

    const iframeSrc = `/simulator-ui.html?v=20260324d&uploadMode=tradingview&ruleset=${activeRuleset}`;

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0B0B0F' }}>

            {/* Top nav bar */}
            <div style={{
                background: 'rgba(138, 43, 226, 0.15)',
                border: '1px solid rgba(138, 43, 226, 0.45)',
                borderRadius: '8px',
                padding: '0.8rem 1rem',
                margin: '1rem 1rem 0 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.9rem'
            }}>
                <span style={{ color: '#c991ff', fontWeight: 600 }}>📊 TradingView Prop Account Mode</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <a href="/simulator/mt5" style={{
                        fontSize: '0.78rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'transparent',
                        color: '#666',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                    }}>Switch to MT5</a>
                    <a href="/simulator/ninjatrader" style={{
                        fontSize: '0.78rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'transparent',
                        color: '#666',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                    }}>Switch to NinjaTrader</a>
                    <LogoutButton />
                </div>
            </div>

            {/* Ruleset selector */}
            <div style={{
                margin: '0.75rem 1rem 0 1rem',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'stretch',
            }}>
                {RULESETS.map((rs) => {
                    const active = activeRuleset === rs.key;
                    return (
                        <button
                            key={rs.key}
                            onClick={() => setActiveRuleset(rs.key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.65rem',
                                padding: '0.55rem 1.1rem 0.55rem 0.85rem',
                                borderRadius: '9px',
                                border: `1px solid ${active ? rs.borderActive : rs.border}`,
                                background: active ? rs.accentFaint : 'rgba(255,255,255,0.03)',
                                cursor: 'pointer',
                                transition: 'all 0.18s ease',
                                outline: 'none',
                                boxShadow: active ? `0 0 14px ${rs.accentFaint}` : 'none',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Active indicator pill */}
                            {active && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: rs.accent,
                                    borderRadius: '9px 9px 0 0',
                                }} />
                            )}

                            {/* Logo icon */}
                            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                {rs.logo}
                            </div>

                            {/* Text */}
                            <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                                <div style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    color: active ? rs.accent : '#888',
                                    letterSpacing: '0.02em',
                                    transition: 'color 0.18s',
                                }}>
                                    {rs.label}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: active ? `${rs.accent}cc` : '#555',
                                    fontWeight: 400,
                                    transition: 'color 0.18s',
                                }}>
                                    {rs.sublabel}
                                </div>
                            </div>

                            {/* Active dot */}
                            {active && (
                                <div style={{
                                    marginLeft: 'auto',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: rs.accent,
                                    boxShadow: `0 0 6px ${rs.accent}`,
                                    flexShrink: 0,
                                }} />
                            )}
                        </button>
                    );
                })}

                {/* Spacer + active label */}
                <div style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    paddingRight: '0.25rem',
                }}>
                    <span style={{ fontSize: '0.72rem', color: '#444' }}>Ruleset:</span>
                    <span style={{
                        fontSize: '0.72rem',
                        color: RULESETS.find(r => r.key === activeRuleset)?.accent ?? '#888',
                        fontWeight: 600,
                    }}>
                        {RULESETS.find(r => r.key === activeRuleset)?.label} — {RULESETS.find(r => r.key === activeRuleset)?.sublabel}
                    </span>
                </div>
            </div>

            {/* Simulator iframe */}
            <iframe
                key={activeRuleset}
                src={iframeSrc}
                style={{ flex: 1, border: 'none', borderRadius: '8px', margin: '0.75rem 1rem 1rem 1rem' }}
            />
        </div>
    );
}
