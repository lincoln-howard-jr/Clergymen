const poolDetails = require ("./poolDetails");
const { execSync } = require('child_process');

try {
  command = `aws cognito-idp admin-confirm-sign-up --user-pool-id ${poolDetails.UserPoolId} --username ${process.argv [2]}`
  console.log (`Username = ${process.argv [2]}`);
  let result = execSync (command);
  console.log ('Results:')
  console.log (result);
} catch (e) {
  console.error (e);
  console.error ('Please write command in the form of:' );
  console.error ('node confirmUser.js <username>');
}
