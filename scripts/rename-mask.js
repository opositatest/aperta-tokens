const fs = require('fs');

const SRC_FOLDER = './dist/icons/';

const renameMask = (file) => {
  let svgContent = fs.readFileSync(file, "utf8");
  const maskRandom = Math.floor(Math.random() * 99999999);

  for (i = 97; i <= 122; i++) {
    svgContent = svgContent
      .split(`id="${String.fromCharCode(i)}"`)
      .join(`id="opo-mask-${maskRandom}"`)
      .split(`url(#${String.fromCharCode(i)})`)
      .join(`url(#opo-mask-${maskRandom})`);
  }

  fs.writeFileSync(file, svgContent);
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
