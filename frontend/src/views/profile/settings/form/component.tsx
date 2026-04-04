import { Button, Text } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { logout } from '@api/auth'
import { useAxiosInstance } from '@api/use-axios-instance'
import { deleteUser } from '@api/user/delete-user'
import { TUser } from '@api/user/get-user'
import { updateUser } from '@api/user/update-user'

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
  console.log(user)

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

  const onSubmit: SubmitHandler<TSettingsFormValues> = async data => {
    await updateUser(data, axiosInstance)
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
          <Button
            type="button"
            size="xl"
            onClick={() => logout(axiosInstance)}
            className={styles.actionButton}
          >
            Выйти
          </Button>
          <Button
            type="button"
            size="xl"
            onClick={() => deleteUser(axiosInstance)}
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
