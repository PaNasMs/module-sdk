export type GrantRequest = {
  connectionId: string
  consumer: string
  capability: 'google-drive' | 'google-drive-readonly' | 'dropbox-files'
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

export declare function ProviderConnect(props: {
  providerId: 'google' | 'github' | 'dropbox'
  link?: boolean
  grant?: GrantRequest
  onComplete?: (grantId?: string) => void
}): import('react').JSX.Element | null
