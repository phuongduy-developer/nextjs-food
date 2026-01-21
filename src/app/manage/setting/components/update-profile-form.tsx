'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import Field from '@/components/field'
import ImageUploadField from '@/components/image-upload-field'
import { useUploadImage } from '@/queries/media/useUploadImage'
import { handleErrorApi, object } from '@/lib/utils'
import { useUpdateMe } from '@/queries/account/useUpdateMe'
import { toast } from 'sonner'
import { useGetMe } from '@/queries/account/useGetMe'
import { useEffect } from 'react'

export default function UpdateProfileForm() {
  const { mutateAsync: uploadImageMutate } = useUploadImage()
  const { mutateAsync: updateProfile } = useUpdateMe()
  const { data: profile } = useGetMe()
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: ''
    }
  })
  const { setError, handleSubmit, setValue } = form
  useEffect(() => {
    if (profile?.payload.data.avatar) {
      setValue('avatar', profile?.payload.data.avatar)
    }
    if (profile?.payload.data.name) {
      setValue('name', profile?.payload.data.name)
    }
  }, [profile?.payload.data.avatar, profile?.payload.data.name, setValue])

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const data = await uploadImageMutate(formData)
    return data.payload.data
  }

  const onSubmit: SubmitHandler<UpdateMeBodyType> = async (data) => {
    try {
      let avatarUrl: string | undefined;

      const isEqual = object.isEqual(data, profile?.payload?.data || {}, 'name', 'avatar')
      if (isEqual) {
        return toast.success('Vui lòng cập nhật thông tin mới')
      }
      //khi có đổi ảnh
      if (data.avatar instanceof File) {
        avatarUrl = await uploadImage(data.avatar)
      }
      const payload = avatarUrl ? { ...data, avatar: avatarUrl } : {name: data.name}

      const { payload: { message } } = await updateProfile(payload)

      return toast.success(message)
    } catch (error) {
      handleErrorApi({
        error,
        setError
      })
    }
  };


  return (
    <Form {...form} >
      <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' onSubmit={handleSubmit(onSubmit)}>
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>

              <ImageUploadField form={form} name='avatar' label='Ảnh đại diện' />
              <Field form={form} label='Tên' name='name' placeholder='Nguyen Van A' />

              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
