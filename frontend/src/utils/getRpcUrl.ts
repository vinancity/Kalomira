import sample from "lodash/sample";

export const getNodeUrl = () => {
	return process.env.REACT_APP_NODE_DEFAULT;
};

export const getEthereumUrl = () => {
	return process.env.REACT_APP_NODE_ETH;
};

export const getKardiaUrl = () => {
	return process.env.REACT_APP_NODE_KAI;
};

export default getNodeUrl;
