const CleanCSS = require("clean-css");
const fs = require('fs');
const htmlmin = require('html-minifier');
const prettydata = require('pretty-data');

module.exports = (config) => {

  // Data Filters

  config.addFilter("sortWithId", function(collection) {
    return collection.sort((a,b) => a.data.id - b.data.id)
  });

  config.addFilter('length', (path) => {
    const stats = fs.statSync(path);

    return stats.size;
  });


  // HTML Minification

  config.addFilter('htmlmin', (value) => {
    return htmlmin.minify(
      value, {
        removeComments: true,
        collapseWhitespace: true
      }
    );
  });

  config.addTransform('htmlmin', (content, outputPath) => {
    if(outputPath && outputPath.endsWith('.html')) {
      const result = htmlmin.minify(
        content, {
          removeComments: true,
          collapseWhitespace: true
        }
      );

      return result;
    }

    return content;
  });

  // XML Minification for RSS

  config.addTransform('xmlmin', (content, outputPath) => {
    if(outputPath && outputPath.endsWith('.xml')) {
      return prettydata.pd.xmlmin(content);
    }

    return content;
  });

  // Passthrough Copy

  config.addPassthroughCopy('src/fonts');
  config.addPassthroughCopy('src/scripts');
  config.addPassthroughCopy('src/static');
  config.addPassthroughCopy('src/posts');
  config.addPassthroughCopy('src/admin');

  // Minified CSS

  config.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Config

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: [
      'md', 'njk'
    ],
  };
};
