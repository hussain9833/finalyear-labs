/**
 * Additional seed content: more categories, more SAMPLE projects (isSample=true) and launch blog posts.
 * Category starting prices are initial estimates — confirm/edit them in Admin → Categories.
 */
import type { DEMO_PROJECTS } from "./seed-data";

export const EXTRA_CATEGORIES = [
  {
    name: "Mobile Applications",
    slug: "mobile-apps",
    shortName: "Mobile",
    description: "Android and cross-platform apps built with Flutter, React Native or Kotlin — with a backend and admin panel.",
    priceFrom: 8000,
    examples: ["Flutter apps", "Android (Kotlin/Java) apps", "React Native apps", "Firebase-backed apps", "Booking & delivery apps"],
    icon: "smartphone",
    accent: "emerald",
    whatsappRoute: "web",
    isAI: false,
    order: 5,
    content: {
      intro:
        "Mobile application projects let you demonstrate app design, state management and a connected backend. Flutter and React Native are popular because one codebase runs on Android and iOS.",
      sections: [
        {
          heading: "What a good mobile project includes",
          body: "Authentication, a clear navigation flow, a backend or cloud database (Firebase, Supabase or a REST API), push notifications where useful, and an admin panel or dashboard to manage data. Examiners appreciate offline handling and a polished UI on small screens.",
        },
        {
          heading: "Demonstrating your app",
          body: "Install a signed APK on your phone and keep a screen recording as backup. Be ready to explain the app architecture, how data is synced with the backend and how you tested on different screen sizes.",
        },
      ],
    },
    faqs: [
      {
        question: "Flutter or native Android — which should I choose?",
        answer:
          "Flutter is faster to build and runs on both platforms; native Kotlin is closer to many university syllabi. Pick the one you can explain confidently — we can help with either.",
      },
    ],
  },
  {
    name: "Machine Learning & Data Science",
    slug: "machine-learning",
    shortName: "ML",
    description: "Prediction, classification and analytics projects with real datasets, model evaluation and a usable interface.",
    priceFrom: 8000,
    examples: ["Prediction models", "Classification systems", "Recommendation engines", "Data analytics dashboards", "Computer vision", "NLP / sentiment analysis"],
    icon: "brain",
    accent: "violet",
    whatsappRoute: "ai",
    isAI: true,
    order: 6,
    content: {
      intro:
        "Machine learning projects show that you can work with data end-to-end: collecting and cleaning it, training and evaluating models, and presenting results through an app or dashboard.",
      sections: [
        {
          heading: "Structure of a strong ML project",
          body: "A clear problem statement, a documented dataset, exploratory data analysis, at least two models compared on proper metrics (accuracy, precision/recall, F1, RMSE), and a simple web interface (Streamlit, Flask or FastAPI) so examiners can try it.",
        },
        {
          heading: "Being honest about results",
          body: "Report how you split data, avoid data leakage, and discuss where the model fails. A well-explained 85% model is more convincing than an unexplained 99%.",
        },
      ],
    },
    faqs: [
      {
        question: "Where do the datasets come from?",
        answer: "We use public datasets (e.g. Kaggle, UCI) with proper attribution, or help you collect your own. Your report should cite the source.",
      },
    ],
  },
  {
    name: "IoT Projects",
    slug: "iot",
    shortName: "IoT",
    description: "Sensor-based systems with microcontrollers, cloud dashboards and mobile alerts.",
    priceFrom: 12000,
    examples: ["Smart home automation", "Health monitoring", "Smart agriculture", "Environment monitoring", "Vehicle tracking"],
    icon: "cpu",
    accent: "cyan",
    whatsappRoute: "sales",
    isAI: false,
    order: 7,
    content: {
      intro:
        "IoT projects combine hardware (ESP32, Arduino, Raspberry Pi and sensors) with software — a cloud backend, a dashboard and often a mobile app. They are popular for B.Tech and M.Tech final-year work.",
      sections: [
        {
          heading: "Hardware and software together",
          body: "Plan the circuit, choose reliable sensors, and send data over Wi-Fi/MQTT to a backend. The software side — dashboard, alerts and data history — is what makes the project complete. Hardware components are usually purchased separately.",
        },
      ],
    },
    faqs: [
      {
        question: "Is hardware included in the price?",
        answer: "The price covers code, circuit design, setup guidance and documentation resources. Hardware components are sourced separately; we share an exact components list.",
      },
    ],
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    shortName: "Security",
    description: "Security-focused tools and systems — authentication, encryption, detection and secure web applications.",
    priceFrom: 8000,
    examples: ["Phishing URL detection", "Password managers", "Intrusion detection", "Secure file sharing", "2FA authentication"],
    icon: "shield",
    accent: "rose",
    whatsappRoute: "sales",
    isAI: false,
    order: 8,
    content: {
      intro:
        "Cybersecurity projects demonstrate an understanding of threats and defences — from encryption and secure authentication to detecting malicious activity. They stand out because security is relevant to every system.",
      sections: [
        {
          heading: "Keeping it ethical",
          body: "All security projects are built for defensive and educational use, tested only on systems you own or have permission to test. Your report should describe the threat model and the ethical boundaries of your work.",
        },
      ],
    },
    faqs: [],
  },
] as const;

