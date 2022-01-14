const hre = require('hardhat')

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000));

async function main () {
  const ethers = hre.ethers

  const {parseEther, formatEther} = ethers.utils;

  const africeumToken = '0xb9bFE9241aCFFBe7f5B06C4e668c4a43b8431D3a';

  console.log('network:', await ethers.provider.getNetwork())

  const signer = (await ethers.getSigners())[0]
  console.log('signer:', await signer.getAddress())

  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider)

  console.log('deployer:',deployer.address, formatEther(await deployer.getBalance()));


  console.log("erc token Contract deployed to ",)

  const afcAddress = '0xb9bFE9241aCFFBe7f5B06C4e668c4a43b8431D3a';


  const SAT = '0x2d97A45D32669bC5a043eC8D33C40fF7858D3607'
  const fee = '0x8b16e4bf6f32cef367b43f890368313b8ee5c41d'

  /**
   *  Deploy Altura Faucet
   */
  const AfriceumNFT = await ethers.getContractFactory('AfriceumNFT', deployer)


  const contract = await AfriceumNFT.deploy(afcAddress, SAT, fee);
  await contract.deployed()

  console.log('contract deployed to:', contract.address)
  
  await sleep(60);
  await hre.run("verify:verify", {
    address: contract.address,
    contract: "contracts/AfriceumNFT.sol:AfriceumNFT",
    constructorArguments: [afcAddress, SAT, fee],
  })

  console.log('contract verified')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
