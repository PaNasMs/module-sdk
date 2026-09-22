export type GrantRequest = {
  connectionId: string
  consumer: string
  capability: 'google-drive' | 'google-drive-readonly'
}
export type ExternalGrant = {
  id: string
  connectionId: string
  consumer: string
  capability: string
  scope: string
  status: 'active' | 'unavailable' | 'reconnect_required'
  created: number
}
export declare function GoogleConnect(props: {
  link?: boolean
  grant?: GrantRequest
  onComplete?: (grantId?: string) => void
}): import('react').JSX.Element | null
