const fs = require('fs');

const SRC_FOLDER = './dist/icons/';

const renameMask = (file) => {
  const svgContent = fs.readFileSync(file, 'utf8');
  const maskRandom = Math.floor(Math.random() * 99999999);
  fs.writeFileSync(
    file,
    svgContent
      .split('mask id="a"')
      .join(`mask id="opo-mask-${maskRandom}"`)
      .split('mask="url(#a)"')
      .join(`mask="url(#opo-mask-${maskRandom})"`),
  );
};

const readIcons = (directory) => {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    if (file !== 'icons.ts') {
      if (fs.statSync(`${directory}/${file}`).isDirectory()) {
        readIcons(directory + file);
      } else {
        renameMask(`${directory}/${file}`);
      }
    }
  });
};

readIcons(SRC_FOLDER);
