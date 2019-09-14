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
          alt: `Wizard ${i}`,
          type: "wizard"
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
      alt: `Wizard ${item.id}`,
      type: "wizard"
    };
    nfts.push(wizard);
  });

  return nfts;
}

export async function getKitties(owner, drizzle) {
  let nfts = [];

  if (process.env.NODE_ENV === "development") {
    for (let i = 5; i < 8; i++) {
      const addr = await drizzle.contracts.KittyCore.methods.ownerOf(i).call();
      if (addr == owner) {
        nfts.push({
          id: i,
          src: `https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/${i}.svg`,
          alt: `Kitty ${i}`,
          type: "kitty"
        });
      }
    }
    return nfts;
  }

  let response = await axios.get(
    "https://public.api.cryptokitties.co/v1/kitties",
    {
      params: {
        owner_wallet_address: owner
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
      alt: `Kitty ${item.id}`,
      type: "kitty"
    };
    nfts.push(kitty);
  });

  return nfts;
}
