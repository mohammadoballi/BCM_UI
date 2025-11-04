import { Component } from '@angular/core';
import { UI_COMPONENTS } from '../../shared/components/UI/ui-module';
import { CardService } from '../../core/services/card.service';
import { inject } from '@angular/core';
import { getAllRequest, Card, CardCreateDTO, CardUpdateDTO } from '../../core/models/card.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardDetailsDialog } from '../../shared/components/UI/card-details-dialog/card-details-dialog';
import { CardFormDialog } from '../../shared/components/UI/card-form-dialog/card-form-dialog';
import { ImportDialog } from '../../shared/components/UI/import-dialog/import-dialog';
import { QRScannerDialog } from '../../shared/components/UI/qr-scanner-dialog/qr-scanner-dialog';
import { getImageUrl } from '../../core/utils/image.utils';
import { genderToNumber, numberToGender } from '../../core/utils/gender.utils';
import { SpinnerService } from '../../core/services/spinner.service';
import { AlertService } from '../../core/services/alert.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { formatDateToYYYYMMDD } from '../../core/utils/date.utils';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [...UI_COMPONENTS, MatDialogModule, MatButtonModule, MatIconModule, MatNativeDateModule, MatDatepickerModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})


export class CardManager {


    getAllRequest = new getAllRequest();
    cardservice = inject(CardService);
    dialog = inject(MatDialog);
    spinnerService = inject(SpinnerService);
    alertService = inject(AlertService);
    cards: Card[] = [];
    // pagination state
    pageIndex = 1;
    pageSize = 10;
    total = 0;
    actionButtons = [
      { key: 'view', label: 'View' },
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' },
    ];

    genderOptions = [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
    ];

