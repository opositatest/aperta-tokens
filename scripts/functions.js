const axios = require('axios');

const FIGMA_API_BASE_URL = 'https://api.figma.com';
const SRC_FOLDER = './src/icons/downloaded/';
const FIGMA_TOKENS_PATH = './src/tokens/';

const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const generateApiData = () => {
  const figmaUrl = new URL(process.env.FIGMA_FILE_URL);

  return {
    API_HEADERS: {
      headers: {
        'X-FIGMA-TOKEN': process.env.FIGMA_PERSONAL_ACCESS_TOKEN,
      },
    },
    FILE_KEY: figmaUrl.pathname.split('/')[2],
    NODE_ID: figmaUrl.searchParams.get('node-id'),
  };
};

const getFileDataFromApi = async (apiHeaders) => {
  try {
    return await axios.get(
      `${FIGMA_API_BASE_URL}/v1/files/${apiHeaders.FILE_KEY}/nodes?ids=${encodeURI(apiHeaders.NODE_ID)}`,
      apiHeaders.API_HEADERS,
    );
  } catch (err) {
    console.log(`Error al cargar datos de la API de Figma: ${err}`);
    process.exit(9);
  }
};

const capitalizeHex = (str) => {
  if (isNaN(str) && str.indexOf('#') !== -1) {
    const regexp = /#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})/g;
    const colors = str.match(regexp);
    for (let i = 0; i < colors.length; i++) {
      str = str.replace(colors[i], `${colors[i].toUpperCase()}`);
    }
  }
  return str;
};

const rem = (px) => `${px / 16}rem`;

module.exports = {
  FIGMA_API_BASE_URL,
  SRC_FOLDER,
  FIGMA_TOKENS_PATH,
  componentToHex,
  rgbToHex,
  generateApiData,
  getFileDataFromApi,
  capitalizeHex,
  rem
};
