import json
import os
from pathlib import Path

from dotenv import load_dotenv
from solcx import compile_standard, install_solc
from web3 import Web3

load_dotenv()

RPC_URL = os.getenv("SEPOLIA_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

if not RPC_URL:
    raise ValueError("Missing SEPOLIA_RPC_URL")

if not PRIVATE_KEY:
    raise ValueError("Missing PRIVATE_KEY")

if not PRIVATE_KEY.startswith("0x"):
    PRIVATE_KEY = "0x" + PRIVATE_KEY

w3 = Web3(Web3.HTTPProvider(RPC_URL))

if not w3.is_connected():
    raise ConnectionError("Could not connect to RPC")

account = w3.eth.account.from_key(PRIVATE_KEY)
deployer_address = account.address

print("Deploying from:", deployer_address)

install_solc("0.8.20")


def load_contract_sources():
    contracts_dir = Path("contracts")
    sources = {}

    for file in contracts_dir.glob("*.sol"):
        sources[str(file)] = {
            "content": file.read_text()
        }

    return sources


def compile_contracts():
    compiled = compile_standard(
        {
            "language": "Solidity",
            "sources": load_contract_sources(),
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": ["abi", "evm.bytecode"]
                    }
                }
            },
        },
        solc_version="0.8.20",
    )

    return compiled


def get_contract_interface(compiled, file_name, contract_name):
    contract_data = compiled["contracts"][file_name][contract_name]
    abi = contract_data["abi"]
    bytecode = contract_data["evm"]["bytecode"]["object"]

    return abi, bytecode


def deploy_contract(abi, bytecode, constructor_args=None):
    constructor_args = constructor_args or []

    contract = w3.eth.contract(
        abi=abi,
        bytecode=bytecode
    )

    nonce = w3.eth.get_transaction_count(deployer_address)

    tx = contract.constructor(*constructor_args).build_transaction(
        {
            "from": deployer_address,
            "nonce": nonce,
            "gas": 5_000_000,
            "gasPrice": w3.eth.gas_price,
            "chainId": w3.eth.chain_id,
        }
    )

    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

    print("Tx sent:", tx_hash.hex())

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    if receipt.status != 1:
        raise RuntimeError("Deployment failed")

    return receipt.contractAddress


def main():
    compiled = compile_contracts()

    credential_abi, credential_bytecode = get_contract_interface(
        compiled,
        "contracts/CredentialRegistry.sol",
        "CredentialRegistry"
    )

    event_abi, event_bytecode = get_contract_interface(
        compiled,
        "contracts/EventRegistry.sol",
        "EventRegistry"
    )

    ticket_abi, ticket_bytecode = get_contract_interface(
        compiled,
        "contracts/TicketCredential.sol",
        "TicketCredential"
    )

    gate_abi, gate_bytecode = get_contract_interface(
        compiled,
        "contracts/GateVerifier.sol",
        "GateVerifier"
    )

    credential_registry = deploy_contract(
        credential_abi,
        credential_bytecode
    )

    print("CredentialRegistry:", credential_registry)

    event_registry = deploy_contract(
        event_abi,
        event_bytecode
    )

    print("EventRegistry:", event_registry)

    ticket_credential = deploy_contract(
        ticket_abi,
        ticket_bytecode,
        [
            event_registry,
            credential_registry
        ]
    )

    print("TicketCredential:", ticket_credential)

    gate_verifier = deploy_contract(
        gate_abi,
        gate_bytecode,
        [
            event_registry,
            ticket_credential,
            credential_registry
        ]
    )

    print("GateVerifier:", gate_verifier)

    deployed = {
        "CredentialRegistry": credential_registry,
        "EventRegistry": event_registry,
        "TicketCredential": ticket_credential,
        "GateVerifier": gate_verifier,
    }

    Path("deployed-addresses.json").write_text(
        json.dumps(deployed, indent=2)
    )

    print("Saved deployed-addresses.json")


if __name__ == "__main__":
    main()