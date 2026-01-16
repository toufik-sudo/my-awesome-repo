export const kpisMocks = [
  {
    title: 'users',
    value: 15000,
    subtitle: 'users',
    active: true,
    charts: [
      {
        label: 'active.users',
        value: 13450,
        color: 'secondary',
        percent: 100
      },
      { label: 'pending.users', value: 450, color: 'warning', percent: 80 },
      {
        label: 'blocked.users',
        value: 100,
        color: 'danger',
        percent: 30
      }
    ]
  },
  {
    title: 'results',
    value: 15000,
    subtitle: 'declarations',
    active: false,
    charts: [
      {
        label: 'declaration.volume',
        value: 7000,
        color: 'primary',
        percent: 100
      },
      { label: 'declaration.validated', value: 6000, color: 'primary-light', percent: 80 },
      {
        label: 'declaration.declined',
        value: 1000,
        color: 'danger',
        percent: 30
      }
    ]
  },
  {
    title: 'rewards',
    value: 15000,
    subtitle: 'points',
    active: false,
    charts: [
      {
        label: 'awarded.points',
        value: 7000,
        color: 'primary',
        percent: 100
      },
      { label: 'converted.points', text: 'coming.soon' },
      { label: 'pending.points', text: 'coming.soon' },
      { label: 'expired.points', text: 'coming.soon' }
    ]
  },
  {
    title: 'revenue',
    value: 15000,
    subtitle: 'in.revenue',
    active: false,
    charts: [
      {
        label: 'generated.revenue',
        value: 100000,
        color: 'secondary',
        percent: 100
      },
      { label: 'validated.revenue', value: 75000, color: 'primary', percent: 80 },
      {
        label: 'declined.revenue',
        value: 2500,
        color: 'danger',
        percent: 30
      },
      { label: 'points.budget', text: 'coming.soon' }
    ]
  }
];
