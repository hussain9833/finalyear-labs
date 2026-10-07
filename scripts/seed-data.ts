/**
 * Seed content. Categories and degrees are real launch data (prices supplied by the business).
 * DEMO_PROJECTS are SAMPLE listings for development/review only — they are flagged `isSample: true`,
 * shown with a "Sample listing" badge, and only inserted with `npm run seed -- --demo`.
 */

export const CATEGORIES = [
  {
    name: "Static Websites",
    slug: "static-websites",
    shortName: "Static",
    description: "Fast, well-designed informational websites — ideal for a first project or a semester submission.",
    priceFrom: 2000,
    examples: ["Portfolio website", "Business website", "College website", "Landing page", "Informational website"],
    icon: "layout-template",
    accent: "cyan",
    whatsappRoute: "web",
    isAI: false,
    order: 4,
    content: {
      intro:
        "Static websites are built with HTML, CSS and JavaScript (or a modern framework that exports static pages). They have no database or login, which keeps them simple to build, host and explain.",
      sections: [
        {
          heading: "When a static website is the right choice",
          body: "Choose a static website when your syllabus asks for a front-end or web-design project, when it is a semester or mini project, or when you want to focus on layout, responsiveness and accessibility. They are also a good base to extend later with a contact form or a CMS.",
        },
        {
          heading: "What examiners usually look for",
          body: "Clean semantic HTML, a responsive layout that works on phones, consistent styling, good page speed and a clear site structure. Be ready to explain how you organised your CSS, how the layout adapts to screen sizes and how you would deploy the site.",
        },
      ],
    },
    faqs: [
      {
        question: "Is a static website enough for a final-year project?",
        answer:
          "It depends on your university. Many BCA and BSc IT programmes accept static sites for semester projects, but final-year projects usually expect a database, login or admin features. Check your guidelines, or ask us about upgrading to a dynamic website.",
      },
    ],
  },
  {
    name: "Dynamic Websites",
    slug: "dynamic-websites",
    shortName: "Dynamic",
    description: "Database-driven web applications with authentication, CRUD operations and admin dashboards.",
    priceFrom: 5000,
    examples: ["Authentication", "CRUD applications", "Admin dashboards", "Database applications", "User management", "API-based applications"],
    icon: "database",
    accent: "iris",
    whatsappRoute: "web",
    isAI: false,
    order: 2,
    content: {
      intro:
        "Dynamic websites store and process data on a server. Users can sign up, log in, create and manage records, and administrators can control everything from a dashboard. This is the most common type of final-year project.",
      sections: [
        {
          heading: "Typical modules",
          body: "Authentication (register, login, roles), user and profile management, the core CRUD module for your domain (e.g. students, appointments, books), search and filters, reports, and an admin panel. Good projects also include validation, error handling and a clean database design.",
        },
        {
          heading: "Choosing a technology stack",
          body: "Popular stacks include MERN (MongoDB, Express, React, Node.js), Next.js with a database, PHP with MySQL, Django or Flask with PostgreSQL, and Java Spring Boot. Pick the stack you are most comfortable explaining — in a viva, understanding beats complexity.",
        },
        {
          heading: "Documentation you will need",
          body: "ER diagram, data-flow diagrams, use-case diagram, database table design, module descriptions, screenshots and test cases. Our documentation resources follow this structure so you can adapt them to your implementation.",
        },
      ],
    },
    faqs: [
      {
        question: "Which stack is best for a dynamic website project?",
        answer:
          "There is no single best stack. MERN and Next.js are modern and in demand, PHP/MySQL is widely taught, and Django suits Python learners. Choose based on your syllabus and what you can confidently explain.",
      },
    ],
  },
  {
    name: "AI-Integrated Websites",
    slug: "ai",
    shortName: "AI",
    description: "Web applications powered by AI — chatbots, analyzers, recommendation engines and RAG systems.",
    priceFrom: 10000,
    examples: ["AI chatbot", "AI resume analyzer", "AI recommendation system", "AI document analyzer", "AI content generator", "AI image generation", "AI analytics", "RAG applications"],
    icon: "sparkles",
    accent: "violet",
    whatsappRoute: "ai",
    isAI: true,
    order: 1,
    content: {
      intro:
        "AI-integrated projects combine a full web application with machine learning or large language models (LLMs). They stand out in evaluations because they solve a real problem in a modern way — as long as you can explain how the AI part works.",
      sections: [
        {
          heading: "Popular AI project types",
          body: "Chatbots and virtual assistants, resume and document analyzers, recommendation systems, content generators, sentiment analysis, and Retrieval-Augmented Generation (RAG) apps that answer questions from your own documents.",
        },
        {
          heading: "How to present an AI project",
          body: "Explain the problem, the data or model you use, how prompts or features are designed, and how you evaluate results. Show limitations honestly (cost, accuracy, privacy) and how you handle them — examiners value that understanding.",
        },
        {
          heading: "API keys and running costs",
          body: "Many AI projects call an AI API (such as OpenAI, Gemini or Claude) or run an open-source model locally. We explain the setup, free-tier options and how to keep keys secure so your demo runs reliably.",
        },
      ],
    },
    faqs: [
      {
        question: "Do I need to know machine learning to do an AI project?",
        answer:
          "Not deeply for LLM-based projects — you need to understand APIs, prompts and how the app uses the results. For classical ML projects, you should understand the dataset, the model and the evaluation metrics. We explain both in the project walkthrough.",
      },
      {
        question: "Will the AI features work without paid API keys?",
        answer:
          "Most projects can run on free tiers or on an open-source model for demos. Each project page lists what it needs, and we help you configure it.",
      },
    ],
  },
  {
    name: "E-Commerce",
    slug: "ecommerce",
    shortName: "E-Commerce",
    description: "Complete online store systems — catalog, cart, checkout, orders, inventory and admin panel.",
    priceFrom: 20000,
    examples: ["Product management", "Cart", "Checkout", "Orders", "Authentication", "Admin panel", "Inventory", "Payment integration"],
    icon: "shopping-bag",
    accent: "amber",
    whatsappRoute: "ecommerce",
    isAI: false,
    order: 3,
    content: {
      intro:
        "E-commerce projects are complete, multi-module systems: a customer storefront, a shopping cart and checkout, order management, and an admin panel for products and inventory. They are well suited to final-year MCA, B.Tech and M.Tech projects.",
      sections: [
        {
          heading: "Core modules",
          body: "Product catalog with categories and search, cart, checkout, order tracking, customer accounts, admin product/inventory management, and reports. Optional: payment gateway (test mode), coupons, reviews and recommendations.",
        },
        {
          heading: "Payments in a student project",
          body: "Payment gateways such as Razorpay or Stripe offer test modes, so you can demonstrate a full checkout without real money. We explain test-mode setup and how to present it.",
        },
      ],
    },
    faqs: [
      {
        question: "Can an e-commerce project include real payments?",
        answer:
          "For academic demos we recommend the gateway's test mode. It shows the full flow without needing a registered business account.",
      },
    ],
  },
] as const;

