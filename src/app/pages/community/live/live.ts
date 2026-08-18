import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-live',
  standalone: true,
  templateUrl: './live.html',
  styleUrl: './live.css'
})
export class LiveComponent implements OnInit {

  liveId = '';

  isLive = true;

  isChatOpen = true;

  viewerCount = 128;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.liveId =
      this.route.snapshot.paramMap.get('id') || '';

  }


  /* =====================================================
     BACK
  ====================================================== */

  leaveLive(): void {

    this.router.navigate([
      '/dashboard/community'
    ]);

  }


  /* =====================================================
     SHARE LIVE
  ====================================================== */

  shareLive(): void {

    const link =
      `${window.location.origin}/dashboard/live/${this.liveId}`;

    if (navigator.share) {

      navigator.share({
        title: 'B2WA Live',
        text: 'Rejoignez ce Live sur B2WA',
        url: link
      });

    } else {

      navigator.clipboard.writeText(link);

      console.log('Lien du Live copié');

    }

  }


  /* =====================================================
     TOGGLE CHAT
  ====================================================== */

  toggleChat(): void {

    this.isChatOpen =
      !this.isChatOpen;

  }


  /* =====================================================
     SEND MESSAGE
  ====================================================== */

  sendMessage(message: string): void {

    if (!message.trim()) {
      return;
    }

    console.log(
      'Message envoyé :',
      message
    );

  }


  /* =====================================================
     CLOSE LIVE
  ====================================================== */

  closeLive(): void {

    this.isLive = false;

  }

}