// import logger from '../../util/logger'
import Relay from '../Relay'
import { DialogOptions } from '../../util/interfaces'
import Dialog from '../../../../web/src/rtc/Dialog'
import BrowserSession from '../../../../web/src/BrowserSession'
import VertoHandler from '../../../../web/src/services/VertoHandler'

export default class WebRTC extends Relay {
  protected _configure: boolean = true

  get service() {
    return 'webrtc'
  }

  constructor(public session: BrowserSession) {
    super(session)
  }

  notificationHandler(notification: any) {
    const { event_type, node_id, params } = notification
    // console.log('WebRTC notification', event_type, params)
    switch (event_type) {
      case 'webrtc.message':
        const handler = new VertoHandler(this.session)
        handler.nodeId = node_id
        handler.handleMessage(params)
        break
    }
  }

  async newCall(params: DialogOptions) {
    await this.Ready

    const { destinationNumber = null } = params
    if (!destinationNumber) {
      throw new Error('SignalWire.newCall() error: destinationNumber is required.')
    }
    const dialog = new Dialog(this.session, params)
    dialog.invite()
    return dialog
  }
}
