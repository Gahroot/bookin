export interface Option {
  value: string
  label: string
  description?: string
}

export const BUSINESS_TYPES: Option[] = [
  { value: 'real-estate', label: 'Real estate fund / operator' },
  { value: 'agency', label: 'Agency / Consultancy' },
  { value: 'saas', label: 'SaaS / Tech company' },
  { value: 'ecommerce', label: 'E-commerce / Retail' },
  { value: 'services', label: 'Professional services' },
  { value: 'other', label: 'Other' },
]

export const REVENUE_OPTIONS: Option[] = [
  { value: 'pre-revenue', label: 'Pre-revenue' },
  { value: '0-100k', label: '$0 - $100K' },
  { value: '100k-500k', label: '$100K - $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m-5m', label: '$1M - $5M' },
  { value: '5m+', label: '$5M+' },
]

export const PROJECT_TYPES: Option[] = [
  {
    value: 'ai-agents',
    label: 'AI agents',
    description: 'Agents that do real work in your systems',
  },
  {
    value: 'data-platform',
    label: 'Data platform / MCP',
    description: 'Ask ChatGPT or Claude about your own data',
  },
  {
    value: 'automation',
    label: 'Workflow automation',
    description: 'Eliminate manual, repeated work',
  },
  {
    value: 'integrations',
    label: 'System integrations',
    description: 'Connect your tools and platforms',
  },
  { value: 'full-stack', label: 'Custom software', description: 'Internal tools and platforms' },
  { value: 'consulting', label: 'Strategy', description: 'Not sure yet, need guidance' },
]

export const TIMELINES: Option[] = [
  { value: 'asap', label: 'ASAP', description: 'Urgent' },
  { value: '1-2-weeks', label: '1-2 weeks', description: 'Quick turnaround' },
  { value: '1-month', label: 'Within a month', description: 'Standard timeline' },
  { value: '1-3-months', label: '1-3 months', description: 'Flexible' },
  { value: 'exploring', label: 'Just exploring', description: 'Gathering information' },
]

export const BUDGETS: Option[] = [
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-5k', label: '$1,000 - $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k+', label: '$25,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
]
