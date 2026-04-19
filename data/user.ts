import {Images} from '../config';

interface Performance {
  value: string;
  title: string;
}

interface UserDataItem {
  id: string;
  image: any;
  name: string;
  major: string;
  email: string;
  address: string;
  point: string;
  about: string;
  performance: Performance[];
}

const UserData: UserDataItem[] = [
  {
    id: '1',
    image: Images.profile2,
    name: 'Steve Garrett',
    major: 'Travel Agency',
    email: 'lewis.victor@milford.tv',
    address: 'Singapore, Golden Mile',
    point: '9.5',
    about:
      'Andaz Tokyo Toranomon Hills is one of the newest luxury hotels in Tokyo. Located in one of the uprising areas of Tokyo',
    performance: [
      {value: '97.01%', title: 'Feedback'},
      {value: '999', title: 'Items'},
      {value: '120k', title: 'Followers'},
    ],
  },
  {
    id: '2',
    image: Images.profile3,
    name: 'Athena alizabeth',
    major: 'Software Engineer',
    email: 'lewis.victor@milford.tv',
    address: '667 Wiegand Gardens Suite 330',
    point: '9.5',
    about:
      'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Curabitur aliquet quam id dui posuere blandit.',
    performance: [
      {value: '97.01%', title: 'Feedback'},
      {value: '999', title: 'Items'},
      {value: '120k', title: 'Followers'},
    ],
  },
  {
    id: '3',
    image: Images.profile4,
    name: 'Paul',
    major: 'Software Engineer',
    email: 'lewis.victor@milford.tv',
    address: '667 Wiegand Gardens Suite 330',
    point: '9.5',
    about:
      'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Curabitur aliquet quam id dui posuere blandit.',
    performance: [
      {value: '97.01%', title: 'Feedback'},
      {value: '999', title: 'Items'},
      {value: '120k', title: 'Followers'},
    ],
  },
  {
    id: '4',
    image: Images.profile5,
    name: 'Dung',
    major: 'Software Engineer',
    email: 'lewis.victor@milford.tv',
    address: '667 Wiegand Gardens Suite 330',
    point: '9.5',
    about:
      'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Curabitur aliquet quam id dui posuere blandit.',
    performance: [
      {value: '97.01%', title: 'Feedback'},
      {value: '999', title: 'Items'},
      {value: '120k', title: 'Followers'},
    ],
  },
];

export {UserData}; 