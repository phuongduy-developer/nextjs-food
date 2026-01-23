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

export default function UpdateProfileForm() {
  const { mutateAsync: uploadImageMutate } = useUploadImage()
  const { mutateAsync: updateProfile } = useUpdateMe()
  const { data: profile, refetch } = useGetMe({
    staleTime: 0,
  })
  const defaultValues: UpdateMeBodyType = {
    name: '',
    avatar: ''
  }
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: ''
    },
    values: {
      name: profile?.payload.data.name ?? '',
      avatar: profile?.payload.data.avatar ?? '',
    }
  })

  const { setError, handleSubmit, setValue, reset } = form

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
        return toast.warning('Vui lòng cập nhật thông tin mới')
      }
      //khi có đổi ảnh
      if (data.avatar instanceof File) {
        avatarUrl = await uploadImage(data.avatar)
      }
      const payload = avatarUrl ? { ...data, avatar: avatarUrl } : { name: data.name }

      const { payload: { message } } = await updateProfile(payload, {
        onSuccess(data) {
          setValue('name', data.payload.data.name)
          if (data.payload.data.avatar) {
            setValue('avatar', data.payload.data.avatar)
          }
          refetch()
        },
      })

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
      <form className='grid auto-rows-max items-start gap-4 md:gap-8' onSubmit={handleSubmit(onSubmit)}
      >
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>

              <ImageUploadField form={form} name='avatar' label='Ảnh đại diện' />
              <Field form={form} label='Tên' name='name' placeholder='Nguyen Van A' />

              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='button' onClick={() => reset(defaultValues)}>
                  Hủy
                </Button>
                <Button size='sm'>
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
