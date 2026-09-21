import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ChatMessage {
  sender: 'user' | 'kora';
  text: string;
  time: string;
}

@Component({
  selector: 'app-register-help',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register-help.html',
  styleUrl: './register-help.css'
})
export class RegisterHelpComponent {

  message = '';

  messages: ChatMessage[] = [
    {
      sender: 'kora',
      text: `Bonjour 👋

Je suis Kora, votre assistant B2WA.

Je peux vous accompagner uniquement pour votre inscription : création du compte, vérification par OTP, documents, validation du dossier et problèmes rencontrés pendant l'inscription.

Comment puis-je vous aider ?`,
      time: this.getCurrentTime()
    }
  ];

  quickQuestions = [
    'Comment créer mon compte ?',
    'Je n’ai pas reçu mon OTP',
    'Quels documents dois-je fournir ?',
    'Qu’est-ce que le RCCM ?',
    'Pourquoi mon document est refusé ?',
    'Combien de temps prend la validation ?'
  ];

  sendMessage(): void {
    const text = this.message.trim();

    if (!text) {
      return;
    }

    this.messages.push({
      sender: 'user',
      text,
      time: this.getCurrentTime()
    });

    this.message = '';

    setTimeout(() => {
      this.messages.push({
        sender: 'kora',
        text: this.getResponse(text),
        time: this.getCurrentTime()
      });
    }, 500);
  }

  askQuestion(question: string): void {
    this.message = question;
    this.sendMessage();
  }

  private getResponse(question: string): string {
    const q = question.toLowerCase();

    if (
      q.includes('compte') ||
      q.includes('inscription') ||
      q.includes('inscrire')
    ) {
      return `Pour commencer votre inscription sur B2WA, choisissez d’abord votre profil :

• Fournisseur
• Commerçant

Si vous choisissez « Fournisseur », vous serez accompagné à travers les différentes étapes : informations personnelles et entreprise, vérification, documents puis validation du dossier.`;
    }

    if (
      q.includes('otp') ||
      q.includes('code') ||
      q.includes('vérification')
    ) {
      return `Si vous n’avez pas reçu votre code OTP, vérifiez d’abord l’adresse e-mail utilisée lors de votre inscription.

Pensez également à vérifier vos courriers indésirables.

Si le code a expiré, vous pourrez demander l’envoi d’un nouveau code depuis l’étape de vérification.`;
    }

    if (
      q.includes('document') ||
      q.includes('rccm') ||
      q.includes('nif') ||
      q.includes('identité')
    ) {
      return `Pour une inscription fournisseur, certains documents peuvent être demandés afin de vérifier votre activité.

Selon votre situation, cela peut notamment concerner :
• le RCCM
• le NIF
• une pièce d’identité

Les documents doivent être lisibles et correspondre aux informations fournies pendant l’inscription.`;
    }

    if (q.includes('rccm')) {
      return `Le RCCM signifie « Registre du Commerce et du Crédit Mobilier ».

Il s’agit d’un document officiel utilisé pour identifier une entreprise ou une activité commerciale enregistrée.

Lors de l’inscription fournisseur, il peut être demandé dans le cadre de la vérification de votre entreprise.`;
    }

    if (
      q.includes('refus') ||
      q.includes('rejet') ||
      q.includes('rejeté')
    ) {
      return `Si un document est refusé, cela peut notamment être lié à sa lisibilité, à des informations incorrectes ou à un document qui ne correspond pas aux informations fournies.

Consultez le motif indiqué par B2WA et, si nécessaire, transmettez un document conforme.`;
    }

    if (
      q.includes('temps') ||
      q.includes('validation') ||
      q.includes('combien')
    ) {
      return `Après l’envoi de votre dossier, celui-ci passe par une phase de vérification.

Votre compte fournisseur peut rester en attente pendant l’examen des informations et des documents transmis.

Kora pourra également vous guider si vous avez une question concernant le statut de votre dossier.`;
    }

    if (
      q.includes('mot de passe') ||
      q.includes('password')
    ) {
      return `Pour votre sécurité, choisissez un mot de passe suffisamment robuste et confirmez-le correctement lors de l'inscription.

Si vous rencontrez un problème avec votre mot de passe, indiquez-moi ce qui bloque et je vous guiderai.`;
    }

    return `Je suis Kora, l’assistant dédié à l’inscription B2WA. 🤝

Je peux vous aider concernant :
• la création de votre compte
• le choix de votre profil
• le code OTP
• les documents
• le RCCM et le NIF
• la validation de votre dossier
• les problèmes rencontrés pendant l'inscription

Essayez de me poser votre question autrement.`;
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}