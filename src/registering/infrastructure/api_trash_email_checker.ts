import { TrashEmailGateway } from '#core/registering/domain/gateways/trash_email_gateway'

export class ApiTrashEmailChecker implements TrashEmailGateway {
  async isTrash(_: string): Promise<boolean> {
    return false
  }
}
