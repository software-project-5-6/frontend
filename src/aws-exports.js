const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_fEghCDpYb",
      userPoolClientId: "7fdstu9bpvri9fv2vt9lb24j2e",
      loginWith: {
        email: true,
      },
    },
  },
};

export default awsConfig;
