import { NextResponse } from 'next/server';
import { calculerClassement, FiltresUtilisateur } from '@/lib/decision';
import { WeightDistribution } from '@/types';

interface RequeteRecommandation {
  poids?: WeightDistribution;
  filtres?: FiltresUtilisateur;
}

const poidsParDefaut: WeightDistribution = {
  cost: 25,
  ram: 25,
  cpu: 25,
  bandwidth: 25,
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequeteRecommandation;
    const poids = body.poids ?? poidsParDefaut;
    const resultat = calculerClassement(poids, body.filtres);

    return NextResponse.json({
      succes: true,
      total: resultat.length,
      resultat,
    });
  } catch {
    return NextResponse.json(
      {
        succes: false,
        message: 'Requete invalide. Verifiez le format des poids et des filtres.',
      },
      { status: 400 }
    );
  }
}
