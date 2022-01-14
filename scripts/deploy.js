const hre = require('hardhat')

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000));

async function main () {
  const ethers = hre.ethers

  const {parseEther, formatEther} = ethers.utils;

  const upgrades = hre.upgrades;

  console.log('network:', await ethers.provider.getNetwork())

  const signer = (await ethers.getSigners())[0]
  console.log('signer:', await signer.getAddress())

  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider)

  console.log('deployer:',deployer.address, formatEther(await deployer.getBalance()));

  const BuyToken = await ethers.getContractFactory("TestToken", deployer);

  const buyTestToken = await BuyToken.deploy();
  await buyTestToken.deployed();

  console.log("token Contract deployed to ", buyTestToken.address)


  const SAT = '0x2d97A45D32669bC5a043eC8D33C40fF7858D3607'
  const fee = '0x98911a83795099e63608600788bBE777D7e71E0A'

  /**
   *  Deploy Altura Faucet
   */
  const PrinceNFT = await ethers.getContractFactory('NFTMarketplace', deployer)

  const nftcontract = await upgrades.deployProxy(PrinceNFT, 
    [buyTestToken.address, SAT, fee],
    {initializer: 'initialize',kind: 'uups'});

  await nftcontract.deployed()

  console.log('nftcontract deployed to:', nftcontract.address)

  const upgradeNFT =  false;

  if(upgradeNFT) {

    let nftAddress = '0xbc5eDFE446C1Cd36527f4373A55aC9276C5aF402';

    const PrinceNFTV2 = await ethers.getContractFactory('NFTMarketplace', deployer)
  
    console.log('upgrading proxy')
    await upgrades.upgradeProxy(nftAddress, PrinceNFTV2);

    console.log('PriceNFT V2 upgraded')
  }



  await sleep(1);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
