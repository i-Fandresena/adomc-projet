export interface Utilisateur {
  email: string;
  motDePasse: string;
  dateCreation: string;
}

const CLE_UTILISATEURS = 'adomc-utilisateurs';
const CLE_SESSION = 'adomc-session';
const EMAIL_DEFAUT = 'ainafandresena9@gmail.com';
const MOT_DE_PASSE_DEFAUT = 'adomc2026';

function lireUtilisateurs(): Utilisateur[] {
  if (typeof window === 'undefined') return [];
  const brut = window.localStorage.getItem(CLE_UTILISATEURS);
  if (!brut) return [];
  try {
    return JSON.parse(brut) as Utilisateur[];
  } catch {
    return [];
  }
}

function ecrireUtilisateurs(utilisateurs: Utilisateur[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CLE_UTILISATEURS, JSON.stringify(utilisateurs));
}

export function initialiserUtilisateurDefaut() {
  const utilisateurs = lireUtilisateurs();
  const existe = utilisateurs.some((u) => u.email.toLowerCase() === EMAIL_DEFAUT.toLowerCase());
  if (existe) return;

  const maj = [
    ...utilisateurs,
    {
      email: EMAIL_DEFAUT,
      motDePasse: MOT_DE_PASSE_DEFAUT,
      dateCreation: new Date().toISOString(),
    },
  ];
  ecrireUtilisateurs(maj);
}

export function inscrireUtilisateur(email: string, motDePasse: string): { succes: boolean; message: string } {
  const emailNormalise = email.trim().toLowerCase();
  if (!emailNormalise || !motDePasse.trim()) {
    return { succes: false, message: 'Veuillez renseigner un email et un mot de passe.' };
  }
  if (motDePasse.length < 8) {
    return { succes: false, message: 'Le mot de passe doit contenir au moins 8 caracteres.' };
  }

  const utilisateurs = lireUtilisateurs();
  const dejaPris = utilisateurs.some((u) => u.email.toLowerCase() === emailNormalise);
  if (dejaPris) {
    return { succes: false, message: 'Cet email existe deja.' };
  }

  utilisateurs.push({
    email: emailNormalise,
    motDePasse,
    dateCreation: new Date().toISOString(),
  });
  ecrireUtilisateurs(utilisateurs);
  return { succes: true, message: 'Compte cree avec succes. Vous pouvez vous connecter.' };
}

export function connecterUtilisateur(email: string, motDePasse: string): { succes: boolean; message: string } {
  const emailNormalise = email.trim().toLowerCase();
  const utilisateurs = lireUtilisateurs();
  const utilisateur = utilisateurs.find((u) => u.email.toLowerCase() === emailNormalise);

  if (!utilisateur || utilisateur.motDePasse !== motDePasse) {
    return { succes: false, message: 'Email ou mot de passe incorrect.' };
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CLE_SESSION, utilisateur.email);
  }
  return { succes: true, message: 'Connexion reussie.' };
}

export function obtenirSessionUtilisateur(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(CLE_SESSION);
}

export function deconnecterUtilisateur() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CLE_SESSION);
}
