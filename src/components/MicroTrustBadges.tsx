import { Clock, CheckCircle, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

/**
 * MicroTrustBadges - Displays 3 quick-scan trust indicators
 * Position: Below hero headline, above calendar embed
 * Height: ~60px with padding
 */
export default function MicroTrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
        <Clock className="w-4 h-4" />
        <span>30 Minutes</span>
      </Badge>

      <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>No Pressure</span>
      </Badge>

      <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
        <Zap className="w-4 h-4" />
        <span>Direct with Nolan</span>
      </Badge>
    </div>
  )
}
