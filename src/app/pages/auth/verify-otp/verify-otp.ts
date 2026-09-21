import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.css']
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpForm!: FormGroup;

  otpControls = [
    'digit1',
    'digit2',
    'digit3',
    'digit4',
    'digit5',
    'digit6'
  ];

  /* Affiché dans le HTML : {{ email }} */
  email = '';

  isLoading = false;
  isResending = false;
  submitted = false;

  countdown = 60;

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private resendTimeout: ReturnType<typeof setTimeout> | null = null;
  private submitTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    /*
     * Récupère :
     * /auth/verify-otp?email=exemple@domaine.com
     */
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';

    /*
     * Simulation seulement :
     * si tu arrives directement sur la page OTP sans e-mail,
     * on affiche une adresse par défaut au lieu de rediriger.
     */
    if (!this.email) {
      this.email = 'fournisseur@b2wa.com';
    }

    const group: Record<string, unknown> = {};

    this.otpControls.forEach((control) => {
      group[control] = [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]$')
        ]
      ];
    });

    this.otpForm = this.fb.group(group);

    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearCountdown();

    if (this.resendTimeout) {
      clearTimeout(this.resendTimeout);
      this.resendTimeout = null;
    }

    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
      this.submitTimeout = null;
    }
  }

  startCountdown(): void {
    this.countdown = 60;

    this.clearCountdown();

    this.timerInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.clearCountdown();
      }

      this.cdr.detectChanges();
    }, 1000);
  }

  clearCountdown(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);

    input.value = digit;

    const controlName = this.otpControls[index];

    this.otpForm.get(controlName)?.setValue(digit);
    this.otpForm.get(controlName)?.markAsTouched();
    this.otpForm.get(controlName)?.updateValueAndValidity();

    if (digit && index < this.otpControls.length - 1) {
      this.otpInputs.toArray()[index + 1]?.nativeElement.focus();
    }

    if (digit && index === this.otpControls.length - 1) {
      this.otpInputs.toArray()[index]?.nativeElement.blur();
    }
  }

  onKeyDown(index: number, event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Backspace') {
      const currentControl = this.otpForm.get(this.otpControls[index]);

      if (!currentControl?.value && index > 0) {
        keyboardEvent.preventDefault();

        const previousControlName = this.otpControls[index - 1];

        this.otpForm.get(previousControlName)?.setValue('');
        this.otpForm.get(previousControlName)?.markAsTouched();

        this.otpInputs.toArray()[index - 1]?.nativeElement.focus();
      }
    }

    if (keyboardEvent.key === 'ArrowLeft' && index > 0) {
      keyboardEvent.preventDefault();
      this.otpInputs.toArray()[index - 1]?.nativeElement.focus();
    }

    if (
      keyboardEvent.key === 'ArrowRight' &&
      index < this.otpControls.length - 1
    ) {
      keyboardEvent.preventDefault();
      this.otpInputs.toArray()[index + 1]?.nativeElement.focus();
    }

    if (keyboardEvent.key === 'Enter' && this.otpForm.valid) {
      keyboardEvent.preventDefault();
      this.onSubmit();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedData =
      event.clipboardData?.getData('text')?.trim() ?? '';

    const digits = pastedData
      .replace(/\D/g, '')
      .slice(0, this.otpControls.length);

    if (!digits) {
      return;
    }

    const splitDigits = digits.split('');

    this.otpControls.forEach((controlName, index) => {
      const digit = splitDigits[index] ?? '';

      this.otpForm.get(controlName)?.setValue(digit);
      this.otpForm.get(controlName)?.markAsTouched();
      this.otpForm.get(controlName)?.updateValueAndValidity();
    });

    const inputs = this.otpInputs.toArray();

    if (digits.length === this.otpControls.length) {
      inputs[this.otpControls.length - 1]?.nativeElement.focus();
      inputs[this.otpControls.length - 1]?.nativeElement.blur();
    } else {
      inputs[digits.length]?.nativeElement.focus();
    }

    this.cdr.detectChanges();
  }

  resendCode(): void {
    if (this.countdown > 0 || this.isResending) {
      return;
    }

    this.isResending = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isResending = false;
      this.submitted = false;

      this.otpForm.reset();

      this.startCountdown();

      this.otpInputs.toArray()[0]?.nativeElement.focus();

      this.cdr.detectChanges();
    }, 1200);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.otpForm.invalid || this.isLoading) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const otpCode = this.otpControls
      .map((controlName) => this.otpForm.get(controlName)?.value ?? '')
      .join('');

    this.isLoading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();

      console.log('Simulation OTP validé :', {
        email: this.email,
        otpCode
      });

      this.router.navigate(['/auth/reset-password'], {
        queryParams: {
          email: this.email
        }
      });
    }, 1200);
  }

  editEmail(): void {
    this.clearCountdown();

    this.router.navigate(['/auth/forgot-password'], {
      queryParams: {
        email: this.email
      }
    });
  }
}