import { memo } from 'react'
import { CheckCircle, Star, Users, Clock } from 'lucide-react'

/**
 * Performance-optimized Trust Section - Displays trust signals, testimonials, and urgency
 *
 * Optimizations:
 * 1. React.memo to prevent unnecessary re-renders
 * 2. CSS containment for layout optimization
 * 3. Content visibility: auto for paint optimization
 * 4. Minimal layout shifts
 */

interface TrustSidebarProps {
  className?: string
}

const MicroTrustBadge = memo(({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: typeof CheckCircle
  label: string
  value: string 
}) => (
  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
    <div>
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
))

MicroTrustBadge.displayName = 'MicroTrustBadge'

const TrustSidebar = memo(({ className = '' }: TrustSidebarProps) => {
  return (
    <aside
      className={`
        grid sm:grid-cols-3 gap-6
        ${className}
      `}
      style={{
        // CSS containment prevents layout recalculation of children affecting parent
        contain: 'layout paint',
        // Prevent content from affecting layout during scroll
        contentVisibility: 'auto',
      }}
    >
      {/* Trust Signals */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="font-bold text-lg">Our Track Record</h3>
        
        <div className="space-y-3">
          <MicroTrustBadge
            icon={Clock}
            label="Average Response"
            value="Within 24h"
          />
          <MicroTrustBadge
            icon={Users}
            label="Clients Helped"
            value="100+"
          />
          <MicroTrustBadge
            icon={Star}
            label="Satisfaction"
            value="4.9/5"
          />
          <MicroTrustBadge
            icon={CheckCircle}
            label="Success Rate"
            value="95%"
          />
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="font-bold text-lg">Client Testimonial</h3>
        <blockquote className="space-y-3">
          <p className="text-sm text-muted-foreground italic">
            "Nolan helped us automate 40+ hours of manual work every month. 
            The ROI was immediate."
          </p>
          <footer className="text-sm font-semibold">
            — Sarah M., Agency Owner
          </footer>
        </blockquote>
      </div>

      {/* Urgency Element */}
      <div className="bg-primary/10 rounded-xl border border-primary/20 p-6 space-y-2">
        <h3 className="font-bold text-sm">Limited Availability</h3>
        <p className="text-xs text-muted-foreground">
          Only a few slots left this week. Book now to secure your call.
        </p>
      </div>
    </aside>
  )
})

TrustSidebar.displayName = 'TrustSidebar'

export default TrustSidebar
export { MicroTrustBadge }
