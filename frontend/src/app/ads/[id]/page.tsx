import { TAd } from '@api/ads'

import { AdView } from '@views/ad'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const ad: TAd = {
    id,
    title: 'Новое объявление',
    image: '',
    description: 'Нужно доставить аккуратно',
    status: 'ACTIVE',
    startDate: '2026-03-12T00:00:00.000Z',
    endDate: '2026-03-20T00:00:00.000Z',
    fromCity: 'Москва',
    toCity: 'Саратов',
    price: 2000,
    weight: 0.5,
    isFragile: true,
    isDocument: false,
    packaging: 'BOX',
    length: 40,
    width: 30,
    height: 20,
    userState: {
      canEdit: false,
      role: 'recipient',
    },
    author: {
      id: '123321-12dd1923-d13i-13f5v413',
      fullName: 'Иван Иванов',
      photo: 'https://photoLink.ru',
    },
    sender: {
      id: '123321-12dd1923-d13i-13f5v413',
      fullName: 'Иван Иванов',
      photo: 'https://photoLink.ru',
    },
    recipient: {
      id: '123321-12dd1923-d13i-13f5v413',
      fullName: 'Иван Иванов',
      photo: 'https://photoLink.ru',
    },
    courier: {
      id: '123321-12dd1923-d13i-13f5v413',
      fullName: 'Иван Иванов',
      photo: 'https://photoLink.ru',
    },
  }

  return <AdView ad={ad} />
}

export default Page
