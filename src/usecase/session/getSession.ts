import { sessionService } from '../../gateway/sessionService'

/**
 * セッションを検証し成功すればユーザーIDを返す
 * @param sessionId セッションID
 */
export async function getSession(sessionId: string): Promise<string | null> {
  const res = await sessionService.getSession({ sessionId })
  return res.userId
}
