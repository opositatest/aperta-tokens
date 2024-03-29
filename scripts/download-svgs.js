const fs = require('fs');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });
const _ = require('lodash');
const { FIGMA_API_BASE_URL, SRC_FOLDER, FIGMA_TOKENS_PATH, rgbToHex, generateApiData, getFileDataFromApi } = require('./functions.js');

axiosRetry(axios, { retries: 5 });

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
        return item.type === 'SECTION' && item.devStatus.type === 'READY_FOR_DEV';
      })
      .forEach((item) => {
        frames.push(item);
      });

    const categoryColors = { color: {} };
    const iconsWithColors = [];
    frames.forEach((frame) => {
      if (frame.children) {
        let categoryName = '';
        if (frame.children[0] && frame.children[0].name === 'System / Heading' && frame.children[0].children) {
          categoryName = _.kebabCase(frame.children[0].children[0].characters);
        }
        if (frame.children[1].children && frame.children[1].children[0].children) {
          const components = frame.children[1].children[0].children;
          components.forEach((component) => {
            let iconName = '';
            component.children.forEach((item) => {
              if (item.name === 'Data' || item.name === 'System / Data') {
                item.children.forEach((text) => {
                  if (text.name === 'Modifier') {
                    iconName = text.characters;
                  }
                });
              }
            });
            component.children.forEach((item) => {
              if (
                item.type !== 'TEXT' &&
                iconName !== '' &&
                item.name !== 'WA-Badge' &&
                item.name !== 'Data' &&
                item.name !== 'System / Heading Variant' &&
                item.name !== 'System / Data' &&
                item.name !== 'Frame 38' &&
                item.name !== 'Frame 56'
              ) {
                const addIconData = (icon, iconName, categoryName) => {
                  if (iconName.indexOf('_color') > -1) {
                    iconName = iconName.split('_color').join('');
                    iconsWithColors.push(_.kebabCase(iconName));
                  }

                  iconsData.push({
                    id: icon.id,
                    name: iconName,
                    category: categoryName,
                  });
                };

                if (categoryName === 'categories') {
                  item.children.forEach((category) => {
                    if (
                      category.name.indexOf('Color-') > -1 ||
                      (iconName === 'Comunidades Autónomas' && category.name === 'Content')
                    ) {
                      let color;
                      if (iconName !== 'Comunidades Autónomas') {
                        color = category.children[0].fills[0].color;
                      } else {
                        color = category.children[0].children[0].fills[0].color;
                      }

                      categoryColors.color.opposition = {
                        ...categoryColors.color.opposition,
                        ...{
                          [_.kebabCase(iconName)]: {
                            value: rgbToHex(
                              Math.round(color.r * 255).toString(16),
                              Math.round(color.g * 255).toString(16),
                              Math.round(color.b * 255).toString(16),
                            ),
                          },
                        },
                      };
                    } else {
                      addIconData(category, iconName, categoryName);
                    }
                  });
                } else {
                  addIconData(item, iconName, categoryName);
                }
              }
            });
          });
        }
      }
    });

    console.log(`Encontrados ${iconsData.length} componentes en el nodo de la página ` + `${figmaPageName}`);

    if (!fs.existsSync(FIGMA_TOKENS_PATH)) {
      fs.mkdirSync(FIGMA_TOKENS_PATH, { recursive: true });
    }
    if (!fs.existsSync(SRC_FOLDER)) {
      fs.mkdirSync(SRC_FOLDER, { recursive: true });
    }

    fs.writeFileSync(`${FIGMA_TOKENS_PATH}relatedvars.json`, JSON.stringify(categoryColors));
    fs.writeFileSync(`${SRC_FOLDER}icons-with-colors.txt`, iconsWithColors.join(','));

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
    console.log(`Ha fallado la exportación de iconos con la API de Figma`);

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
        const svgName = _.kebabCase(nodeItem.name);
        try {
          const svgFileResponse = await axios.get(nodeItem.url, apiData.API_HEADERS);
          console.log(`Descargado ${svgName}.svg`);

          const fileFolder = `${SRC_FOLDER}${nodeItem.category}/`;
          if (!fs.existsSync(fileFolder)) {
            fs.mkdirSync(fileFolder, { recursive: true });
          }

          fs.writeFile(`${fileFolder}${svgName}.svg`, svgFileResponse.data, (error) => {
            if (error) {
              console.log(`Error al guardar el archivo: ${svgName}.svg`);
            } else {
              console.log(`Guardado ${svgName}.svg`);
            }
          });
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
getFileDataFromApi(apiData).then((fileData) => {
  let iconsData = parseFileData(fileData, apiData.NODE_ID.split('-').join(':'));
  getUrlsForIcons(apiData, iconsData).then((iconsData) => {
    getSVGs(apiData, iconsData);
  });
});