type DemoProject = (typeof DEMO_PROJECTS)[number];

export const EXTRA_PROJECTS: DemoProject[] = [
  {
    name: "Food Delivery App (Flutter)",
    slug: "food-delivery-app-flutter",
    category: "mobile-apps",
    degrees: ["bca", "mca", "bsc-it", "btech"],
    technologies: ["Flutter", "Dart", "Firebase", "Google Maps API"],
    tags: ["food", "delivery", "android", "ios"],
    priceFrom: 12000,
    difficulty: "intermediate",
    level: "final",
    platform: "mobile",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: true,
    shortDescription: "A cross-platform food ordering app with restaurant listings, cart, live order tracking and a restaurant admin panel.",
    description:
      "Customers browse nearby restaurants, add dishes to the cart, place orders and track delivery status in real time. Restaurant owners manage menus and orders from an admin panel, with Firebase handling authentication and data sync.",
    features: [
      ["Restaurant & menu browsing", "Categories, search and ratings display."],
      ["Cart & checkout", "Quantity updates, address selection and order summary."],
      ["Live order tracking", "Order status updates in real time."],
      ["Push notifications", "Order confirmations and status alerts."],
      ["Restaurant admin", "Menu management and incoming orders."],
    ],
    modules: [
      ["Customer app", "Ordering flow.", ["Browse", "Cart", "Checkout", "Order history"]],
      ["Restaurant panel", "Order management.", ["Menu CRUD", "Order status"]],
      ["Backend", "Firebase services.", ["Auth", "Firestore", "Cloud Messaging"]],
    ],
    howItWorks: [
      ["Browse", "Customer picks a restaurant and dishes."],
      ["Order", "Cart is checked out with a delivery address."],
      ["Track", "Status updates arrive in real time until delivery."],
    ],
  },
  {
    name: "College Event Management App",
    slug: "college-event-management-app",
    category: "mobile-apps",
    degrees: ["bca", "bsc-it", "msc-it"],
    technologies: ["React Native", "Node.js", "MongoDB"],
    tags: ["events", "college", "registration", "qr"],
    priceFrom: 9000,
    difficulty: "intermediate",
    level: "both",
    platform: "cross",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: false,
    shortDescription: "Students discover college events, register in one tap and check in with a QR code; organisers manage everything from a dashboard.",
    description:
      "An event app for colleges: organisers publish events with schedules and seat limits, students register and receive a QR ticket, and volunteers scan tickets at the venue. A web dashboard shows registrations and attendance.",
    features: [
      ["Event listings", "Upcoming events with filters by department."],
      ["One-tap registration", "Seat limits and waitlists."],
      ["QR tickets & check-in", "Scan at the venue to mark attendance."],
      ["Organiser dashboard", "Registrations, attendance and exports."],
    ],
    modules: [
      ["Student app", "Discover and register.", ["Events", "My tickets"]],
      ["Organiser dashboard", "Manage events.", ["Event CRUD", "Attendance", "Export CSV"]],
    ],
    howItWorks: [
      ["Publish", "Organisers create an event."],
      ["Register", "Students register and get a QR ticket."],
      ["Check in", "Volunteers scan tickets at the venue."],
    ],
  },
  {
    name: "House Price Prediction System",
    slug: "house-price-prediction",
    category: "machine-learning",
    degrees: ["bca", "mca", "bsc-it", "msc-it", "btech"],
    technologies: ["Python", "scikit-learn", "Pandas", "Streamlit"],
    tags: ["regression", "real estate", "prediction", "data science"],
    priceFrom: 8000,
    difficulty: "beginner",
    level: "both",
    platform: "web",
    isAI: true,
    hasAdminPanel: false,
    hasAuth: false,
    featured: false,
    shortDescription: "Predicts house prices from location, area and amenities using regression models, with an interactive Streamlit interface.",
    description:
      "An end-to-end regression project: data cleaning, exploratory analysis, feature engineering, and comparison of Linear Regression, Random Forest and Gradient Boosting models. The best model is served through a Streamlit app.",
    features: [
      ["Exploratory data analysis", "Charts and insights from the dataset."],
      ["Model comparison", "Multiple regression models evaluated with RMSE and R²."],
      ["Interactive predictions", "Enter property details and get an estimate."],
    ],
    modules: [
      ["Data pipeline", "Preparation.", ["Cleaning", "Encoding", "Feature engineering"]],
      ["Modelling", "Training and evaluation.", ["Train/test split", "Cross-validation", "Metrics"]],
      ["App", "Streamlit interface.", ["Input form", "Prediction", "Charts"]],
    ],
    howItWorks: [
      ["Prepare", "Clean and engineer features from the dataset."],
      ["Train", "Compare models and pick the best."],
      ["Predict", "Users enter details in the app and get a price."],
    ],
  },
  {
    name: "Fake News Detection (NLP)",
    slug: "fake-news-detection",
    category: "machine-learning",
    categories: ["machine-learning", "ai"],
    degrees: ["mca", "msc-it", "btech", "mtech"],
    technologies: ["Python", "NLTK", "scikit-learn", "Flask"],
    tags: ["nlp", "text classification", "news", "misinformation"],
    priceFrom: 10000,
    difficulty: "intermediate",
    level: "final",
    platform: "web",
    isAI: true,
    hasAdminPanel: false,
    hasAuth: false,
    featured: true,
    shortDescription: "Classifies news articles as likely real or fake using NLP features and machine-learning models, served through a Flask web app.",
    description:
      "Text is cleaned, tokenised and vectorised with TF-IDF; Logistic Regression, Naive Bayes and Passive-Aggressive classifiers are compared. A Flask app lets users paste an article and see the prediction with a confidence score.",
    features: [
      ["Text preprocessing", "Cleaning, stop-word removal and lemmatisation."],
      ["TF-IDF features", "Vectorised text for classical ML models."],
      ["Model comparison", "Accuracy, precision, recall and confusion matrices."],
      ["Web interface", "Paste an article and get a prediction."],
    ],
    modules: [
      ["NLP pipeline", "Text processing.", ["Tokenisation", "Lemmatisation", "TF-IDF"]],
      ["Classifier", "Model training.", ["Training", "Evaluation", "Model export"]],
      ["Flask app", "User interface.", ["Input", "Result with confidence"]],
    ],
    howItWorks: [
      ["Input", "User pastes a news article."],
      ["Process", "Text is cleaned and vectorised."],
      ["Classify", "The trained model predicts real or fake with a confidence score."],
    ],
  },
  {
    name: "Customer Churn Analytics Dashboard",
    slug: "customer-churn-analytics",
    category: "machine-learning",
    degrees: ["mca", "msc-it", "btech"],
    technologies: ["Python", "Pandas", "XGBoost", "Plotly Dash"],
    tags: ["analytics", "churn", "dashboard", "business intelligence"],
    priceFrom: 11000,
    difficulty: "intermediate",
    level: "final",
    platform: "web",
    isAI: true,
    hasAdminPanel: false,
    hasAuth: true,
    featured: false,
    shortDescription: "Analyses customer data to predict churn and visualises key drivers in an interactive analytics dashboard.",
    description:
      "Combines data analytics and machine learning: the dashboard shows retention trends and segments, while an XGBoost model scores customers by churn risk and explains the main contributing factors.",
    features: [
      ["Interactive dashboard", "Filters, KPIs and trend charts."],
      ["Churn prediction", "Risk score for each customer."],
      ["Feature importance", "Explains which factors drive churn."],
    ],
    modules: [
      ["Analytics", "Business insights.", ["KPIs", "Segments", "Trends"]],
      ["Prediction", "ML model.", ["Training", "Scoring", "Explainability"]],
    ],
    howItWorks: [
      ["Load", "Customer data is imported and cleaned."],
      ["Analyse", "Dashboard visualises trends and segments."],
      ["Predict", "Model flags customers likely to churn."],
    ],
  },
  {
    name: "Smart Home Automation (ESP32)",
    slug: "smart-home-automation",
    category: "iot",
    degrees: ["btech", "mtech", "bsc-it"],
    technologies: ["ESP32", "Arduino C++", "MQTT", "Node.js", "React"],
    tags: ["home automation", "sensors", "mqtt", "relay"],
    priceFrom: 14000,
    difficulty: "advanced",
    level: "final",
    platform: "cross",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: false,
    shortDescription: "Control lights and appliances from a web dashboard, monitor temperature and motion sensors, and automate rules — built on ESP32.",
    description:
      "An ESP32 connects relays and sensors to an MQTT broker. A Node.js backend stores readings and automation rules, and a React dashboard provides live control, history charts and alerts.",
    features: [
      ["Remote appliance control", "Toggle relays from the dashboard."],
      ["Sensor monitoring", "Temperature, humidity and motion with history."],
      ["Automation rules", "e.g. turn on fan above 30°C."],
      ["Alerts", "Notifications for motion or threshold events."],
    ],
    modules: [
      ["Firmware", "ESP32 code.", ["Wi-Fi", "MQTT client", "Relay control"]],
      ["Backend", "Node.js services.", ["MQTT bridge", "Rules engine", "History API"]],
      ["Dashboard", "React UI.", ["Controls", "Charts", "Alerts"]],
    ],
    howItWorks: [
      ["Sense", "ESP32 reads sensors and publishes over MQTT."],
      ["Decide", "Backend stores data and evaluates rules."],
      ["Act", "Commands flow back to relays; dashboard updates live."],
    ],
  },
  {
    name: "Patient Health Monitoring System",
    slug: "patient-health-monitoring-iot",
    category: "iot",
    degrees: ["btech", "mtech"],
    technologies: ["Arduino", "Pulse & SpO2 sensors", "Firebase", "Flutter"],
    tags: ["healthcare", "sensors", "monitoring", "alerts"],
    priceFrom: 15000,
    difficulty: "advanced",
    level: "final",
    platform: "cross",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: false,
    shortDescription: "Monitors heart rate, SpO2 and temperature with sensors and alerts caregivers through a mobile app when readings are abnormal.",
    description:
      "Sensor readings are sent to Firebase in real time. A Flutter app shows live vitals and history, and sends alerts when values cross configurable thresholds. Built for academic demonstration, not clinical use.",
    features: [
      ["Live vitals", "Heart rate, SpO2 and temperature in real time."],
      ["Threshold alerts", "Notifications to caregivers."],
      ["History & trends", "Charts of past readings."],
    ],
    modules: [
      ["Device", "Sensor firmware.", ["Sensor reading", "Data upload"]],
      ["Mobile app", "Caregiver app.", ["Live view", "History", "Alerts"]],
    ],
    howItWorks: [
      ["Measure", "Sensors read the patient's vitals."],
      ["Sync", "Readings stream to Firebase."],
      ["Alert", "App notifies caregivers on abnormal values."],
    ],
  },
  {
    name: "Phishing URL Detection System",
    slug: "phishing-url-detection",
    category: "cybersecurity",
    categories: ["cybersecurity", "machine-learning"],
    degrees: ["bca", "mca", "btech", "msc-it"],
    technologies: ["Python", "scikit-learn", "Flask", "Chrome Extension"],
    tags: ["phishing", "security", "url", "classification"],
    priceFrom: 9000,
    difficulty: "intermediate",
    level: "final",
    platform: "web",
    isAI: true,
    hasAdminPanel: false,
    hasAuth: false,
    featured: true,
    shortDescription: "Detects phishing websites from URL and page features using machine learning, with a web checker and a browser extension.",
    description:
      "Extracts lexical and host-based features from URLs and trains classifiers to flag phishing links. Users can check a URL on the web app or get warnings through a lightweight browser extension.",
    features: [
      ["URL feature extraction", "Length, special characters, domain age and more."],
      ["ML classification", "Random Forest and Gradient Boosting compared."],
      ["Web checker", "Paste a URL and get a risk score."],
      ["Browser extension", "Warns before visiting risky sites."],
    ],
    modules: [
      ["Feature engine", "URL analysis.", ["Lexical features", "Host features"]],
      ["Model", "Classifier.", ["Training", "Evaluation"]],
      ["Clients", "User tools.", ["Web app", "Extension"]],
    ],
    howItWorks: [
      ["Extract", "Features are computed from the URL."],
      ["Classify", "The model predicts phishing probability."],
      ["Warn", "The user sees a clear risk verdict."],
    ],
  },
  {
    name: "Secure File Sharing with Encryption",
    slug: "secure-file-sharing",
    category: "cybersecurity",
    degrees: ["bca", "mca", "bsc-it", "btech"],
    technologies: ["Node.js", "Express", "React", "AES-256", "MongoDB"],
    tags: ["encryption", "file sharing", "security", "otp"],
    priceFrom: 8000,
    difficulty: "intermediate",
    level: "both",
    platform: "web",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: false,
    shortDescription: "Upload files encrypted with AES-256, share them via expiring links with OTP verification, and audit every download.",
    description:
      "Files are encrypted before storage; recipients receive an expiring link and must verify with a one-time password. Owners can revoke access, and an audit log records every download.",
    features: [
      ["AES-256 encryption", "Files are encrypted at rest."],
      ["Expiring share links", "Time-limited access."],
      ["OTP verification", "Second factor for recipients."],
      ["Audit log", "Who downloaded what and when."],
    ],
    modules: [
      ["Auth", "Users and 2FA.", ["Login", "OTP"]],
      ["Files", "Secure storage.", ["Encrypt", "Share", "Revoke"]],
      ["Admin", "Oversight.", ["Users", "Audit log"]],
    ],
    howItWorks: [
      ["Upload", "File is encrypted and stored."],
      ["Share", "A time-limited link is generated."],
      ["Verify", "Recipient enters an OTP to download."],
    ],
  },
  {
    name: "AI Interview Preparation Assistant",
    slug: "ai-interview-assistant",
    category: "ai",
    degrees: ["bca", "mca", "bsc-it", "btech"],
    technologies: ["Next.js", "TypeScript", "LLM API", "Speech-to-Text", "PostgreSQL"],
    tags: ["interview", "career", "llm", "speech"],
    priceFrom: 13000,
    difficulty: "intermediate",
    level: "final",
    platform: "web",
    isAI: true,
    hasAdminPanel: true,
    hasAuth: true,
    featured: true,
    shortDescription: "Practice mock interviews with role-specific AI questions, speak your answers and get instant feedback and scores.",
    description:
      "Users pick a job role; the assistant generates questions, records spoken answers, transcribes them and uses an LLM to score clarity, relevance and technical depth with improvement tips. Progress is tracked across sessions.",
    features: [
      ["Role-based questions", "Generated for the selected role and level."],
      ["Voice answers", "Speech-to-text transcription."],
      ["AI feedback", "Scores and suggestions per answer."],
      ["Progress tracking", "History and improvement over time."],
    ],
    modules: [
      ["Interview engine", "Question flow.", ["Question generation", "Session state"]],
      ["Evaluation", "LLM scoring.", ["Rubric prompts", "Feedback"]],
      ["Admin", "Content control.", ["Roles", "Usage analytics"]],
    ],
    howItWorks: [
      ["Choose", "Pick a role and difficulty."],
      ["Answer", "Speak or type answers to AI questions."],
      ["Improve", "Get scores and specific tips."],
    ],
  },
  {
    name: "Library Management System",
    slug: "library-management-system",
    category: "dynamic-websites",
    degrees: ["bca", "bsc-it", "mca"],
    technologies: ["Java", "Spring Boot", "MySQL", "Thymeleaf"],
    tags: ["library", "books", "fines", "college"],
    priceFrom: 6000,
    difficulty: "beginner",
    level: "both",
    platform: "web",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: false,
    shortDescription: "Manage books, members, issues, returns and automatic fine calculation with separate librarian and member logins.",
    description:
      "A complete library system: librarians catalogue books, issue and return them, and track fines; members search the catalogue, reserve books and view their borrowing history.",
    features: [
      ["Book catalogue", "Search by title, author or ISBN."],
      ["Issue & return", "With due dates and reminders."],
      ["Automatic fines", "Calculated on late returns."],
      ["Reports", "Popular books and overdue lists."],
    ],
    modules: [
      ["Catalogue", "Books.", ["Add/edit books", "Search"]],
      ["Circulation", "Lending.", ["Issue", "Return", "Fines"]],
      ["Members", "Accounts.", ["Registration", "History"]],
    ],
    howItWorks: [
      ["Catalogue", "Librarian adds books."],
      ["Lend", "Books are issued with due dates."],
      ["Return", "Fines apply automatically if late."],
    ],
  },
  {
    name: "Multi-Vendor Marketplace",
    slug: "multi-vendor-marketplace",
    category: "ecommerce",
    degrees: ["mca", "btech", "mtech"],
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe/Razorpay (test mode)"],
    tags: ["marketplace", "vendors", "commission", "payments"],
    priceFrom: 25000,
    difficulty: "advanced",
    level: "final",
    platform: "web",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    featured: false,
    shortDescription: "A marketplace where multiple sellers list products, customers buy from many shops in one cart, and admins manage commissions.",
    description:
      "Vendors register and manage their own stores; customers shop across vendors with a single checkout; the platform splits orders per vendor, tracks commissions and gives admins oversight of sellers, products and payouts.",
    features: [
      ["Vendor storefronts", "Each seller manages products and orders."],
      ["Unified cart", "Buy from multiple vendors at once."],
      ["Commission tracking", "Platform fees per order."],
      ["Admin moderation", "Approve vendors and products."],
    ],
    modules: [
      ["Vendor panel", "Seller tools.", ["Products", "Orders", "Earnings"]],
      ["Storefront", "Customer shopping.", ["Catalogue", "Cart", "Checkout"]],
      ["Admin", "Platform control.", ["Vendors", "Commissions", "Reports"]],
    ],
    howItWorks: [
      ["List", "Vendors add products."],
      ["Buy", "Customers check out from several vendors."],
      ["Settle", "Orders split per vendor; commissions recorded."],
    ],
  },
];

