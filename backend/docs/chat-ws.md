# Chat WebSocket API (`/chat`)

Этот документ описывает WebSocket события для чатов.

## Подключение

- **Транспорт**: Socket.IO
- **Namespace**: `/chat`
- **URL (пример)**: `http://<API_HOST>/chat`

## Авторизация (сессии через cookie)

Авторизация выполняется через **cookie-сессию** (как и HTTP).

- На клиенте нужно подключаться так, чтобы браузер отправлял cookies.
- Для запросов HTTP у вас уже используется `credentials: true`.
- Для Socket.IO так же важно разрешить cookies.

Если сессии нет, сервер разрывает соединение.

## Комнаты

Для получения событий конкретного чата нужно войти в комнату этого чата.

- **room id** = `chatId`

## События

### `join`

Подписка на комнату чата.

- **Client → Server**

Payload:

```json
{ "chatId": "..." }
```

Ответ (ack):

```json
{ "ok": true }
```

Ошибки:
- `{ "ok": false }` если нет сессии или нет доступа к чату.

---

### `message`

Отправка текстового сообщения в чат.

- **Client → Server**

Payload:

```json
{ "chatId": "...", "text": "Привет!" }
```

Ответ (ack):

```json
{ "ok": true, "message": { /* message */ } }
```

---

### `message:new`

Новое сообщение в чате (broadcast всем участникам комнаты `chatId`, включая отправителя).

- **Server → Client**

Payload (пример):

```json
{
  "id": "uuid",
  "chatId": "uuid",
  "text": "Привет!",
  "createdAt": "2026-03-18T12:34:56.000Z",
  "sender": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Ivan",
    "lastName": "Petrov",
    "photo": null
  },
  "files": []
}
```

## HTTP ручки (для истории и списка)

WS используется для realtime, а историю/пагинацию удобнее брать через HTTP:

- **Мои чаты**: `GET /chats?page=1&limit=20&q=...`
- **Сообщения чата**: `GET /chats/:chatId/messages?page=1&limit=50`

## Пример клиента (socket.io-client)

Установить:

```bash
npm i socket.io-client
```

Подключение и работа:

```ts
import { io } from 'socket.io-client'

const socket = io(`${process.env.NEXT_PUBLIC_API_HOST}/chat`, {
  withCredentials: true,
})

socket.on('connect', () => {
  console.log('connected', socket.id)
})

socket.on('disconnect', () => {
  console.log('disconnected')
})

// Подписка на чат
socket.emit('join', { chatId: 'CHAT_ID' }, (ack: any) => {
  console.log('join ack', ack)
})

// Получение новых сообщений
socket.on('message:new', (msg) => {
  console.log('new message', msg)
})

// Отправка сообщения
socket.emit('message', { chatId: 'CHAT_ID', text: 'Привет!' }, (ack: any) => {
  console.log('message ack', ack)
})
```

## Примечания

- События вложений/файлов пока не добавлены. Обычно делается так:
  - файл загружается в S3/MinIO по HTTP,
  - создаётся `MessageFile` в БД,
  - затем по WS (или HTTP) отправляется сообщение, связанное с файлами.

