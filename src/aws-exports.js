const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-1_VtbFovxkK",
      userPoolClientId: "69j0oldo8qb75ipap2cdf2ja9d",
      loginWith: {
        email: true,
      },
    },
  },
};

export default awsConfig;
