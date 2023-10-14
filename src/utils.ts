export const tokenABI = `[{
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    }
]`;

export const multicallABI = `[{
    "inputs": [
        {
            "internalType": "bool",
            "name": "requireSuccess",
            "type": "bool"
        },
        {
            "components": [
                {
                    "internalType": "address",
                    "name": "target",
                    "type": "address"
                },
                {
                    "internalType": "bytes",
                    "name": "callData",
                    "type": "bytes"
                }
            ],
            "internalType": "struct Multicall2.Call[]",
            "name": "calls",
            "type": "tuple[]"
        }
    ],
    "name": "tryAggregate",
    "outputs": [
        {
            "components": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                },
                {
                    "internalType": "bytes",
                    "name": "returnData",
                    "type": "bytes"
                }
            ],
            "internalType": "struct Multicall2.Result[]",
            "name": "returnData",
            "type": "tuple[]"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}]`;
