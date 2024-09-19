const fs = require("fs");
const Handlebars = require("handlebars");
const helpers = require("handlebars-helpers")();

//  Register eq helper for comparisons
// Handlebars.registerHelper(helpers);

Handlebars.registerHelper("ifcond", function (v1, v2, options) {
  if (v1 === v2) return options.fn(this);
  return options.inverse(this);
});
Handlebars.registerHelper("ifType", function (v1, v2, options) {
  if (typeof v1 == v2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
Handlebars.registerHelper("switch", function (value, options) {
  this._switch_value_ = value;
  var html = options.fn(this); // Process the body of the block
  delete this._switch_value_;
  return html;
});

Handlebars.registerHelper("case", function (value, options) {
  if (value === this._switch_value_) {
    return options.fn(this);
  }
});

Handlebars.registerHelper("default", function (options) {
  return options.fn(this);
});

Handlebars.registerHelper("replaceKeysWithLinks", function (text, templates) {
  // Iterate over the templates and replace the keys with the anchor tags
  templates.forEach(function (template) {
    text = text.replace(
      "{{" + template.key + "}}",
      ' <a style="color:#2F80ED;" href="' +
        template.link +
        '">' +
        template.value +
        "</a> "
    );
  });

  // Return the modified text
  return new Handlebars.SafeString(text);
});
/**
 * Render a Handlebars template with the provided JSON data.
 * @param {string} templatePath - Path to the Handlebars template file.
 * @param {object} data - JSON data to be used in the template.
 * @returns {string} - Rendered HTML.
 */
function renderTemplate(templatePath, data) {
  // Read the Handlebars template file
  const templateSource = fs.readFileSync(templatePath, "utf-8");

  // Compile the Handlebars template
  const template = Handlebars.compile(templateSource);

  // Use the template with the provided data
  return template(data);
}

/**
 * Save HTML content to a new file.
 * @param {string} outputPath - Path to the output HTML file.
 * @param {string} content - HTML content to be saved.
 */
function saveToHtmlFile(outputPath, content) {
  fs.writeFileSync(outputPath, content, "utf-8");
}

module.exports = {
  renderTemplate,
  saveToHtmlFile,
};