const degreeContent = (name: string, full: string, focus: string, techs: string, examples: string) => ({
  intro: `${name} (${full}) final-year projects are where you show you can design, build and explain a complete software application. ${focus}`,
  sections: [
    {
      heading: `What is a ${name} final-year project?`,
      body: `It is a working software system you design and build, usually in your final semester, together with a project report and a presentation or viva. Evaluators look at the problem you chose, your design, the implementation, testing and — most importantly — how well you understand and can explain your own project.`,
    },
    {
      heading: `Types of ${name} projects`,
      body: `Common choices include ${examples}. Web applications with a database and admin panel are the most common, and AI-integrated projects are increasingly popular because they solve problems in a modern way.`,
    },
    {
      heading: "Technologies students commonly use",
      body: `${techs}. Pick a stack your syllabus covers or that you want to learn properly — you will be asked how the pieces fit together.`,
    },
    {
      heading: "How to choose the right project",
      body: "Start with your university guidelines (scope, team size, allowed technologies). Choose a problem you find interesting, check that it has enough modules for your level, and make sure you can explain every part. A smaller project you fully understand is better than a large one you can't defend.",
    },
    {
      heading: "Documentation you will need",
      body: "Most universities expect an abstract, introduction, problem statement, objectives, existing vs proposed system, system design (DFD, ER and UML diagrams), database design, module descriptions, screenshots, testing, future scope and conclusion. Always follow your institution's format.",
    },
    {
      heading: "Preparing for your presentation and viva",
      body: "Run the project end-to-end on your own machine, rehearse a short demo, and be ready to explain the architecture, database tables, one or two important pieces of code, and what you would improve. Customizing the project to your own idea makes it far easier to present confidently.",
    },
  ],
});

