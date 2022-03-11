import React from 'react';
import UserList from '../components/UserList';
const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'alfred',
      image:
        'https://www.gannett-cdn.com/presto/2022/02/04/NOAK/b075a64c-6cfd-4972-9c5d-4f6522907a0c-Borchers.jpg?width=1588',
      places: 3,
    },
  ];

  return <UserList items={USERS} />;
};

export default Users;
