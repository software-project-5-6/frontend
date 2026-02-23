const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-1_yEjEFxKtt",
      userPoolClientId: "3svilmbd5c2ae3bg83g9tq8abl",
      loginWith: {
        email: true,
      },
    },
  },
};

export default awsConfig;