export const BLOG_POSTS = [
  {
    title: "How to Choose the Right Final-Year Project (BCA, MCA & B.Tech)",
    slug: "how-to-choose-final-year-project",
    excerpt:
      "A practical, step-by-step way to pick a final-year project you can actually build, understand and present — without wasting weeks on the wrong idea.",
    author: "FinalYear Labs Team",
    tags: ["project ideas", "bca", "mca", "btech"],
    body: [
      {
        heading: "Start with your university guidelines",
        body: "Before looking at ideas, read your department's rules: allowed technologies, team size, whether a database or live demo is required, and the report format. Many students lose marks not because the project is weak, but because it doesn't match what the guidelines asked for.",
      },
      {
        heading: "Pick a problem, not just a technology",
        body: "Examiners respond to projects that solve a clear problem for a clear user — a hostel complaint system for students, a booking system for a clinic, a resume analyzer for job seekers. Write one sentence: \"This project helps [who] do [what] by [how].\" If you can't, the idea needs work.\n\nOnce the problem is clear, choose the technology that fits it and that you can explain.",
      },
      {
        heading: "Match the scope to your level",
        body: "Semester and BCA/BSc IT projects usually need a working application with a database and a few well-built modules. MCA, B.Tech and M.Tech projects are expected to show more depth — role-based access, an admin panel, integrations, AI features, or an evaluation section. More modules are not automatically better; three complete, well-tested modules beat eight half-finished ones.",
      },
      {
        heading: "Check that you can explain every part",
        body: "In the viva you will be asked how the system works, why you designed the database the way you did, and how one or two important features are implemented. If a project uses a technology you have never touched, budget time to learn it properly — or choose something closer to what you know.",
      },
      {
        heading: "Consider AI — carefully",
        body: "AI-integrated projects (chatbots, analyzers, recommendation systems) stand out, and many use AI APIs inside a normal web app, which is achievable for most students. Make sure you can explain what the AI part does, its limitations and costs, and how you tested its output.",
      },
      {
        heading: "Plan for documentation from day one",
        body: "Keep notes, diagrams and screenshots as you build. Your report will need an abstract, problem statement, system design (DFD, ER, UML), database design, module descriptions, testing and future scope. Starting early makes the final weeks far less stressful.",
      },
      {
        heading: "A quick checklist",
        body: "Does it follow your guidelines? Does it solve a clear problem? Is the scope right for your degree? Can you run it on your own machine? Can you explain every module? If the answer is yes to all five, you have a good project. If you're still unsure, our project finder can suggest options based on your degree and budget.",
      },
    ],
  },
  {
    title: "How to Prepare Your Project Report and Ace Your Viva",
    slug: "project-report-and-viva-preparation",
    excerpt:
      "What examiners look for in a final-year project report and viva — with a section-by-section report outline and the questions students are asked most often.",
    author: "FinalYear Labs Team",
    tags: ["project report", "viva", "documentation"],
    body: [
      {
        heading: "What the report is really for",
        body: "Your report proves that you understand the problem, made reasoned design decisions and tested your work. It should describe the system you actually built — not a generic template. Always follow your university's prescribed format, font and chapter order.",
      },
      {
        heading: "A typical report structure",
        body: "Abstract → Introduction → Problem statement and objectives → Existing system and its limitations → Proposed system → Methodology and technology stack → System design (DFD, ER diagram, use-case and class diagrams) → Database design → Module descriptions → Screenshots → Testing (test cases and results) → Future scope → Conclusion → References.",
      },
      {
        heading: "Write the abstract last",
        body: "The abstract summarises the problem, your approach, the main features and the outcome in about 150–250 words. It is much easier to write once everything else is done.",
      },
      {
        heading: "Make diagrams match your real system",
        body: "Examiners often point to a diagram and ask you to explain it. Your ER diagram should match your actual database tables, and your DFDs should reflect the real data flow. Redraw any template diagram so it describes your implementation.",
      },
      {
        heading: "Show real testing",
        body: "List concrete test cases — input, expected result, actual result, pass/fail — for login, validation, core features and edge cases. Mention bugs you found and fixed; it shows genuine engagement with your project.",
      },
      {
        heading: "Common viva questions",
        body: "Why did you choose this project? What is the architecture? Explain your database design. How does login/authentication work? What happens if a user enters invalid data? Which part was hardest and how did you solve it? What are the limitations and future scope? Practise answering each in under a minute.",
      },
      {
        heading: "Rehearse the demo",
        body: "Run the full project on the machine you'll present from, the day before. Prepare sample data, keep a short screen recording as a backup, and follow a 3–5 minute demo script that walks through the main user journey. Customizing the project to your own idea makes all of this far easier — you'll be explaining decisions you actually made.",
      },
    ],
  },
];
