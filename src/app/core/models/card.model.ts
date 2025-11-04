export class CardCreateDTO {

    public name!: string;

    public gender!: number;

    public birthDate!: Date;


    public email!: string;


    public phone!: string;


    public address!: string;

    public image!: File;
}

export class CardUpdateDTO {
    public id!: string;
    public name!: string | null;

    public gender!: number | null;

    public birthDate!: Date | null;

    public email!: string | null;

    public phone!: string | null;

    public address!: string | null;

    public image!: File | null;
}


export class Card{
  public id!: string;

  public name!: string;

  public gender!: string | number;

  public birthDate!: Date | string;


  public email!: string;


  public phone!: string;


  public address!: string;

  public image!: string;
}

export  interface Minimuzecard{
  id: string;
  name: string;
  gender: string;
  phone: string;
}


export class getAllRequest{
public id!: number;
public name!: string;
public email!: string;
public phone!: string;
public gender!: string;

public pageSize!: number;
public pageIndex!: number;
}