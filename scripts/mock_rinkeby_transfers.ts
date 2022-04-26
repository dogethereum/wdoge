import hre from "hardhat";
import { loadDeployment } from "../deploy";
import type { ContractTransaction } from "ethers";

async function mockTransfers() {
  const deployment = await loadDeployment(hre);
  const tokenAdmin = await hre.ethers.getSigner(deployment.dogeToken.tokenAdmin);
  const userA = await hre.ethers.getSigner("0x1f8826b2A56e84058455d2687c46Fc44C9F43F4D");

  // dogecoin has 8 decimals so 10^20 units = 10^12 dogetokens
  const workingSupply = hre.ethers.BigNumber.from(10).pow(20);
  const dogeToken = deployment.dogeToken.contract.connect(tokenAdmin);

  let tx: ContractTransaction = await dogeToken.mint(workingSupply);
  await tx.wait();
  tx = await dogeToken.transfer(userA.address, hre.ethers.BigNumber.from(10).pow(17));
  await tx.wait();
  console.log(`Minted ${workingSupply.div(1e8).toString()} tokens.`);

  const tenthOfDoge = hre.ethers.BigNumber.from(1e7);

  for (let i = 0; i < 10; i++) {
    const suppliedAmount = tenthOfDoge.mul(10n ** BigInt(i));
    await dogeToken.transfer(userA.address, suppliedAmount, { gasLimit: 80_000 });
    await dogeToken.connect(userA).transfer(tokenAdmin.address, suppliedAmount.div(10), { gasLimit: 80_000 });
  }
  const fiftyDoges = 5e9;
  tx = await dogeToken.burn(fiftyDoges, { gasLimit: 80_000 });
  await tx.wait();
}

mockTransfers()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });