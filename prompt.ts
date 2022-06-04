import inquirer from 'inquirer';
import colors from 'colors/safe';
require('dotenv').config();

const { TO_EMAILS } = process.env;

if (TO_EMAILS) {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'isSure',
        message: `Are you sure you want to send the email to ${colors.green(TO_EMAILS)}?`
      }
    ])
    .then(({ isSure }) => {
      if (!isSure) {
        console.log(colors.red('Aborted successfully'));
        process.kill(process.pid, 'SIGINT');
      }
    });
}
