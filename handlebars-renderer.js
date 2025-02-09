const fs = require("fs");
const Handlebars = require("handlebars");
const helpers = require("handlebars-helpers")();

//  Register eq helper for comparisons
// Handlebars.registerHelper(helpers);
Handlebars.registerHelper("currentYear", function () {
  return new Date().getFullYear();
});
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

// New assess helpers
Handlebars.registerHelper("numberLoop", function (n, options) {
  let result = "";
  n = parseInt(n, 10);
  for (let i = 0; i < n; i++) {
    result += options.fn({ number: i, parent: this });
  }

  return result;
});

Handlebars.registerHelper("compareNum", function (a, operator, b, options) {
  if (arguments.length < 4) {
    throw new Error('Handlerbars Helper "compare" needs 3 parameters');
  }

  // Convert parameters to numbers if they're numeric strings
  if (!isNaN(a)) a = parseFloat(a);
  if (!isNaN(b)) b = parseFloat(b);

  let result = false;

  switch (operator) {
    case ">":
      result = a > b;
      break;
    case ">=":
      result = a >= b;
      break;
    case "<":
      result = a < b;
      break;
    case "<=":
      result = a <= b;
      break;
    case "==":
      result = a == b;
      break;
    case "===":
      result = a === b;
      break;
    case "!=":
      result = a != b;
      break;
    case "!==":
      result = a !== b;
      break;
    default:
      throw new Error(
        'Handlerbars Helper "compare" doesn\'t know the operator ' + operator
      );
  }

  // Only render the block if the comparison is true
  return result ? options.fn(this) : "";
});

Handlebars.registerHelper("formatDescription", function (description) {
  if (!description || !description.data || !description.text) {
    return "";
  }

  let formattedText = description.text;
  const sortedData = [...description.data].sort(
    (a, b) => b.text.length - a.text.length
  );

  // Process each substitution
  sortedData.forEach((item) => {
    const textToReplace = item.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const replacement = `<span style="background-color: ${item.highlight_color}; color: ${item.color}">${item.substitute}</span>`;
    const regex = new RegExp(textToReplace, "g");
    formattedText = formattedText.replace(regex, replacement);
  });
  return formattedText;
});
Handlebars.registerHelper("getPointerPosition", function (value, max) {
  const percent = (value / max) * 100;
  // since container has some width
  return percent - 5;
});
Handlebars.registerHelper("mod", function (a, b) {
  return a % b;
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
