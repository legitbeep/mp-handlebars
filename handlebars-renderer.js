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
    result += options.fn({ number: i, fill: this.fill });
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
  const sortedData = description.data;

  // Process each substitution
  sortedData.forEach((item) => {
    const textToReplace = item.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const replacement = item?.url
      ? `<a style="color: ${item.color ? item.color : "#16A9B1"};" href="${
          item.url
        }" target="_blank">${item.substitute}</a>`
      : `<span style="background-color: ${item.color}; color: #fff">${item.substitute}</span>`;
    const regex = new RegExp(textToReplace, "g");
    formattedText = formattedText.replace(regex, replacement);
  });
  return formattedText;
});
Handlebars.registerHelper("mod", function (a, b) {
  return a % b;
});

Handlebars.registerHelper("getIndex", function (array, index) {
  if (Array.isArray(array) && typeof index === "number") {
    if (index == -1) index = array.length - 1;
    return array[index];
  }
  return "";
});
Handlebars.registerHelper("getProp", function (obj, key) {
  if (obj && typeof obj === "object" && key in obj) {
    return obj[key];
  }
  return ""; // Return empty string if key is not found
});
Handlebars.registerHelper("getGraphValue", function (result, index) {
  if (index < 3) {
    switch (index) {
      case 0:
        return result.part_a_score;
      case 1:
        return result.part_b_score;
      case 2:
        return result.part_c_score;
    }
  }
  return ""; // Return empty string if key is not found
});
Handlebars.registerHelper("subtract", function (a, b) {
  return a - b;
});
Handlebars.registerHelper("calculateValue", function (value, maxValue) {
  const TOTAL_WIDTH = 30;
  return Math.round((value / maxValue) * TOTAL_WIDTH);
});
Handlebars.registerHelper(
  "calculateGaugeWidth",
  function (value, array, index) {
    if (!Array.isArray(array) || array.length === 0) {
      return 0;
    }
    return (1 / array.length) * 100;
  }
);

Handlebars.registerHelper("getPointerPosition", function (value, arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return 0;
  }

  const segmentIndex = arr.findIndex((segment) => {
    return value <= segment.value;
  });

  let startVal = segmentIndex == 0 ? 0 : arr[segmentIndex - 1].value;
  let endVal = arr[segmentIndex].value;
  const currSegPercent = ((value - startVal) / (endVal - startVal)) * 100;

  console.log({ segmentIndex, currSegPercent, startVal, endVal, value });
  return `calc(${currSegPercent}% - 34px)`;
});

// ------------------ Missing helpers ---------------------------

Handlebars.registerHelper("inc", function (v1) {
  return parseInt(v1) + 1;
});
Handlebars.registerHelper("multiply", function (v1, v2) {
  return v1 * v2;
});
Handlebars.registerHelper("divide", function (v1, v2) {
  return (v1 / v2).toFixed(2);
});
Handlebars.registerHelper("reduce", function (v1) {
  return v1.reduce(
    (prev, current) => {
      let summary = current.summary;
      return {
        currency: current.currency,
        subTotal: (Number(prev.subTotal) + summary.total.coupon).toFixed(2),
        tax: (Number(prev.tax) + summary.tax).toFixed(2),
        grandTotal: parseFloat(
          Number(prev.grandTotal) + summary.total.grand.toFixed(2)
        ).toFixed(2),
      };
    },
    { subTotal: 0, tax: 0, grandTotal: 0 }
  );
});

Handlebars.registerHelper("setValue", function (varName, varValue, options) {
  options.data.root[varName] = varValue;
});
// -------------------- New helpers ------------------------------
Handlebars.registerHelper("currentYear", function () {
  return new Date().getFullYear();
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
