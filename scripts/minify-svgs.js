import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
const execSync = childProcess.execSync;
import { optimize } from 'svgo';
import { parse, stringify } from 'svgson';
import _ from 'lodash';

const SRC_FOLDER = './src/icons/downloaded/';
const OPTIMIZED_FOLDER = './dist/icons';

const args = process.argv.slice(2);

if (!fs.existsSync(OPTIMIZED_FOLDER)) {
  fs.mkdirSync(OPTIMIZED_FOLDER, { recursive: true });
}

const saveIcon = (file, data) => {
  const fileName = path.basename(file);

  const folders = path.dirname(file).split('/');
  const savePath = `${OPTIMIZED_FOLDER}/${folders[folders.length - 1]}/`;

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
  }

  fs.writeFile(`${savePath}/${fileName}`, data, (error) => {
    if (error) {
      console.log(`Error al guardar el icono: ${fileName}`);
    } else {
      console.log(`Se ha guardado el icono ${fileName}`);
    }
  });
};

const minimizeIcons = (icons) => {
  if (icons.length > 0) {
    console.log(`Se va a minificar los siguientes iconos: \n${icons.join('\n')}`);

    let iconsWithColors = fs.readFileSync(`${SRC_FOLDER}icons-with-colors.txt`, { encoding: 'utf8', flag: 'r' });
    iconsWithColors = iconsWithColors.split(',');

    icons.forEach((file) => {
      console.log(`Optimizando el icono ${path.basename(file)}`);
      fs.readFile(file, (err, data) => {
        if (err) throw err;

        const fp = 3;
        const tp = 4;

        let plugins = [
          {
            name: 'removeDoctype',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeXMLProcInst',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeComments',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeMetadata',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeEditorsNSData',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'cleanupAttrs',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'mergeStyles',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'inlineStyles',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'minifyStyles',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'cleanupIds',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeUselessDefs',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'cleanupNumericValues',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'convertColors',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
              currentColor: !iconsWithColors.includes(path.basename(file).split('.svg').join('')),
            },
          },
          {
            name: 'removeUnknownsAndDefaults',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeNonInheritableGroupAttrs',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeUselessStrokeAndFill',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'cleanupEnableBackground',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeHiddenElems',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeEmptyText',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'convertShapeToPath',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'moveElemsAttrsToGroup',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'moveGroupAttrsToElems',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'collapseGroups',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'convertPathData',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'convertEllipseToCircle',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'convertTransform',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeEmptyAttrs',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeEmptyContainers',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'mergePaths',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeUnusedNS',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'sortAttrs',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'sortDefsChildren',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeTitle',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeDesc',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeDimensions',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeStyleElement',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeScriptElement',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
          {
            name: 'removeOffCanvasPaths',
            params: {
              transformPrecision: tp,
              floatPrecision: fp,
            },
          },
        ];

        const result = optimize(data, {
          path: file,
          multipass: true,
          js2svg: {
            indent: 2,
            pretty: true,
          },
          plugins,
        });

        try {
          parse(result.data, {
            camelcase: false,
          }).then((svgTree) => {
            const fileName = path.basename(file);

            console.log(`Se ha optimizado el icono ${fileName}`);

            svgTree.attributes = {
              ...svgTree.attributes,
              class: `Icon Icon-${fileName.split('.svg').join('')}`,
            };

            if (fileName === 'interior.svg') {
              svgTree.children.forEach((children) => {
                if (children.name === 'mask') {
                  children.children.forEach((child) => {
                    if (child.name === 'mask') {
                      child.attributes.fill = '#fff';
                    }
                  });
                }
              });
            }

            if (fileName === 'check-circle.svg') {
              svgTree.children.forEach((child) => {
                if (child.attributes.stroke === 'currentColor') {
                  child.attributes.stroke = 'white';
                }
              });
            }

            if (fileName === 'answer-all.svg') {
              svgTree.children.forEach((child) => {
                child.attributes.fill = 'currentColor';
              });
            }

            const updatedSvgContent = stringify(svgTree);

            saveIcon(file, updatedSvgContent);
          });
        } catch (error) {
          saveIcon(file, data);
        }
      });
    });
  }
};

const readIcons = (directory, icons) => {
  const files = fs.readdirSync(directory);

  icons = icons || [];

  files.forEach(function (file) {
    if (fs.statSync(`${directory}/${file}`).isDirectory()) {
      icons = readIcons(directory + file, icons);
    } else {
      if (file.indexOf('.txt') === -1) {
        icons.push(`${directory}/${file}`);
      }
    }
  });

  return icons;
};

if (!fs.existsSync(OPTIMIZED_FOLDER)) {
  fs.mkdirSync(OPTIMIZED_FOLDER, { recursive: true });
}

const generateImportsFile = (icons) => {
  const readedIcons = readIcons(SRC_FOLDER);
  if (icons === undefined) {
    icons = readedIcons;
  }

  const exportsArray = [];
  const importsArray = [];
  let actualFolder = '';
  readedIcons.forEach((icon) => {
    const fileName = path.basename(icon);
    const folders = path.dirname(icon).split('/');
    const folder = folders[folders.length - 1] !== 'downloaded' ? `${folders[folders.length - 1]}/` : '';
    const className = fileName.split('.svg').join('');
    if (folder !== actualFolder) {
      importsArray.push(`// folder: /${folder}`);
    }
    importsArray.push(
      `import ${_.upperFirst(_.camelCase(className))} from '@opositatest/aperta-tokens/icons/${folder}${fileName}';`,
    );

    exportsArray.push(`\t${_.camelCase(className)}: ${_.upperFirst(_.camelCase(className))},`);

    actualFolder = folder;
  });
  const importsExportsFile = `// @ts-nocheck\n${importsArray.join('\n')}\n\nconst icons = {\n${exportsArray.join('\n')}\n}\n`;

  fs.writeFile(`${OPTIMIZED_FOLDER}/icons.ts`, importsExportsFile, (error) => {
    if (error) {
      console.log('Error al guardar el archivo de imports y exports');
    }

    minimizeIcons(icons);
  });
};

if (args.includes('-folder')) {
  generateImportsFile();
} else {
  const modifiedFiles = execSync('git status --porcelain | cut -c 1-3 --complement')
    .toString()
    .split('\n')
    .filter((file) => file.includes('icons/downloaded') && file.endsWith('.svg'));

  generateImportsFile(modifiedFiles);
}
