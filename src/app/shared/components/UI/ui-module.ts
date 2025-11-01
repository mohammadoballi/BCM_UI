import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from './button/button';
import { Table } from './table/table';
import {Input} from './input/input';


@NgModule({
  declarations: [Button, Table, Input],
  imports: [
    CommonModule
  ]
})
export class UIModule { }
