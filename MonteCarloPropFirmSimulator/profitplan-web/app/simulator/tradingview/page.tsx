"use client";

import { useMemo, useState } from 'react';
import { LogoutButton } from '@/components/LogoutButton';

type RulesetKey = 'apex_50k_legacy' | 'apex_50k_eod' | 'alpha_futures_50k_zero';

const RULESET_OPTIONS: Array<{
    key: RulesetKey;
    label: string;
    subtitle: string;
    color: string;
    logo: JSX.Element;
}> = [
        {
            key: 'apex_50k_legacy',
            label: 'Apex 50K Legacy',
            subtitle: 'Default',
            color: '#4F8BFF',
            logo: (
                <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                    <path d="M6 24L16 6L26 24H20L16 16L12 24Z" fill="#4F8BFF" />
                </svg>
            ),
        },
        {
            key: 'apex_50k_eod',
            label: 'Apex 50K EOD',
            subtitle: 'End-of-day trailing',
            color: '#2F6EEB',
            logo: (
                <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                    <path d="M6 24L16 6L26 24H20L16 16L12 24Z" fill="#2F6EEB" />
                    <circle cx="24.5" cy="8.5" r="5.5" fill="#1B4FC9" />
                    <path d="M22 8.7L24 10.6L27.4 7.2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            key: 'alpha_futures_50k_zero',
            label: 'Alpha Futures 50K Zero',
            subtitle: 'Static DD profile',
            color: '#12B76A',
            logo: (
                <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                    <path d="M16 5L28 27H4Z" fill="#12B76A" />
                    <path d="M16 11L21.2 21H10.8Z" fill="#0B0B0F" opacity="0.42" />
                </svg>
            ),
        },
    ];

export default function TradingViewSimulator() {
    const [ruleset, setRuleset] = useState<RulesetKey>('apex_50k_legacy');

    const simulatorSrc = useMemo(
        () => `/simulator-ui.html?v=20260324g&uploadMode=tradingview&ruleset=${ruleset}`,
        [ruleset]
    );

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0B0B0F' }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(16, 35, 80, 0.55), rgba(9, 14, 28, 0.72))',
                border: '1px solid rgba(79, 139, 255, 0.35)',
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                margin: '1rem 1rem 0.75rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                fontSize: '0.9rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#C9DCFF', fontWeight: 700 }}>TradingView Prop Account Mode</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <a href="/simulator/mt5" style={{
                            fontSize: '0.78rem',
                            padding: '0.35rem 0.72rem',
                            borderRadius: '7px',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#A4AFBF',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                        }}>Switch to MT5</a>
                        <a href="/simulator/ninjatrader" style={{
                            fontSize: '0.78rem',
                            padding: '0.35rem 0.72rem',
                            borderRadius: '7px',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#A4AFBF',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                        }}>Switch to NinjaTrader</a>
                        <LogoutButton />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
                    {RULESET_OPTIONS.map((option) => {
                        const isActive = ruleset === option.key;
                        return (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => setRuleset(option.key)}
                                style={{
                                    position: 'relative',
                                    borderRadius: '10px',
                                    border: isActive ? `1px solid ${option.color}` : '1px solid rgba(255,255,255,0.12)',
                                    background: isActive ? `linear-gradient(180deg, ${option.color}22, rgba(255,255,255,0.02))` : 'rgba(255,255,255,0.02)',
                                    color: '#EAF0FF',
                                    padding: '0.52rem 0.78rem',
                                    minWidth: '208px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.62rem',
                                    cursor: 'pointer',
                                    boxShadow: isActive ? `0 0 0 1px ${option.color}33, 0 10px 24px ${option.color}29` : 'none',
                                    transition: 'all 0.18s ease'
                                }}
                            >
                                {isActive && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 10,
                                            right: 10,
                                            height: 2,
                                            borderRadius: 2,
                                            background: option.color
                                        }}
                                    />
                                )}
                                <span style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? `${option.color}99` : 'rgba(255,255,255,0.16)'}`,
                                    background: 'rgba(9, 13, 24, 0.86)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {option.logo}
                                </span>
                                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                                    <span style={{ fontSize: '0.81rem', fontWeight: 700 }}>{option.label}</span>
                                    <span style={{ fontSize: '0.66rem', color: isActive ? '#D8E5FF' : '#90A2BF' }}>{option.subtitle}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <iframe
                key={ruleset}
                src={simulatorSrc}
                style={{ flex: 1, border: 'none', borderRadius: '8px', margin: '0 1rem 1rem 1rem' }}
            />
        </div>
    );
}
