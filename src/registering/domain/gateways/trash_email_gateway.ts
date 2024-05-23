export abstract class TrashEmailGateway {
  abstract isTrash(email: string): Promise<boolean>
}