export const DEGREES = [
  {
    name: "BCA",
    slug: "bca",
    fullName: "Bachelor of Computer Applications",
    shortIntro: "Web, AI and database projects suited to BCA final and semester submissions.",
    order: 1,
    content: degreeContent(
      "BCA",
      "Bachelor of Computer Applications",
      "BCA projects usually focus on practical web or desktop applications with a clear database design.",
      "HTML/CSS/JavaScript, PHP and MySQL, Python (Django/Flask), Java, React, Node.js and MongoDB",
      "management systems (library, hostel, inventory), online booking portals, e-learning sites, e-commerce stores and AI chatbots",
    ),
    faqs: [
      {
        question: "What is a good final-year project for BCA?",
        answer:
          "A database-driven web application with an admin panel — for example a management system or booking portal — is a strong choice. If you are comfortable with APIs, an AI-integrated project like a resume analyzer or chatbot stands out.",
      },
      {
        question: "Can BCA students do AI projects?",
        answer:
          "Yes. Many AI projects use AI APIs inside a normal web app, which fits the BCA skill set well. Make sure you can explain how the AI feature works and its limitations.",
      },
    ],
  },
  {
    name: "MCA",
    slug: "mca",
    fullName: "Master of Computer Applications",
    shortIntro: "Advanced full-stack, AI and e-commerce projects for MCA students.",
    order: 2,
    content: degreeContent(
      "MCA",
      "Master of Computer Applications",
      "At the master's level, examiners expect stronger architecture, security and scalability considerations.",
      "React, Next.js, Node.js, Python, Java Spring Boot, MongoDB, PostgreSQL, REST APIs and cloud deployment",
      "multi-role web platforms, e-commerce systems, AI/ML applications, analytics dashboards and RAG-based assistants",
    ),
    faqs: [
      {
        question: "What makes a good MCA final-year project?",
        answer:
          "A multi-module application with proper authentication, role-based access, a well-designed database and at least one advanced feature such as AI, analytics or payment integration.",
      },
    ],
  },
  {
    name: "BSc IT",
    slug: "bsc-it",
    fullName: "Bachelor of Science in Information Technology",
    shortIntro: "Practical web and AI projects that match BSc IT syllabi.",
    order: 3,
    content: degreeContent(
      "BSc IT",
      "Bachelor of Science in Information Technology",
      "BSc IT projects typically emphasise working systems, networking or web concepts and clear documentation.",
      "HTML/CSS/JavaScript, PHP, Python, Java, Android, MySQL and Firebase",
      "web portals, management systems, Android apps, chat applications and AI-based tools",
    ),
    faqs: [
      {
        question: "Which projects are suitable for BSc IT final year?",
        answer:
          "Web applications with a database, mobile apps and AI-integrated tools are all common. Pick one that your syllabus supports and that you can explain end-to-end.",
      },
    ],
  },
  {
    name: "MSc IT",
    slug: "msc-it",
    fullName: "Master of Science in Information Technology",
    shortIntro: "Research-friendly AI, data and full-stack projects for MSc IT.",
    order: 4,
    content: degreeContent(
      "MSc IT",
      "Master of Science in Information Technology",
      "MSc IT projects often combine an application with an analytical or research component.",
      "Python, machine learning libraries, React, Node.js, Django, MongoDB, PostgreSQL and cloud services",
      "AI/ML applications, data analytics dashboards, recommendation systems and secure web platforms",
    ),
    faqs: [
      {
        question: "Should an MSc IT project include research?",
        answer:
          "Many programmes expect a literature review and an evaluation section. AI and analytics projects make this natural — compare approaches and report results honestly.",
      },
    ],
  },
  {
    name: "B.Tech",
    slug: "btech",
    fullName: "Bachelor of Technology",
    shortIntro: "Engineering-grade web, AI and full-stack projects for B.Tech (CSE/IT).",
    order: 5,
    content: degreeContent(
      "B.Tech",
      "Bachelor of Technology",
      "B.Tech (CSE/IT) projects are expected to show engineering depth — clear architecture, sound algorithms and testing.",
      "React, Next.js, Node.js, Python (Flask/Django/FastAPI), machine learning, Java, MongoDB, MySQL and cloud deployment",
      "AI and machine-learning systems, full-stack platforms, e-commerce, IoT dashboards and automation tools",
    ),
    faqs: [
      {
        question: "What are good AI projects for B.Tech students?",
        answer:
          "Resume analyzers, document Q&A (RAG) systems, recommendation engines and AI chatbots are popular. Focus on a clear problem statement and an evaluation of results.",
      },
    ],
  },
  {
    name: "M.Tech",
    slug: "mtech",
    fullName: "Master of Technology",
    shortIntro: "Advanced AI and system projects with room for research and evaluation.",
    order: 6,
    content: degreeContent(
      "M.Tech",
      "Master of Technology",
      "M.Tech projects are expected to contribute something — an improved approach, a comparison or a well-evaluated system.",
      "Python, deep-learning frameworks, LLM APIs, vector databases, Next.js, FastAPI and cloud platforms",
      "AI/ML research implementations, RAG systems, intelligent recommendation engines and scalable web platforms",
    ),
    faqs: [
      {
        question: "Can I use a ready project as a base for my M.Tech work?",
        answer:
          "A working base can save time on infrastructure so you can focus on your research contribution. Make sure your novel work, evaluation and report are your own and follow your institution's policies.",
      },
    ],
  },
] as const;

