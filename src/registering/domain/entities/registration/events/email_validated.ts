import { DomainEvent } from '#core/domain_event'
import { RegistrationId } from '#core/registering/domain/entities/registration/registration'

export class EmailValidated implements DomainEvent {
  readonly userId: RegistrationId
  readonly type = 'EMAIL_VALIDATED'
  readonly occurredAt = new Date()

  constructor(userId: RegistrationId) {
    this.userId = userId
  }
}
