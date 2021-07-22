import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import KalomiraArtifact from "../contracts/Kalomira.json";
//import KardiaArtifact from "../contracts/Kardia.json";
import ibKAIArtifact from "../contracts/ibKAI.json";
import TokenFarmArtifact from "../contracts/TokenFarm.json"
import contractAddress from "../contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { Frontpage } from "./Frontpage";
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Stake } from "./Stake";
import { Unstake } from "./Unstake";
import { WithdrawYield } from "./WithdrawYield";
import { Transfer } from "./Transfer";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const ethNetwork = "http://127.0.0.1:8545";
const kaiNetwork = "https://dev-1.kardiachain.io";
const Web3 = require("web3");

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user KAL_balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class KaiDapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      //which statewe are on
      pagestate: undefined,
      // The info of the token (i.e. It's Name and symbol)
      KAL_tokenData: undefined,
      KAI_tokenData: undefined,
      // The user's address and token balances
      selectedAddress: undefined,
      KAL_balance: undefined,
      KAI_balance: undefined,
      // The user's stake
      KAI_staked: undefined, 
      KAL_harvest: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (!window.ethereum && !window.kardiachain) {
      return <NoWalletDetected />;
    }

    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={(wallet) => this._connectWallet(wallet)} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If the token data or the user's Balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.KAL_tokenData || !this.state.KAL_balance || !this.state.KAI_tokenData || !this.state.KAI_balance) {
      return <Loading />;
    }

    return (
      
      <div className="container p-4">       
        <div className="row">
          <div className="col-12">
            <h1>
              {this.state.KAL_tokenData.name} ({this.state.KAL_tokenData.symbol})
            </h1>
            <p>
              Welcome <b>{this.state.selectedAddress}</b>, you have{" "}
              <b>
                {(this.state.KAI_balance/(10**18)).toString()}{" "}{this.state.KAI_tokenData.symbol}
              </b>
              .
            </p>
            <div className="row">
            <div className="col-md-auto">
                KAI Staked:
                <h2>
                  { (this.state.KAI_staked) ? (this.state.KAI_staked/(10**18)).toString() : "N/A" }
                  {" "}
                  {this.state.KAI_tokenData.symbol}
                </h2>
              </div>
              <div className="col-md-auto">
                KAL to Harvest:
                <h2>
                  {(this.state.KAL_harvest) ? (this.state.KAL_harvest/(10**18)).toString() : "N/A"}{" "}{this.state.KAL_tokenData.symbol}
                </h2>
              </div>
              <div className="col-md-auto">
                KAL in Wallet:
                <h2>
                  {(this.state.KAL_balance/(10**18)).toString()}{" "}{this.state.KAL_tokenData.symbol}
                </h2>
              </div>
              
            </div>
          </div>
        </div>

        <hr />

        {
          // Bring back to Homepage for any component
        }
        <div className="row">
          {this.state.pagestate !== 'frontpage' && (
          <div className="btn" role="group">
            <button className="btn btn-secondary" type="button" 
              onClick={() => {
                this.setState({pagestate: 'frontpage'});
              }
            }>Back to Home</button>
          </div>)}
        </div>

        <div className="row">
          <div className="col-12">
            {/* 
              Sending a transaction isn't an immidiate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {
              // Front page
            }
            {this.state.pagestate === 'frontpage' &&
              (<Frontpage changeState={(pgstate) => 
                this.changePageState(pgstate)}
                />
            )}
            {/*
              If the user has no tokens, we don't show the Tranfer form
            */}
            {this.state.KAL_balance.eq(0) && this.state.KAI_balance.eq(0) && (
              <NoTokensMessage selectedAddress={this.state.selectedAddress} />
            )}
            {
              // Stake
            }
            {this.state.pagestate === 'stake' && this.state.KAI_balance.gt(0) && (
             <Stake 
                stakeTokens={(amount) =>
                  this._stakeTokens(amount)
                }
                tokenSymbol={this.state.KAI_tokenData.symbol}
             /> 
            )}
            {
              // Withdraw Yield
            }
            {this.state.pagestate === 'withdraw' && (
             <WithdrawYield 
                withdrawYield={() => 
                  this._withdrawYield()
                }
                tokenSymbol={this.state.KAL_tokenData.symbol}
             /> 
            )}
            {
              // Unstake
            }
            {this.state.pagestate === 'unstake' && (
             <Unstake 
                unstakeTokens={(amount) =>
                  this._unstakeTokens(amount)
                }
                tokenSymbol={this.state.KAI_tokenData.symbol}
             /> 
            )}

            {this.state.pagestate === 'transferKAL' && this.state.KAL_balance.gt(0) && (
              <Transfer
                transferTokens={(to, amount, symbol) =>
                  this._transferTokens(to, amount, symbol)
                }
                tokenSymbol={this.state.KAL_tokenData.symbol}
              />
            )}

            {this.state.pagestate === 'transferKAI' && this.state.KAI_balance.gt(0) && (
              <Transfer
                transferTokens={(to, amount, symbol) =>
                  this._transferTokens(to, amount, symbol)
                }
                tokenSymbol={this.state.KAI_tokenData.symbol}
              />
            )}
            
          </div>
        </div>
      </div>
    );
  }

  changePageState(newState) {
    //console.log(newState);
    this.setState({pagestate: newState});
  }

  async _stakeTokens(amount){
    console.log("Amount to stake: %s", amount);
    try {
      this._dismissTransactionError();

      let toStake = ethers.utils.parseEther(amount.toString())
      await this._ibKaiToken.approve(this._kalFarm.address, toStake);
      const tx = await this._kalFarm.stake(toStake);

      this.setState({ txBeingSent: tx.hash });
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      await this._updateBalance();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  async _unstakeTokens(amount){
    console.log("Amount to unstake: %s", amount);
    try {
      this._dismissTransactionError();

      let toUnstake = ethers.utils.parseEther(amount.toString())
      const tx = await this._kalFarm.unstake(toUnstake);
      
      this.setState({ txBeingSent: tx.hash });
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      await this._updateBalance();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  async _withdrawYield(){
    console.log("Withdrawing yield");
    try {
      this._dismissTransactionError();
      const tx = await this._kalFarm.withdrawYield();
      
      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();      

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      await this._updateBalance();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  componentWillUnmount() {
    // We poll the user's KAL_balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _getAccounts() {
    let accounts;
    try {
      accounts = (await this._wallet.send("eth_requestAccounts")).result
    }
    catch(error){
      console.error(this._getRpcErrorMessage(error))
    }

    if(!accounts) {
      accounts = await this._wallet.enable()
    }
    return accounts;
  }

  async _connectWallet(wallet) {    
    this._wallet = wallet;
    console.log(wallet)
    const [selectedAddress] = await this._getAccounts()
    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!(await this._checkNetwork())) {
      return;
    }
    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    this._wallet.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    this._wallet.on("networkChanged", ([networkId]) => {
      console.log("Network ID changed to: %s", networkId);
      this._stopPollingData();
      this._resetState();
      return window.location.reload();
    });

    // We reset the dapp state if the network is changed
    this._wallet.on("chainChanged", ([chainId]) => {
      console.log("Chain ID changed to: %s", chainId);
      this._stopPollingData();
      this._resetState();
      return window.location.reload();
    });
  }


  _initialize(userAddress) {

    this.setState({
      pagestate: 'frontpage',
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    this._intializeEthers();
    this._getTokenData();
    this._startPollingData();
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(this._wallet);
    //this._provider = new ethers.providers.Web3Provider(window.kardiachain);

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._kalToken = new ethers.Contract(
      //contractAddress.Kalomira,
      this._wallet === window.ethereum ? contractAddress.Kalomira : "0x6765ed069D4f20e061B6489fB0ae11C6797ABf63",
      KalomiraArtifact.abi,
      this._provider.getSigner(0)
    );

    this._ibKaiToken = new ethers.Contract(
      //contractAddress.ibKAI,
      this._wallet === window.ethereum ? contractAddress.ibKAI : "0x73aBef771479d89a93ACd896772608ae2625e18b",
      ibKAIArtifact.abi,
      this._provider.getSigner(0)
    );

    this._kalFarm = new ethers.Contract(
      //contractAddress.TokenFarm,
      this._wallet === window.ethereum ? contractAddress.TokenFarm :"0xa154926A29c8e063d09D2F3FE0d5278F745E3339",
      TokenFarmArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  // The next to methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTokenData() {
    let name = await this._kalToken.name();
    let symbol = await this._kalToken.symbol();

    this.setState({ KAL_tokenData: { name, symbol } });

    
    name = await this._ibKaiToken.name();
    symbol = await this._ibKaiToken.symbol();

    this.setState({ KAI_tokenData: { name, symbol } });
  }

  async _updateBalance() {
    const KAL_balance = await this._kalToken.balanceOf(this.state.selectedAddress);
    this.setState({ KAL_balance });
   

    const KAI_balance = await this._ibKaiToken.balanceOf(this.state.selectedAddress);
    this.setState({ KAI_balance });

    
    const KAI_staked = await this._kalFarm.stakingBalance(this.state.selectedAddress);
    this.setState({ KAI_staked });
    
    const KAL_harvest = (await this._kalFarm.calculateYieldTotal(this.state.selectedAddress));

    this.setState({ KAL_harvest });
  }
  
  async _transferTokens(to, amount, symbol) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();
      
      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      let tx;
      let toTransfer = ethers.utils.parseEther(amount.toString())
      if(symbol === this.state.KAL_tokenData.symbol){
        console.log("transferring KAL");
        tx = await this._kalToken.transfer(to, toTransfer);
      }
      else if(symbol === this.state.KAI_tokenData.symbol){
        console.log("transferring KAI");
        tx = await this._ibKaiToken.transfer(to, toTransfer);
      }
      else{
        throw new Error("Cannot transfer token");
      }
      
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();
      
      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that make the transaction fail once it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's KAL_balance.
      await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  // method clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // method clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // utility method that turns an RPC error into a human readable message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }
    return error.message;
  }

  // method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // method checks if wallet connected to deplyoed network
  async _checkNetwork() {
    let chainID = await this._wallet.send("net_version")
    if(this._wallet === window.ethereum && chainID.result === "31337"){
      return true;
    }
    if (this._wallet === window.kardiachain && chainID.result === "69"){
      return true;
    }

    this.setState({ 
      networkError: `Please connect Wallet to ${this._wallet === window.ethereum ? ethNetwork : kaiNetwork}`
    });

    return false;
  }
}