    // table columns
    columns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'gender', label: 'Gender' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'birthDate', label: 'Birth Date' },
      { key: 'address', label: 'Address' },
      { key: 'image', label: 'Image' },
    ];
    ngOnInit(): void {
        // initialize pagination on first load
        this.getAllRequest.pageIndex = this.pageIndex;
        this.getAllRequest.pageSize = this.pageSize;
        this.getAllCards();
    }

    getAllCards(){
        this.getAllRequest.pageIndex = this.pageIndex;
        this.getAllRequest.pageSize = this.pageSize;
        
        this.spinnerService.show();
        this.cardservice.GetAllCards(this.getAllRequest).subscribe({
          next: (res) => {
            if(res.isSuccess){
              if(res.data != null){
                this.cards = res.data.map((card: any) => {
                  card.image = getImageUrl(card.image);
                  card.birthDate = formatDateToYYYYMMDD(new Date(card.birthDate));
                  return card;
                });
              }else{
                this.cards = [];
              }

              const p: any = res.pagination;
              if (p) {
                this.total = p.total ?? this.total;
                this.pageIndex = p.index ?? this.pageIndex;
                this.pageSize = p.size ?? this.pageSize;
              }
            }
            this.spinnerService.hide();
          },
          error: () => {
            this.spinnerService.hide();
          }
        });
    }

    onPageChange(newIndex: number){
      this.pageIndex = newIndex;
      this.getAllCards();
    }

    onPageSizeChange(newSize: number){
      this.pageSize = newSize;
      this.pageIndex = 1; // reset to first page when changing page size
      this.getAllCards();
    }

    onFilterChange(field: keyof getAllRequest, value: string){
      (this.getAllRequest as any)[field] = value;
      this.pageIndex = 1; // reset to first page on filter change
      this.getAllCards();
    }

    onAction(e: { action: string; row: any }){
      if (e.action === 'view') {
        this.viewCard(e.row.id);
      }
      if (e.action === 'edit') {
        this.openEditDialog(e.row.id);
      }
      if (e.action === 'delete') {
        this.spinnerService.show();
        this.cardservice.deleteCard(e.row.id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.alertService.showSuccess(res.message_en || 'Card deleted successfully');
              this.getAllCards();
            } else {
              this.alertService.showError(res.message_en || 'Failed to delete card');
            }
          },
          error: (err) => {
            console.error('Error deleting card:', err);
            this.alertService.showError('An error occurred while deleting the card');
          },
          complete: () => {
            this.spinnerService.hide();
          }
        });
      }
    }

    openCreateDialog(): void {
      const dialogRef = this.dialog.open(CardFormDialog, {
        width: 'auto',
        maxWidth: '90vw',
        data: { mode: 'create' },
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const createDto: CardCreateDTO = {
            name: result.name,
            gender: result.gender,
            email: result.email,
            phone: result.phone,
            address: result.address,
            birthDate: new Date(result.birthDate),
            image: result.imageFile
          };

          this.spinnerService.show();
          this.cardservice.createCard(createDto).subscribe({
            next: (res) => {
              if (res.isSuccess) {
                this.alertService.showSuccess(res.message_en || 'Card created successfully');
                this.getAllCards();
              } else {
                this.alertService.showError(res.message_en || 'Failed to create card');
              }
            },
            error: (err) => {
              console.error('Error creating card:', err);
              this.alertService.showError('An error occurred while creating the card');
            },
            complete: () => {
              this.spinnerService.hide();
            }
          });
        }
      });
    }

    openEditDialog(id: string): void {
      this.spinnerService.show();
      this.cardservice.getCard(Number(id)).subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            res.data.image = getImageUrl(res.data.image);
            res.data.gender = genderToNumber(res.data.gender as string);
            if (res.data.birthDate) {
              res.data.birthDate = new Date(res.data.birthDate);
            }
          
            const dialogRef = this.dialog.open(CardFormDialog, {
              width: 'auto',
              maxWidth: '90vw',
              data: { card: res.data, mode: 'edit' },
              panelClass: 'custom-dialog-container'
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                const updateDto: CardUpdateDTO = {
                  id: id,
                  name: result.name,
                  gender: result.gender,
                  email: result.email,
                  phone: result.phone,
                  address: result.address,
                  birthDate: result.birthDate ? new Date(result.birthDate) : null,
                  image: result.imageFile
                };

                this.spinnerService.show();
                this.cardservice.updateCard(updateDto).subscribe({
                  next: (res) => {
                    if (res.isSuccess) {
                      this.alertService.showSuccess(res.message_en || 'Card updated successfully');
                      this.getAllCards();
                    } else {
                      this.alertService.showError(res.message_en || 'Failed to update card');
                    }
                  },
                  error: (err) => {
                    console.error('Error updating card:', err);
                    this.alertService.showError('An error occurred while updating the card');
                  },
                  complete: () => {
                    this.spinnerService.hide();
                  }
                });
              }
            });
          }
        },
        error: (err) => {
          console.error('Error fetching card:', err);
          this.alertService.showError('An error occurred while fetching the card');
        },
        complete: () => {
          this.spinnerService.hide();
        }
      });
  
    }

    openImportDialog(): void {
      const dialogRef = this.dialog.open(ImportDialog, {
        width: 'auto',
        maxWidth: '90vw',
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAllCards();
        }
      });
    }

    openQRScannerDialog(): void {
      const dialogRef = this.dialog.open(QRScannerDialog, {
        width: 'auto',
        maxWidth: '90vw',
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAllCards();
        }
      });
    }

    viewCard(id: string) {
      this.spinnerService.show();
      this.cardservice.getCard(Number(id)).subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            res.data.image = getImageUrl(res.data.image);
            res.data.gender = typeof res.data.gender === "number" ? numberToGender(res.data.gender) : res.data.gender;
            this.dialog.open(CardDetailsDialog, {
              width: 'auto',
              maxWidth: '90vw',
              data: { card: res.data },
              panelClass: 'custom-dialog-container'
            });
          }
        },
        error: (err) => {
          console.error('Error fetching card:', err);
          this.alertService.showError('An error occurred while fetching the card');
        },
        complete: () => {
          this.spinnerService.hide();
        }
      });
    }
}
