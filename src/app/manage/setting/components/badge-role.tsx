'use client'
import { Badge } from '@/components/ui/badge'
import { useGetMe } from '@/queries/account/useGetMe'

const BadgeRole = () => {
  const { data: meProfile } = useGetMe()
  if (!meProfile) return null
  return (
    <Badge variant='outline' className='ml-auto sm:ml-0'>
      {meProfile?.payload.data.role}
    </Badge>
  )
}

export default BadgeRole