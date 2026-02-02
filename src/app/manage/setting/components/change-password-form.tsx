'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { SubmitHandler, useForm } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import Field from '@/components/field'
import { useChangePassword } from '@/queries/account/useChangePassword'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })
  const { setError, handleSubmit } = form
  const { mutateAsync: changePassword } = useChangePassword()

  const onSubmit: SubmitHandler<ChangePasswordBodyType> = async (data) => {
    changePassword(data, {
      onSuccess(data) {
        toast.success(data.payload.message)
      },
      onError(error) {
        handleErrorApi({
          error,
          setError,
        });
      },
    })
  }
  return (
    <Form {...form}>
      <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' onSubmit={handleSubmit(onSubmit)}>
        <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            {/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <Field form={form} name='oldPassword' label='Mật khẩu cũ' />
              <Field form={form} name='password' label='Mật khẩu mới' />
              <Field form={form} name='confirmPassword' label='Nhập lại mật khẩu mới' />
              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm'>
                  Hủy
                </Button>
                <Button size='sm'>Lưu thông tin</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
