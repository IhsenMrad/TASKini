export interface Task {
  id: number;                    // ✅ number au lieu de string
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  deadline: string;              // ✅ deadline au lieu de date, string pour ISO
  status: string;                // ✅ string simple ('OPEN', 'IN_PROGRESS', 'COMPLETED')
  creatorId: number;             // ✅ AJOUTÉ - correspond à creatorId dans Spring
  createdAt?: string;            // ✅ AJOUTÉ - optionnel

  // Champs optionnels pour la compatibilité avec l'existant frontend
  date?: Date;                   // Gardé pour compatibilité
  postedBy?: string;             // Gardé pour compatibilité
  postedByName?: string;         // Gardé pour compatibilité
  applications?: number;         // Gardé pour compatibilité
  requirements?: string;         // Gardé pour compatibilité
  imageUrl?: string;             // Gardé pour compatibilité
  applicationStatus?: string;    // Status of user's application to this task
}

export interface Application {
  id: number;                    // ✅ number au lieu de string
  taskId: number;                // ✅ number au lieu de string
  applicantId: number;           // ✅ AJOUTÉ - correspond à applicantId dans Spring
  message?: string;
  status: string;                // ✅ string simple ('PENDING', 'ACCEPTED', 'REJECTED')
  appliedDate?: string;          // ✅ string pour ISO au lieu de Date

  // Champs optionnels pour la compatibilité
  userId?: string;               // Gardé pour compatibilité
  userName?: string;             // Gardé pour compatibilité
  proposedPrice?: number;        // Gardé pour compatibilité
}

export interface User {
  id: number; // Changé de string à number
  fullName: string; // Changé de name à fullName
  email: string;
  avatar?: string;
  skills: string[];
  completedTasks: number;
  rating: number;
  bio?: string;
  role: string;
  phone?: string;
  location?: string;
  banned?: boolean;
  banReason?: string;
  createdAt?: string;
}

