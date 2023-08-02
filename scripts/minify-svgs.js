import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
const execSync = childProcess.execSync;
import { optimize } from 'svgo';
import { parse, stringify } from 'svgson';

const SRC_FOLDER = './src/icons/downloaded/';
const OPTIMIZED_FOLDER = './dist/icons';
const COLOR_EXCLUSIONS = [
  'mastercard',
  'paypal',
  'stripe-purple',
  'visa',
  'facebook',
  'instagram',
  'linkedin',
  'pinterest',
  'twitter',
  'twitter',
  'youtube',
  'doubt-on',
  'marker-on',
  'heart-on',
];

const args = process.argv.slice(2);
console.log(args);

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

    icons.forEach((file) => {
      console.log(`Optimizando el icono ${path.basename(file)}`);
      fs.readFile(file, (err, data) => {
        if (err) throw err;

        const fp = 3;
        const tp = 4;

        const result = optimize(data, {
          path: file,
          multipass: true,
          js2svg: {
            indent: 2,
            pretty: true,
          },
          plugins: [
            /* {
              name: 'cleanupAttrs',
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
              name: 'cleanupListOfValues',
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
              name: 'collapseGroups',
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
                currentColor: !COLOR_EXCLUSIONS.includes(path.basename(file).split('.svg').join('')),
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
              name: 'convertPathData',
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
              name: 'convertTransform',
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
              name: 'mergePaths',
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
              name: 'minifyStyles',
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
              name: 'removeComments',
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
              name: 'removeDoctype',
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
              name: 'removeEmptyText',
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
              name: 'removeMetadata',
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
              name: 'removeOffCanvasPaths',
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
              name: 'removeStyleElement',
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
              name: 'removeUnknownsAndDefaults',
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
              name: 'removeUselessDefs',
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
              name: 'removeXMLProcInst',
              params: {
                transformPrecision: tp,
                floatPrecision: fp,
              },
            },
            {
              name: 'reusePaths',
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
            }, */

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
                currentColor: !COLOR_EXCLUSIONS.includes(path.basename(file).split('.svg').join('')),
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
          ],
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
    if (fs.statSync(directory + '/' + file).isDirectory()) {
      icons = readIcons(directory + file, icons);
    } else {
      // icons.push(path.join(SRC_FOLDER, directory, '/', file));
      icons.push(`${directory}/${file}`);
    }
  });

  return icons;
};

if (!fs.existsSync(OPTIMIZED_FOLDER)) {
  fs.mkdirSync(OPTIMIZED_FOLDER, { recursive: true });
}

if (args.includes('-folder')) {
  minimizeIcons(readIcons(SRC_FOLDER));
} else {
  const modifiedFiles = execSync('git status --porcelain | cut -c 1-3 --complement')
    .toString()
    .split('\n')
    .filter((file) => file.includes('icons/downloaded') && file.endsWith('.svg'));

  minimizeIcons(modifiedFiles);
}
