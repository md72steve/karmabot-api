export default () => ({
  mongodb: {
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },
  slack: {
    token: process.env.SLACK_BOT_USER_TOKEN,
  },
});
