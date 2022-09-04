
import * as CardRepository from '../Repositories/CardRepository';
import * as rechargeRepository from '../Repositories/RechargeRepository';
import dayjs from "dayjs";

async function RechargeInsert(number: string, amount: number) {


  //Somente valores maiores que 0 deveram ser aceitos
  if (amount < 0) { throw { type: "conflict", message: "invalid amount" } }

  //Somente cartões cadastrados devem ser ativado
  const cardCheck = await CardRepository.findByNumber(number)
  console.log("Card check", cardCheck)
  if (!cardCheck) { throw { type: "conflict", message: "card not registered" } }

  //Somente cartões ativos devem ser bloqueados
  if (cardCheck.isBlocked === true) { throw { type: "conflict", message: "card not activated" } }

  //Somente cartões não expirados devem ser ativados
  var time = dayjs().format("MM/YY")
  console.log(dayjs().format("MM/YY"))
  let Data = cardCheck.expirationDate
  if (Data < time) { throw { type: "conflict", message: "card expired" } }
  console.log("2")
  let id = cardCheck.id
  //Somente cartões não bloqueados devem ser bloqueados
  if (cardCheck.isBlocked === true) { throw { type: "conflict", message: "card blocked" } }


  let idcard = cardCheck.id
  let data = { cardId: idcard, amount }

  await rechargeRepository.insert(data)

}
export {
  RechargeInsert
}