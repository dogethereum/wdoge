import hre from "hardhat";

async function listFunctions() {
  const contracts = ["WDogeProxy", "WDoge"];
  for (const contractName of contracts) {
    console.log(`${contractName}:`);
    const contract = await hre.ethers.getContractFactory(contractName);
    for (const [fName, fragment] of Object.entries(contract.interface.functions)) {
      const fCharacteristic = `${fName} ${fragment.stateMutability}`;
      const outputs = fragment.outputs
        ?.map(({ type, name }) => `${type} ${name ?? "_"}`)
        .join(", ");
      let fDescriptor = `  ${fCharacteristic}`;
      if (outputs !== undefined) {
        fDescriptor += ` returns (${outputs})`;
      }

      console.log(fDescriptor);
    }
    console.log();
  }
}

listFunctions()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
