<template>
  <div id="about">
    <b-container>
      <b-row>
        <b-col>
          <h4>What</h4>
          <p>
            ManaBank is a way for CheezeWizards and CryptoKitties owners to get
            instant liquidity on their spare collectibles.
          </p>

          <p>
            It was built by
            <a href="https://github.com/veronicaz41">Veronica Zheng</a> and
            <a href="https://www.lakshmansankar.com/">Lakshman Sankar</a> for
            the
            <a
              href="https://coinlist.co/build/cheezewizards"
            >CheezeWizards+CoinList hackathon</a>.
          </p>

          <h4>How</h4>
          <p>
            ManaBank introduces a new ERC20 token contract called XMN, that can
            be redeemed by 'exiling' Kitties or Wizards. Exiling a wizard or
            kitty puts it in direct custody of the XMN contract, but grants you
            a fixed amount (currently 10) of XMN for each exiled item.
          </p>XMN can be:
          <ol>
            <li>used to 'summon' a random kitty or wizard held by the XMN contract</li>
            <li>
              traded anywhere you can trade ERC20s. We're starting the XMN
              economy by seeding an ETH/XMN Uniswap pool
            </li>
          </ol>

          <!-- TODO: Add link for mainnet deploy! -->
          <p>
            The ManaBank contract is currently deployed on mainnet
            <a
              href="https://etherscan.io"
            >here</a>
          </p>

          <h4>Why</h4>

          <p>
            As fun as NFT games are, sometimes you want to sell your game items.
            And when you do, it's hard to find a counterparty that wants to buy
            the exact item you're selling.
          </p>

          <p>
            We think that the XMN token is a step towards bridging that gap by
            giving NFT owners something fungible
            <em>immediately</em> for their
            tokens. And because XMN is immediately redeemable for a random
            Wizard or Kitty that's been deposited in the contract, it's always
            guarantee to have a floor market value.
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style scoped>
h4 {
  padding-top: 24px;
}
.row {
  margin-left: 12.5%;
  margin-right: 12.5%;
}
</style>
