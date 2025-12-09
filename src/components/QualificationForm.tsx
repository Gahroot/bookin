import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  DollarSign,
  Target,
  Clock,
  User,
  CheckCircle,
  Briefcase,
  Rocket,
  Users,
  Zap,
} from 'lucide-react'

// Types
export interface QualificationData {
  businessType: string
  revenue: string
  projectType: string
  timeline: string
  budget: string
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  projectDetails: string
}

interface QualificationFormProps {
  onComplete: (data: QualificationData) => void
}

type Step = {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
}

const STEPS: Step[] = [
  {
    id: 'businessType',
    title: 'What best describes your business?',
    subtitle: 'Help us understand who we\'re working with',
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    id: 'revenue',
    title: 'What\'s your current annual revenue?',
    subtitle: 'This helps us recommend the right solutions',
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    id: 'projectType',
    title: 'What do you need help with?',
    subtitle: 'Select the area that fits your needs best',
    icon: <Target className="w-6 h-6" />,
  },
  {
    id: 'timeline',
    title: 'When do you need this completed?',
    subtitle: 'Helps us prioritize and plan accordingly',
    icon: <Clock className="w-6 h-6" />,
  },
  {
    id: 'budget',
    title: 'What\'s your budget for this project?',
    subtitle: 'Be honest - this helps us serve you better',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    id: 'contact',
    title: 'Almost there! Let\'s get your details',
    subtitle: 'So we can prepare for our conversation',
    icon: <User className="w-6 h-6" />,
  },
]

const BUSINESS_TYPES = [
  { value: 'agency', label: 'Agency / Consultancy', icon: <Users className="w-5 h-5" /> },
  { value: 'saas', label: 'SaaS / Tech Company', icon: <Rocket className="w-5 h-5" /> },
  { value: 'ecommerce', label: 'E-commerce / Retail', icon: <Building2 className="w-5 h-5" /> },
  { value: 'real-estate', label: 'Real Estate', icon: <Building2 className="w-5 h-5" /> },
  { value: 'services', label: 'Professional Services', icon: <Briefcase className="w-5 h-5" /> },
  { value: 'other', label: 'Other', icon: <Zap className="w-5 h-5" /> },
]

const REVENUE_OPTIONS = [
  { value: 'pre-revenue', label: 'Pre-revenue / Just starting' },
  { value: '0-100k', label: '$0 - $100K' },
  { value: '100k-500k', label: '$100K - $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m-5m', label: '$1M - $5M' },
  { value: '5m+', label: '$5M+' },
]

const PROJECT_TYPES = [
  { value: 'automation', label: 'Workflow Automation', description: 'Eliminate manual tasks & busywork' },
  { value: 'ai-agents', label: 'AI Agents / Chatbots', description: 'Intelligent assistants for your business' },
  { value: 'integrations', label: 'System Integrations', description: 'Connect your tools & platforms' },
  { value: 'full-stack', label: 'Full-Stack Development', description: 'Custom apps & platforms' },
  { value: 'lead-systems', label: 'Lead Generation Systems', description: 'Capture, qualify & nurture leads' },
  { value: 'consulting', label: 'Strategy / Consulting', description: 'Not sure yet, need guidance' },
]

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'ASAP - Urgent', description: 'Need it yesterday' },
  { value: '1-2-weeks', label: '1-2 Weeks', description: 'Quick turnaround' },
  { value: '1-month', label: 'Within a Month', description: 'Standard timeline' },
  { value: '1-3-months', label: '1-3 Months', description: 'Flexible timeline' },
  { value: 'exploring', label: 'Just Exploring', description: 'No rush, gathering info' },
]

