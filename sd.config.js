const combineJSON = require('style-dictionary/lib/utils/combineJSON');
const fs = require('fs-extra');
const glob = require('glob');
const Color = require('tinycolor2');

// Use style dictionary's internal method for combining JSON files
// to get a properties object
const properties = combineJSON([`tokens/**/*.json`], true);

// The directory to build the colorsets in
const assetsDir = 'build/ios/Assets.xcassets';

// Custom action for creating iOS colorsets
const createColorsets = (dictionary) => {
  dictionary.allProperties
    // grab all colors
    .filter(token => token.attributes.category === 'color')
    .forEach(token => {
      const folder = `${assetsDir}/${token.name}.colorset`;
      const file = `${folder}/Contents.json`;
      const contents = {
        colors: [
          {
            'color-space': "srgb",
            idiom: "universal",
            components: {
              alpha: `${token.value.a}`,
              red: `${token.value.r}`,
              green: `${token.value.g}`,
              blue: `${token.value.b}`,
            }
          }
        ]
      };
      // create the directory if it doesn't exist
      fs.ensureDirSync(folder);
      // create the Contents.json file
      fs.writeFileSync(file, JSON.stringify(contents, null, 2));
    });
}

// Exporting an object as the style dictionary configuration
// see 'build' npm script in package.json for how this is used
module.exports = {
  // Directly adding custom actions on the configuration
  // You could also do: StyleDictionary.registerAction() as well
  action: {
    createColorsets: {
      do: createColorsets,
      undo: function(dictionary, config) {
        // clean up colorsets we build when the package is cleaned
        glob(`${assetsDir}/*.colorset`, function (error, results) {
          results.forEach((colorsetFolder) => {
            fs.removeSync(colorsetFolder);
          });
        });
      }
    },
  },
  
  // Same with custom transforms, I just like doing it this way
  transform: {
    colorRGB: {
      type: `value`,
      matcher: (token) => token.attributes.category === 'color',
      transformer: (token) => {
        return Color(token.value).toRgb();
      }
    }
  },
  
  // Adding the properties object here directly rather than using `source`
  properties: properties,
  
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: `build/web/`,
      // Now you can access the properties object to build files based on
      // its structure
      files: Object.keys(properties.color).map((colorType) => ({
        destination: `${colorType}.js`,
        format: `javascript/es6`,
        filter: (token) => token.attributes.type === colorType
      }))
    },
    iOSColors: {
      transforms: [`attribute/cti`,`colorRGB`,`name/cti/pascal`],
      // Using our custom action to build colorsets
      actions: [`createColorsets`]
    }
  }
}