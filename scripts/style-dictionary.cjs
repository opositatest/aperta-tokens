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
  source: [`./dist/tokens/tokens.json`],
  format: {
    aperta: function ({ dictionary, platform }) {
      const convertFonts = (token) => {
        const values = [];
        for (const value in token.value) {
          values.push(
            `${prefix}${token.name}-${value}: ${capitalizeHex(
              value === 'weight' ? token.value[value] : rem(token.value[value]),
            )};`,
          );
        }

        return values.join('\n');
      };

      const convertToMultipleKeys = (token) => {
        const values = [];
        for (const value in token.value) {
          values.push(
            `${prefix}${token.name}-${value}: ${capitalizeHex(
              token.name.includes('spacing') ? rem(token.value[value]) : token.value[value],
            )};`,
          );
        }

        return values.join('\n');
      };

      let prefix, header, footer;
      if (platform.transformGroup === 'css') {
        prefix = '\t--';
        header = `/**\n* Do not edit directly\n* Generated on ${new Date().toUTCString()}\n*/\n\n:root {\n`;
        footer = '\n}';
      } else if (platform.transformGroup === 'scss') {
        prefix = '$';
        header = `\n// Do not edit directly\n// Generated on ${new Date().toUTCString()}\n\n`;
        footer = '';
      }

      const variables = dictionary.allTokens.map((token) => {
        if (typeof token.value === 'object') {
          if (platform.transformGroup === 'css') {
            if (token.path.includes('font')) {
              return convertFonts(token);
            } else {
              return convertToMultipleKeys(token);
            }
          } else if (platform.transformGroup === 'scss') {
            return convertToMultipleKeys(token);
          }
        }

        return `${prefix}${token.name.split('oppositions-').join('').split('typography-').join('')}: ${capitalizeHex(
          token.value,
        )};`;
      });

      return `${header}${variables.join('\n')}${footer}`;
    },
    apertaJS: function ({ dictionary }) {
      const prefix = 'export const ';
      const header = `/**\n* Do not edit directly\n* Generated on ${new Date().toUTCString()}\n*/\n\n`;

      const variables = dictionary.allTokens.map((token) => {
        let value = token.value;

        if (typeof token.value === 'string') {
          value = `'${value}'`;
        }

        if (token.name.includes('COLOR_')) {
          value = `${capitalizeHex(value)}`;
        }

        if (token.name.includes('SPACING')) {
          value = `[${value}]`;
        }

        if (token.name.includes('FONT_')) {
          value = JSON.stringify(value);
        }

        return `${prefix}${token.name.split('OPPOSITIONS_').join('').split('TYPOGRAPHY_').join('')} = ${value};`;
      });

      return `${header}${variables.join('\n')}`;
    },
  },
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'tokens.css',
          format: 'aperta',
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'tokens.scss',
          format: 'aperta',
        },
      ],
    },
    'react-native': {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      transforms: ['name/cti/constant'],
      files: [
        {
          destination: 'tokens.js',
          format: 'apertaJS',
        },
      ],
    },
  },
};
