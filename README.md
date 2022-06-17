# License Report Mailer

This repo will generate csv files from your project's repo, and will send an email to whomever you decide.

## Flow

1. Inquire the user: "Are you sure you want to send the email?"

   > If the user isn't sure then we abort the script.

   > Else continue...

1. Generate the csv files from the project's package.json files.
1. Check for licenses that are not in the usual list.
1. Send the email 🚀
