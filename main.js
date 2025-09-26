const handlebarsRenderer = require("./handlebars-renderer");
const fs = require("fs");
const { generatePDF } = require("./pdf-convertor");
const diagnosticData = require("./data/diagnostic_test.json");
const signupData = require("./data/signup_user_data.json");

const PAYMENT_OBJ = {
  user: {
    name: "User Harsh",
    email: "harsh@mail.com",
    contact: {
      code: "+91",
      mobile: "9876543210",
      country_code: "IN",
    },
  },
  invoice: {
    id: "123456",
    date: " 2023-10-10",
  },
  payments: {
    cash: [
      {
        description: "Plan 1",
        quantity: 1,
        amount: 500,
        currency: "Rs",
        summary: {
          total: {
            coupon: 20,
            grand: 600,
          },
          tax: 18,
        },
      },
      {
        description: "Plan 2",
        quantity: 2,
        amount: 500,
        currency: "Rs",
        summary: {
          total: {
            coupon: 40,
            grand: 1100,
          },
          tax: 18,
        },
      },
    ],
  },
};

const JOURNAL_OBJ = {
  bookings: [
    { name: "Journal entry 1", date: "2023-10-10", time: "10:00 AM" },
    { name: "Journal entry 2", date: "2023-10-10", time: "10:00 AM" },
  ],
};

const AFFIRMATION_OBJ = {
  affirmation_text: `“I am growing at my own pace, and that is enough. I trust myself, my journey, and the timing of my life.”`,
  affirmation_author: "Jeff Bezos",
};

const templateData = {
  translated: {
    path: "\\new-templates\\slot_reminder.handlebars",
    output: "\\output\\new-templates\\verify_user.html",
    outputPdf: "\\output\\new-tempaltes\\verify_user.pdf",
    data: {
      therapists: [
        { name: "harsh", url: "https://dashboard.staging.mindpeers.co/zone" },
        { name: "harsh2", url: "https://dashboard.staging.mindpeers.co/zone2" },
      ],
      orgLogoUrl: "../../assets/mp-sm-logo.png",
      header: "https://cdn.mindpeers.co/logos/mindpeers_default.png",
      constants: {
        logoUrl: "https://cdn.mindpeers.co/logos/mindpeers_default.png",
        dashboardUrl: "https://dashboard.staging.mindpeers.co/zone",
        test: {
          name: "Test Name",
          url: "https://dashboard.staging.mindpeers.co/zone",
        },
        smLogoUrl: "../../assets/mp-sm-logo.png",
        ...signupData,
      },
      otp: 234543,
      name: "Harsh",
      client: "Harsh",
      normal_therapist_1: {
        name: "Normal",
        photo: "https://placehold.co/50x50",
      },
      normal_therapist_2: {
        name: "Normal2",
        photo: "https://placehold.co/50x50",
      },
      superstar_therapist_1: {
        name: "Superstar",
        photo: "https://placehold.co/50x50",
      },
      superstar_therapist_2: {
        name: "Superstar2",
        photo: "https://placehold.co/50x50",
      },
      ...AFFIRMATION_OBJ,
      ...JOURNAL_OBJ,
      ...PAYMENT_OBJ,
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
    // await downloadPdf(renderedHtml);
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