export const HOME_FAQS = [
  {
    question: "What exactly do I get with a project?",
    answer:
      "Source code, a setup guide, a project explanation, documentation/project-book templates, screenshots and demo access where available, plus technical guidance over WhatsApp. Each project page lists exactly what is included.",
  },
  {
    question: "Can you customize a project for my requirements?",
    answer:
      "Yes. Most projects can be customized — new modules, a different technology, branding or features from your synopsis. Share your requirements on WhatsApp or through the custom project form.",
  },
  {
    question: "Will you help me understand and run the project?",
    answer:
      "Yes. We walk you through the setup and explain how the project works, so you can run it on your own machine and present it confidently.",
  },
  {
    question: "Are the documentation templates ready to submit?",
    answer:
      "They are structured templates and resources. You should adapt them to your actual implementation and to your university's format and guidelines — we never guarantee acceptance by any institution.",
  },
  {
    question: "How do I buy a project?",
    answer:
      "Tap “Get This Project” on any project page. It opens WhatsApp with a pre-filled message so we can share details, pricing and customization options.",
  },
];

/* ------------------------------ SAMPLE DATA ------------------------------ */

type DemoProject = {
  name: string;
  slug: string;
  category: string;
  categories?: string[];
  degrees: string[];
  technologies: string[];
  tags: string[];
  priceFrom: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  level: "final" | "semi-final" | "both";
  platform: "web" | "mobile" | "desktop" | "cross";
  isAI: boolean;
  hasAdminPanel: boolean;
  hasAuth: boolean;
  featured: boolean;
  shortDescription: string;
  description: string;
  features: [string, string][];
  modules: [string, string, string[]][];
  howItWorks: [string, string][];
  faqs?: [string, string][];
};

export const STANDARD_WHAT_YOU_GET = [
  { title: "Complete source code", description: "Well-structured, commented code for the full project." },
  { title: "Setup guide", description: "Step-by-step instructions to run the project on your machine." },
  { title: "Project explanation", description: "A walkthrough of the architecture, modules and key code." },
  { title: "Documentation / project-book template", description: "A structured template to adapt to your implementation and university format." },
  { title: "PPT resources", description: "Presentation outline and slides you can customize." },
  { title: "Screenshots & demo", description: "Screenshots for your report and demo access where available." },
  { title: "Technical guidance", description: "Help over WhatsApp while you set up and understand the project." },
  { title: "Customization options", description: "Add modules, change the stack or tailor features (quoted separately)." },
];

export const STANDARD_DOC_ITEMS = [
  "Abstract", "Introduction", "Problem statement", "Objectives", "Existing & proposed system", "Methodology",
  "System design (DFD, ER, UML)", "Database design", "Module description", "Screenshots", "Testing", "Future scope & conclusion",
];

