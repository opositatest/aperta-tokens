import * as fs from 'fs';

const FIGMA_TOKENS_PATH = './src/tokens/';
const FIGMA_TOKENS_FILE = 'figma.json';
const PROCESSED_TOKENS_PATH = './dist/tokens/';
const PROCESSED_TOKENS_FILE = 'tokens.json';

const readTokens = (filePath) => {
  try {
    const tokens = fs.readFileSync(filePath);
    return JSON.parse(tokens);
  } catch (err) {
    throw err;
  }
};

const figmaTokens = readTokens(`${FIGMA_TOKENS_PATH}${FIGMA_TOKENS_FILE}`);

const processedTokens = {};
processedTokens.breakpoints = figmaTokens.breakpoints;
processedTokens.container = figmaTokens.container;
processedTokens.spacing = figmaTokens.spacing;

if (figmaTokens.effect && figmaTokens.effect.shadow) {
  processedTokens.shadow = {};
  for (const groupName in figmaTokens.effect.shadow) {
    const shadow = figmaTokens.effect.shadow[groupName];
    if (!processedTokens.shadow[groupName]) {
      processedTokens.shadow[groupName] = {};
    }
    processedTokens.shadow[groupName] = {
      description: shadow?.description,
      type: shadow.type,
      value: `${shadow.value.offsetX}px ${shadow.value.offsetY}px ${shadow.value.radius}px ${shadow.value.spread}px ${shadow.value.color}`,
    };
  }
}

const saveFontToken = (fontSize, lineHeight) => ({
  value: {
    fontSize,
    lineHeight,
  },
});

processedTokens.font = {};
for (const groupName in figmaTokens.font) {
  for (const fontName in figmaTokens.font[groupName]) {
    if (!fontName.includes('semi')) {
      const font = figmaTokens.font[groupName][fontName];
      const fontType = fontName.split(' | ');
      if (!processedTokens.font[fontType[0]]) {
        processedTokens.font[fontType[0]] = {};
      }
      if (fontType.length === 1) {
        processedTokens.font[fontType[0]] = {
          desktop: saveFontToken(font.value.fontSize, font.value.lineHeight),
          mobile: saveFontToken(font.value.fontSize, font.value.lineHeight),
        };
      } else {
        processedTokens.font[fontType[0]][fontType[1]] = saveFontToken(font.value.fontSize, font.value.lineHeight);
      }
    }
  }
}

processedTokens.color = {};
for (const groupName in figmaTokens.color) {
  const colorName = figmaTokens.color[groupName];
  for (const key in colorName) {
    const newKey = `${groupName}-${key}`;
    processedTokens.color[newKey] = { value: colorName[key].value };
  }
}

const jsonTokens = fs.readdirSync(FIGMA_TOKENS_PATH);
jsonTokens.forEach((json) => {
  if (json !== FIGMA_TOKENS_FILE) {
    const tokens = readTokens(`${FIGMA_TOKENS_PATH}${json}`);
    const name = json.split('.json').join('');
    if (!processedTokens[name]) {
      processedTokens[name] = {};
    }
    processedTokens[name] = tokens;
  }
});

if (!fs.existsSync(PROCESSED_TOKENS_PATH)) {
  fs.mkdirSync(PROCESSED_TOKENS_PATH, { recursive: true });
}

fs.writeFile(`${PROCESSED_TOKENS_PATH}${PROCESSED_TOKENS_FILE}`, JSON.stringify(processedTokens), (error) => {
  if (error) {
    console.log(`Error al guardar el archivo: ${PROCESSED_TOKENS_FILE}`);
  } else {
    console.log(`Guardado ${PROCESSED_TOKENS_FILE}`);
  }
});
