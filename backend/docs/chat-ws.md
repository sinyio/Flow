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

Отправка сообщения в чат (текст и/или вложения).

- **Client → Server**

Payload:

```json
{
  "chatId": "...",
  "text": "Привет!",
  "attachments": [
    {
      "name": "photo.png",
      "mimeType": "image/png",
      "size": 123456,
      "dataBase64": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

Ответ (ack):

```json
{ "ok": true, "message": { /* message */ } }
```

Правила:

- Можно отправить только текст, только вложения или и то и другое.
- Пустое сообщение (без текста и без вложений) отклоняется.
- `dataBase64` должен быть **чистой base64 строкой** (без префикса `data:*/*;base64,`).
- До `10` вложений в одном сообщении.
- До `10MB` на одно вложение.

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

Если есть вложения, в `files` придут объекты вида:

```json
{
  "id": "uuid",
  "url": "/chats/<chatId>/files/<fileId>",
  "mimeType": "image/png",
  "fileName": "photo.png",
  "size": 123456,
  "createdAt": "2026-03-18T12:34:56.000Z"
}
```

## HTTP ручки (для истории и списка)

WS используется для realtime, а историю/пагинацию удобнее брать через HTTP:

- **Мои чаты**: `GET /chats?page=1&limit=20&q=...`
- **Сообщения чата**: `GET /chats/:chatId/messages?page=1&limit=50`
- **Скачать вложение**: `GET /chats/:chatId/files/:fileId` (только участник чата)

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

// Пример: отправка файла
async function fileToBase64(file: File): Promise<string> {
  const arr = await file.arrayBuffer()
  const bytes = new Uint8Array(arr)
  let binary = ''
  const chunkSize = 0x8000

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }

  return btoa(binary)
}

async function sendFileMessage(chatId: string, file: File) {
  const dataBase64 = await fileToBase64(file)

  socket.emit(
    'message',
    {
      chatId,
      text: '',
      attachments: [
        {
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          dataBase64,
        },
      ],
    },
    (ack: any) => {
      console.log('file message ack', ack)
    },
  )
}

// Пример: скачивание вложения из message.files[].url
async function downloadAttachment(fileUrl: string, fileName = 'file') {
  const res = await fetch(fileUrl, { credentials: 'include' })
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)

  const blob = await res.blob()
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(href)
}
```

## Примечания

- Вложения физически хранятся в MinIO.
- Прямые публичные ссылки на MinIO клиенту не отдаются.
- Доступ к вложениям идет через backend-эндпоинт с проверкой участия в чате.

