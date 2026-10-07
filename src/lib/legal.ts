/**
 * Legal/trust page content. Items in [square brackets] are placeholders the business owner must confirm
 * (legal entity name, address, jurisdiction, refund windows). Have the final text reviewed by a professional.
 */
import { siteConfig } from "@/lib/site";
import type { ProseBlock } from "@/components/marketing/prose-page";

export const LEGAL_UPDATED = "7 October 2026";
const brand = siteConfig.name;
const email = siteConfig.contactEmail || "[contact email]";

export const ABOUT: ProseBlock[] = [
  {
    heading: "What we do",
    paragraphs: [
      `${brand} helps technical students — BCA, MCA, BSc IT, MSc IT, B.Tech and M.Tech — find, understand and customize final-year and semester projects. Each project comes with source code, a setup guide, an explanation of how it works, documentation resources and direct support on WhatsApp.`,
      "We believe a good project is one you can explain. That's why we focus on clarity: live demos where available, clear module breakdowns, honest difficulty levels and guidance while you set things up.",
    ],
  },
  {
    heading: "How we're different from a code download",
    list: [
      "Curated projects organised by degree, category and technology",
      "Explanations of the architecture, modules and key code",
      "Documentation and presentation resources you adapt to your own work",
      "Customization — new modules, a different stack or your own idea",
      "A real person to talk to on WhatsApp",
    ],
  },
  { heading: "Responsible use", paragraphs: [siteConfig.responsibleUse] },
];

export const PRIVACY: ProseBlock[] = [
  {
    heading: "Who we are",
    paragraphs: [`This policy explains how ${brand} ("we", "us") collects and uses information when you use this website. Contact: ${email}.`],
  },
  {
    heading: "Information you give us",
    paragraphs: [
      "When you submit the custom project form we collect the details you provide: name, email, phone/WhatsApp number, degree, year and your project requirements. We use this only to respond to your request and provide the services you ask for.",
      "When you contact us on WhatsApp, the conversation happens on WhatsApp under WhatsApp's own terms and privacy policy. We do not copy your WhatsApp conversations to this website.",
    ],
  },
  {
    heading: "Information collected automatically",
    paragraphs: [
      "We record anonymous usage events — for example that a project page was viewed or that a WhatsApp button was clicked — together with the page, the button location, a device type (mobile/tablet/desktop), the referring website domain and campaign (UTM) parameters. These events do not contain your name, phone number, email address or IP address.",
      "We use a small first-party cookie to remember the campaign or website that brought you to us (for up to 30 days) and a short-lived anonymous session identifier. To prevent abuse we process a one-way, salted hash of your IP address for a few minutes for rate limiting; the raw IP address is not stored.",
      "If Google Analytics is enabled, Google may set its own cookies and process data under Google's privacy policy. IP anonymisation is requested.",
    ],
  },
  {
    heading: "How we use information",
    list: [
      "To respond to enquiries and deliver projects, customization and support",
      "To understand which projects and pages are useful so we can improve the site",
      "To keep the website secure and prevent spam or abuse",
    ],
  },
  {
    heading: "Sharing",
    paragraphs: ["We do not sell your personal information. We share it only with service providers that help us run the website (hosting, database, analytics) under appropriate confidentiality, or when required by law."],
  },
  {
    heading: "Retention",
    paragraphs: ["Enquiry and lead records are kept for as long as needed to provide the service and for our legitimate business records, then deleted. Anonymous analytics events are deleted automatically after [24 months]."],
  },
  {
    heading: "Your choices",
    paragraphs: [`You can ask us to access, correct or delete the personal information you submitted by writing to ${email}. You can also block or delete cookies in your browser settings.`],
  },
];

