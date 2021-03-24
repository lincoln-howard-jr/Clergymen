const poolDetails = require ("./poolDetails");
const { execSync } = require('child_process');

try {
  command = `aws cognito-idp admin-set-user-password --user-pool-id ${poolDetails.UserPoolId} --username ${process.argv [2]} --password ${process.argv [3]} --permanent`
  console.log (`Username = ${process.argv [2]} & Password ${process.argv [3]}`);
  let result = execSync (command);
  console.log ('Results:')
  console.log (result.toString ());
} catch (e) {
  console.error (e);
  console.error ('Please write command in the form of:' );
  console.error ('node confirmUser.js <username> <password>');
}
