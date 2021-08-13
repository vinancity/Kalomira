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
}

export const navItems: NavItem[] = [
	{
		title: "Home",
		url: "/home",
		iosIcon: homeOutline,
		mdIcon: homeSharp,
	},
	{
		title: "Mint & Redeem",
		url: "/mintredeem",
		iosIcon: rocketOutline,
		mdIcon: rocketSharp,
	},
	{
		title: "Farms",
		url: "/farms",
		iosIcon: layersOutline,
		mdIcon: layers,
	},
	{
		title: "More",
		url: "/more",
		iosIcon: gridOutline,
		mdIcon: grid,
	},
];
