const handlebarsRenderer = require("./handlebars-renderer");
const fs = require("fs");
const { generatePDF } = require("./pdf-convertor");
const diagnosticData = require("./data/diagnostic_data.json");
const signupData = require("./data/signup_user_data.json");

const templateData = {
  translated: {
    path: "\\templates\\diagnostic_test_report.handlebars",
    output: "\\output\\diagnostic_test_report.html",
    outputPdf: "\\output\\diagnostic_test_report.pdf",
    data: {
      constants: {
        logoUrl: "https://cdn.mindpeers.co/logos/mindpeers_default.png",
        dashboardUrl: "https://dashboard.staging.mindpeers.co/zone",
        test: {
          name: "Test Name",
          url: "https://dashboard.staging.mindpeers.co/zone",
        },
        ...signupData,
      },
      otp: 234543,
      name: "Harsh",
      ...diagnosticData,
    },
  },
};

// const templatePath = __dirname + "\\" + templateData.diagnosticsHandlebars.path;
// const outputPath = __dirname + `\\` + templateData.diagnosticsHandlebars.output;
// const outputPdfPath =
//   __dirname + `\\` + templateData.diagnosticsHandlebars.outputPdf;
// const jsonData = templateData.diagnosticsHandlebars.data;

const templatePath = __dirname + "\\" + templateData.translated.path;
const outputPath = __dirname + `\\` + templateData.translated.output;
const outputPdfPath = __dirname + `\\` + templateData.translated.outputPdf;
const jsonData = templateData.translated.data;

// Render the template and save the result to a new HTML file
// const renderedHtml = handlebarsRenderer.renderTemplate(templatePath, jsonData);
(async () => {
  try {
    const renderedHtml = handlebarsRenderer.renderTemplate(
      templatePath,
      jsonData
    );
    await downloadPdf(renderedHtml);
    await handlebarsRenderer.saveToHtmlFile(outputPath, renderedHtml);
    console.log("PDF and HTML files saved successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
})();

async function downloadPdf(renderedHtml) {
  const fileBuffer = await generatePDF(renderedHtml);
  // convert file buffer to pdf and download
  fs.writeFileSync(outputPdfPath, fileBuffer);
}
