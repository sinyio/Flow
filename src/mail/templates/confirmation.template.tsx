import { Body, Heading, Link, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from 'react'

interface ConfirmationTemplateProps {
    domain: string,
    token: string
}

export function ConfirmationTemplate({ domain, token }: ConfirmationTemplateProps) {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    return (
        <Html>
            <Body>
                <Heading>Подтверждение почты</Heading>
                <Text>
                    Здравствуйте! Чтобы подтвердить адрес электронной почты,
                    перейдите по следующей ссылке:
                </Text>
                <Link href={confirmLink}>подтвердить почту</Link>
                <Text>
                    Ссылка действительная в течение 1 часа. Если Вы не запрашивали
                    подтверждение, просто проигнорируйте это сообщение.
                </Text>
                <Text>Спасибо за использование нашего сервиса!</Text>
            </Body>
        </Html>
    )
}