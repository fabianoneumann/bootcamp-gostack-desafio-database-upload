/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;

          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;

          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };

    // Solução sem o método reduce
    // const balance: Balance = {
    //   income: 0,
    //   outcome: 0,
    //   total: 0,
    // };

    // const transactions = await this.find();

    // transactions.forEach(transaction => {
    //   if (transaction.type === 'income') {
    //     balance.income += transaction.value;
    //   } else {
    //     balance.outcome += transaction.value;
    //   }
    // });

    // balance.total = balance.income - balance.outcome;

    // return balance;
  }
}

export default TransactionsRepository;
