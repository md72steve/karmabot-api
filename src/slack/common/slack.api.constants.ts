const base = 'https://slack.com/api';

export type Operations = 'usersInfo' | 'usersList' | 'conversationsList' | 'conversationsMembers';

const operations: { [key in Operations]: string } = {
  usersInfo: 'users.info',
  usersList: 'users.list',
  conversationsList: 'conversations.list',
  conversationsMembers: 'conversations.members',
};

export const endpoints = Object.entries(operations)
  .map(([k, v]) => ({ [k as Operations]: [base, v].join('/') }))
  .reduce((res, item) => {
    const key = Object.keys(item)[0];
    res[key] = item[key];
    return res;
  }, {});
