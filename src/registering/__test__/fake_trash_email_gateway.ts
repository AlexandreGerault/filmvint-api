import { TrashEmailGateway } from '#core/registering/gateways/trash_email_gateway'

export class FakeTrashEmailGateway implements TrashEmailGateway {
  constructor(private readonly trashEmails: string[] = []) {}

  async isTrash(email: string): Promise<boolean> {
    return this.trashEmails.includes(email)
  }
}
