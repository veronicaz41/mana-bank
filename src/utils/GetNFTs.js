import axios from "axios";

export async function getWizards(owner, drizzle) {
  let nfts = [];

  if (process.env.NODE_ENV === "development") {
    for (let i = 1; i < 5; i++) {
      const addr = await drizzle.contracts.WizardPresale.methods
        .ownerOf(i)
        .call();
      if (addr == owner) {
        nfts.push({
          id: i,
          src: `https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/${i}.svg`,
          alt: `CheezeWizard #${i}`,
          type: "wizard",
          url: `https://opensea.io/assets/0x2f4bdafb22bd92aa7b7552d270376de8edccbc1e/${i}`
        });
      }
    }
    return nfts;
  }

  let response = await axios.get(
    "https://cheezewizards.alchemyapi.io/wizards",
    {
      params: {
        owner: owner
      },
      headers: {
        "Content-Type": "application/json",
        "x-api-token": process.env.VUE_APP_CHEEZE_VERSE_API_KEY,
        "x-email": process.env.VUE_APP_CHEEZE_VERSE_EMAIL
      }
    }
  );
  const wizards = response.data.wizards || [];
  wizards.forEach(item => {
    let wizard = {
      id: item.id,
      src: `https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/${item.id}.svg`,
      alt: `CheezeWizard #${item.id}`,
      type: "wizard",
      url: `https://opensea.io/assets/0x2f4bdafb22bd92aa7b7552d270376de8edccbc1e/${item.id}`
    };
    nfts.push(wizard);
  });

  return nfts;
}

export async function getKitties(owner, drizzle, offset = 0) {
  let nfts = [];

  if (process.env.NODE_ENV === "development") {
    for (let i = 5; i < 8; i++) {
      const addr = await drizzle.contracts.KittyCore.methods.ownerOf(i).call();
      if (addr == owner) {
        nfts.push({
          id: i,
          src: `https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/${i}.svg`,
          alt: `CryptoKitty #${i}`,
          type: "kitty",
          url: `https://opensea.io/assets/0x06012c8cf97bead5deae237070f9587f8e7a266d/${i}`
        });
      }
    }
    return {
      kitties: nfts,
      total: nfts.length
    };
  }

  let response = await axios.get(
    "https://public.api.cryptokitties.co/v1/kitties",
    {
      params: {
        owner_wallet_address: owner,
        offset: offset
      },
      headers: {
        "x-api-token": process.env.VUE_APP_KITTY_VERSE_API_TOKEN
      }
    }
  );
  // response.data { "limit": 12, "offset": 0, "kitties": [], "total": 0 }
  const kitties = response.data.kitties || [];
  kitties.forEach(item => {
    let kitty = {
      id: item.id,
      src: item.image_url,
      alt: item.name || `CryptoKitty #${item.id}`,
      type: "kitty",
      url: `https://opensea.io/assets/0x06012c8cf97bead5deae237070f9587f8e7a266d/${item.id}`
    };
    nfts.push(kitty);
  });

  return {
    kitties: nfts,
    total: response.data.total
  };
}