export const DEMO_PROJECTS: DemoProject[] = [
  {
    name: "AI Resume Analyzer",
    slug: "ai-resume-analyzer",
    category: "ai",
    degrees: ["bca", "mca", "bsc-it", "btech"],
    technologies: ["Next.js", "TypeScript", "MongoDB", "OpenAI API", "Tailwind CSS"],
    tags: ["resume", "ats", "nlp", "career", "llm"],
    priceFrom: 12000,
    difficulty: "intermediate",
    level: "final",
    platform: "web",
    isAI: true,
    hasAdminPanel: true,
    hasAuth: true,
    featured: true,
    shortDescription: "Upload a resume and get an ATS-style score, skill-gap analysis and AI suggestions for a target job role.",
    description:
      "AI Resume Analyzer helps students and job seekers improve their resumes. Users upload a PDF resume and choose a target role; the system extracts the text, compares it with the role's required skills and uses an LLM to generate a score, missing keywords and rewrite suggestions. An admin panel manages job roles and views usage analytics.",
    features: [
      ["PDF resume upload & parsing", "Extracts text and sections from uploaded PDF resumes."],
      ["ATS-style score", "Scores the resume against a selected job role."],
      ["Skill-gap analysis", "Highlights missing skills and keywords."],
      ["AI rewrite suggestions", "Generates improved bullet points with an LLM."],
      ["History & reports", "Users can revisit previous analyses."],
      ["Admin analytics", "Admins manage job roles and view usage."],
    ],
    modules: [
      ["Authentication", "Secure sign-up and login.", ["Register / login", "Password hashing", "Protected routes"]],
      ["Resume processing", "Parses and stores resumes.", ["PDF upload", "Text extraction", "Section detection"]],
      ["AI analysis engine", "Builds prompts and interprets results.", ["Prompt templates", "Scoring", "Suggestions"]],
      ["Admin panel", "Manages roles and monitors usage.", ["Job role CRUD", "Usage dashboard"]],
    ],
    howItWorks: [
      ["Upload", "The user uploads a PDF resume and picks a target role."],
      ["Extract", "The server extracts and cleans the resume text."],
      ["Analyze", "Skills are matched and an LLM generates feedback."],
      ["Report", "The user sees a score, gaps and suggestions."],
    ],
    faqs: [["Does it need a paid API key?", "It works with the free tier of supported AI APIs for demos; we help you configure keys securely."]],
  },
  {
    name: "College Helpdesk AI Chatbot (RAG)",
    slug: "college-helpdesk-ai-chatbot",
    category: "ai",
    degrees: ["mca", "msc-it", "btech", "mtech"],
    technologies: ["Python", "FastAPI", "React", "LangChain", "Vector DB"],
    tags: ["chatbot", "rag", "llm", "education"],
    priceFrom: 15000,
    difficulty: "advanced",
    level: "final",
    platform: "web",
    isAI: true,
    hasAdminPanel: true,
    hasAuth: true,
    featured: true,
    shortDescription: "A chatbot that answers student questions from your college's own documents using Retrieval-Augmented Generation.",
    description:
      "Admins upload college documents (prospectus, rules, timetables). The system splits them into chunks, creates embeddings and stores them in a vector database. When a student asks a question, relevant passages are retrieved and an LLM writes an answer with sources.",
    features: [
      ["Document ingestion", "Upload PDFs and text that become the chatbot's knowledge base."],
      ["Semantic search", "Retrieves relevant passages with vector embeddings."],
      ["Cited answers", "Every answer shows the source passages."],
      ["Chat history", "Students can revisit past conversations."],
      ["Admin knowledge base", "Add, update and remove documents."],
    ],
    modules: [
      ["Ingestion pipeline", "Chunking and embeddings.", ["PDF parsing", "Chunking", "Embedding & indexing"]],
      ["Retrieval & generation", "RAG chain.", ["Similarity search", "Prompt assembly", "Answer generation"]],
      ["Chat interface", "React chat UI.", ["Streaming responses", "Sources panel"]],
      ["Admin", "Knowledge-base management.", ["Document CRUD", "Re-indexing"]],
    ],
    howItWorks: [
      ["Ingest", "Admins upload documents which are chunked and embedded."],
      ["Ask", "A student types a question."],
      ["Retrieve", "The most relevant chunks are fetched from the vector DB."],
      ["Answer", "The LLM answers using only those chunks, with citations."],
    ],
  },
  {
    name: "Smart E-Commerce Store",
    slug: "smart-ecommerce-store",
    category: "ecommerce",
    categories: ["ecommerce", "ai"],
    degrees: ["mca", "btech", "mtech", "msc-it"],
    technologies: ["Next.js", "Node.js", "MongoDB", "Razorpay (test mode)", "Tailwind CSS"],
    tags: ["shopping", "cart", "payments", "recommendations"],
    priceFrom: 22000,
    difficulty: "advanced",
    level: "final",
    platform: "web",
    isAI: true,
    hasAdminPanel: true,
    hasAuth: true,
    featured: true,
    shortDescription: "A full online store with cart, checkout, order tracking, inventory and AI-powered product recommendations.",
    description:
      "A complete e-commerce platform: customers browse and search products, add to cart, check out with a payment gateway in test mode and track orders. Admins manage products, stock, orders and coupons. A recommendation module suggests related products.",
    features: [
      ["Product catalog & search", "Categories, filters and fast search."],
      ["Cart & checkout", "Persistent cart and a multi-step checkout."],
      ["Payment gateway (test mode)", "End-to-end payment flow without real money."],
      ["Order tracking", "Customers follow order status."],
      ["Inventory management", "Stock levels with low-stock alerts."],
      ["Product recommendations", "Suggests related products."],
    ],
    modules: [
      ["Storefront", "Customer-facing shop.", ["Catalog", "Product page", "Search"]],
      ["Cart & orders", "Purchase flow.", ["Cart", "Checkout", "Order history"]],
      ["Admin panel", "Store management.", ["Products", "Inventory", "Orders", "Coupons"]],
      ["Recommendations", "Related-product suggestions.", ["Similarity scoring", "Recently viewed"]],
    ],
    howItWorks: [
      ["Browse", "Customers search and filter products."],
      ["Buy", "They add items to the cart and check out."],
      ["Pay", "The payment gateway (test mode) confirms the order."],
      ["Fulfil", "Admins update order status; stock adjusts automatically."],
    ],
  },
  {
    name: "Online Grocery Delivery Platform",
    slug: "online-grocery-delivery",
    category: "ecommerce",
    degrees: ["bca", "mca", "btech"],
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    tags: ["grocery", "delivery", "orders"],
    priceFrom: 20000,
    difficulty: "intermediate",
    level: "final",
    platform: "web",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: false,
    shortDescription: "Order groceries online with delivery slots, cart, order history and an admin panel for stores.",
    description:
      "Customers browse groceries by category, choose delivery slots and place orders. Store admins manage products, prices, stock and deliveries from a dashboard.",
    features: [
      ["Category browsing", "Fruits, vegetables, dairy and more."],
      ["Delivery slots", "Customers choose a convenient time."],
      ["Order management", "Track and update orders."],
      ["Admin dashboard", "Products, stock and sales overview."],
    ],
    modules: [
      ["Customer app", "Shopping experience.", ["Catalog", "Cart", "Checkout"]],
      ["Admin", "Store operations.", ["Products", "Orders", "Reports"]],
    ],
    howItWorks: [
      ["Choose", "Customers pick items and a delivery slot."],
      ["Order", "The order is placed and confirmed."],
      ["Deliver", "Admins track and complete deliveries."],
    ],
  },
  {
    name: "Student Management System",
    slug: "student-management-system",
    category: "dynamic-websites",
    degrees: ["bca", "bsc-it", "mca"],
    technologies: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    tags: ["school", "college", "attendance", "marks"],
    priceFrom: 6000,
    difficulty: "beginner",
    level: "both",
    platform: "web",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: true,
    shortDescription: "Manage students, courses, attendance and marks with separate admin, teacher and student logins.",
    description:
      "A classic, well-structured management system with three roles. Admins manage courses and users, teachers record attendance and marks, and students view their records and reports.",
    features: [
      ["Role-based login", "Admin, teacher and student portals."],
      ["Attendance tracking", "Daily attendance with reports."],
      ["Marks & results", "Enter marks and generate result sheets."],
      ["Reports", "Printable reports per student and course."],
    ],
    modules: [
      ["Authentication & roles", "Three user roles.", ["Login", "Role permissions"]],
      ["Academic records", "Core data.", ["Students", "Courses", "Attendance", "Marks"]],
      ["Reports", "Outputs.", ["Result sheet", "Attendance report"]],
    ],
    howItWorks: [
      ["Set up", "Admins create courses and users."],
      ["Record", "Teachers mark attendance and enter marks."],
      ["Review", "Students log in to view their progress."],
    ],
  },
  {
    name: "Hospital Appointment Booking System",
    slug: "hospital-appointment-booking",
    category: "dynamic-websites",
    degrees: ["bca", "mca", "bsc-it", "btech"],
    technologies: ["Django", "Python", "PostgreSQL", "HTML/CSS"],
    tags: ["healthcare", "booking", "appointments"],
    priceFrom: 7500,
    difficulty: "intermediate",
    level: "final",
    platform: "web",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: false,
    shortDescription: "Patients book doctor appointments online; doctors manage schedules; admins manage departments.",
    description:
      "Patients search doctors by department, view available slots and book appointments. Doctors manage availability and see their daily schedule; admins manage departments, doctors and reports.",
    features: [
      ["Doctor search", "Filter by department and availability."],
      ["Slot booking", "Real-time availability, no double booking."],
      ["Doctor dashboard", "Daily schedule and patient list."],
      ["Email notifications", "Booking confirmations and reminders."],
    ],
    modules: [
      ["Patients", "Booking flow.", ["Search", "Book", "History"]],
      ["Doctors", "Schedule management.", ["Availability", "Appointments"]],
      ["Admin", "Hospital setup.", ["Departments", "Doctors", "Reports"]],
    ],
    howItWorks: [
      ["Search", "Patients find a doctor and slot."],
      ["Book", "The slot is reserved and confirmed."],
      ["Consult", "Doctors see the appointment in their schedule."],
    ],
  },
  {
    name: "Developer Portfolio Website",
    slug: "developer-portfolio-website",
    category: "static-websites",
    degrees: ["bca", "bsc-it"],
    technologies: ["HTML", "CSS", "JavaScript"],
    tags: ["portfolio", "resume", "responsive"],
    priceFrom: 2000,
    difficulty: "beginner",
    level: "semi-final",
    platform: "web",
    isAI: false,
    hasAdminPanel: false,
    hasAuth: false,
    featured: false,
    shortDescription: "A fast, responsive personal portfolio with projects, skills, resume download and a contact section.",
    description:
      "A modern, accessible portfolio site with smooth scrolling, project showcases, a skills section and a contact form link. Great for semester submissions and as your own personal site.",
    features: [
      ["Responsive layout", "Looks great on phones, tablets and desktops."],
      ["Projects showcase", "Cards with screenshots and links."],
      ["Dark mode", "Light and dark themes."],
      ["Fast loading", "Optimised images and minimal JavaScript."],
    ],
    modules: [["Pages & sections", "Site structure.", ["Home", "About", "Projects", "Contact"]]],
    howItWorks: [
      ["Customize", "Add your details, projects and photo."],
      ["Deploy", "Host free on GitHub Pages, Netlify or Vercel."],
    ],
  },
  {
    name: "College Website",
    slug: "college-website",
    category: "static-websites",
    degrees: ["bca", "bsc-it", "btech"],
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    tags: ["college", "institution", "responsive"],
    priceFrom: 3000,
    difficulty: "beginner",
    level: "semi-final",
    platform: "web",
    isAI: false,
    hasAdminPanel: false,
    hasAuth: false,
    featured: false,
    shortDescription: "A multi-page college website with departments, courses, faculty, gallery, events and admissions pages.",
    description:
      "A complete informational website for an institution with a clear navigation structure, department and course pages, a gallery and an admissions enquiry section.",
    features: [
      ["Multi-page structure", "Home, departments, courses, faculty, gallery, contact."],
      ["Responsive design", "Mobile-first layout."],
      ["Image gallery", "Lightbox gallery for campus photos."],
    ],
    modules: [["Site pages", "Content sections.", ["Departments", "Courses", "Faculty", "Admissions"]]],
    howItWorks: [
      ["Adapt", "Replace content with your institution's details."],
      ["Publish", "Deploy to any static host."],
    ],
  },
];
