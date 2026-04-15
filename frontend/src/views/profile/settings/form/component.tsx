import { Button, Text, useToaster } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { logout } from '@api/auth'
import { useAxiosInstance } from '@api/use-axios-instance'
import { deleteUser } from '@api/user/delete-user'
import { TUser } from '@api/user/get-user'
import { updateUser } from '@api/user/update-user'

import { normalizeApiMessage } from '@utils/session-not-found'

import { EmailField } from '@components/form'
import { DatePickerField } from '@components/form/date-picker-field/field'
import { PasswordField } from '@components/form/password-field/field'
import { SelectField } from '@components/form/select-field/field'
import { TextField } from '@components/form/text-field/field'
import { PasswordRequirements } from '@components/templates/password-requirements'

import styles from './component.module.css'
import { sex } from './constants'
import { TSettingsFormValues } from './types'
import { settingsSchema } from './validation-schema'

export interface ISettingsFormProps {
  user: TUser
}

export const SettingsForm = ({ user }: ISettingsFormProps) => {
  const { control, handleSubmit, formState } = useForm<TSettingsFormValues>({
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      sex: user.gender,
      dateOfBirth: user.dateOfBirth,
      contacts: '',
      currentPassword: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(settingsSchema),
  })

  const axiosInstance = useAxiosInstance()
  const { add } = useToaster()

  const onSubmit: SubmitHandler<TSettingsFormValues> = async data => {
    try {
      const { data: body } = await updateUser(data, axiosInstance)

      if ('status' in body && body.status === 'ok') {
        add({
          isClosable: true,
          theme: 'success',
          name: 'settings_save_ok',
          title: 'Сохранено',
          content: 'Данные профиля обновлены.',
        })

        return
      }

      const apiMessage = 'message' in body ? body.message : 'Не удалось сохранить изменения'

      console.error('[SettingsForm] updateUser rejected:', body)
      add({
        isClosable: true,
        theme: 'warning',
        name: 'settings_save_error',
        title: 'Ошибка',
        content: apiMessage,
      })
    } catch (error: unknown) {
      console.error('[SettingsForm] updateUser failed:', error)

      let message = 'Произошла ошибка при сохранении'

      if (isAxiosError(error)) {
        const errBody = error.response?.data as { message?: unknown } | undefined

        message = normalizeApiMessage(errBody?.message) ?? error.message ?? message
      }

      add({
        isClosable: true,
        theme: 'warning',
        name: 'settings_save_error',
        title: 'Ошибка',
        content: message,
      })
    }
  }

  const handleLogout = () => {
    void logout(axiosInstance).catch((error: unknown) => {
      console.error('[SettingsForm] logout failed:', error)
      add({
        isClosable: true,
        theme: 'warning',
        name: 'logout_error',
        title: 'Ошибка',
        content: 'Не удалось выйти из аккаунта.',
      })
    })
  }

  const handleDeleteUser = () => {
    void deleteUser(axiosInstance).catch((error: unknown) => {
      console.error('[SettingsForm] deleteUser failed:', error)
      add({
        isClosable: true,
        theme: 'warning',
        name: 'delete_user_error',
        title: 'Ошибка',
        content: 'Не удалось удалить профиль.',
      })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.fields}>
        <TextField size="xl" label="Имя:" controllerProps={{ control, name: 'firstName' }} />

        <TextField size="xl" label="Фамилия:" controllerProps={{ control, name: 'lastName' }} />

        <SelectField
          size="xl"
          label="Пол:"
          options={sex}
          controllerProps={{ control, name: 'sex' }}
          width="max"
        />

        <DatePickerField
          size="xl"
          label="День рождения:"
          controllerProps={{ control, name: 'dateOfBirth' }}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitleBlock}>
          <Text variant="header-2">Контакты</Text>
          <Text variant="body-2" color="secondary">
            Другие пользователи не увидят ваши контакты, пока вы ими не поделитесь
          </Text>
        </div>
        <EmailField size="xl" controllerProps={{ control, name: 'contacts' }} />
      </div>

      <Button type="submit" size="xl" className={styles.saveButton} disabled={!formState.isValid}>
        Сохранить
      </Button>

      <div className={styles.section}>
        <div className={styles.sectionTitleBlock}>
          <Text variant="header-2">Сменить пароль</Text>
          <Text variant="body-2" color="secondary">
            Подтверждение придет вам на почту
          </Text>
        </div>

        <div className={styles.fields}>
          <PasswordField
            size="xl"
            placeholder="Введите текущий пароль"
            controllerProps={{ control, name: 'currentPassword' }}
          />

          <div>
            <PasswordField
              size="xl"
              placeholder="Введите новый пароль"
              controllerProps={{ control, name: 'password' }}
            />
            <div className={styles.requirementsBlock}>
              <PasswordRequirements control={control} />
            </div>
          </div>
        </div>

        <Button type="submit" size="xl" className={styles.saveButton} disabled={!formState.isValid}>
          Сменить пароль
        </Button>
      </div>

      <div className={styles.section}>
        <Text variant="header-2">Управление</Text>
        <div className={styles.managementButtons}>
          <Button type="button" size="xl" onClick={handleLogout} className={styles.actionButton}>
            Выйти
          </Button>
          <Button
            type="button"
            size="xl"
            onClick={handleDeleteUser}
            view="outlined-danger"
            className={styles.actionButton}
          >
            Удалить профиль
          </Button>
        </div>
      </div>
    </form>
  )
}
