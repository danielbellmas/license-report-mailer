import fs from 'fs';
import colors from 'colors/safe';
import { CSV_FOLDER_PATH, LICENSE_WHITE_LIST } from './consts';

const toAmountString = (amount: number, one: string, many: string) => {
  if (amount === 1) return one;

  return many;
};

interface PackageDetails {
  license: string;
  packageName: string;
  line: number;
}

export const checkLicenses = (csvFiles: string[]): string => {
  const diffLicenseByCsv: Record<string, PackageDetails[]> = csvFiles.reduce(
    (acc, fileName) => ({ ...acc, [fileName]: [] }),
    {}
  );

  for (const file of csvFiles) {
    const csvFilePath = `${CSV_FOLDER_PATH}${file}`;
    const csvFile = fs.readFileSync(csvFilePath, 'utf8');

    if (!csvFile.length) {
      console.log(colors.red('One or more csv files are empty, please check'));
      process.exit(1);
    }

    const csvFileLines: string[] = csvFile.split('\n');

    const licenseList: PackageDetails[] = csvFileLines.map((line, index) => {
      const license = line.split(',')[5];
      const packageName = line.split(',')[2];

      return { license, packageName, line: index + 1 };
    });

    const diffLicenseList: PackageDetails[] = licenseList
      .filter(({ license }) => license && !LICENSE_WHITE_LIST.includes(license))
      .filter(Boolean);

    if (diffLicenseList.length > 0) {
      console.log(
        colors.red(
          `${file} has licenses that are not in the whitelist:\n${colors.blue(
            diffLicenseList
              .map(({ license, packageName, line }) => `[line:${line}] ${license} from ${packageName}\n`)
              .join('')
          )}`
        )
      );

      diffLicenseByCsv[file] = diffLicenseList;
    }
  }

  const inValidLicensesText = Object.entries(diffLicenseByCsv)
    .map(
      ([file, licenses]) =>
        !!licenses.length &&
        `<b>${file}</b> has ${toAmountString(licenses.length, 'a license', 'licenses')} that ${toAmountString(
          licenses.length,
          'is',
          'are'
        )} not in our usual list: ${licenses.map(
          ({ license, packageName, line }) => `[line:${line}] <b>${license}</b> from <b>${packageName}</b>`
        )}`
    )
    .filter(Boolean)
    .join('<br>');

  return inValidLicensesText;
};
