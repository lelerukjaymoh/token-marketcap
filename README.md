# token-marketcap

This script calculates the market-cap of a token

## How to use

1. Clone the project from github
2. `cd` into project folder and run `yarn install`
3. Open the script in your editor and in the `index.ts` file, enter the token address you want calculate its marketcap,
4. Run the script using `yarn start`

## Configuration

So as to calculate the marketcap of a token, we need to take into account the tokens that are not in circulation. We do this by fetching the balances of addresses considered hold the tokens out of supply.(eg Burn address, lock and vesting contracts, etc) and deducting their total balance from the total supply

For this to be possible we have a configuration called `circulatingSupplyHolders` which is an array in the `index.ts` file. You need to update this array with any address that could hold tokens ouf of supply as explained above.