export const TERMS: ProseBlock[] = [
  {
    heading: "About these terms",
    paragraphs: [`These terms apply to your use of the ${brand} website and to projects, customization and support you obtain from us. By using the site you agree to them. [Legal entity name, address and governing jurisdiction to be confirmed.]`],
  },
  {
    heading: "What we provide",
    paragraphs: [
      "Each project listing describes what is included — typically source code, a setup guide, a project explanation, documentation/presentation templates, screenshots or a demo where available, and technical guidance. The exact deliverables and price are confirmed with you on WhatsApp or in writing before purchase.",
      "Prices shown on the website are starting prices. The final price may vary with customization, documentation needs and timelines.",
    ],
  },
  {
    heading: "Customization",
    paragraphs: ["Customization requests (new modules, technology changes, design changes) are scoped and quoted separately. Timelines depend on scope and are agreed before work begins."],
  },
  {
    heading: "Support",
    paragraphs: ["We provide setup guidance and help understanding the project for [the period agreed at purchase]. Support covers the project as delivered; changes you make yourself or new features are outside standard support."],
  },
  {
    heading: "Documentation templates",
    paragraphs: ["Documentation, project-book and presentation templates are resources to help you structure your own report. You are responsible for adapting them to your actual implementation and to your institution's format and guidelines. We do not guarantee acceptance, grades or approval by any college or university."],
  },
  {
    heading: "Academic responsibility",
    paragraphs: [siteConfig.responsibleUse, "You are responsible for complying with your institution's rules on originality, collaboration and use of third-party code."],
  },
  {
    heading: "Licence",
    paragraphs: ["Unless agreed otherwise in writing, you receive a personal, non-transferable licence to use, study and modify the project for your own academic and learning purposes. Reselling or redistributing the project or its materials is not permitted."],
  },
  {
    heading: "Liability",
    paragraphs: ["Projects are provided for learning and academic use. To the extent permitted by law, we are not liable for indirect or consequential losses, and our total liability is limited to the amount you paid for the relevant project."],
  },
];

export const REFUND: ProseBlock[] = [
  {
    heading: "Overview",
    paragraphs: ["Because projects are digital products and source code cannot be “returned”, refunds are limited. We want you to be confident before you buy, so please use the live demo, screenshots and WhatsApp to ask questions first. [Refund windows and percentages below are placeholders — confirm before launch.]"],
  },
  {
    heading: "When you may be eligible for a refund",
    list: [
      "The project delivered is materially different from the listing and we cannot fix it within [7] days of you reporting it",
      "We are unable to deliver an agreed customization and no work has been delivered",
      "Duplicate payment for the same order",
    ],
  },
  {
    heading: "When refunds are not available",
    list: [
      "After source code or documentation has been delivered and matches the listing",
      "Change of mind, or a change in your college's requirements after delivery",
      "Issues caused by modifications you made, or by your local environment that we have helped you troubleshoot",
      "Results of academic evaluation — we cannot guarantee acceptance or grades",
    ],
  },
  {
    heading: "Customization payments",
    paragraphs: ["For custom work, any advance covers work already started. If a custom project is cancelled, we refund the portion of the advance that relates to work not yet done, as agreed when the order was placed."],
  },
  {
    heading: "How to request",
    paragraphs: [`Contact us within [7] days of delivery at ${email} or on WhatsApp with your order details. Approved refunds are processed to the original payment method within [7–10] working days.`],
  },
];

export const DISCLAIMER: ProseBlock[] = [
  {
    heading: "Educational purpose",
    paragraphs: [`Projects, code, documentation templates and guidance from ${brand} are provided as learning, development and customization resources.`, siteConfig.responsibleUse],
  },
  {
    heading: "No guarantee of academic outcomes",
    paragraphs: ["We do not guarantee that any project or document will be accepted, approved or graded in any particular way by a college, university or examiner. Requirements differ between institutions and you are responsible for meeting yours."],
  },
  {
    heading: "Third-party services",
    paragraphs: ["Some projects use third-party services (for example AI APIs, payment gateways in test mode or hosting platforms). Their availability, pricing and terms are controlled by those providers."],
  },
  {
    heading: "Information on this site",
    paragraphs: ["We work to keep project descriptions accurate, but technologies and features may be updated. The final scope is confirmed before purchase. Listings marked “Sample listing” are illustrative examples."],
  },
];
