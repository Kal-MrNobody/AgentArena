import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, ABIS } from '../contracts/addresses';
import { handleGlobalError } from '../utils/errors';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const BACKEND_URL = `${BASE_URL.replace(/\/$/, '')}/api/agents`;

// The UI mock data uses fake absolute URLs for display (e.g., https://api.agentarena.io/...).
// We must map the agentId to the actual Express backend routes.
const AGENT_BACKEND_ROUTES = {
  1: "/defi/spot-trade",
  2: "/defi/yield-farm",
  3: "/onchain/whale-watch",
  4: "/defi/rebalance",
  5: "/portfolio/monitor",
  6: "/business/schedule",
  7: "/finance/budget",
  8: "/content/write",
  9: "/onchain/gas-optimize",
  10: "/content/schedule",
  11: "/defi/arbitrage",
  12: "/onchain/audit",
  13: "/content/repurpose",
  14: "/dao/vote",
  15: "/business/report",
  16: "/portfolio/risk",
  17: "/finance/save",
  18: "/business/summarize",
  19: "/portfolio/pnl",
  20: "/finance/tax",
  21: "/wildcard/trend-spot",
  22: "/dao/community",
  23: "/business/notify",
  24: "/content/seo",
  25: "/wildcard/airdrop-hunt"
};
/**
 * Core service to handle the pay-then-execute flow of AgentArena.
 * Returns the final execution result or throws a handled error.
 */
export async function executeAgent({
  agentId,
  endpoint,
  price,
  input,
  walletClient,
  publicClient,
  onStateChange
}) {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  try {
    const fetchUrl = endpoint.startsWith('http') 
      ? endpoint 
      : `${BACKEND_URL}${AGENT_BACKEND_ROUTES[agentId] || endpoint}`;

    // STATE 1 - Probing backend
    if (onStateChange) onStateChange('probe');
    
    // In demo mode we can skip the probe and just send a dummy tx
    if (!isDemoMode) {
      const probe = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      });
      
      if (probe.status !== 402) {
        if (!probe.ok) throw new Error(`Backend error: ${probe.statusText}`);
      }
    }

    let txHash = '0xDEMO...MODE';
    const priceWei = parseUnits(price.toString(), 18);
    const vaultAddress = CONTRACT_ADDRESSES.vault;
    const hlusdAddress = CONTRACT_ADDRESSES.hlusd;

    if (!isDemoMode && walletClient && publicClient) {
      const account = walletClient.account;
      
      // STATE 2 - Approving HLUSD
      if (onStateChange) onStateChange('approving');
      
      // Check current allowance first
      const allowance = await publicClient.readContract({
        address: hlusdAddress,
        abi: ABIS.MockHLUSD,
        functionName: 'allowance',
        args: [account.address, vaultAddress]
      });

      if (allowance < priceWei) {
        const approveHash = await walletClient.writeContract({
          address: hlusdAddress,
          abi: ABIS.MockHLUSD,
          functionName: 'approve',
          args: [vaultAddress, parseUnits("1000000", 18)], // Max approve to save UX
          account
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      // STATE 3 - Paying
      if (onStateChange) onStateChange('paying');
      
      const paymentHash = await walletClient.writeContract({
        address: vaultAddress,
        abi: ABIS.AgentVault,
        functionName: 'payForTask',
        args: [agentId, 0, priceWei, account.address, false], // Assuming taskId 0 for direct execution setup
        account
      });
      
      await publicClient.waitForTransactionReceipt({ hash: paymentHash });
      txHash = paymentHash;
    }

    // STATE 4 - Executing
    if (onStateChange) onStateChange('executing');
    
    const result = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'x-payment-tx': txHash,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });
    
    if (!result.ok) {
      const errBody = await result.json();
      throw new Error(errBody.message || 'Execution failed');
    }

    // STATE 5 - Success handled by caller
    return await result.json();

  } catch (err) {
    if (isDemoMode) {
      console.warn('Backend unavailable, falling back to pure demo execution result');
      await new Promise(r => setTimeout(r, 1500)); // Simulate work
      return {
        taskId: `0xDEMO_MODE_${Date.now().toString(16)}`,
        agentId: agentId,
        status: "success",
        result: { 
          // Finance / Portfolio / Analysis
          summary: {
            startValue: "$12,450.00",
            endValue: "$13,892.50",
            pnl: "+$1,442.50",
            pnlPercent: "+11.58%"
          },
          riskScore: 34,
          riskLevel: "Low to Moderate",
          
          // DeFi
          trade: {
            from: "1000 USDC",
            to: "0.245 WETH",
            executionPrice: "4,081.63",
            slippage: "0.02%",
            txHash: `0x${Date.now().toString(16)}abcd1234efgh5678`
          },
          selectedFarm: {
            protocol: "Aave V3",
            pool: "USDC Native",
            apy: "8.4%",
            risk: "Low"
          },
          newAllocation: {
            "USDC": 40,
            "WETH": 35,
            "WBTC": 25
          },

          // Content / Business
          platform: "Agent Automated Delivery",
          readingTime: "2 min read",
          content: "### Execution Report\n\nTask executed successfully based on the provided parameters. I have analyzed the input sequence, modeled the projected outcomes, and finalized the on-chain sub-routines.\n\n**Action Complete.**",
          hashtags: ["#Automation", "#AgentArena", "#Efficiency"],

          // OnChain
          recommendation: {
            optimalWindow: "02:00 UTC - 04:00 UTC",
            savings: "1.24 HLUSD"
          },
          flags: [
            { severity: "LOW", issue: "Slight market volatility detected in recent 1H window." }
          ],
          sentiment: "BULLISH",
          topic: "Macro Trend Alignment"
        }
      };
    }
    handleGlobalError(err);
    throw err;
  }
}
