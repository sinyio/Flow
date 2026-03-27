import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Button, Text } from '@gravity-ui/uikit'

import { TSettingsFormValues } from './types'
import { TextField } from '@components/form/text-field/field'
import { SelectField } from '@components/form/select-field/field'
import { settingsSchema } from './validation-schema'
import { DatePickerField } from '@components/form/date-picker-field/field'
import { EmailField } from '@components/form'
import { PasswordField } from '@components/form/password-field/field'
import { PasswordRequirements } from '@components/templates/password-requirements'
import { sex } from './constants'
import styles from './component.module.css'

export const SettingsForm = () => {
  const { control, handleSubmit, formState } = useForm<TSettingsFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      sex: '',
      dateOfBirth: '',
      email: '',
      currentPassword: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(settingsSchema),
  })

  const onSubmit: SubmitHandler<TSettingsFormValues> = () => {}

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.section}>
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
        <EmailField size="xl" controllerProps={{ control, name: 'email' }} />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitleBlock}>
          <Text variant="header-2">Сменить пароль</Text>
          <Text variant="body-2" color="secondary">
            Подтверждение придет вам на почту
          </Text>
        </div>

        <PasswordField
          size="xl"
          placeholder="Введите текущий пароль"
          controllerProps={{ control, name: 'currentPassword' }}
        />

        <div className={styles.passwordBlock}>
          <PasswordField
            size="xl"
            placeholder="Введите новый пароль"
            controllerProps={{ control, name: 'password' }}
          />
          <PasswordRequirements control={control} />
        </div>

        <Button type="submit" size="xl" className={styles.saveButton} disabled={!formState.isValid}>
          Сменить пароль
        </Button>
      </div>

      <div className={styles.section}>
        <Text variant="header-2">Управление</Text>
        <div className={styles.managementButtons}>
          <Button type="button" size="xl" className={styles.actionButton}>
            Выйти
          </Button>
          <Button type="button" size="xl" view="outlined-danger" className={styles.actionButton}>
            Удалить профиль
          </Button>
        </div>
      </div>
    </form>
  )
}
