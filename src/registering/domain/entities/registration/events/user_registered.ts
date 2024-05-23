import { DomainEvent } from '#core/domain_event'
import { RegistrationId } from '#core/registering/domain/entities/registration/registration'

export class RegistrationCreated implements DomainEvent {
  readonly userId: RegistrationId
  readonly type = 'USER_REGISTERED'
  readonly occurredAt = new Date()

  constructor(userId: RegistrationId) {
    this.userId = userId
  }
}
