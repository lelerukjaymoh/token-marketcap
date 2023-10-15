
import { request, gql } from "graphql-request";
import { Contract, JsonRpcProvider, ZeroAddress, formatUnits } from "ethers";
import { multicallABI, tokenABI } from "./utils";


class MarketCap {
    subgraphUrl = "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev";
    ankrRPCUrl = "https://rpc.ankr.com/eth"
    provider = new JsonRpcProvider(this.ankrRPCUrl)
    multicallAddress = "0x9695fa23b27022c7dd752b7d64bb5900677ecc21"

    // This are all the addresses that could be holding the token out of supply. 
    // They include dead addresses, liquidity locking contracts, vesting contracts etc
    circulatingSupplyHolders = [
        "0xE2fE530C047f2d85298b07D9333C05737f1435fB", // TrustSwap: Team Finance
        ZeroAddress, // Zero address
        "0x000000000000000000000000000000000000dead"  // Dead / Burn address
        // ADD MORE ADDRESSES THAT COULD BE HOLDING TOKENS IN THIS LIST  
    ];


    fetchMarketCap = async (tokenAddress: string): Promise<Number> => {
        // query the deriveETH from subgraph
        // get the current eth price
        // returns the token price in usd

        const query = gql`
                query {
                    token(id: "${tokenAddress}") {
                        derivedETH
                        totalSupply
                    }
                    bundle(id: "1") {
                        ethPrice
                    }
                }
            `;

        try {
            const data: any = await request(this.subgraphUrl, query);
            const token = data.token;
            const bundle = data.bundle;

            console.log("Token price in ETH: ", token.derivedETH);
            console.log("ETH price: ", bundle.ethPrice);

            const tokensInCirculation = Number(await this.fetchCirculatingSupply(tokenAddress))
            const marketCap = tokensInCirculation * token.derivedETH * bundle.ethPrice
            console.log("\nmarketCap ", marketCap);

            return marketCap
        } catch (error: any) {
            console.error("Error fetching data from the subgraph:", error);
            throw new Error(error)
        }

    }

    fetchCirculatingSupply = async (tokenAddress: string) => {
        try {
            const multiCallContract = new Contract(this.multicallAddress, multicallABI, this.provider)
            const tokenContract = new Contract(tokenAddress, tokenABI, this.provider)

            const batchCalldata = this.circulatingSupplyHolders.map(address => {
                return {
                    target: tokenAddress,
                    callData: tokenContract.interface.encodeFunctionData("balanceOf", [address])
                }
            })

            // Use MakerDao's multicall contract to fetch the balance of different addresses 
            // that could be holding the token in one request. This includes deadAddress, liquidity locking contract (eg unicrypt), etc
            const response = await multiCallContract.tryAggregate.staticCall(
                false,
                batchCalldata
            )

            let totalHeld = BigInt(0)
            response.map(({ success, returnData }: any, i: any) => {
                const address = this.circulatingSupplyHolders[i]

                if (!success) {
                    console.log(`Failed to retrieve balance for ${address}`)
                    return [address, 0]
                }

                const amount = tokenContract.interface.decodeFunctionResult("balanceOf", returnData)[0]
                if (amount > 0) {
                    console.log(`Tokens locked in ${address}: ${amount}`)
                }
                totalHeld += amount
            })


            const tokenTotalSupply = await tokenContract.totalSupply()
            const tokenDecimals = await tokenContract.decimals()

            console.log("token TotalSupply ", tokenTotalSupply);
            console.log("total locked tokens ", totalHeld);

            const tokenInCirculation = tokenTotalSupply - totalHeld
            const circulatingSupply = Number(formatUnits(tokenInCirculation, tokenDecimals ? tokenDecimals : 18))
            // console.log("circulatingSupply ", circulatingSupply);
            return circulatingSupply


        } catch (error: any) {
            console.error("Error fetching data from etherscan:", error);
            throw new Error(error)
        }
    }
}

const m = new MarketCap();
m.fetchMarketCap("0xff836a5821e69066c87e268bc51b849fab94240c")