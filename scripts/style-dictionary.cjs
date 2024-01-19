module.exports = {
  source: [`./dist/tokens/tokens.json`],
  format: {
    aperta: function ({ dictionary, platform }) {
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

      const mobileFonts = [];
      const convertFonts = (token) => {
        if (token.path.includes('desktop')) {
          const values = [];
          for (const value in token.value) {
            values.push(
              `${prefix}${token.name.split('-desktop').join('')}-${value}: ${capitalizeHex(
                value === 'weight' ? token.value[value] : rem(token.value[value]),
              )};`,
            );
          }

          return values.join('\n');
        } else {
          const values = [];
          for (const value in token.value) {
            values.push(
              `${prefix}${token.name.split('-mobile').join('')}-${value}: ${capitalizeHex(
                value === 'weight' ? token.value[value] : rem(token.value[value]),
              )};`,
            );
          }
          mobileFonts.push(values.join('\n\t'));
        }
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

      let breakpoint = 0;

      const variables = dictionary.allTokens.map((token) => {
        if (typeof token.value === 'object') {
          if (platform.transformGroup === 'css') {
            if (token.path.includes('font')) {
              return convertFonts(token);
            } else {
              return convertToMultipleKeys(token);
            }
          } else if (platform.transformGroup === 'scss' && !Array.isArray(token.value)) {
            return convertToMultipleKeys(token);
          }
        }

        if (token.name === 'breakpoints-s') {
          breakpoint = token.value;
        }

        return `${prefix}${token.name}: ${capitalizeHex(
          token.name.includes('spacing') ? rem(token.value) : token.value,
        )};`;
      });

      footer = `${footer}\n\n@media screen and (max-width: ${breakpoint}) {\n\t:root {\n`;
      mobileFonts.forEach((mobileFont) => {
        footer = `${footer}\t${mobileFont}\n`;
      });
      footer = `${footer}\t}\n}`;

      return `${header}${variables.join('\n')}${footer}`;
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
          format: 'javascript/es6',
        },
      ],
    },
  },
};
