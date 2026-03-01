export interface Address {
  direccion: string;
  coloniaPoblacion: string;
  delegacionMunicipio: string;
  ciudad: string;
  estado: string;
  CP: string;
}

export interface Person {
  apellidoPaterno: string;
  apellidoMaterno: string;
  primerNombre: string;
  fechaNacimiento: string;
  RFC: string;
  nacionalidad: string;
  domicilio: Address;
}