const BUDGET_OPTIONS = [
  { value: 'under-1k', label: 'Under $1,000', description: 'Small project' },
  { value: '1k-5k', label: '$1,000 - $5,000', description: 'Starter automation' },
  { value: '5k-10k', label: '$5,000 - $10,000', description: 'Full automation system' },
  { value: '10k-25k', label: '$10,000 - $25,000', description: 'Enterprise solution' },
  { value: '25k+', label: '$25,000+', description: 'Large-scale project' },
  { value: 'not-sure', label: 'Not sure yet', description: 'Need guidance' },
]

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function QualificationForm({ onComplete }: QualificationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [formData, setFormData] = useState<QualificationData>({
    businessType: '',
    revenue: '',
    projectType: '',
    timeline: '',
    budget: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    projectDetails: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof QualificationData, string>>>({})
  const [showError, setShowError] = useState(false)

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const validateCurrentStep = (): boolean => {
    const step = STEPS[currentStep]
    const newErrors: Partial<Record<keyof QualificationData, string>> = {}

    switch (step.id) {
      case 'businessType':
        if (!formData.businessType) newErrors.businessType = 'Please select an option'
        break
      case 'revenue':
        if (!formData.revenue) newErrors.revenue = 'Please select an option'
        break
      case 'projectType':
        if (!formData.projectType) newErrors.projectType = 'Please select an option'
        break
      case 'timeline':
        if (!formData.timeline) newErrors.timeline = 'Please select an option'
        break
      case 'budget':
        if (!formData.budget) newErrors.budget = 'Please select an option'
        break
      case 'contact':
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setShowError(true)
      return
    }

    setShowError(false)
    if (currentStep < STEPS.length - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSelect = (field: keyof QualificationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setShowError(false)
  }

  const handleInputChange = (field: keyof QualificationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const renderStepContent = () => {
    const step = STEPS[currentStep]

    switch (step.id) {
      case 'businessType':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {BUSINESS_TYPES.map((option) => (
              <motion.button
                key={option.value}
                variants={itemVariants}
                type="button"
                onClick={() => handleSelect('businessType', option.value)}
                className={cn(
                  'flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200',
                  'hover:border-primary hover:bg-primary/5',
                  formData.businessType === option.value
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border bg-card'
                )}
              >
                <div
                  className={cn(
                    'p-3 rounded-full transition-colors',
                    formData.businessType === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  {option.icon}
                </div>
                <span className="text-sm font-medium text-center">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )

      case 'revenue':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {REVENUE_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                variants={itemVariants}
                type="button"
                onClick={() => handleSelect('revenue', option.value)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 text-center',
                  'hover:border-primary hover:bg-primary/5',
                  formData.revenue === option.value
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border bg-card'
                )}
              >
                <span className="font-medium">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )

      case 'projectType':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {PROJECT_TYPES.map((option) => (
              <motion.button
                key={option.value}
                variants={itemVariants}
                type="button"
                onClick={() => handleSelect('projectType', option.value)}
                className={cn(
                  'flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  'hover:border-primary hover:bg-primary/5',
                  formData.projectType === option.value
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border bg-card'
                )}
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.description}</span>
              </motion.button>
            ))}
          </motion.div>
        )

      case 'timeline':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {TIMELINE_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                variants={itemVariants}
                type="button"
                onClick={() => handleSelect('timeline', option.value)}
                className={cn(
                  'flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  'hover:border-primary hover:bg-primary/5',
                  formData.timeline === option.value
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border bg-card'
                )}
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.description}</span>
              </motion.button>
            ))}
          </motion.div>
        )

      case 'budget':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {BUDGET_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                variants={itemVariants}
                type="button"
                onClick={() => handleSelect('budget', option.value)}
                className={cn(
                  'flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  'hover:border-primary hover:bg-primary/5',
                  formData.budget === option.value
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border bg-card'
                )}
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.description}</span>
              </motion.button>
            ))}
          </motion.div>
        )

      case 'contact':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-1.5">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 bg-card transition-colors',
                    'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                    errors.firstName ? 'border-destructive' : 'border-border'
                  )}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-1.5">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 bg-card transition-colors',
                    'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                    errors.lastName ? 'border-destructive' : 'border-border'
                  )}
                  placeholder="Smith"
                />
                {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-1.5">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-card transition-colors',
                  'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                  errors.email ? 'border-destructive' : 'border-border'
                )}
                placeholder="john@company.com"
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-1.5">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-card transition-colors',
                  'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                  errors.phone ? 'border-destructive' : 'border-border'
                )}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-1.5">Company Name (Optional)</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-card transition-colors',
                  'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                  'border-border'
                )}
                placeholder="Acme Inc."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-1.5">Tell us about your project (Optional)</label>
              <textarea
                value={formData.projectDetails}
                onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                rows={3}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-card transition-colors resize-none',
                  'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                  'border-border'
                )}
                placeholder="Brief description of what you're looking to build or automate..."
              />
            </motion.div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        {/* Step Indicators */}
        <div className="flex justify-between mt-3">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all',
                index < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Step Header */}
      <div className="text-center mb-8">
        <motion.div
          key={`icon-${currentStep}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4"
        >
          {STEPS[currentStep].icon}
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`header-${currentStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{STEPS[currentStep].title}</h2>
            <p className="text-muted-foreground">{STEPS[currentStep].subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {showError && currentStep < 5 && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-destructive text-sm mt-4"
        >
          Please select an option to continue
        </motion.p>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className={cn(currentStep === 0 && 'invisible')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button type="button" onClick={handleNext} size="lg" className="min-w-[140px]">
          {currentStep === STEPS.length - 1 ? (
            <>
              Book My Call
              <CheckCircle className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Trust indicator */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Your information is secure and will never be shared with third parties.
      </p>
    </div>
  )
}
