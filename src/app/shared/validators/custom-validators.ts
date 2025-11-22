import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  /**
   * Validador para nombres (solo letras y espacios)
   */
  static name(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Solo letras, espacios y caracteres con tilde
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        return { invalidName: 'Solo se permiten letras y espacios' };
      }

      // No puede empezar o terminar con espacio
      if (value.trim() !== value) {
        return { invalidName: 'No puede empezar o terminar con espacios' };
      }

      return null;
    };
  }

  /**
   * Validador para evitar espacios múltiples
   */
  static noMultipleSpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (/\s{2,}/.test(value)) {
        return { multipleSpaces: 'No se permiten espacios múltiples' };
      }

      return null;
    };
  }

  /**
   * Validador para DNI peruano (8 dígitos)
   */
  static dni(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (!/^[0-9]{8}$/.test(value)) {
        return { invalidDni: 'El DNI debe tener 8 dígitos' };
      }

      return null;
    };
  }

  /**
   * Validador para RUC peruano (11 dígitos)
   */
  static ruc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (!/^[0-9]{11}$/.test(value)) {
        return { invalidRuc: 'El RUC debe tener 11 dígitos' };
      }

      // RUC debe empezar con 10 o 20
      if (!value.startsWith('10') && !value.startsWith('20')) {
        return { invalidRuc: 'El RUC debe empezar con 10 o 20' };
      }

      return null;
    };
  }

  /**
   * Validador para teléfono peruano (9 dígitos, empieza con 9)
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (!/^9[0-9]{8}$/.test(value)) {
        return { invalidPhone: 'El teléfono debe tener 9 dígitos y empezar con 9' };
      }

      return null;
    };
  }

  /**
   * Validador para edad mínima (18 años)
   */
  static minAge(minAge: number = 18): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < minAge) {
        return { underAge: `Debe ser mayor de ${minAge} años` };
      }

      if (age > 100) {
        return { invalidAge: 'Edad no válida' };
      }

      return null;
    };
  }

  /**
   * Validador para fecha de contratación (no puede ser futura)
   */
  static hireDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hireDate = new Date(value);
      const today = new Date();

      if (hireDate > today) {
        return { futureDate: 'La fecha de contratación no puede ser futura' };
      }

      // No puede ser más de 50 años atrás
      const fiftyYearsAgo = new Date();
      fiftyYearsAgo.setFullYear(fiftyYearsAgo.getFullYear() - 50);

      if (hireDate < fiftyYearsAgo) {
        return { tooOld: 'Fecha de contratación no válida' };
      }

      return null;
    };
  }

  /**
   * Validador para precio/salario (positivo, máximo 2 decimales)
   */
  static price(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (value <= 0) {
        return { invalidPrice: 'El precio debe ser mayor a 0' };
      }

      // Máximo 2 decimales
      if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
        return { invalidPrice: 'Máximo 2 decimales' };
      }

      // Máximo 999,999.99
      if (value > 999999.99) {
        return { invalidPrice: 'Precio demasiado alto' };
      }

      return null;
    };
  }

  /**
   * Validador para stock (entero positivo)
   */
  static stock(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined) return null;

      if (!Number.isInteger(Number(value))) {
        return { invalidStock: 'El stock debe ser un número entero' };
      }

      if (value < 0) {
        return { invalidStock: 'El stock no puede ser negativo' };
      }

      if (value > 999999) {
        return { invalidStock: 'Stock demasiado alto' };
      }

      return null;
    };
  }

  /**
   * Validador para URL de imagen (acepta URLs y base64)
   */
  static imageUrl(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Permitir imágenes en base64
      if (value.startsWith('data:image/')) {
        return null;
      }

      // Validar URL normal
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

      if (!urlPattern.test(value)) {
        return { invalidUrl: 'URL inválida' };
      }

      // Verificar que sea una imagen
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasImageExtension = imageExtensions.some(ext => value.toLowerCase().includes(ext));

      if (!hasImageExtension) {
        return { invalidUrl: 'La URL debe ser de una imagen' };
      }

      return null;
    };
  }

  /**
   * Validador para email mejorado
   */
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(value)) {
        return { invalidEmail: 'Email inválido' };
      }

      // No permitir emails temporales comunes
      const tempDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
      const domain = value.split('@')[1]?.toLowerCase();

      if (tempDomains.includes(domain)) {
        return { invalidEmail: 'No se permiten emails temporales' };
      }

      return null;
    };
  }

  /**
   * Validador para código alfanumérico
   */
  static alphanumeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        return { invalidCode: 'Solo se permiten letras y números' };
      }

      return null;
    };
  }

  /**
   * Validador para cantidad positiva
   */
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined) return null;

      if (value <= 0) {
        return { invalidNumber: 'Debe ser un número positivo' };
      }

      return null;
    };
  }

  /**
   * Validador para rango de números
   */
  static numberRange(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined) return null;

      if (value < min || value > max) {
        return { outOfRange: `El valor debe estar entre ${min} y ${max}` };
      }

      return null;
    };
  }

  /**
   * Validador para fecha no futura
   */
  static notFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        return { futureDate: 'La fecha no puede ser futura' };
      }

      return null;
    };
  }

  /**
   * Validador para fecha no pasada
   */
  static notPastDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return { pastDate: 'La fecha no puede ser pasada' };
      }

      return null;
    };
  }

  /**
   * Validador para solo espacios
   */
  static noOnlySpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (typeof value === 'string' && value.trim().length === 0) {
        return { noOnlySpaces: 'No puede contener solo espacios' };
      }

      return null;
    };
  }

  /**
   * Validador para caracteres especiales al inicio
   */
  static noSpecialCharactersStart(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (/^[^a-zA-Z0-9]/.test(value)) {
        return { noSpecialCharactersStart: 'No puede comenzar con caracteres especiales' };
      }

      return null;
    };
  }

  /**
   * Validador para nombre de empresa
   */
  static businessName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Permitir letras, números, espacios y algunos caracteres especiales comunes en nombres de empresas
      if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\-&,]+$/.test(value)) {
        return { businessName: 'Nombre de empresa inválido' };
      }

      return null;
    };
  }

  /**
   * Validador para solo letras y espacios
   */
  static alphabeticWithSpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        return { alphabeticWithSpaces: 'Solo se permiten letras y espacios' };
      }

      return null;
    };
  }

  /**
   * Validador para teléfono peruano (9 dígitos, empieza con 9)
   */
  static peruvianPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (!/^9[0-9]{8}$/.test(value)) {
        return { peruvianPhone: 'Debe comenzar con 9 y tener 9 dígitos' };
      }

      return null;
    };
  }

  /**
   * Validador para email empresarial
   */
  static businessEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(value)) {
        return { businessEmail: 'Email inválido' };
      }

      // No permitir emails gratuitos comunes para empresas
      const freeDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
      const domain = value.split('@')[1]?.toLowerCase();

      if (freeDomains.includes(domain)) {
        return { businessEmail: 'Use un email corporativo' };
      }

      return null;
    };
  }

  /**
   * Validador para dirección válida
   */
  static validAddress(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Debe contener al menos una letra y un número
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);

      if (!hasLetter || !hasNumber) {
        return { validAddress: 'La dirección debe contener letras y números' };
      }

      return null;
    };
  }

  /**
   * Validador para número entero positivo
   */
  static positiveInteger(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;

      const numValue = Number(value);

      if (!Number.isInteger(numValue)) {
        return { positiveInteger: 'Debe ser un número entero' };
      }

      if (numValue < 0) {
        return { positiveInteger: 'Debe ser un número positivo' };
      }

      return null;
    };
  }
}
