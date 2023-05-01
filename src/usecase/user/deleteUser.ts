import { sessionService } from '../../gateway/sessionService'
import { userService } from '../../gateway/userService'

export async function deleteUserUseCase(userId: string) {
  await userService.deleteUser({ id: userId })
  await sessionService.deleteSessionByUserId({ userId })
}
