import BaseSession from '../BaseSession'
import logger from '../util/logger'
import RelayClient from '../../../node/src/relay/'
import VertoHandler from '../webrtc/VertoHandler'
import { CallNotification } from '../util/constants/relay'

/* tslint:disable-next-line */
export default function BroadcastHandler(session: BaseSession, broadcastParams: any): void;
/* tslint:disable-next-line */
export default function BroadcastHandler(session: RelayClient, broadcastParams: any): void;

/* tslint:disable-next-line */
export default function BroadcastHandler(session: any, broadcastParams: any): void {
  const { protocol, params } = broadcastParams
  const { event_type, node_id } = params

  if (protocol !== session.relayProtocol) {
    return logger.error('Session protocol mismatch.')
  }

  switch (event_type) {
    case CallNotification.State:
    case CallNotification.Receive:
    case CallNotification.Connect:
    case CallNotification.Record:
    case CallNotification.Play:
    case CallNotification.Collect:
      session.calling.notificationHandler(params)
      break
    case 'webrtc.message':
      const handler = new VertoHandler(session)
      handler.nodeId = node_id
      handler.handleMessage(params.params)
      break
    default:
      return logger.error(`Unknown notification type: ${event_type}`)
  }
}
