import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundNotificationService {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;

  constructor() {
    // Inicializar AudioContext cuando el usuario interactúe por primera vez
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    const initAudio = () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };

    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
  }

  // Reproducir sonido de notificación para nuevos pedidos
  playNewOrderSound(): void {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Crear un sonido agradable para nuevos pedidos
      this.playTone(800, 0.1, 'sine'); // Tono principal
      setTimeout(() => this.playTone(1000, 0.1, 'sine'), 150); // Segundo tono
      setTimeout(() => this.playTone(1200, 0.2, 'sine'), 300); // Tono final más largo
    } catch (error) {
      console.warn('No se pudo reproducir el sonido de notificación:', error);
    }
  }

  // Reproducir sonido para notificaciones generales
  playNotificationSound(): void {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      this.playTone(600, 0.15, 'sine');
    } catch (error) {
      console.warn('No se pudo reproducir el sonido de notificación:', error);
    }
  }

  // Reproducir sonido de alerta
  playAlertSound(): void {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Sonido de alerta más llamativo
      this.playTone(400, 0.1, 'square');
      setTimeout(() => this.playTone(400, 0.1, 'square'), 200);
      setTimeout(() => this.playTone(400, 0.2, 'square'), 400);
    } catch (error) {
      console.warn('No se pudo reproducir el sonido de alerta:', error);
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Envelope para suavizar el sonido
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Habilitar/deshabilitar sonidos
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('soundNotificationsEnabled', enabled.toString());
  }

  isNotificationSoundEnabled(): boolean {
    const stored = localStorage.getItem('soundNotificationsEnabled');
    return stored !== null ? stored === 'true' : true;
  }

  // Reproducir sonido usando HTML5 Audio (alternativa)
  playAudioFile(audioUrl: string): void {
    if (!this.isEnabled) return;

    try {
      const audio = new Audio(audioUrl);
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.warn('No se pudo reproducir el archivo de audio:', error);
      });
    } catch (error) {
      console.warn('Error al crear el elemento de audio:', error);
    }
  }
}