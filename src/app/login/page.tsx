'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Mail, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import {
  initialiserUtilisateurDefaut,
  inscrireUtilisateur,
  connecterUtilisateur,
  obtenirSessionUtilisateur,
} from '@/lib/auth-client';

export default function PageConnexion() {
  const router = useRouter();
  const [modeInscription, setModeInscription] = useState(false);
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [typeMessage, setTypeMessage] = useState<'erreur' | 'succes'>('succes');

  useEffect(() => {
    initialiserUtilisateurDefaut();
    const session = obtenirSessionUtilisateur();
    if (session) {
      router.replace('/');
    }
  }, [router]);

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    const resultat = modeInscription
      ? inscrireUtilisateur(email, motDePasse)
      : connecterUtilisateur(email, motDePasse);

    setMessage(resultat.message);
    setTypeMessage(resultat.succes ? 'succes' : 'erreur');

    if (resultat.succes && !modeInscription) {
      router.replace('/');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-md glass-panel p-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-violet-300" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {modeInscription ? 'Creer un compte' : 'Connexion securisee'}
          </h1>
          <p className="text-sm text-gray-400">
            {modeInscription
              ? 'Inscrivez-vous pour acceder a la plateforme d aide a la decision.'
              : 'Connectez-vous pour acceder a la plateforme d aide a la decision multicritere.'}
          </p>
        </div>

        <form onSubmit={soumettre} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-gray-300">Email</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-gray-100 outline-none"
                placeholder="exemple@email.com"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-gray-300">Mot de passe</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2">
              <LockKeyhole className="w-4 h-4 text-violet-400" />
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-gray-100 outline-none"
                placeholder="Votre mot de passe"
              />
            </div>
          </label>

          {message && (
            <p
              className={`text-sm rounded-lg px-3 py-2 border ${
                typeMessage === 'succes'
                  ? 'text-emerald-200 bg-emerald-500/10 border-emerald-500/30'
                  : 'text-rose-200 bg-rose-500/10 border-rose-500/30'
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            {modeInscription ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {modeInscription ? 'Creer le compte' : 'Se connecter'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setModeInscription((p) => !p);
            setMessage('');
          }}
          className="w-full text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          {modeInscription ? 'Deja inscrit ? Aller a la connexion' : 'Pas de compte ? Creer un compte'}
        </button>
      </section>
    </main>
  );
}
