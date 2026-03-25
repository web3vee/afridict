const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying AfriPredict contracts with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC");

  // 1. Deploy Mock USDT (testnet only — on mainnet use real USDT: 0xc2132D05D31c914a87C6611C10748AEb04B58e8F)
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  console.log("MockUSDT deployed to:", await usdt.getAddress());

  // 2. Deploy Mock Oracle (testnet only)
  const MockOracle = await ethers.getContractFactory("MockOracle");
  const oracle = await MockOracle.deploy();
  await oracle.waitForDeployment();
  console.log("MockOracle deployed to:", await oracle.getAddress());

  // 3. Deploy PredictionMarket
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const market = await PredictionMarket.deploy(await usdt.getAddress());
  await market.waitForDeployment();
  console.log("PredictionMarket deployed to:", await market.getAddress());

  // 4. Approve deployer KYC
  await market.setKYC(deployer.address, true);
  console.log("Deployer KYC approved");

  // 5. Create sample African markets
  const now = Math.floor(Date.now() / 1000);
  const oneDay = 86400;
  const oneWeek = 7 * oneDay;

  const sampleMarkets = [
    {
      description: "Will the ANC win the 2024 South African general election with >50% of votes?",
      category: "election",
      region: "South Africa",
      endTime: now + oneWeek,
      resolutionTime: now + oneWeek + oneDay,
    },
    {
      description: "Will Nigeria qualify for the 2026 FIFA World Cup from African qualifiers?",
      category: "sports",
      region: "Nigeria",
      endTime: now + oneWeek * 4,
      resolutionTime: now + oneWeek * 4 + oneDay,
    },
    {
      description: "Will Cocoa price exceed $4000/ton on the ICE by end of Q2 2026?",
      category: "commodity",
      region: "West Africa",
      endTime: now + oneWeek * 8,
      resolutionTime: now + oneWeek * 8 + oneDay,
    },
    {
      description: "Will the Kenyan Shilling (KES) depreciate more than 10% against USD this year?",
      category: "economy",
      region: "Kenya",
      endTime: now + oneWeek * 12,
      resolutionTime: now + oneWeek * 12 + oneDay,
    },
    {
      description: "Will Senegal win the 2025 Africa Cup of Nations (AFCON)?",
      category: "sports",
      region: "West Africa",
      endTime: now + oneWeek * 2,
      resolutionTime: now + oneWeek * 2 + oneDay,
    },
  ];

  for (const m of sampleMarkets) {
    const tx = await market.createMarket(
      m.description,
      m.category,
      m.region,
      m.endTime,
      m.resolutionTime,
      ethers.ZeroAddress,  // manual resolution for samples
      ethers.ZeroHash
    );
    await tx.wait();
    console.log(`Market created: "${m.description.substring(0, 50)}..."`);
  }

  // 6. Save contract addresses to frontend & backend
  const addresses = {
    PredictionMarket: await market.getAddress(),
    MockUSDT: await usdt.getAddress(),
    MockOracle: await oracle.getAddress(),
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
  };

  const addressesJson = JSON.stringify(addresses, null, 2);

  fs.writeFileSync(
    path.join(__dirname, "../frontend/src/contracts/addresses.json"),
    addressesJson
  );
  fs.writeFileSync(
    path.join(__dirname, "../backend/contracts/addresses.json"),
    addressesJson
  );

  console.log("\n✅ Deployment complete!");
  console.log("Addresses saved to frontend and backend.");
  console.log(addresses);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
