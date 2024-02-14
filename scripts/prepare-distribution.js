const fs = require('fs');
const jsonPath = './dist/package.json';

const jsonReader = (filePath, cb) => {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
};

fs.copyFile('package.json', jsonPath, () => {
  jsonReader(jsonPath, (err, packageJson) => {
    if (err) {
      throw err;
    }

    delete packageJson.devDependencies;
    delete packageJson.scripts;

    packageJson.main = packageJson.main.split('dist/').join('');
    packageJson.style = packageJson.style.split('dist/').join('');
    packageJson.files = ['./*'];

    let processedJson = JSON.stringify(packageJson, null, '\t').split('dist/').join('');
    fs.writeFile(jsonPath, processedJson, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
