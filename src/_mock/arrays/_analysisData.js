import { add, subDays } from 'date-fns';
//
import _Analysismock from '../map/_Analysismock';
import { randomInArray, randomNumberRange } from '../utils';

// ----------------------------------------------------------------------
export const _analysisData = [...Array(20)].map((_,index)=>({
  id: _Analysismock.id(index),
//   category: _Analysismock.company(index),
  name: randomInArray([
    'Bureau Analysis','Bank Statment','Customer val','Credit card','Digital FP'
  ]),
  table: _Analysismock.number.table(index),
  record: _Analysismock.number.record(index),
  AnalysisNumber: `${0 + index}`,
  category: randomInArray([
    'Insurance',
    'Finance',
    'Payment',
    'Mortgage',
  ]),
  sent: randomNumberRange(1, 10),
  createDate: subDays(new Date(), index),
  dueDate: add(new Date(), { days: index + 15, hours: index }),
  status: randomInArray(['paid', 'unpaid', 'overdue', 'draft']),
  
}))
