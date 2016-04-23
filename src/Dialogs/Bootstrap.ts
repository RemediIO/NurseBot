
import { ToDo } from './ToDo/ToDo'

export function bootstrapDialogs(bot: any) {
      bot.add('/', new ToDo().dialog);
};