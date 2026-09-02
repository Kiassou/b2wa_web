import {
ChangeDetectionStrategy,
ChangeDetectorRef,
Component,
EventEmitter,
Input,
OnChanges,
OnDestroy,
Output,
SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
Content,
ContentVisibility
} from '../../../models/content.model';

export interface StoryFormData {
content: string;
image?: string;
video?: string;
visibility: ContentVisibility;
communityId?: string;
communityName?: string;
}

export interface StoryCommunity {
id: string;
name: string;
}

@Component({
selector: 'app-create-story-modal',
standalone: true,
imports: [
CommonModule,
FormsModule
],
templateUrl: './create-story-modal.html',
styleUrl: './create-story-modal.css',
changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStoryModalComponent
implements OnChanges, OnDestroy {

@Input() visible = false;
@Input() isPremium = false;
@Input() content: Content | null = null;

@Input() communities: StoryCommunity[] = [
{
id: 'comm-001',
name: 'Commerce & Import Mali'
},
{
id: 'comm-002',
name: 'Produits agricoles Afrique de l’Ouest'
},
{
id: 'comm-003',
name: 'Électronique & Smartphones Mali'
}
];

@Output() closed = new EventEmitter<void>();
@Output() submitted = new EventEmitter<StoryFormData>();
@Output() premiumRequired = new EventEmitter<void>();

form: StoryFormData = {
content: '',
visibility: 'community'
};

imagePreview = '';
videoPreview = '';

submittedForm = false;

private imageObjectUrl = '';
private videoObjectUrl = '';

constructor(
private cdr: ChangeDetectorRef
) {}

ngOnChanges(changes: SimpleChanges): void {
if (!this.visible) return;

if (
  changes['visible'] ||
  changes['content']
) {
  this.loadForm();
}

}

get isEditing(): boolean {
return !!this.content;
}

get contentLength(): number {
return this.form.content.length;
}

get canPublish(): boolean {
const hasText = this.form.content.trim().length > 0;
const hasMedia =
!!this.form.image ||
!!this.form.video;

if (!hasText && !hasMedia) {
  return false;
}

if (
  this.form.visibility === 'public' &&
  !this.isPremium
) {
  return false;
}

if (
  this.form.visibility === 'community' &&
  !this.form.communityId
) {
  return false;
}

return true;

}

private loadForm(): void {

this.clearObjectUrls();

this.submittedForm = false;

if (this.content) {

  this.form = {
    content: this.content.content || '',
    image: this.content.image,
    video: this.content.video,
    visibility: this.content.visibility,
    communityId: this.content.communityId,
    communityName: this.content.communityName
  };

  this.imagePreview = this.content.image || '';
  this.videoPreview = this.content.video || '';

} else {

  this.form = {
    content: '',
    visibility: 'community',
    communityId: undefined,
    communityName: undefined,
    image: undefined,
    video: undefined
  };

  this.imagePreview = '';
  this.videoPreview = '';
}

this.cdr.markForCheck();

}

closeModal(): void {
this.closed.emit();
}

selectVisibility(
visibility: ContentVisibility
): void {

if (visibility === 'public') {

  if (!this.isPremium) {
    this.premiumRequired.emit();
    return;
  }

  this.form.visibility = 'public';

} else {

  this.form.visibility = 'community';

}

this.cdr.markForCheck();

}

onCommunityChange(event: Event): void {

const select =
  event.target as HTMLSelectElement;

const communityId = select.value;

this.form.communityId =
  communityId || undefined;

const community =
  this.communities.find(
    item => item.id === communityId
  );

this.form.communityName =
  community?.name;

this.cdr.markForCheck();

}

onImageSelected(event: Event): void {

const input =
  event.target as HTMLInputElement;

if (!input.files?.length) {
  return;
}

const file = input.files[0];

if (!file.type.startsWith('image/')) {
  alert('Veuillez sélectionner une image valide.');
  input.value = '';
  return;
}

if (file.size > 5 * 1024 * 1024) {
  alert('L’image ne doit pas dépasser 5 Mo.');
  input.value = '';
  return;
}

this.revokeImageUrl();

this.imageObjectUrl =
  URL.createObjectURL(file);

this.imagePreview =
  this.imageObjectUrl;

this.form.image =
  this.imageObjectUrl;

this.form.video = undefined;

this.revokeVideoUrl();

this.videoPreview = '';

input.value = '';

this.cdr.markForCheck();

}

onVideoSelected(event: Event): void {

const input =
  event.target as HTMLInputElement;

if (!input.files?.length) {
  return;
}

const file = input.files[0];

if (!file.type.startsWith('video/')) {
  alert('Veuillez sélectionner une vidéo valide.');
  input.value = '';
  return;
}

if (file.size > 30 * 1024 * 1024) {
  alert('La vidéo ne doit pas dépasser 30 Mo.');
  input.value = '';
  return;
}

this.revokeVideoUrl();

this.videoObjectUrl =
  URL.createObjectURL(file);

this.videoPreview =
  this.videoObjectUrl;

this.form.video =
  this.videoObjectUrl;

this.form.image = undefined;

this.revokeImageUrl();

this.imagePreview = '';

input.value = '';

this.cdr.markForCheck();

}

removeMedia(): void {

this.revokeImageUrl();
this.revokeVideoUrl();

this.imagePreview = '';
this.videoPreview = '';

this.form.image = undefined;
this.form.video = undefined;

this.cdr.markForCheck();

}

requestPremium(): void {
  this.premiumRequired.emit();  
  this.closed.emit();
}

publishStory(): void {

this.submittedForm = true;

if (
  this.form.visibility === 'public' &&
  !this.isPremium
) {
  this.premiumRequired.emit();
  return;
}

if (!this.canPublish) {
  this.cdr.markForCheck();
  return;
}

const data: StoryFormData = {
  content: this.form.content.trim(),
  image: this.form.image,
  video: this.form.video,
  visibility: this.form.visibility,
  communityId: this.form.communityId,
  communityName: this.form.communityName
};

this.submitted.emit(data);

}

private revokeImageUrl(): void {

if (this.imageObjectUrl) {
  URL.revokeObjectURL(this.imageObjectUrl);
  this.imageObjectUrl = '';
}

}

private revokeVideoUrl(): void {

if (this.videoObjectUrl) {
  URL.revokeObjectURL(this.videoObjectUrl);
  this.videoObjectUrl = '';
}

}

private clearObjectUrls(): void {
this.revokeImageUrl();
this.revokeVideoUrl();
}

ngOnDestroy(): void {
this.clearObjectUrls();
}
}
