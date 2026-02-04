// Demo data for investor presentation
// This simulates real posts to showcase the platform's potential

export const demoPosts = [
    {
        id: 'demo-1',
        title: '🔥 Bug React useEffect qui tourne en boucle infinie',
        content: `Mon useEffect se déclenche en boucle, j'ai essayé plusieurs solutions mais rien ne marche.

\`\`\`javascript
useEffect(() => {
  setData(fetchData());
}, [data]); // Cette dépendance cause la boucle
\`\`\`

Le composant se re-render constamment et l'app freeze. J'ai besoin d'aide urgente pour mon projet de startup !`,
        authorPseudo: 'DevJunior_Alex',
        createdAt: Date.now() - 1000 * 60 * 15, // 15 min ago
        commentCount: 7,
        upvotes: 23,
        mediaUrls: [],
        tags: ['React', 'JavaScript', 'Hooks'],
        urgent: true
    },
    {
        id: 'demo-2',
        title: 'Comment structurer une API REST pour une app de livraison ?',
        content: `Je développe une app de livraison type UberEats pour mon startup. J'ai besoin de conseils sur:

- Structure des endpoints (orders, users, restaurants)
- Gestion des statuts de commande en temps réel
- Architecture microservices vs monolithique

Budget: 50 crédits pour une session de 15 min avec un expert backend.`,
        authorPseudo: 'StartupFounder_Marie',
        createdAt: Date.now() - 1000 * 60 * 45, // 45 min ago
        commentCount: 12,
        upvotes: 45,
        mediaUrls: [],
        tags: ['Backend', 'API', 'Architecture'],
        urgent: false
    },
    {
        id: 'demo-3',
        title: '🆘 Mon déploiement AWS crashe après 2 minutes',
        content: `Mon app Node.js crash systématiquement après 2 minutes sur EC2. Les logs montrent:

\`\`\`
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
\`\`\`

J'ai augmenté la RAM de l'instance mais ça ne change rien. C'est urgent, on a une demo client demain !`,
        authorPseudo: 'CTO_Thomas',
        createdAt: Date.now() - 1000 * 60 * 30, // 30 min ago
        commentCount: 5,
        upvotes: 18,
        mediaUrls: [],
        tags: ['AWS', 'Node.js', 'DevOps'],
        urgent: true
    },
    {
        id: 'demo-4',
        title: 'Besoin d\'aide pour optimiser mes requêtes PostgreSQL',
        content: `Ma query principale prend 8 secondes sur 10M de lignes. Voici la query:

\`\`\`sql
SELECT * FROM orders 
JOIN users ON orders.user_id = users.id 
WHERE orders.created_at > '2024-01-01'
ORDER BY orders.total DESC;
\`\`\`

J'ai déjà créé des index mais c'est toujours lent. Un DBA peut m'aider ?`,
        authorPseudo: 'BackendEngineer_Sophie',
        createdAt: Date.now() - 1000 * 60 * 60, // 1h ago
        commentCount: 9,
        upvotes: 31,
        mediaUrls: [],
        tags: ['PostgreSQL', 'Performance', 'Database'],
        urgent: false
    },
    {
        id: 'demo-5',
        title: 'Comment implémenter Stripe Connect pour une marketplace ?',
        content: `Je crée une marketplace et j'ai besoin d'intégrer les paiements entre vendeurs et acheteurs.

Questions:
1. Stripe Connect Standard vs Express ?
2. Gestion des frais de plateforme (commission)
3. Payout aux vendeurs automatique vs manuel

Qui a de l'expérience avec ça ? Prêt à payer 30 crédits pour 10 min d'explication.`,
        authorPseudo: 'IndieHacker_Jules',
        createdAt: Date.now() - 1000 * 60 * 90, // 1.5h ago
        commentCount: 14,
        upvotes: 52,
        mediaUrls: [],
        tags: ['Stripe', 'Payments', 'Marketplace'],
        urgent: false
    },
    {
        id: 'demo-6',
        title: '🎨 Besoin de feedback sur mon design system',
        content: `Je suis en train de créer un design system pour ma startup SaaS. J'aimerais avoir l'avis d'un designer UX/UI expérimenté sur:

- Ma palette de couleurs
- Mes composants de base (boutons, inputs, cards)
- L'accessibilité

Je peux partager mon Figma en session vidéo.`,
        authorPseudo: 'ProductDesigner_Léa',
        createdAt: Date.now() - 1000 * 60 * 120, // 2h ago
        commentCount: 8,
        upvotes: 27,
        mediaUrls: [],
        tags: ['Design', 'UX/UI', 'Figma'],
        urgent: false
    }
];

export const demoComments = {
    'demo-1': [
        {
            id: 'c1',
            text: 'Le problème c\'est que tu modifies `data` dans l\'effet qui dépend de `data`. C\'est un pattern anti-pattern classique !',
            authorPseudo: 'SeniorDev_Marcus',
            createdAt: Date.now() - 1000 * 60 * 10
        },
        {
            id: 'c2',
            text: 'Utilise un useRef pour éviter la boucle, ou mieux: un useCallback pour le fetch',
            authorPseudo: 'ReactExpert_Nina',
            createdAt: Date.now() - 1000 * 60 * 8
        },
        {
            id: 'c3',
            text: 'Je peux t\'aider en live, dispo maintenant pour 3 min ! 🎯',
            authorPseudo: 'Mentor_Pro',
            createdAt: Date.now() - 1000 * 60 * 5,
            isHelper: true
        }
    ],
    'demo-2': [
        {
            id: 'c4',
            text: 'Pour le temps réel, regarde WebSockets avec Socket.io, c\'est parfait pour ton use case',
            authorPseudo: 'FullStack_Antoine',
            createdAt: Date.now() - 1000 * 60 * 35
        },
        {
            id: 'c5',
            text: 'Commence monolithique, tu pourras toujours découper en microservices plus tard. C\'est l\'erreur classique des startups early stage.',
            authorPseudo: 'TechLead_Emma',
            createdAt: Date.now() - 1000 * 60 * 30
        }
    ]
};

export const demoMentors = [
    {
        id: 'm1',
        name: 'Marcus Chen',
        expertise: ['React', 'TypeScript', 'Next.js'],
        rating: 4.9,
        sessionsCompleted: 156,
        responseTime: '< 2 min',
        available: true
    },
    {
        id: 'm2',
        name: 'Sophie Martin',
        expertise: ['PostgreSQL', 'MongoDB', 'Data Engineering'],
        rating: 4.8,
        sessionsCompleted: 89,
        responseTime: '< 5 min',
        available: true
    },
    {
        id: 'm3',
        name: 'Thomas Leroy',
        expertise: ['AWS', 'Docker', 'Kubernetes'],
        rating: 4.95,
        sessionsCompleted: 234,
        responseTime: '< 1 min',
        available: false
    }
];

export const platformStats = {
    totalMentors: 1247,
    activeNow: 89,
    avgResponseTime: '47 sec',
    totalSessions: 28453,
    satisfactionRate: 98.2
};
