import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ARTICLES = [
  {
    title: "Getting Started with Acme SaaS",
    category: "getting-started",
    content: `Welcome to Acme SaaS! Here's how to get started in under 5 minutes:

1. Sign up at app.acmesaas.com with your work email
2. Verify your email address by clicking the link we send you
3. Create your first workspace and invite team members
4. Choose a plan that fits your team (you can start with the free tier)
5. Import your existing data or start fresh

Our onboarding wizard will guide you through setting up your first project, connecting integrations, and customizing your dashboard. If you need help at any step, our support team is available 24/7.`,
  },
  {
    title: "Pricing Plans Overview",
    category: "billing",
    content: `Acme SaaS offers three pricing tiers:

**Free Plan** — $0/month
- Up to 3 team members
- 5 projects
- 1GB storage
- Community support

**Pro Plan** — $29/user/month
- Unlimited team members
- Unlimited projects
- 50GB storage
- Priority email support
- Advanced analytics
- Custom integrations

**Enterprise Plan** — Custom pricing
- Everything in Pro
- Unlimited storage
- Dedicated account manager
- SSO/SAML authentication
- SLA guarantee (99.99% uptime)
- Custom contracts and invoicing
- On-premise deployment option

All plans include a 14-day free trial of Pro features. No credit card required to start. Annual billing gives you 2 months free.`,
  },
  {
    title: "How to Reset Your Password",
    category: "troubleshooting",
    content: `If you've forgotten your password or need to reset it:

1. Go to app.acmesaas.com/login
2. Click "Forgot password?" below the login form
3. Enter your registered email address
4. Check your inbox for the reset link (check spam/junk if you don't see it within 2 minutes)
5. Click the link and set a new password
6. Your new password must be at least 12 characters with a mix of letters, numbers, and symbols

The reset link expires after 1 hour for security reasons. If it's expired, request a new one.

If you're still having trouble, contact support with your registered email address and we'll help you regain access. For enterprise accounts with SSO, contact your IT administrator.`,
  },
  {
    title: "Integrations Guide",
    category: "integrations",
    content: `Acme SaaS integrates with 50+ popular tools. Here are the most popular:

**Project Management**: Jira, Linear, Asana, Trello, Monday.com
**Communication**: Slack, Microsoft Teams, Discord
**Version Control**: GitHub, GitLab, Bitbucket
**CI/CD**: GitHub Actions, CircleCI, Jenkins
**Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob
**Analytics**: Google Analytics, Mixpanel, Amplitude
**CRM**: Salesforce, HubSpot, Pipedrive

To set up an integration:
1. Go to Settings → Integrations
2. Find the tool you want to connect
3. Click "Connect" and follow the OAuth flow
4. Configure the sync settings (real-time or scheduled)

Most integrations take under 2 minutes to set up. All data transfers are encrypted and comply with SOC 2 Type II standards. You can manage permissions per integration from the admin panel.`,
  },
  {
    title: "Data Security & Compliance",
    category: "security",
    content: `We take security seriously at Acme SaaS:

**Certifications**: SOC 2 Type II, ISO 27001, GDPR compliant, HIPAA ready (Enterprise plan)

**Encryption**: All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Database backups are encrypted and stored in geographically distributed locations.

**Access Control**: Role-based access control (RBAC) with four levels — Owner, Admin, Member, Guest. SSO/SAML available on Enterprise plan. Two-factor authentication supported for all accounts.

**Data Residency**: Choose between US (Virginia), EU (Frankfurt), or APAC (Singapore) data centers. Enterprise customers can request custom regions.

**Audit Logging**: Full audit trail of all user actions, exportable for compliance. Retained for 12 months (Pro) or custom duration (Enterprise).

**Penetration Testing**: Annual third-party pen tests by CrowdStrike. Bug bounty program open at security.acmesaas.com.`,
  },
  {
    title: "Team Management & Permissions",
    category: "features",
    content: `Managing your team in Acme SaaS:

**Inviting Members**: Go to Settings → Team → Invite. Send invites by email. Pending invites expire after 7 days.

**Roles**:
- Owner: Full access, billing management, can delete workspace
- Admin: Full access except billing and workspace deletion
- Member: Can create/edit projects, view analytics
- Guest: View-only access to specific projects they're invited to

**Groups**: Create groups to manage permissions at scale. Assign roles to groups instead of individual users.

**Deactivation**: Deactivated users lose access immediately but their data is preserved. Reactivate anytime within 90 days.

Seat limits apply per plan. When you reach your limit, you'll need to upgrade or remove inactive members to add new ones.`,
  },
  {
    title: "API Documentation Overview",
    category: "api",
    content: `Acme SaaS provides a RESTful API for automation and custom integrations.

**Base URL**: https://api.acmesaas.com/v2
**Authentication**: Bearer token (API key from Settings → API Keys)
**Rate Limits**: 100 requests/minute (Free), 1000/minute (Pro), custom (Enterprise)

**Key Endpoints**:
- GET /projects — List all projects
- POST /projects — Create a project
- GET /projects/:id — Get project details
- PUT /projects/:id — Update a project
- DELETE /projects/:id — Delete a project
- GET /users — List team members
- POST /webhooks — Register a webhook

**SDKs**: Official SDKs for JavaScript/TypeScript, Python, Ruby, Go, and Java.

**Webhooks**: Real-time notifications for project events. Configure at Settings → Webhooks. Supports retry with exponential backoff.

Full API reference at docs.acmesaas.com/api. Interactive API explorer available in your dashboard.`,
  },
  {
    title: "Billing & Invoices",
    category: "billing",
    content: `Managing your billing in Acme SaaS:

**Payment Methods**: Credit/debit cards (Visa, Mastercard, Amex) and wire transfer (Enterprise only). We use Stripe for secure payment processing.

**Billing Cycle**: Monthly or annual. Annual billing gives you 2 months free. Invoices are generated on the 1st of each month.

**Upgrading**: Upgrades take effect immediately. You'll be charged a prorated amount for the remainder of your current billing cycle.

**Downgrading**: Downgrades take effect at the end of your current billing cycle. You keep access to premium features until then.

**Invoices**: Access all invoices at Settings → Billing → Invoice History. Invoices are also emailed to the billing contact.

**Tax**: We collect applicable sales tax based on your billing address. EU customers: provide your VAT ID for reverse charge.

**Cancellation**: Cancel anytime from Settings → Billing. Your data is preserved for 30 days after cancellation.`,
  },
  {
    title: "Custom Dashboards",
    category: "features",
    content: `Build custom dashboards to visualize your data:

**Widgets Available**: Charts (line, bar, pie, area), KPI cards, tables, text blocks, embedded content, progress bars, heatmaps.

**Data Sources**: Connect widgets to any project data, integration data, or custom API endpoints.

**Sharing**: Dashboards can be private, shared with your team, or published as a public URL (great for stakeholder reports).

**Refresh Rate**: Data refreshes every 5 minutes by default. Real-time option available on Pro and Enterprise.

**Templates**: Start from 20+ pre-built templates (Project Health, Sprint Velocity, Revenue Tracker, etc.) and customize to your needs.

To create a dashboard:
1. Go to Dashboards → New Dashboard
2. Choose a template or start blank
3. Add widgets by dragging from the sidebar
4. Configure each widget's data source and visualization
5. Save and optionally share with your team`,
  },
  {
    title: "Mobile App Guide",
    category: "features",
    content: `Acme SaaS mobile app is available on iOS (15+) and Android (12+).

**Features**:
- View and manage projects on the go
- Receive push notifications for updates and mentions
- Quick-add tasks and notes
- View dashboards (read-only)
- Team chat and mentions
- Offline mode for viewing cached data

**Getting Started**:
1. Download from the App Store or Google Play (search "Acme SaaS")
2. Sign in with your existing account
3. Enable push notifications when prompted
4. Your projects sync automatically

**Limitations**: The mobile app is optimized for viewing and quick actions. For complex tasks like dashboard building, integration setup, or admin functions, use the web app.

**Biometric Auth**: Enable Face ID / fingerprint lock in the app's settings for quick, secure access.`,
  },
  {
    title: "Data Import & Export",
    category: "features",
    content: `Moving data in and out of Acme SaaS:

**Import**:
- CSV/Excel: Bulk import projects, contacts, and tasks via CSV. Map columns during import.
- Jira: One-click migration tool that preserves issues, sprints, and attachments.
- Trello: Import boards, lists, and cards with full history.
- Asana: Import projects, tasks, and team structure.
- API: Programmatic import via our REST API.

**Export**:
- CSV/Excel: Export any view or dashboard data.
- PDF: Export reports and dashboards as formatted PDFs.
- API: Full data export via API (all records, including history).
- GDPR Export: Request a complete data export at Settings → Privacy.

**Data Retention**: Exported data is available for download for 24 hours. All exports are encrypted.

Need help migrating from another tool? Contact support and we'll help with custom migration plans.`,
  },
  {
    title: "Notifications & Alerts",
    category: "features",
    content: `Stay informed without the noise:

**Channels**: In-app, email, Slack, Microsoft Teams, mobile push, and webhooks.

**Notification Types**:
- Mentions (@you in comments or tasks)
- Task assignments and status changes
- Project milestones and deadlines
- Integration alerts (build failures, deployment status)
- System announcements

**Customization**:
1. Go to Settings → Notifications
2. For each notification type, choose which channels to use
3. Set quiet hours to pause non-urgent notifications
4. Use "Focus mode" to temporarily mute everything except mentions

**Digest**: Enable daily or weekly email digests instead of individual notifications. Great for reducing inbox clutter while staying informed.

**Smart Notifications**: Our AI learns your patterns and prioritizes notifications by relevance. Available on Pro and Enterprise.`,
  },
  {
    title: "Uptime & SLA",
    category: "security",
    content: `Acme SaaS is built for reliability:

**Uptime History**: 99.98% average over the last 12 months. Check real-time status at status.acmesaas.com.

**SLA Tiers**:
- Free: No SLA (best-effort)
- Pro: 99.9% uptime guarantee
- Enterprise: 99.99% uptime guarantee with financial credits

**Architecture**: Multi-region deployment on AWS with automatic failover. Database replication across 3 availability zones.

**Maintenance Windows**: Planned maintenance happens on Sundays 02:00–06:00 UTC. We notify at least 72 hours in advance. Zero-downtime deployments for most updates.

**Incident Response**: P1 incidents acknowledged within 15 minutes. Dedicated incident channel for Enterprise customers. Post-mortems published within 48 hours for any significant incident.

**Backups**: Continuous database backups with point-in-time recovery (up to 30 days). Full daily backups stored for 90 days.`,
  },
  {
    title: "Single Sign-On (SSO) Setup",
    category: "security",
    content: `SSO is available on the Enterprise plan. We support SAML 2.0 and OpenID Connect.

**Supported Providers**: Okta, Azure AD, Google Workspace, OneLogin, Auth0, Ping Identity, and any SAML 2.0 compatible IdP.

**Setup Steps**:
1. Go to Settings → Security → SSO
2. Choose your identity provider
3. Enter your SSO metadata URL or upload the XML
4. Configure attribute mapping (email, name, role)
5. Test the connection with a single user
6. Enable "Require SSO" to enforce it for all members

**SCIM Provisioning**: Automatic user provisioning and deprovisioning via SCIM 2.0. Sync users and groups from your IdP.

**Domain Verification**: Verify your email domain to auto-assign SSO login for matching emails.

**Fallback**: Workspace owners always have password access as a backup (configurable).`,
  },
  {
    title: "Automations & Workflows",
    category: "features",
    content: `Automate repetitive tasks with Acme workflows:

**Trigger Types**: On task creation, status change, date reached, form submission, webhook received, or scheduled (cron).

**Actions**: Send notification, create task, update field, move to project, assign user, send email, call webhook, run script.

**Builder**: Visual drag-and-drop workflow builder. No code required for simple automations. JavaScript editor available for complex logic.

**Templates**: 30+ pre-built automation templates:
- Auto-assign tasks based on type
- Send Slack notification on deadline miss
- Create follow-up task when marked complete
- Weekly report generation
- Customer onboarding sequence

**Limits**: Free: 5 automations, 100 runs/month. Pro: 50 automations, 10,000 runs/month. Enterprise: unlimited.

**Logging**: Full execution logs with input/output for debugging. Failed runs are automatically retried with exponential backoff.`,
  },
  {
    title: "Keyboard Shortcuts",
    category: "features",
    content: `Work faster with keyboard shortcuts:

**Navigation**:
- Cmd/Ctrl + K: Quick search (projects, tasks, people)
- Cmd/Ctrl + /: Open keyboard shortcuts panel
- G then P: Go to Projects
- G then D: Go to Dashboard
- G then T: Go to Team
- G then S: Go to Settings

**Task Management**:
- N: Create new task
- E: Edit selected task
- Space: Toggle task status
- Tab: Indent (make subtask)
- Shift + Tab: Outdent

**Editor**:
- Cmd/Ctrl + B: Bold
- Cmd/Ctrl + I: Italic
- Cmd/Ctrl + Shift + L: Create list
- / : Slash commands (embed, mention, date)

**Views**:
- 1: Board view
- 2: List view
- 3: Calendar view
- 4: Timeline view

All shortcuts can be customized at Settings → Keyboard Shortcuts.`,
  },
  {
    title: "Troubleshooting Common Issues",
    category: "troubleshooting",
    content: `Here are solutions to frequently reported issues:

**Can't log in**: Clear browser cache, try incognito mode, check if SSO is required for your organization. Try resetting your password if regular login.

**Slow performance**: Check your internet connection. Try clearing browser cache. Disable browser extensions that might interfere. If dashboard-specific, reduce the number of widgets or data range.

**Missing data**: Check the view's filters — hidden filters can make data appear missing. Verify you have the right project selected. Check if the data source integration is connected.

**Integration not syncing**: Go to Settings → Integrations and check the sync status. Disconnect and reconnect the integration. Ensure the connected account still has the required permissions.

**Email notifications not arriving**: Check Settings → Notifications to ensure emails are enabled. Check spam/junk folder. Add noreply@acmesaas.com to your contacts. Enterprise: check if your email gateway blocks our domain.

**File upload failing**: Maximum file size is 100MB (Pro) or 1GB (Enterprise). Supported formats: all common document, image, and archive formats. If upload hangs, try a smaller file or different browser.

Still stuck? Contact support with your workspace URL and a screenshot of the issue.`,
  },
  {
    title: "Webhooks Configuration",
    category: "api",
    content: `Set up webhooks to receive real-time notifications:

**Creating a Webhook**:
1. Go to Settings → Webhooks → New Webhook
2. Enter your endpoint URL (must be HTTPS)
3. Select which events to listen for
4. Optionally set a secret for signature verification
5. Save and test with the "Send Test" button

**Available Events**: project.created, project.updated, task.created, task.completed, task.assigned, member.joined, member.left, comment.added, integration.synced, build.completed, build.failed

**Payload Format**: JSON with event type, timestamp, actor, and full resource data. Includes a X-Acme-Signature header for verification using HMAC-SHA256.

**Retry Policy**: Failed deliveries (non-2xx response) are retried 3 times with exponential backoff (1min, 5min, 30min). After 3 failures, the webhook is marked as failing and you're notified.

**Limits**: 10 webhooks per workspace (Free/Pro), unlimited (Enterprise). Payload size limit: 1MB.`,
  },
  {
    title: "Contact Support",
    category: "general",
    content: `Need help? Here's how to reach us:

**In-App Chat**: Click the chat bubble in the bottom-right corner of any page. Our AI assistant Echo handles common questions instantly, and can connect you with a human agent for complex issues.

**Email**: support@acmesaas.com — Response within 4 hours (Pro), 1 hour (Enterprise), 24 hours (Free).

**Phone**: Enterprise customers have a dedicated support line. Contact your account manager for the number.

**Community**: Join our community forum at community.acmesaas.com. Connect with other users, share tips, and vote on feature requests.

**Documentation**: Comprehensive docs at docs.acmesaas.com with tutorials, guides, and API reference.

**Status Page**: Real-time system status at status.acmesaas.com. Subscribe for incident notifications.

**Office Hours**: Live Q&A sessions every Thursday at 2 PM EST. Register at acmesaas.com/office-hours.

Support hours: 24/7 for Enterprise, Mon-Fri 9AM-9PM EST for Pro, Mon-Fri 9AM-5PM EST for Free.`,
  },
];

