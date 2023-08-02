module.exports = {
  source: [`./dist/tokens/tokens.json`],
  format: {
    aperta: function ({ dictionary, platform }) {
      const capizalizeHex = (str) => {
        if (isNaN(str) && str.indexOf('#') !== -1) {
          const regexp = /#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})/g;
          const colors = str.match(regexp);
          for (let i = 0; i < colors.length; i++) {
            str = str.replace(colors[i], `${colors[i].toUpperCase()}`);
          }
        }
        return str;
      };

      const convertToMultipleKeys = (token) => {
        const values = [];
        for (const value in token.value) {
          values.push(`${prefix}${token.name}-${value}: ${capizalizeHex(token.value[value])};`);
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
            return convertToMultipleKeys(token);
          } else if (platform.transformGroup === 'scss' && !Array.isArray(token.value)) {
            return convertToMultipleKeys(token);
          }
        }

        return `${prefix}${token.name}: ${capizalizeHex(token.value)};`;
      });

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
