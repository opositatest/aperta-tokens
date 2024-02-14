export const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

export const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const generateApiData = () => {
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

export const getFileDataFromApi = async (apiHeaders) => {
  try {
    return await axios.get(
      `${FIGMA_API_BASE_URL}/v1/files/${apiHeaders.FILE_KEY}/nodes?ids=${encodeURI(apiHeaders.NODE_ID)}`,
      apiHeaders.API_HEADERS,
    );
  } catch (err) {
    console.log(errorTxt(`Error al cargar datos de la API de Figma: ${err}`));
    process.exit(9);
  }
};
