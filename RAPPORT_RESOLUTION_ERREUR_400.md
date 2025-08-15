# Rapport de résolution - Erreur 400 lors de soumission de propositions

## 📋 Résumé exécutif

**Problème** : Erreur 400 "Ce projet n'accepte plus de nouvelles propositions" lors de la soumission de propositions par les vendeurs.

**Cause racine** : Incohérence dans la gestion des statuts de projets entre différentes parties du système.

**Solution** : Harmonisation des vérifications de statuts pour accepter toutes les variantes (majuscules/minuscules).

---

## 🔍 Diagnostic du problème

### 1. Symptômes observés
- Les vendeurs pouvaient voir les projets disponibles
- L'authentification fonctionnait correctement (rôle SELLER validé)
- La soumission de proposition échouait systématiquement avec une erreur 400
- Message d'erreur : "Ce projet n'accepte plus de nouvelles propositions"

### 2. Architecture concernée
```
Frontend (/seller/projects) 
    ↓ 
API récupération projets (/api/projects/available)
    ↓
API soumission proposition (/api/seller/projects/[id]/proposal)
```

### 3. Identification des incohérences

#### Dans le schéma Prisma
```prisma
model Project {
  status String @default("pending") // Défaut : "pending"
}
```

#### Dans l'API de récupération des projets
```typescript
// /api/projects/available
where: {
    status: "OPEN",  // Recherche : "OPEN" (majuscules)
}
```

#### Dans l'API de soumission de propositions (version initiale)
```typescript
// /api/seller/projects/[id]/proposal
if (project.status !== "pending" && project.status !== "open") {
    // Vérification : "pending" et "open" (minuscules uniquement)
}
```

---

## 🛠️ Étapes de résolution

### Phase 1 : Identification du problème de conversion de types
**Problème initial** : Erreur sur `params.id` dans Next.js 15+
```
Error: Route used `params.id`. `params` should be awaited before using its properties.
```

**Solution appliquée** :
```typescript
// Avant
const projectId = parseInt(params.id)

// Après
const resolvedParams = await params
const projectId = parseInt(resolvedParams.id)
```

### Phase 2 : Correction des types Decimal
**Problème** : Erreur sur les calculs de prix
```
products.reduce(...).toFixed is not a function
```

**Solution** :
```typescript
// Conversion explicite des types Decimal de Prisma
const getTotalValue = () => {
  return products.reduce((sum, p) => sum + Number(p.price), 0)
}
```

### Phase 3 : Diagnostic approfondi avec logs
**Ajout de logs détaillés** dans toutes les APIs concernées :

#### Frontend (/seller/projects)
```typescript
console.log("🚀 FRONTEND: Début soumission proposition")
console.log("📤 FRONTEND: Payload envoyé:", requestPayload)
console.log("📥 FRONTEND: Réponse reçue:", response.status)
```

#### API disponibilité des projets
```typescript
console.log("📊 API AVAILABLE: Projets trouvés:", projects.length)
console.log("✅ API AVAILABLE: Projets formatés:", formattedProjects)
```

#### API soumission de propositions
```typescript
console.log("👤 Session récupérée:", { role: session?.user?.role })
console.log("📋 Projet récupéré:", { status: project?.status })
console.log("🔍 Vérification du statut:", { currentStatus: project.status })
```

### Phase 4 : Découverte de l'incohérence de statuts
**Logs révélateurs** :
```
📋 Projet récupéré: { status: 'OPEN' }
🔍 Vérification du statut: { 
  currentStatus: 'OPEN', 
  isPending: false,
  isOpen: false 
}
❌ Statut du projet invalide: OPEN
```

**Analyse** :
- Les projets en base de données avaient le statut `"OPEN"` (majuscules)
- L'API de récupération filtrait par `"OPEN"` 
- L'API de soumission ne vérifiait que `"pending"` et `"open"` (minuscules)
- Résultat : rejet systématique des propositions

---

## ✅ Solution finale implémentée

### 1. Modification de l'API de soumission de propositions
```typescript
// Avant (restrictif)
if (project.status !== "pending" && project.status !== "open") {
    return NextResponse.json(
        { error: "Ce projet n'accepte plus de nouvelles propositions" },
        { status: 400 }
    )
}

// Après (flexible)
const validStatuses = ["pending", "open", "PENDING", "OPEN"]
if (!validStatuses.includes(project.status)) {
    return NextResponse.json(
        { error: "Ce projet n'accepte plus de nouvelles propositions" },
        { status: 400 }
    )
}
```

### 2. Amélioration de l'API de récupération des projets
```typescript
// Recherche avec statuts multiples
const availableProjects = await prisma.project.findMany({
    where: {
        OR: [
            { status: "OPEN" },
            { status: "open" },
            { status: "pending" },
            { status: "PENDING" }
        ],
        // ...
    }
})
```

### 3. Harmonisation du formatage
```typescript
// Normalisation des statuts pour le frontend
status: project.status.toLowerCase(), // Toujours en minuscules
```

---

## 📊 Résultats obtenus

### Avant la correction
- ❌ Erreur 400 systématique
- ❌ Impossible de soumettre des propositions
- ❌ Incohérence entre les APIs

### Après la correction
- ✅ Soumission de propositions fonctionnelle
- ✅ Gestion robuste des différents formats de statuts
- ✅ Logs détaillés pour le débogage futur
- ✅ Système harmonisé et maintenable

---

## 🎯 Leçons apprises

### 1. Importance de la cohérence des données
- Les statuts doivent être uniformisés dans tout le système
- Les enums Prisma auraient pu prévenir ce problème

### 2. Valeur du logging détaillé
- Les logs ont été essentiels pour identifier la cause racine
- Un système de logging structuré facilite le débogage

### 3. Gestion des versions Next.js
- Les nouvelles versions peuvent introduire des breaking changes
- Les paramètres de route dynamique nécessitent maintenant `await`

### 4. Types Prisma Decimal
- Les types Decimal de Prisma nécessitent une conversion explicite
- Prévoir ces conversions dans les utilitaires

---

## 🔮 Recommandations futures

### 1. Standardisation des statuts
```prisma
enum ProjectStatus {
  PENDING
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Project {
  status ProjectStatus @default(PENDING)
}
```

### 2. Système de logging centralisé
- Implémenter un logger structuré (ex: Winston, Pino)
- Niveaux de log configurables par environnement

### 3. Tests unitaires
- Ajouter des tests pour les vérifications de statuts
- Tests d'intégration pour les workflows complets

### 4. Documentation technique
- Documenter les statuts valides et leurs transitions
- Guide de débogage pour les erreurs communes

---

## 📈 Impact sur le système

**Temps de résolution** : ~3 heures de diagnostic et correction

**Fonctionnalités restaurées** :
- Soumission de propositions par les vendeurs
- Workflow complet client-vendeur
- Notifications automatiques

**Amélirations apportées** :
- Robustesse accrue du système
- Meilleure observabilité via les logs
- Base pour futurs développements

---

*Rapport généré le 15 août 2025*
