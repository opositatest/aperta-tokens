import * as fs from 'fs';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

axiosRetry(axios, { retries: 5 });

const FIGMA_API_BASE_URL = 'https://api.figma.com';
const SRC_FOLDER = './src/icons/downloaded/';

const generateName = (text, separator = '-') => {
  text = text.replace(/^\s+|\s+$/g, ''); // trim
  text = text.toLowerCase();

  var from = 'àáäâèéëêìíïîòóöôùúüûçěščřžýúůďťň·/_,:;';
  var to = 'aaaaeeeeiiiioooouuuucescrzyuudtn------';

  for (var i = 0, l = from.length; i < l; i++) {
    text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  text = text
    .replace('.', `${separator}`)
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, `${separator}`)
    .replace(/-+/g, `${separator}`)
    .replace(/\//g, '');

  return text;
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
    console.log(errorTxt(`Error al cargar datos de la API de Figma: ${err}`));
    process.exit(9);
  }
};

const parseFileData = (response, node_id) => {
  if (response.status === 404) {
    console.log('El archivo de Figma no existe');
    process.exit(9);
  }

  try {
    const json = response.data;
    const nodes = json.nodes[node_id].document.children;
    const iconsData = [];

    let figmaPageName = json.nodes[node_id].document.name;
    figmaPageName = typeof figmaPageName !== 'undefined' ? figmaPageName : '';

    console.log(`Extrayendo datos del proyecto ${json.name}`);

    const frames = [];
    nodes
      .filter((item) => {
        return item.type === 'SECTION' && item.name === 'Categorías';
      })
      .forEach((item) => {
        frames.push(item);
      });

    let childNodes = [];
    frames.forEach((item) => {
      if (item.children && item.children[1] && item.children[1].children) {
        if (item.name === 'Categorías') {
          item.children[1].children[0].children?.forEach((child) => {
            child.children.forEach((subchild) => {
              if (subchild.name !== 'Data' && subchild.name !== '.Documentation / Component') {
                // console.log(subchild);
                // subchild.parentFrameName = generateName(item.name);
                subchild.parentFrameName = generateName(item.children[0].children[0].characters);
                childNodes.push(subchild);
              }
            });
          });
        } else {
          item.children[1].children[0].children?.forEach((child) => {
            // child.parentFrameName = generateName(item.name);
            child.parentFrameName = generateName(item.children[0].children[0].characters);
            childNodes.push(child);
          });
        }
      }
    });

    const iconColors = [];
    const iconNodes = [];
    childNodes = childNodes.filter((item) => {
      return (
        item.type === 'FRAME' &&
        (item.name.charAt(0) === '.' || item.name === 'Content') &&
        item.name !== 'System / Heading Variant' &&
        item.name !== 'System / Heading Variant'
      );
    });

    let hasColor = false;
    childNodes.forEach((item) => {
      item.children.forEach((child) => {
        console.log(child);
        // console.log(child);
        if (child.type === 'FRAME') {
          if (child?.children[0]?.characters && child?.children[0]?.characters.indexOf('_color') !== -1) {
            hasColor = true;
          }
        }

        if ((child.type === 'INSTANCE' || child.type === 'COMPONENT') && child.name.indexOf('Color-Oposiciones') !== -1) {
          child.parentFrameName = item.parentFrameName;
          iconNodes.push(child);

          if (hasColor) {
            iconColors.push(generateName(child.name));
            hasColor = false;
          }
        }
      });
    });

    // console.log(iconColors);

    iconNodes.forEach((item) => {
      // console.log(item);
      iconsData.push({
        id: item.id,
        name: item.name,
        category: item.parentFrameName,
      });
    });

    console.log(`Encontrados ${iconsData.length} componentes en el nodo de la página ` + `${figmaPageName}`);

    return iconsData;
  } catch (err) {
    console.log(`Error al parsear el JSON de datos de la API: ${err}`);
    process.exit(9);
  }
};

const exportFigmaNodesAsFiles = async (apiData, nodes, format, scale) => {
  console.log(`Exportando los iconos ${format} como archivos desde Figma...`);

  const iconDataIds = nodes.map((item) => item.id);

  try {
    const response = await axios.get(
      FIGMA_API_BASE_URL +
        `/v1/images/${apiData.FILE_KEY}` +
        `?ids=${iconDataIds.join(',')}&scale=1&format=svg&svg_simplify_stroke=false&use_absolute_bounds=false`,
      apiData.API_HEADERS,
    );
    return response.data.images;
  } catch (err) {
    console.log(`Ha fallado la exporación de iconos con la API de Figma`);

    if (err.response.data.status === 400) {
      console.log('Parámetro incorrecto');
    }

    if (err.response.data.status === 404) {
      console.log('El archivo no se ha encontrado en la API de Figma');
    }

    if (err.response.data.status === 500) {
      console.log('La API de Figma ha fallado');
    }

    process.exit(9);
  }
};

const getUrlsForIcons = async (apiData, iconNodes) => {
  const exportedIconFileURLs = await exportFigmaNodesAsFiles(apiData, iconNodes, 'svg', 'svgScale');
  for (const nodeURL in exportedIconFileURLs) {
    if (Object.prototype.hasOwnProperty.call(exportedIconFileURLs, nodeURL)) {
      const idx = iconNodes.findIndex((nodeItem) => nodeItem.id === nodeURL);

      if (idx === -1) {
        console.log('Ha fallado el parseo de los datos. Falta una URL');
        process.exit(9);
      }

      iconNodes[idx].url = exportedIconFileURLs[nodeURL];
    }
  }

  return iconNodes;
};

const getSVGs = async (apiData, iconNodes) => {
  console.log(`Descargando ${iconNodes.length} iconos...`);

  return Promise.all(
    iconNodes.map(async (nodeItem) => {
      if (nodeItem.url) {
        const svgName = generateName(nodeItem.name);
        // console.log(svgName);
        // console.log(nodeItem);
        try {
          const svgFileResponse = await axios.get(nodeItem.url, apiData.API_HEADERS);
          // console.log(`Descargado ${svgName}.svg`);

          /* const fileFolder = `${SRC_FOLDER}${nodeItem.category}/`;
          if (!fs.existsSync(fileFolder)) {
            fs.mkdirSync(fileFolder, { recursive: true });
          }

          fs.writeFile(`${fileFolder}${svgName}.svg`, svgFileResponse.data, (error) => {
            if (error) {
              console.log(`Error al guardar el archivo: ${svgName}.svg`);
            } else {
              console.log(`Guardado ${svgName}.svg`);
            }
          }); */
        } catch (err) {
          console.log(`Error al guardar el icono: ${svgName}.svg`);
          process.exit(9);
        }
      }

      return nodeItem;
    }),
  );
};

const apiData = generateApiData();
const fileData = await getFileDataFromApi(apiData);
let iconsData = parseFileData(fileData, apiData.NODE_ID.split('-').join(':'));
iconsData = await getUrlsForIcons(apiData, iconsData);
await getSVGs(apiData, iconsData);
