
const poolDetails = require ("./poolDetails");
const { execSync } = require('child_process');
const id = () => {
  return require ('crypto').randomBytes (32).toString ('hex');
}

try {
  command = `aws cognito-idp admin-update-user-attributes --user-pool-id ${poolDetails.UserPoolId} --username ${process.argv [2]} --user-attributes Name=custom:id,Value="${id ()}"`;
  command2 = `aws cognito-idp admin-update-user-attributes --user-pool-id ${poolDetails.UserPoolId} --username ${process.argv [2]} --user-attributes Name=custom:application-role,Value="admin"`;
  console.log (`Username = ${process.argv [2]}`);
  let result = execSync (command);
  result += execSync (command2);
  console.log ('Results:');
  console.log (result.toString ());
} catch (e) {
  console.error (e);
  console.error ('Please write command in the form of:' );
  console.error ('node setCustomAttributes.js <username>');
}
