import { useState, useEffect, useCallback } from 'react';

import { CONTRACT_ADDRESSES } from '../contracts/addresses';

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [isConnected, setIsConnected] = useState(false);

  const fetchBalance = useCallback(async (addr) => {
    try {
      const hlusdAddress = CONTRACT_ADDRESSES.hlusd;
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

      if (!hlusdAddress || hlusdAddress === '0x0000000000000000000000000000000000000000') {
        if (isDemoMode) {
          setBalance('15.00');
        } else {
          setBalance('0.00');
        }
        return;
      }

      // Check Chain ID first
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      // 666888 in hex is 0xa2d08
      if (chainId !== '0xa2d08') {
        console.warn('Wrong network. Please switch to HeLa Official Runtime Testnet (666888)');
        setBalance('0.00');
        return;
      }

      const data = '0x70a08231' + addr.replace('0x', '').padStart(64, '0');
      const result = await window.ethereum.request({
        method: 'eth_call',
        params: [{ to: hlusdAddress, data }, 'latest']
      });
      // Handle the 0x result appropriately
      if (result === '0x' || result === '0x0') {
         setBalance('0.00');
      } else {
         const wei = BigInt(result);
         const balanceInHLUSD = Number(wei) / 1e18;
         setBalance(balanceInHLUSD.toFixed(3));
      }
    } catch (err) {
      console.error('fetchBalance error:', err);
      setBalance('0.00');
    }
  }, []);

  const syncAccounts = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        fetchBalance(accounts[0]);
      } else {
        setAddress(null);
        setIsConnected(false);
        setBalance('0.00');
      }
    } catch {
      // silent fail
    }
  }, [fetchBalance]);

  useEffect(() => {
    // Check on mount
    syncAccounts();

    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        fetchBalance(accounts[0]);
      } else {
        setAddress(null);
        setIsConnected(false);
        setBalance('0.00');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', syncAccounts);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', syncAccounts);
    };
  }, [syncAccounts, fetchBalance]);

  const connect = async () => {
    if (!window.ethereum) {
      alert('MetaMask not found. Please install MetaMask to continue.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        
        // Enforce HeLa Testnet
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0xa2d08') {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xa2d08' }],
            });
          } catch (switchError) {
             // If chain doesn't exist, try adding it
             if (switchError.code === 4902) {
               await window.ethereum.request({
                 method: 'wallet_addEthereumChain',
                 params: [{
                   chainId: '0xa2d08',
                   chainName: 'HeLa Official Runtime Testnet',
                   nativeCurrency: { name: 'HLUSD', symbol: 'HLUSD', decimals: 18 },
                   rpcUrls: ['https://testnet-rpc.helachain.com'],
                   blockExplorerUrls: ['https://testnet-explorer.helachain.com']
                 }]
               });
             } else {
                 console.error('Failed to switch network:', switchError);
             }
          }
        }

        setAddress(accounts[0]);
        setIsConnected(true);
        fetchBalance(accounts[0]);
      }
    } catch (err) {
      if (err.code === 4001) {
        console.log('User rejected the connection request.');
      } else {
        console.error('Connect error:', err);
      }
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance('0.00');
  };

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return { address, balance, isConnected, connect, disconnect, shortAddress };
}