async function main() {
  console.log("Seeding Echo database...");

  // Create admin
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "echo2024",
    10
  );
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@echo.zolentix.com" },
    update: { password: hashedPassword },
    create: {
      email: process.env.ADMIN_EMAIL || "admin@echo.zolentix.com",
      password: hashedPassword,
      name: "Echo Admin",
    },
  });
  console.log("  Admin user created");

  // Create articles
  for (const article of ARTICLES) {
    await prisma.article.create({ data: article });
  }
  console.log(`  ${ARTICLES.length} knowledge base articles created`);

  // Create sample conversations
  const conv1 = await prisma.conversation.create({
    data: {
      sessionId: "demo_session_1",
      status: "resolved",
      visitorName: "Sarah Chen",
      visitorEmail: "sarah@example.com",
    },
  });
  await prisma.message.createMany({
    data: [
      { conversationId: conv1.id, role: "user", content: "Hi, how do I reset my password?" },
      { conversationId: conv1.id, role: "assistant", content: "To reset your password, go to app.acmesaas.com/login and click 'Forgot password?' below the login form. Enter your registered email address and we'll send you a reset link. The link expires after 1 hour for security reasons." },
      { conversationId: conv1.id, role: "user", content: "Thanks, that worked!" },
      { conversationId: conv1.id, role: "assistant", content: "You're welcome! Is there anything else I can help you with?" },
    ],
  });

  const conv2 = await prisma.conversation.create({
    data: {
      sessionId: "demo_session_2",
      status: "active",
      visitorName: "James Rodriguez",
    },
  });
  await prisma.message.createMany({
    data: [
      { conversationId: conv2.id, role: "user", content: "What's the difference between Pro and Enterprise?" },
      { conversationId: conv2.id, role: "assistant", content: "Great question! The Pro Plan is $29/user/month and includes unlimited team members, projects, 50GB storage, and priority email support. The Enterprise Plan adds unlimited storage, dedicated account manager, SSO/SAML, 99.99% uptime SLA, custom contracts, and on-premise deployment option. Enterprise pricing is custom — contact our sales team for a quote." },
      { conversationId: conv2.id, role: "user", content: "Do you offer volume discounts for large teams?" },
      { conversationId: conv2.id, role: "assistant", content: "Yes! For teams of 50+ users on Pro, we offer volume discounts. For Enterprise, all pricing is negotiated based on your specific needs. I'd recommend reaching out to our sales team at sales@acmesaas.com for a custom quote." },
    ],
  });

  const conv3 = await prisma.conversation.create({
    data: {
      sessionId: "demo_session_3",
      status: "handed-off",
      visitorName: "Priya Sharma",
      visitorEmail: "priya@techcorp.com",
    },
  });
  await prisma.message.createMany({
    data: [
      { conversationId: conv3.id, role: "user", content: "We're seeing intermittent 502 errors on the API since this morning" },
      { conversationId: conv3.id, role: "assistant", content: "I'm sorry to hear you're experiencing API errors. Let me check — I'm not aware of any current outages on our status page. Could you share the specific endpoint and your workspace ID so I can look into this?" },
      { conversationId: conv3.id, role: "user", content: "I'd rather speak to an engineer about this" },
      { conversationId: conv3.id, role: "assistant", content: "I understand you'd like to speak with a human agent. Let me connect you with our support team. A team member will be with you shortly." },
    ],
  });

  // Seed analytics
  const eventTypes = ["question", "question", "question", "question", "deflection", "handoff", "resolved", "question", "question", "deflection"];
  for (const type of eventTypes) {
    await prisma.analyticsEvent.create({
      data: {
        type,
        metadata: type === "question"
          ? JSON.stringify({ query: "Sample question about " + ["pricing", "features", "setup", "billing", "integrations"][Math.floor(Math.random() * 5)] })
          : type === "deflection"
            ? JSON.stringify({ query: "How do I configure custom SAML attributes?" })
            : JSON.stringify({ conversationId: conv1.id }),
      },
    });
  }
  console.log("  Sample conversations and analytics seeded");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
