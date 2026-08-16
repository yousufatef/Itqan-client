import { KycStatus, type User } from '../types/user.types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    fullName: 'Mina Atef',
    phoneNumber: '+201112223344',
    email: 'mina.atef@example.com',
    createdOn: '2024-09-23',
    isActive: true,
    kycStatus: KycStatus.APPROVED,
  },
  {
    id: '2',
    fullName: 'Ahmed Samir',
    phoneNumber: '+201112223344',
    email: 'ahmed.samir@example.com',
    createdOn: '2024-09-23',
    isActive: false,
    kycStatus: KycStatus.PENDING,
  },
  {
    id: '3',
    fullName: 'Farah Zaki',
    phoneNumber: '+201005006000',
    email: 'farah.zaki@example.com',
    createdOn: '2024-09-23',
    isActive: true,
    kycStatus: KycStatus.REJECTED,
  },
  {
    id: '4',
    fullName: 'Youssef Nabil',
    phoneNumber: '+201229876543',
    email: 'youssef.nabil@example.com',
    createdOn: '2024-09-23',
    isActive: true,
    kycStatus: KycStatus.APPROVED,
  },
  {
    id: '5',
    fullName: 'Salma Adel',
    phoneNumber: '+201555444789',
    email: 'salma.adel@example.com',
    createdOn: '2024-09-23',
    isActive: false,
    kycStatus: KycStatus.REJECTED,
  },
];
