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
  jsonReader(jsonPath, (err, package) => {
    if (err) {
      throw err;
    }

    delete package.devDependencies;
    delete package.scripts;

    package.main = package.main.split('dist/').join('');
    package.style = package.style.split('dist/').join('');
    package.files = ['./*'];

    let processedJson = JSON.stringify(package, null, '\t').split('dist/').join('');
    fs.writeFile(jsonPath, processedJson, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
