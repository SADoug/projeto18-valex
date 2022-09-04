
import * as CardRepository from '../Repositories/CardRepository';
import * as rechargeRepository from '../Repositories/RechargeRepository';
import dayjs from "dayjs";

async function RechargeInsert(number: string, amount: number) {
  if (amount < 0) { throw { type: "conflict", message: "invalid amount" } }
  const cardCheck = await CardRepository.findByNumber(number)
  if (!cardCheck) { throw { type: "conflict", message: "card not registered" } }
  if (cardCheck.isBlocked === true) { throw { type: "conflict", message: "card not activated" } }

  var time = dayjs().format("MM/YY")
  let Data = cardCheck.expirationDate
  if (Data < time) { throw { type: "conflict", message: "card expired" } }
  let id = cardCheck.id
  if (cardCheck.isBlocked === true) { throw { type: "conflict", message: "card blocked" } }

  let idcard = cardCheck.id
  let data = { cardId: idcard, amount }

  await rechargeRepository.insert(data)

}
export {
  RechargeInsert
}