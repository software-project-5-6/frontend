const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_0QFCbEsah",
      userPoolClientId: "5veqtnqonicfsgr4eaidrj7a7g",
      loginWith: {
        email: true,
      },
    },
  },
};

export default awsConfig;
