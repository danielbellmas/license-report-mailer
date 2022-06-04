import fs from 'fs';
import colors from 'colors/safe';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { checkLicenses } from './utils/checkLicenses';
import { CSV_FOLDER_PATH } from './utils/consts';

require('dotenv').config();

const { FROM_EMAIL, PASSWORD, TO_EMAILS } = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: FROM_EMAIL,
    pass: PASSWORD
  }
});

const csvFiles: string[] = fs.readdirSync(CSV_FOLDER_PATH);
const inValidLicensesText = checkLicenses(csvFiles);

const monthName = new Date().toLocaleString('default', { month: 'long' });

const mailOptions: Mail.Options = {
  from: FROM_EMAIL,
  to: TO_EMAILS,
  bcc: FROM_EMAIL,
  subject: `Monthly license report - ${monthName}`,
  html: `
  Hi Michael, <br>
  As part of my periodic 3rd party package review, I'm attaching the reports.<br>
  ${inValidLicensesText ? `<br>${inValidLicensesText}<br>` : ''}
  Please let me know if any of them cause any issues for you.<br>
  <br>
  Thanks, Daniel.
  `,
  attachments: csvFiles.map(name => ({
    filename: name,
    path: `${CSV_FOLDER_PATH}${name}`,
    contentType: 'text/csv'
  }))
};

transporter.sendMail(mailOptions, (error: Error | null) => {
  if (error) {
    console.log(colors.red(`Error occurred, didn't send the mail ${JSON.stringify(error, null, 2)}`));
  } else {
    console.log(
      // @ts-ignore
      colors.inverse.green(`
- - - - - - - - - - - - - - - - -
| Email was successfully sent 🚀|
- - - - - - - - - - - - - - - - -
`)
    );
  }
});
