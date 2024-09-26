import User from "#models/user";
import { HttpContext } from "@adonisjs/core/http";

export default class ValidateEmailController {
  async handle({ request, response }: HttpContext) {
    const email = request.param('email');

    if (request.hasValidSignature() === false) {
      return response.badRequest();
    }

    const user = await User.findByOrFail('email', email);
    
    await user?.merge({ emailVerifiedAt: new Date() }).save();

    return response.noContent();
  }
}