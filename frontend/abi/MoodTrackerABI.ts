
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const MoodTrackerABI = {
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "emojis",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "index",
          "type": "uint8"
        }
      ],
      "name": "getEmoji",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEmojiCount",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "dayTimestamp",
          "type": "uint32"
        }
      ],
      "name": "getMood",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "euint8",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "euint256",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTodayTimestamp",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserMoodCount",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "dayTimestamp",
          "type": "uint32"
        }
      ],
      "name": "hasMood",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "hasRecordedToday",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint8",
          "name": "emojiIndex",
          "type": "bytes32"
        },
        {
          "internalType": "externalEuint256",
          "name": "messageHash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "inputProofEmoji",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "inputProofMessage",
          "type": "bytes"
        }
      ],
      "name": "recordMood",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

