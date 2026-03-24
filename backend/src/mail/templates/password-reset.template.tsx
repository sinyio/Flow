import { Body, Heading, Link, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from 'react'

interface PasswordResetTemplateProps {
    domain: string,
    token: string
}

export function PasswordResetTemplate({ domain, token }: PasswordResetTemplateProps) {
    const confirmLink = `${domain}/auth/password-reset?token=${token}`

    return (
        <Html>
            <Body>
                <Heading>Восстановление пароля</Heading>
                <Text>
                    Здравствуйте! Чтобы восстановить пароль,
                    перейдите по следующей ссылке:
                </Text>
                <Link href={confirmLink}>восстановить пароль</Link>
                <Text>
                    Ссылка действительная в течение 1 часа. Если Вы не запрашивали
                    восстановление пароля, просто проигнорируйте это сообщение.
                </Text>
                <Text>Спасибо за использование нашего сервиса!</Text>
            </Body>
        </Html>
    )
}