export interface OrdenPago {
  cuentaBeneficiario: string;
  tipoCuentaOrdenante: string;
  nombreBeneficiario: string;
  rfcCurpBeneficiario: string;
  conceptoPago: string;
  institucionOperante: string;
  referenciaNumerica: string;
  claveRastreo: string;
  tipoCuentaBeneficiario: string;
  cuentaOrdenante: string;
  empresa: string;
  folioOrigen: string;
  institucionContraparte: string;
  monto: string;
  rfcCurpOrdenante: string;
  tipoPago: string;
  fechaOperacion: string;
  nombreOrdenante: string;
  emailBeneficiario: string;
  tipoCuentaBeneficiario2: string;
  nombreBeneficiario2: string;
  cuentaBeneficiario2: string;
  rfcCurpBeneficiario2: string;
  conceptoPago2: string;
  claveCatalogoUsuario1: string;
  claveCatalogoUsuario2: string;
  clavePago: string;
  referenciaCobranza: string;
  tipoOperacion: string;
  topologia: string;
  usuario: string;
  medioEntrega: string;
  prioridad: string;
  iva: string;
  firma?: string;
}

export const expectedOrderRegisterOrder = [
  'institucionContraparte',
  'empresa',
  'fechaOperacion',
  'folioOrigen',
  'claveRastreo',
  'institucionOperante',
  'monto',
  'tipoPago',
  'tipoCuentaOrdenante',
  'nombreOrdenante',
  'cuentaOrdenante',
  'rfcCurpOrdenante',
  'tipoCuentaBeneficiario',
  'nombreBeneficiario',
  'cuentaBeneficiario',
  'rfcCurpBeneficiario',
  'emailBeneficiario',
  'tipoCuentaBeneficiario2',
  'nombreBeneficiario2',
  'cuentaBeneficiario2',
  'rfcCurpBeneficiario2',
  'conceptoPago',
  'conceptoPago2',
  'claveCatalogoUsuario1',
  'claveCatalogoUsuario2',
  'clavePago',
  'referenciaCobranza',
  'referenciaNumerica',
  'tipoOperacion',
  'topologia',
  'usuario',
  'medioEntrega',
  'prioridad',
  'iva',
];
