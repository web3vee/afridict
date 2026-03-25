const { ethers } = require("ethers");
const Market = require("../models/Market");
const path = require("path");
const fs = require("fs");

let provider;
let contract;

function getABI() {
  const abiPath = path.join(__dirname, "../contracts/PredictionMarket.json");
  if (!fs.existsSync(abiPath)) {
    console.warn("ABI not found — run `npx hardhat compile` and copy artifacts");
    return null;
  }
  return JSON.parse(fs.readFileSync(abiPath)).abi;
}

function getAddresses() {
  const addrPath = path.join(__dirname, "../contracts/addresses.json");
  if (!fs.existsSync(addrPath)) {
    console.warn("addresses.json not found — run deploy script first");
    return null;
  }
  return JSON.parse(fs.readFileSync(addrPath));
}

async function initBlockchainListener(io) {
  const abi = getABI();
  const addresses = getAddresses();
  if (!abi || !addresses) return;

  const rpcUrl = process.env.POLYGON_RPC_URL || "http://127.0.0.1:8545";
  provider = new ethers.JsonRpcProvider(rpcUrl);
  contract = new ethers.Contract(addresses.PredictionMarket, abi, provider);

  console.log("Blockchain listener started for:", addresses.PredictionMarket);

  // MarketCreated event
  contract.on("MarketCreated", async (marketId, description, category, region, endTime, event) => {
    try {
      const id = Number(marketId);
      await Market.findOneAndUpdate(
        { contractId: id },
        {
          contractId: id,
          description,
          category,
          region,
          endTime: new Date(Number(endTime) * 1000),
          resolutionTime: new Date(Number(endTime) * 1000 + 86400000),
          creator: event.log.address,
          status: "open",
        },
        { upsert: true, new: true }
      );
      io.emit("market:created", { marketId: id, description, category, region });
      console.log("Market created:", id, description.substring(0, 40));
    } catch (err) {
      console.error("Error handling MarketCreated:", err);
    }
  });

  // BetPlaced event
  contract.on("BetPlaced", async (marketId, user, outcome, amount, shares) => {
    try {
      const id = Number(marketId);
      const isYes = Number(outcome) === 1;
      const amountNum = Number(ethers.formatUnits(amount, 6));

      const update = {
        $inc: {
          yesPool: isYes ? amountNum : 0,
          noPool: isYes ? 0 : amountNum,
          totalVolume: amountNum,
        },
      };

      const market = await Market.findOneAndUpdate({ contractId: id }, update, { new: true });

      if (market) {
        io.to(`market:${id}`).emit("market:bet", {
          marketId: id,
          outcome: isYes ? "yes" : "no",
          amount: amountNum,
          yesPool: market.yesPool,
          noPool: market.noPool,
          yesOdds: market.yesOdds,
          noOdds: market.noOdds,
        });
      }
    } catch (err) {
      console.error("Error handling BetPlaced:", err);
    }
  });

  // MarketResolved event
  contract.on("MarketResolved", async (marketId, outcome) => {
    try {
      const id = Number(marketId);
      const resolvedOutcome = Number(outcome) === 1 ? "yes" : "no";

      await Market.findOneAndUpdate(
        { contractId: id },
        { status: "resolved", outcome: resolvedOutcome }
      );

      io.emit("market:resolved", { marketId: id, outcome: resolvedOutcome });
      console.log(`Market ${id} resolved: ${resolvedOutcome}`);
    } catch (err) {
      console.error("Error handling MarketResolved:", err);
    }
  });

  // MarketCancelled event
  contract.on("MarketCancelled", async (marketId) => {
    const id = Number(marketId);
    await Market.findOneAndUpdate({ contractId: id }, { status: "cancelled" });
    io.emit("market:cancelled", { marketId: id });
  });
}

async function getContractData(marketId) {
  if (!contract) return null;
  const market = await contract.getMarket(marketId);
  return market;
}

module.exports = { initBlockchainListener, getContractData };
