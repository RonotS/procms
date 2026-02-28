// Mock data for ProCMS - Client & Project Management System

export type TaskStatus = string;

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: "low" | "medium" | "high" | "urgent";
    assigneeId: string;
    projectId: string;
    dueDate: string;
    createdAt: string;
    tags: string[];
}

export interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    order: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    clientId: string;
    status: "active" | "completed" | "on-hold" | "cancelled";
    progress: number;
    startDate: string;
    dueDate: string;
    budget: number;
    columns: KanbanColumn[];
    tasks: Task[];
}

export interface Client {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    avatar: string;
    status: "active" | "inactive";
    industry: string;
    address: string;
    createdAt: string;
    totalProjects: number;
    totalRevenue: number;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    avatar: string;
    status: "available" | "busy" | "away" | "offline";
    tasksAssigned: number;
    tasksCompleted: number;
}

export const defaultColumns: KanbanColumn[] = [
    { id: "backlog", title: "Backlog", color: "#6B7280", order: 0 },
    { id: "todo", title: "To Do", color: "#3B82F6", order: 1 },
    { id: "in-progress", title: "In Progress", color: "#F59E0B", order: 2 },
    { id: "review", title: "Review", color: "#8B5CF6", order: 3 },
    { id: "done", title: "Done", color: "#10B981", order: 4 },
];

export const employees: Employee[] = [
    {
        id: "emp-1",
        name: "Alex Rivera",
        email: "alex@procms.com",
        role: "Frontend Developer",
        department: "Engineering",
        avatar: "",
        status: "available",
        tasksAssigned: 8,
        tasksCompleted: 45,
    },
    {
        id: "emp-2",
        name: "Sarah Chen",
        email: "sarah@procms.com",
        role: "UI/UX Designer",
        department: "Design",
        avatar: "",
        status: "busy",
        tasksAssigned: 5,
        tasksCompleted: 32,
    },
    {
        id: "emp-3",
        name: "Marcus Johnson",
        email: "marcus@procms.com",
        role: "Backend Developer",
        department: "Engineering",
        avatar: "",
        status: "available",
        tasksAssigned: 6,
        tasksCompleted: 51,
    },
    {
        id: "emp-4",
        name: "Emily Nakamura",
        email: "emily@procms.com",
        role: "Project Manager",
        department: "Management",
        avatar: "",
        status: "busy",
        tasksAssigned: 12,
        tasksCompleted: 67,
    },
    {
        id: "emp-5",
        name: "David Park",
        email: "david@procms.com",
        role: "Full Stack Developer",
        department: "Engineering",
        avatar: "",
        status: "away",
        tasksAssigned: 4,
        tasksCompleted: 29,
    },
    {
        id: "emp-6",
        name: "Lisa Thompson",
        email: "lisa@procms.com",
        role: "QA Engineer",
        department: "Quality Assurance",
        avatar: "",
        status: "available",
        tasksAssigned: 7,
        tasksCompleted: 38,
    },
];

export const clients: Client[] = [
    {
        id: "client-1",
        name: "James Mitchell",
        company: "TechVision Labs",
        email: "james@techvisionlabs.com",
        phone: "+1 (555) 234-5678",
        avatar: "",
        status: "active",
        industry: "Technology",
        address: "415 Innovation Blvd, San Francisco, CA 94105",
        createdAt: "2024-08-15",
        totalProjects: 3,
        totalRevenue: 185000,
    },
    {
        id: "client-2",
        name: "Olivia Grant",
        company: "GreenLeaf Studios",
        email: "olivia@greenleaf.co",
        phone: "+1 (555) 345-6789",
        avatar: "",
        status: "active",
        industry: "Media & Entertainment",
        address: "890 Creative Way, Los Angeles, CA 90028",
        createdAt: "2024-09-22",
        totalProjects: 2,
        totalRevenue: 95000,
    },
    {
        id: "client-3",
        name: "Robert Kim",
        company: "NexGen Finance",
        email: "robert@nexgenfinance.com",
        phone: "+1 (555) 456-7890",
        avatar: "",
        status: "active",
        industry: "Financial Services",
        address: "200 Wall Street, New York, NY 10005",
        createdAt: "2024-06-10",
        totalProjects: 4,
        totalRevenue: 320000,
    },
    {
        id: "client-4",
        name: "Amanda Brooks",
        company: "HealthPulse Inc",
        email: "amanda@healthpulse.io",
        phone: "+1 (555) 567-8901",
        avatar: "",
        status: "inactive",
        industry: "Healthcare",
        address: "750 Medical Center Dr, Boston, MA 02115",
        createdAt: "2024-03-05",
        totalProjects: 1,
        totalRevenue: 45000,
    },
    {
        id: "client-5",
        name: "Carlos Mendez",
        company: "UrbanScale Co",
        email: "carlos@urbanscale.com",
        phone: "+1 (555) 678-9012",
        avatar: "",
        status: "active",
        industry: "Real Estate",
        address: "1200 Main St, Austin, TX 78701",
        createdAt: "2024-11-01",
        totalProjects: 2,
        totalRevenue: 128000,
    },
];

