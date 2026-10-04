import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { DecisionInput, AnalysisResult, AssumptionStatus, SavedSession } from '../types';

export interface CloudDecision {
  id: string;
  userId: string;
  title: string;
  options: string;
  leaning: string;
  leaningReason: string;
  knownFacts: string;
  coreFactors: string;
  constraints: string;
  doubtsAndConcerns: string;
  analysis: AnalysisResult;
  userNotes: Record<string, string>;
  assumptionStatuses: Record<string, AssumptionStatus>;
  createdAt: string;
  updatedAt: string;
}

export async function syncUserProfile(user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null }) {
  const path = `users/${user.uid}`;
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || '',
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveDecisionToCloud(
  userId: string,
  input: DecisionInput,
  analysis: AnalysisResult,
  userNotes: Record<string, string> = {},
  assumptionStatuses: Record<string, AssumptionStatus> = {},
  existingId?: string
): Promise<string> {
  const decisionId = existingId || `dec_${Date.now()}`;
  const path = `users/${userId}/decisions/${decisionId}`;

  const payload: CloudDecision = {
    id: decisionId,
    userId: userId,
    title: input.title,
    options: input.options || '',
    leaning: input.leaning || '',
    leaningReason: input.leaningReason || '',
    knownFacts: input.knownFacts || '',
    coreFactors: input.coreFactors || '',
    constraints: input.constraints || '',
    doubtsAndConcerns: input.doubtsAndConcerns || '',
    analysis: analysis,
    userNotes: userNotes,
    assumptionStatuses: assumptionStatuses,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', userId, 'decisions', decisionId), payload);
    return decisionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function updateDecisionNotesInCloud(
  userId: string,
  decisionId: string,
  userNotes: Record<string, string>,
  assumptionStatuses: Record<string, AssumptionStatus>
) {
  const path = `users/${userId}/decisions/${decisionId}`;
  try {
    await setDoc(
      doc(db, 'users', userId, 'decisions', decisionId),
      {
        userNotes,
        assumptionStatuses,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteDecisionFromCloud(userId: string, decisionId: string) {
  const path = `users/${userId}/decisions/${decisionId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'decisions', decisionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserDecisions(
  userId: string,
  onData: (decisions: CloudDecision[]) => void,
  onError?: (err: any) => void
) {
  const path = `users/${userId}/decisions`;
  const q = query(collection(db, 'users', userId, 'decisions'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: CloudDecision[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as CloudDecision);
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}
