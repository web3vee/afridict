export function useAdminColors() {
  return {
    colorMode:           'dark' as const,
    adminBg:             '#07090f',
    adminSidebarBg:      '#0c1220',
    adminCardBg:         '#0f1623',
    adminBorderColor:    '#1e293b',
    adminRowBorder:      '#0d1420',
    adminHeadingColor:   'white',
    adminSubtextColor:   '#64748b',
    adminMutedColor:     '#475569',
    adminSecondaryColor: '#94a3b8',
    adminInputBg:        '#1e293b',
    adminInputBorder:    '#374151',
    adminHoverBg:        'rgba(255,255,255,0.02)',
    adminSidebarHoverBg: 'rgba(255,255,255,0.03)',
    adminQuoteBg:        '#0c1220',
    adminInputColor:     '#94a3b8',
    adminBarTrackBg:     '#1e293b',
  };
}
