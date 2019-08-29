<template>
  <div>

    <b-container>
      <b-row>
        <b-col cols="9">
          <div id="nav">
            <router-link to="/">Get Mana</router-link> |
            <router-link to="/get_collectibles">Get Collectibles</router-link> |
            <router-link to="/trade">Trade for ETH</router-link>
          </div>
        </b-col>

        <b-col cols="3">
          <div id="balance">
            Balance: 100
          </div>
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>
