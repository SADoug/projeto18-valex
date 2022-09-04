import * as CardRepository from '../Repositories/CardRepository';
import * as paymentRepository from '../Repositories/paymentRepository';
import * as BR from "../Repositories/businessRepository";
import * as RechargeRepository from '../Repositories/RechargeRepository';
import { findByApiKey } from '../Repositories/companyRepository';
import dayjs from "dayjs";


async function purchaseInsert(number: string, password: string, businessId: number, amount: number, apiKey: string) {

  console.log(number, password, businessId, amount, apiKey)
  const apiVerification = await findByApiKey(apiKey)
  console.log("API check", apiVerification)
  if (!apiVerification) { throw { type: "conflict", message: "API KEY not registered" } }

  //Somente cartões cadastrados devem ser ativados
  const cardCheck = await CardRepository.findByNumber(number)
  console.log("Card check", cardCheck)
  if (!cardCheck) { throw { type: "conflict", message: "card not registered" } }
  //Cartões já ativados (com senha cadastrada) não devem poder ser ativados de novo
  if (cardCheck.password === '') { throw { type: "conflict", message: "password not registered" } }

  //Somente cartões não expirados devem ser ativados
  var time = dayjs().format("MM/YY")
  console.log(dayjs().format("MM/YY"))
  //Somente cartões não expirados devem ser ativados

  if (cardCheck.expirationDate < time) { throw { type: "conflict", message: "card expired" } }
  let id = cardCheck.id
  //Somente cartões não bloqueados devem ser bloqueados
  if (cardCheck.isBlocked === true) { throw { type: "conflict", message: "card blocked" } }

  //- A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
  // let hashedPassword = cardCheck.password
  // console.log(hashedPassword)
  // if (!bcrypt.compareSync(password, hashedPassword)) { throw "Erro no Card Service 6" }

  //Somente estabelecimentos cadastrados devem poder transacionar
  const BusinessCheck = await BR.findById(businessId)
  if (!BusinessCheck) { throw { type: "conflict", message: "business not registered" } }
  console.log(BusinessCheck[0].type)

  //Somente estabelecimentos do mesmo tipo do cartão devem poder transacionar com ele
  if (BusinessCheck[0].type != cardCheck.type) { throw { type: "conflict", message: "not similar bussiness and card type" } }

  //O cartão deve possuir saldo suficiente para cobrir o montante da compra

  const payments = await paymentRepository.findByCardId(id);
  const recharges = await RechargeRepository.findByCardId(id);

  async function getCardAmount(payments: paymentRepository.PaymentWithBusinessName[], recharges: rechargeRepository.Recharge[]) {
    const totalPaymentAmount = payments.reduce(sumTransactionWithAmount, 0);
    const totalRechargeAmount = recharges.reduce(sumTransactionWithAmount, 0);
    return totalRechargeAmount - totalPaymentAmount;
  }

  function sumTransactionWithAmount(amount: number, transaction: any) {
    return amount + transaction.amount;
  }

  const cardAmount = await getCardAmount(payments, recharges);
  if (cardAmount < amount) {
    throw { type: "bad_request", message: "sorry, you don't have the money for this" };
  }
  //A compra deve ser persistida

  let idcard = cardCheck.id
  let data = { cardId: idcard, businessId, amount }

  await paymentRepository.insert(data)

}
export {
  purchaseInsert
}