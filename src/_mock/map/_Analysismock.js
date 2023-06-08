import { sub } from 'date-fns';
//
import {
  age,
  role,
  price,
  title,
  email,
  rating,
  percent,
  country,
  company,
  boolean,
  sentence,
  lastName,
  fullName,
  firstName,
  description,
  fullAddress,
  phoneNumber,
  ServiceName,
  table,
} from '../assets';

// ----------------------------------------------------------------------

const _Analysismock = {
  id: (index) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
  time: (index) => sub(new Date(), { days: index, hours: index }),
  boolean: (index) => boolean[index],
  category: (index) => company[index],
  
  
  name: {
    ServiceName: (index) => ServiceName[index],
  },
  
  number: {
    table: (index) => (table[index]),
    record: (index) => age[index],
  },
  
};

export default _Analysismock;
