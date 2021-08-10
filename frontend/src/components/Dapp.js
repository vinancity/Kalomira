import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { ethers } from "ethers";

import KalomiraArtifact from "../contracts/Kalomira.json";
import ibKAIArtifact from "../contracts/ibKAI.json";
import MockLPArtifact from "../contracts/MockLP.json"
import MasterChefArtifact from "../contracts/MasterChef.json"
import contractAddress from "../contracts/contract-address.json";


import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Navbar } from "./Navbar"
import { Home } from "./Home";
import { Farms } from "./Farm/Farms"
import { MintAndRedeem } from "./MintAndRedeem/MintAndRedeem";
import { Loading } from "./Loading";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
//import { NoTokensMessage } from "./NoTokensMessage";
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const ethNetwork = "http://127.0.0.1:8545";
const kaiNetwork = "https://dev-1.kardiachain.io";

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user KALO_balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      //which statewe are on
      pagestate: undefined,
      // The info of the token (i.e. It's Name and symbol)
      KALO_tokenData: undefined,
      ibKAI_tokenData: undefined,
      Pools: [],
      UserInfo: [],
      PendingRewards: [],
      LP_tokenData: [],
      LP1_tokenData: undefined,
      LP2_tokenData: undefined,
      LP3_tokenData: undefined,
      selectedPID: undefined,
      // The user's address and token balances
      selectedAddress: undefined,
      Native_balance: undefined,
      KALO_balance: undefined,
      ibKAI_balance: undefined,
      LP1_balance: undefined,
      LP2_balance: undefined,
      LP3_balance: undefined,
      // The user's stake
      LP_staked: undefined,
      KALO_harvest: undefined,
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
    if (!this.state.Native_balance || !this.state.KALO_tokenData || !this.state.KALO_balance
      || !this.state.ibKAI_tokenData || !this.state.ibKAI_balance
      || !this.state.LP1_tokenData || !this.state.LP1_balance
      || !this.state.LP2_tokenData || !this.state.LP2_balance
      || !this.state.LP3_tokenData || !this.state.LP3_balance
      || !this.state.Pools.length || !this.state.UserInfo.length) {
      return <Loading />;
    }

    return (

      <div>
        <Router>
          <div className="container p-4">
            <Navbar
              address={this.state.selectedAddress}
              KaiBalance={this.state.Native_balance}
              ibKaiBalance={this.state.ibKAI_balance}
            />
          </div>
          <Switch>
            <div className="container p-4">
              <div className="row">
                <div className="col-12">
                  <h1>
                    {this.state.KALO_tokenData.name} ({this.state.KALO_tokenData.symbol})
                  </h1>
                  <p>
                    Welcome <b>{this.state.selectedAddress}</b>
                  </p>
                  <p>
                    You have{" "}
                    <b>
                      {(this.state.ibKAI_balance / (10 ** 18)).toFixed(4)}{" "}{this.state.ibKAI_tokenData.symbol}
                    </b>
                    {", "}
                    <b>
                      {(this.state.LP1_balance / (10 ** 18)).toFixed(4)}{" "}{this.state.LP1_tokenData.name}
                    </b>
                    {", "}
                    <b>
                      {(this.state.LP2_balance / (10 ** 18)).toFixed(4)}{" "}{this.state.LP2_tokenData.name}
                    </b>
                    {", "}and{" "}
                    <b>
                      {(this.state.LP3_balance / (10 ** 18)).toFixed(4)}{" "}{this.state.LP3_tokenData.name}
                    </b>
                    .
                  </p>
                  <div className="row">
                    <div className="col-md-auto">
                      Total LP Staked:
                      <h2>
                        {(this.state.LP_staked) ? (this.state.LP_staked / (10 ** 18)).toFixed(4) : "N/A"}{" LP"}
                      </h2>
                    </div>
                    <div className="col-md-auto">
                      {this.state.KALO_tokenData.symbol} to Harvest:
                      <h2>
                        {(this.state.KALO_harvest) ? (this.state.KALO_harvest / (10 ** 18)).toString() : "N/A"}{" "}{this.state.KALO_tokenData.symbol}
                      </h2>
                    </div>
                    <div className="col-md-auto">
                      {this.state.KALO_tokenData.symbol} in Wallet:
                      <h2>
                        {(this.state.KALO_balance / (10 ** 18)).toString()}{" "}{this.state.KALO_tokenData.symbol}
                      </h2>
                    </div>

                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-12">
                  {this.state.txBeingSent && (
                    <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
                  )}
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
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <Route exact path="/MintAndRedeem">
                    <MintAndRedeem
                      mintIBKAI = {(amount) => this._mintIBKAI(amount)}
                      redeemKAI = {(amount) => this._redeemKAI(amount)}
                      ibKaiContract = {this._ibKaiToken}
                      kaiBal={this.state.Native_balance}
                      ibKaiBal={this.state.ibKAI_balance}
                    />
                  </Route>
                  <Route exact path="/Farm">
                    <Farms
                      stakeLP={(amount) => this._stakeTokens(amount)}
                      unstakeLP={(amount) => this._unstakeTokens(amount)}
                      harvestYield={() => this._harvestYield()}
                      setId={(id) => this.setId(id)}
                      lp_data={this.state.LP_tokenData}
                      pools={this.state.Pools}
                      userInfo={this.state.UserInfo}
                      pendingRewards={this.state.PendingRewards}
                    />
                  </Route>
                </div>
              </div>
            </div>
          </Switch>
        </Router>
      </div>);
  }

  changePageState(newState) {
    //console.log(newState);
    this.setState({ pagestate: newState });
  }

  async setId(id) {
    await this.setState({ selectedPID: id })
    console.log(this.state.selectedPID)
  }

  async totalStaked(userAddr) {
    let length = await this._masterchef.poolLength();
    let total = 0;

    for (let x = 0; x < length; x++) {
      total += Number((await this._masterchef.userInfo(x, userAddr)).amount)
    }
    return total.toString();
  }

  async totalHarvestable(userAddr) {
    let length = await this._masterchef.poolLength();
    let total = 0;

    for (let x = 0; x < length; x++) {
      total += Number((await this._masterchef.pendingKalo(x, userAddr)))
    }
    return total.toString();
  }

  async _mintIBKAI(amount){
    console.log("Depositing %s KAI", amount)
    try {
      this._dismissTransactionError();

      let mintAmount = ethers.utils.parseEther(amount)
      console.log(mintAmount.toString())
      const tx = await this._ibKaiToken.deposit({
        value: mintAmount,
      });

      this.setState({ txBeingSent: tx.hash });
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      await this._updateBalance();
    }
    catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ transactionError: error });
    }
    finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  async _redeemKAI(amount){
    console.log("Returning %s ibKAI", amount)
    try {
      this._dismissTransactionError();

      let redeemAmount = ethers.utils.parseEther(amount)
      console.log(redeemAmount.toString())
      const tx = await this._ibKaiToken.withdraw(redeemAmount);

      this.setState({ txBeingSent: tx.hash });
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      await this._updateBalance();
    }
    catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ transactionError: error });
    }
    finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  async _stakeTokens(amount) {
    console.log("Amount to stake: %s", amount);
    try {
      this._dismissTransactionError();

      let toStake = ethers.utils.parseEther(amount)
      let pid = this.state.selectedPID;
      console.log(pid)
      await this._lp[pid].approve(this._masterchef.address, toStake);
      const tx = await this._masterchef.deposit(pid, toStake);

      this.setState({ txBeingSent: tx.hash });
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      await this._updateBalance();
    }
    catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ transactionError: error });
    }
    finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  async _harvestYield() {
    console.log("Withdrawing yield");
    try {
      this._dismissTransactionError();
      let pid = this.state.selectedPID;
      console.log(pid)
      const tx = await this._masterchef.harvest(pid)

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

  async _unstakeTokens(amount) {
    console.log("Amount to unstake: %s", amount);
    try {
      this._dismissTransactionError();

      let toUnstake = ethers.utils.parseEther(amount)
      let pid = this.state.selectedPID;
      console.log(pid)
      const tx = await this._masterchef.withdraw(pid, toUnstake);

      this.setState({ txBeingSent: tx.hash });
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      await this._updateBalance();
    }
    catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    }
    finally {
      this.setState({ txBeingSent: undefined });
    }
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
      if (symbol === this.state.KALO_tokenData.symbol) {
        console.log("transferring KALO");
        tx = await this._kalToken.transfer(to, toTransfer);
      }
      else if (symbol === this.state.ibKAI_tokenData.symbol) {
        console.log("transferring KAI");
        tx = await this._ibKaiToken.transfer(to, toTransfer);
      }
      else {
        throw new Error("Cannot transfer token");
      }

      this.setState({ txBeingSent: tx.hash });
      console.log(tx);

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
      // update your state. Here, we update the user's KALO_balance.
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
    // We poll the user's KALO_balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _getAccounts() {
    let accounts;
    try {
      accounts = (await this._wallet.send("eth_requestAccounts")).result
    }
    catch (error) {
      console.error(this._getRpcErrorMessage(error))
    }

    if (!accounts) {
      accounts = await this._wallet.enable()
    }
    return accounts;
  }

  async _connectWallet(wallet) {
    this._wallet = wallet;
    const [selectedAddress] = await this._getAccounts()
    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!(await this._checkNetwork())) {
      return;
    }
    await this._initialize(selectedAddress);

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

  async _initialize(userAddress) {

    this.setState({
      pagestate: 'frontpage',
      selectedAddress: userAddress,
    });

    // initialize ethers, fetch the token's data, and start polling balance

    await this._intializeEthers();
    await this._getTokenData();
    this._startPollingData();
  }

  async _intializeEthers() {
    // provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(this._wallet);
    //this._provider = new ethers.providers.Web3Provider(window.kardiachain);

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


    this._lp1 = new ethers.Contract(
      contractAddress.MockLP1,
      MockLPArtifact.abi,
      this._provider.getSigner(0)
    );
    this._lp2 = new ethers.Contract(
      contractAddress.MockLP2,
      MockLPArtifact.abi,
      this._provider.getSigner(0)
    );
    this._lp3 = new ethers.Contract(
      contractAddress.MockLP3,
      MockLPArtifact.abi,
      this._provider.getSigner(0)
    );

    this._lp = [];
    this._lp.push(this._lp1)
    this._lp.push(this._lp2)
    this._lp.push(this._lp3)

    this._masterchef = new ethers.Contract(
      contractAddress.MasterChef,
      MasterChefArtifact.abi,
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
    this.setState({ KALO_tokenData: { name, symbol } });

    name = await this._ibKaiToken.name();
    symbol = await this._ibKaiToken.symbol();
    this.setState({ ibKAI_tokenData: { name, symbol } });

    name = await this._lp1.name();
    symbol = await this._lp1.symbol();
    this.setState({ LP1_tokenData: { name, symbol } });
    this.setState({ LP_tokenData: [...this.state.LP_tokenData, { name, symbol }] })

    name = await this._lp2.name();
    symbol = await this._lp2.symbol();
    this.setState({ LP2_tokenData: { name, symbol } });
    this.setState({ LP_tokenData: [...this.state.LP_tokenData, { name, symbol }] })

    name = await this._lp3.name();
    symbol = await this._lp3.symbol();
    this.setState({ LP3_tokenData: { name, symbol } });
    this.setState({ LP_tokenData: [...this.state.LP_tokenData, { name, symbol }] })

    const Pools = [];
    const UserInfo = [];
    const PendingRewards = [];

    let length = await this._masterchef.poolLength();
    for (let x = 0; x < length; x++) {
      Pools.push(await this._masterchef.poolInfo(x))
      UserInfo.push(await this._masterchef.userInfo(x, this.state.selectedAddress))
      PendingRewards.push(await this._masterchef.pendingKalo(x, this.state.selectedAddress))
    }

    this.setState({ Pools })
    console.log(this.state.Pools)
    this.setState({ UserInfo })
    console.log(this.state.UserInfo)
    this.setState({ PendingRewards })
    console.log(this.state.PendingRewards)
  }

  async _updateBalance() {
    const Native_balance = await this._provider.getBalance(this.state.selectedAddress);
    this.setState({ Native_balance });

    const KALO_balance = await this._kalToken.balanceOf(this.state.selectedAddress);
    this.setState({ KALO_balance });

    const KALO_harvest = await this.totalHarvestable(this.state.selectedAddress);
    this.setState({ KALO_harvest });

    const ibKAI_balance = await this._ibKaiToken.balanceOf(this.state.selectedAddress);
    this.setState({ ibKAI_balance });

    const LP_staked = await this.totalStaked(this.state.selectedAddress)
    this.setState({ LP_staked });

    const LP1_balance = await this._lp1.balanceOf(this.state.selectedAddress);
    this.setState({ LP1_balance });

    const LP2_balance = await this._lp2.balanceOf(this.state.selectedAddress);
    this.setState({ LP2_balance });

    const LP3_balance = await this._lp3.balanceOf(this.state.selectedAddress);
    this.setState({ LP3_balance });

    const UserInfo = [];
    const PendingRewards = [];
    let length = await this._masterchef.poolLength();
    for (let x = 0; x < length; x++) {
      UserInfo.push(await this._masterchef.userInfo(x, this.state.selectedAddress))
      PendingRewards.push(await this._masterchef.pendingKalo(x, this.state.selectedAddress))
    }
    this.setState({ UserInfo })
    this.setState({ PendingRewards })

    console.log("Block: ", (await this._masterchef.getBlock()).toString())
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
    if (this._wallet === window.ethereum && chainID.result === "31337") {
      return true;
    }
    if (this._wallet === window.kardiachain && chainID.result === "69") {
      return true;
    }

    this.setState({
      networkError: `Please connect Wallet to ${this._wallet === window.ethereum ? ethNetwork : kaiNetwork}`
    });

    return false;
  }
}
