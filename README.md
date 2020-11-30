# Style Dictionary Example Colorsets

This is a quick Style Dictionary example to show how to build iOS colorsets from a Style Dictionary using a custom action. 

This example also shows how to combine source JSON files outside of the Style Dictionary configuration to build output files based on the structure of the dictionary object. 

This example is built to answer the question posted here: https://github.com/amzn/style-dictionary/issues/490

## How it works

It creates a custom action that grabs all the color tokens and creates iOS colorsets which are a directory with the `.colorset` extension and a `Contents.json` file inside of it. 

To combine JSON files outside of Style Dictionary this example uses the internal method Style Dictionary uses to combine JSON files and then passes that object as the `properties` attribute in the Style Dictionary configuration. 
## What to look at

All of the good stuff is in [sd.config.js](sd.config.js). For brevity I created a very small set of color tokens in the [tokens](tokens) directory. 