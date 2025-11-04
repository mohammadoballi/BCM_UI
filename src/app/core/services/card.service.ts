import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardCreateDTO ,CardUpdateDTO, Card, getAllRequest, Minimuzecard} from '../models/card.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private api: ApiService) {}

  public createCard(cardDto : CardCreateDTO){
    const formData = new FormData();
    formData.append('name', cardDto.name);
    formData.append('gender', cardDto.gender.toString());
    formData.append('birthDate', cardDto.birthDate.toISOString());
    formData.append('email', cardDto.email);
    formData.append('phone', cardDto.phone);
    formData.append('address', cardDto.address);
    if (cardDto.image) {
      formData.append('image', cardDto.image);
    }
    return this.api.post<boolean>('Card/Create', formData);
  }

  public updateCard(cardDto : CardUpdateDTO){
    const formData = new FormData();
    formData.append('id', cardDto.id);
    if (cardDto.name) formData.append('name', cardDto.name);
    if (cardDto.gender !== null && cardDto.gender !== undefined) formData.append('gender', cardDto.gender.toString());
    if (cardDto.birthDate) formData.append('birthDate', cardDto.birthDate.toISOString());
    if (cardDto.email) formData.append('email', cardDto.email);
    if (cardDto.phone) formData.append('phone', cardDto.phone);
    if (cardDto.address) formData.append('address', cardDto.address);
    if (cardDto.image) formData.append('image', cardDto.image);
    return this.api.put<boolean>('Card/update/' + cardDto.id, formData);
  }

  public deleteCard(id : number){
    return this.api.delete<boolean>('Card/Delete/' + id);
  }

  public getCard(id : number){
    return this.api.get<Card>('Card/GetCardById/' + id);
  }

public GetAllCards(getAllRequest: getAllRequest) {
  const params: any = {
    pageIndex: getAllRequest.pageIndex?? 1,
    pageSize: getAllRequest.pageSize?? 10,
  };

  if (getAllRequest.name) params.name = getAllRequest.name;
  if (getAllRequest.email) params.email = getAllRequest.email;
  if (getAllRequest.phone) params.phone = getAllRequest.phone;
  if (getAllRequest.gender) params.gender = getAllRequest.gender;

  return this.api.get<Card[]>('Card/GetAllCards', { params });
}

public ImportQrCode(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return this.api.post<boolean>('Card/ImportQrCode', formData);
}

public importFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return this.api.post<boolean>('Card/UploadFile', formData);
}

}
