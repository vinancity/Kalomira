import {
  homeOutline,
  homeSharp,
  rocketOutline,
  rocketSharp,
  layersOutline,
  layers,
  gridOutline,
  grid,
} from "ionicons/icons";

export interface NavItem {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  menuItems: any;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
    menuItems: [],
  },
  {
    title: "Trade",
    url: "/mintredeem",
    iosIcon: rocketOutline,
    mdIcon: rocketSharp,
    // menuItems: ["Trade", "Mint & Redeem", "Add Liquidity"],
    menuItems: {
      Trade: "/trade",
      "Mint & Redeem": "/mintredeem",
      "Add Liquidity": "/liquidity",
    },
  },
  {
    title: "Stake",
    url: "/farms",
    iosIcon: layersOutline,
    mdIcon: layers,
    // menuItems: ["Farms", "Pools", "Treasury"],
    menuItems: {
      Farms: "/farms",
      Pools: "/pools",
      Treasury: "/treasury",
    },
  },
  {
    title: "More",
    url: "/more",
    iosIcon: gridOutline,
    mdIcon: grid,
    // menuItems: ["Contact", "Docs", "Github"],
    menuItems: {
      Contact: "/",
      Docs: "/",
      Github: "/",
    },
  },
];