export const projects: Project[] = [
    {
        id: "proj-1",
        name: "E-Commerce Platform Redesign",
        description: "Complete redesign of the e-commerce platform with modern UI/UX, improved checkout flow, and mobile-first approach.",
        clientId: "client-1",
        status: "active",
        progress: 65,
        startDate: "2025-01-10",
        dueDate: "2025-04-30",
        budget: 75000,
        columns: [...defaultColumns],
        tasks: [
            {
                id: "task-1",
                title: "Design new product listing page",
                description: "Create a modern product listing page with filters, sorting, and grid/list view toggle",
                status: "done",
                priority: "high",
                assigneeId: "emp-2",
                projectId: "proj-1",
                dueDate: "2025-02-15",
                createdAt: "2025-01-12",
                tags: ["design", "ui"],
            },
            {
                id: "task-2",
                title: "Implement shopping cart API",
                description: "Build REST API endpoints for cart management including add, remove, update quantities",
                status: "in-progress",
                priority: "high",
                assigneeId: "emp-3",
                projectId: "proj-1",
                dueDate: "2025-03-01",
                createdAt: "2025-01-15",
                tags: ["backend", "api"],
            },
            {
                id: "task-3",
                title: "Build checkout flow UI",
                description: "Multi-step checkout with address, payment, and confirmation screens",
                status: "todo",
                priority: "medium",
                assigneeId: "emp-1",
                projectId: "proj-1",
                dueDate: "2025-03-15",
                createdAt: "2025-01-18",
                tags: ["frontend", "ui"],
            },
            {
                id: "task-4",
                title: "Payment gateway integration",
                description: "Integrate Stripe payment processing with webhook handling",
                status: "backlog",
                priority: "high",
                assigneeId: "emp-5",
                projectId: "proj-1",
                dueDate: "2025-03-20",
                createdAt: "2025-01-20",
                tags: ["backend", "integration"],
            },
            {
                id: "task-5",
                title: "Mobile responsive testing",
                description: "Test all pages across different devices and fix responsive issues",
                status: "backlog",
                priority: "medium",
                assigneeId: "emp-6",
                projectId: "proj-1",
                dueDate: "2025-04-10",
                createdAt: "2025-01-22",
                tags: ["qa", "testing"],
            },
            {
                id: "task-6",
                title: "User authentication system",
                description: "Implement OAuth2 and email-based authentication",
                status: "review",
                priority: "high",
                assigneeId: "emp-3",
                projectId: "proj-1",
                dueDate: "2025-02-28",
                createdAt: "2025-01-10",
                tags: ["backend", "security"],
            },
        ],
    },
    {
        id: "proj-2",
        name: "Brand Identity System",
        description: "Develop comprehensive brand guidelines, logo variations, and design system components.",
        clientId: "client-2",
        status: "active",
        progress: 40,
        startDate: "2025-02-01",
        dueDate: "2025-05-15",
        budget: 45000,
        columns: [...defaultColumns],
        tasks: [
            {
                id: "task-7",
                title: "Logo concept exploration",
                description: "Create 5 unique logo concepts with rationale for each direction",
                status: "done",
                priority: "high",
                assigneeId: "emp-2",
                projectId: "proj-2",
                dueDate: "2025-02-20",
                createdAt: "2025-02-02",
                tags: ["design", "branding"],
            },
            {
                id: "task-8",
                title: "Color palette definition",
                description: "Define primary, secondary, and accent color palettes with accessibility checks",
                status: "in-progress",
                priority: "medium",
                assigneeId: "emp-2",
                projectId: "proj-2",
                dueDate: "2025-03-01",
                createdAt: "2025-02-05",
                tags: ["design", "branding"],
            },
            {
                id: "task-9",
                title: "Typography selection",
                description: "Select and pair fonts for digital and print use",
                status: "todo",
                priority: "medium",
                assigneeId: "emp-2",
                projectId: "proj-2",
                dueDate: "2025-03-10",
                createdAt: "2025-02-08",
                tags: ["design", "typography"],
            },
        ],
    },
    {
        id: "proj-3",
        name: "Trading Dashboard",
        description: "Real-time trading dashboard with live data feeds, portfolio management, and analytics.",
        clientId: "client-3",
        status: "active",
        progress: 80,
        startDate: "2024-10-15",
        dueDate: "2025-03-31",
        budget: 120000,
        columns: [...defaultColumns],
        tasks: [
            {
                id: "task-10",
                title: "Real-time data pipeline",
                description: "Set up WebSocket connections for live market data streaming",
                status: "done",
                priority: "urgent",
                assigneeId: "emp-3",
                projectId: "proj-3",
                dueDate: "2025-01-15",
                createdAt: "2024-10-20",
                tags: ["backend", "real-time"],
            },
            {
                id: "task-11",
                title: "Portfolio analytics module",
                description: "Build analytics dashboard showing P&L, risk metrics, and performance charts",
                status: "in-progress",
                priority: "high",
                assigneeId: "emp-1",
                projectId: "proj-3",
                dueDate: "2025-03-01",
                createdAt: "2024-11-05",
                tags: ["frontend", "analytics"],
            },
            {
                id: "task-12",
                title: "Performance optimization",
                description: "Optimize rendering performance for large data sets and real-time updates",
                status: "review",
                priority: "high",
                assigneeId: "emp-5",
                projectId: "proj-3",
                dueDate: "2025-03-15",
                createdAt: "2025-01-10",
                tags: ["performance", "optimization"],
            },
        ],
    },
    {
        id: "proj-4",
        name: "Mobile App MVP",
        description: "Build a minimum viable product for the client's mobile application using React Native.",
        clientId: "client-1",
        status: "on-hold",
        progress: 20,
        startDate: "2025-01-20",
        dueDate: "2025-06-30",
        budget: 60000,
        columns: [...defaultColumns],
        tasks: [
            {
                id: "task-13",
                title: "App architecture planning",
                description: "Define app architecture, state management, and navigation structure",
                status: "done",
                priority: "high",
                assigneeId: "emp-4",
                projectId: "proj-4",
                dueDate: "2025-02-10",
                createdAt: "2025-01-22",
                tags: ["planning", "architecture"],
            },
            {
                id: "task-14",
                title: "Core navigation setup",
                description: "Set up React Navigation with tab and stack navigators",
                status: "todo",
                priority: "medium",
                assigneeId: "emp-1",
                projectId: "proj-4",
                dueDate: "2025-03-01",
                createdAt: "2025-01-25",
                tags: ["frontend", "mobile"],
            },
        ],
    },
    {
        id: "proj-5",
        name: "Property Listing Portal",
        description: "Full-stack property listing portal with search, virtual tours, and agent management.",
        clientId: "client-5",
        status: "active",
        progress: 35,
        startDate: "2025-01-15",
        dueDate: "2025-07-31",
        budget: 88000,
        columns: [...defaultColumns],
        tasks: [
            {
                id: "task-15",
                title: "Property search engine",
                description: "Build advanced search with filters for location, price, type, and amenities",
                status: "in-progress",
                priority: "high",
                assigneeId: "emp-5",
                projectId: "proj-5",
                dueDate: "2025-03-15",
                createdAt: "2025-01-18",
                tags: ["backend", "search"],
            },
            {
                id: "task-16",
                title: "Virtual tour component",
                description: "Integrate 360° virtual tour viewer for property listings",
                status: "backlog",
                priority: "medium",
                assigneeId: "emp-1",
                projectId: "proj-5",
                dueDate: "2025-04-30",
                createdAt: "2025-01-20",
                tags: ["frontend", "3d"],
            },
            {
                id: "task-17",
                title: "Agent dashboard",
                description: "Build admin panel for real estate agents to manage listings",
                status: "todo",
                priority: "high",
                assigneeId: "emp-4",
                projectId: "proj-5",
                dueDate: "2025-04-15",
                createdAt: "2025-01-22",
                tags: ["fullstack", "admin"],
            },
        ],
    },
];
