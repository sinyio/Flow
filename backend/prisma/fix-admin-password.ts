import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const hashed = await hash('admin')

  const updated = await prisma.user.update({
    where: { email: 'admin@flow.ru' },
    data: { password: hashed },
  })

  console.log('Password updated for:', updated.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
