import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import KalomiraArtifact from "../contracts/Kalomira.json";
import KardiaArtifact from "../contracts/Kardia.json";
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
import { Transfer } from "./Transfer";
import { Exchange } from "./Exchange"
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";

// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '31337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

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
      //which state we are on
      pagestate: undefined,
      // The info of the token (i.e. It's Name and symbol)
      KAL_tokenData: undefined,
      KAI_tokenData: undefined,
      // The user's address and token balances
      selectedAddress: undefined,
      KAL_balance: undefined,
      KAI_balance: undefined,
      // The user's token deposit 
      KAL_deposit: undefined,
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
    if (window.kardiachain === undefined) {      
      return <NoWalletDetected />;
    }
    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If the token data or the user's Balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.KAL_tokenData || !this.state.KAL_balance || !this.state.KAI_tokenData || !this.state.KAI_balance || !this.state.KAL_deposit) {
      return <Loading />;
    }

    // If everything is loaded, we render the application.
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
                {this.state.KAL_balance.toString()} {this.state.KAL_tokenData.symbol}
              </b>
              {" "}and{" "}
              <b>
                {this.state.KAI_balance.toString()} {this.state.KAI_tokenData.symbol}
              </b>
              .
            </p>
            <div className="row">
              <div className="col-md-auto">
                KAL to Harvest:
                <h2>
                  {this.state.KAL_deposit.toString()} {this.state.KAL_tokenData.symbol}
                </h2>
              </div>
              <div className="col-md-auto">
                KAL in Wallet:
                <h2>
                  {this.state.KAL_balance.toString()} {this.state.KAL_tokenData.symbol}
                </h2>
              </div>
              <div className="col-md-auto">
                KAI in Wallet:
                <h2>
                  {this.state.KAI_balance.toString()} {this.state.KAI_tokenData.symbol}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="row">
          {this.state.pagestate !== 'frontpage' && (
          <div className="btn" role="group">
            <button className="btn btn-secondary" type="button" 
              onClick={() => {
                this.setState({pagestate: 'frontpage'});
                console.log('frontpage');
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
                this.changePageState(pgstate)
              }/>)        
            }
            {/*
              If the user has no tokens, we don't show the Tranfer form
            */}
            {this.state.KAL_balance.eq(0) && this.state.KAI_balance.eq(0) && (
              <NoTokensMessage selectedAddress={this.state.selectedAddress} />
            )}
            {
              // Deposit
            }
            {this.state.pagestate === 'stake' && this.state.KAL_balance.gt(0) && (
             <Stake 
                depositTokens={(amount) =>
                  this._depositTokens(amount)
                }
                tokenSymbol={this.state.KAL_tokenData.symbol}
             /> 
            )}
            {
              // Withdraw
            }
            {this.state.pagestate === 'unstake' && (
             <Unstake 
                withdrawTokens={(amount) =>
                  this._withdrawTokens(amount)
                }
                tokenSymbol={this.state.KAL_tokenData.symbol}
             /> 
            )}
            {/*
              This component displays a form that the user can use to send a 
              transaction and transfer some tokens.
              The component doesn't have logic, it just calls the transferTokens
              callback.
            */}
            {this.state.pagestate === 'transfer' && this.state.KAL_balance.gt(0) && (
              <Transfer
                transferTokens={(to, amount) =>
                  this._transferTokens(to, amount)
                }
                tokenSymbol={this.state.KAL_tokenData.symbol}
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
            {
              // Exchange
            }
            {this.state.pagestate === 'exchange' && (this.state.KAL_balance.gt(0) || this.state.KAI_balance.gt(0)) && (
             <Exchange /> 
            )}
          </div>
        </div>
      </div>
    );
  }

  changePageState(newState) {
    console.log(newState);
    this.setState({pagestate: newState});
  }

  async _depositTokens(amount){
    console.log("Despoit amount: %s", amount);
    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._kalToken.deposit(amount);
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

  async _withdrawTokens(amount){
    console.log("Despoit amount: %s", amount);
    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._kalToken.withdraw(amount);
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

  componentWillUnmount() {
    // We poll the user's KAL_balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    //const [selectedAddress] = await window.ethereum.request({ method: "eth_requestAccounts"})
    const [selectedAddress] = await window.kardiachain.request({ method: "eth_requestAccounts"})

    //console.log("Kardia wallet: %s", KAIaccount);

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!(await this._checkNetwork())) {
      return;
    }

    this._initialize(selectedAddress);

    window.kardiachain.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });

    window.kardiachain.on("networkChanged", ([networkId]) => {
        this._stopPollingData();
        this._resetState();
    });
/*
    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
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
    window.ethereum.on("networkChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });*/
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      pagestate: 'frontpage',
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's KAL_balance.

    // Fetching the token data and the user's KAL_balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._intializeEthers();
    this._getTokenData();
    this._startPollingData();
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    //this._provider = new ethers.providers.Web3Provider(window.ethereum);
    window.kardiachain.networkVersion = HARDHAT_NETWORK_ID;
    window.kardiachain.chainId = "0x" + parseInt(HARDHAT_NETWORK_ID).toString(16);
    this._provider = new ethers.providers.Web3Provider(window.kardiachain);

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._kalToken = new ethers.Contract(
      contractAddress.Kalomira,
      KalomiraArtifact.abi,
      this._provider.getSigner(0)
    );

    this._kaiToken = new ethers.Contract(
      contractAddress.Kardia,
      KardiaArtifact.abi,
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
    let decimals = await this._kalToken.decimals();

    this.setState({ KAL_tokenData: { name, symbol, decimals } });

    
    name = await this._kaiToken.name();
    symbol = await this._kaiToken.symbol();
    decimals = await this._kaiToken.decimals();

    this.setState({ KAI_tokenData: { name, symbol, decimals } });
  }

  async _updateBalance() {
    let KAL_balance = await this._kalToken.balanceOf(this.state.selectedAddress);
    this.setState({ KAL_balance });   

    let KAI_balance = await this._kaiToken.balanceOf(this.state.selectedAddress);
    this.setState({ KAI_balance });
    
    let KAL_deposit = await this._kalToken.depositAmount(this.state.selectedAddress);
    this.setState({ KAL_deposit });
  }
  
  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
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
      if(symbol === this.state.KAL_tokenData.symbol){
        console.log("transferring KAL");
        tx = await this._kalToken.transfer(to, amount);
      }
      else if(symbol === this.state.KAI_tokenData.symbol){
        console.log("transferring KAI");
        tx = await this._kaiToken.transfer(to, amount);
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

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Localhost:8545 
  async _checkNetwork() {  
    let chainID = await window.kardiachain.request({ method: "eth_chainId"})
    chainID = (parseInt(chainID)).toString();
    if (chainID === HARDHAT_NETWORK_ID){
      return true;
    }
/*
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }*/

    this.setState({ 
      networkError: 'Please connect Kardia Wallet to Localhost:8545'
    });

    return false;
  }
}
