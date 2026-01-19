'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLogoutMutation } from '@/queries/auth/useLogoutMutation'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { navigation } from '@/constants/navigation'
import { useGetMe } from '@/queries/account/useGetMe'

const account = {
  name: 'Nguyễn Văn A',
  avatar: 'https://i.pravatar.cc/150'
}

export default function DropdownAvatar() {
  const { replace } = useRouter()
  const { data: account } = useGetMe()
  const { mutate: logoutFn, isPending } = useLogoutMutation({
    onSuccess(data) {
      toast.success(data.payload.message)
      replace(navigation.HOME)
    },
    onError(error) {
      handleErrorApi({
        error
      })
    },
  });

  const onLogout = () => {
    if (isPending) return
    logoutFn()
  };

  if (!account) return null

  const avatar = account?.payload.data.avatar
  const accountName = account.payload.data.name
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
          <Avatar>
            <AvatarImage src={avatar ?? undefined} alt={accountName} />
            <AvatarFallback>{accountName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{accountName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={navigation.MANAGE.SETTING} className='cursor-pointer'>
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
