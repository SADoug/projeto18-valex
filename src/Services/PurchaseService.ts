import * as CardRepository from '../Repositories/CardRepository';
import * as paymentRepository from '../Repositories/paymentRepository';
import * as BR from "../Repositories/businessRepository";
import * as RechargeRepository from '../Repositories/RechargeRepository';
import { findByApiKey } from '../Repositories/companyRepository';
import dayjs from "dayjs";
import bcrypt from "bcrypt";


async function purchaseInsert(number: string, password: string, businessId: number, amount: number, apiKey: string) {

  const apiVerification = await findByApiKey(apiKey)
  if (!apiVerification) { throw { type: "conflict", message: "API KEY not registered" } }

  const cardCheck = await CardRepository.findByNumber(number)
  if (!cardCheck) { throw { type: "conflict", message: "card not registered" } }
  if (cardCheck.password === '') { throw { type: "conflict", message: "password not registered" } }

  var time = dayjs().format("MM/YY")

  if (cardCheck.expirationDate < time) { throw { type: "conflict", message: "card expired" } }
  let id = cardCheck.id
  if (cardCheck.isBlocked === true) { throw { type: "conflict", message: "card blocked" } }

  let hashedPassword = cardCheck.password
  if (!bcrypt.compareSync(password, hashedPassword)) { throw { type: "conflict", message: "wrong password" }}

  const BusinessCheck = await BR.findById(businessId)
  if (!BusinessCheck) { throw { type: "conflict", message: "business not registered" } }

  if (BusinessCheck[0].type != cardCheck.type) { throw { type: "conflict", message: "not similar bussiness and card type" } }
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

  let idcard = cardCheck.id
  let data = { cardId: idcard, businessId, amount }

  await paymentRepository.insert(data)

}
export {
  purchaseInsert
}