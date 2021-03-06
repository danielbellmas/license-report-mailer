import inquirer from 'inquirer';
import colors from 'colors/safe';
import { config } from 'dotenv';

config();
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
} else {
  console.log(colors.red('!!! No TO_EMAILS found in .env !!!'));
  process.kill(process.pid, 'SIGINT');
}
