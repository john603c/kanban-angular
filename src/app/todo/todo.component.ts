import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ITask } from '../model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todoForm !: FormGroup;

  todo: ITask[] = [];

  inProgress: ITask[] = [];

  done: ITask[] = [];

  updateTaskIndex !: any;

  isEditEnabled : boolean = false;

  constructor(private fb : FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    //valida o formulario se o input de texto foi utilizado e ativa o botão
    this.todoForm = this.fb.group({
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
  }

  addTask(){
    this.todo.push({
      //add o conteudo da tarefa no fomrulario
      description: this.todoForm.value.description,

      //formata a data de inicio e fim da tarefa utilizando o Moment js
      startDate : moment(this.todoForm.value.startDate).format('DD/MM/YYYY'),
      endDate : moment(this.todoForm.value.endDate).format('DD/MM/YYYY'),
      done: false
    });
    //Ativa mensagem de tarefa add com sucesso
    this.toastr.success('Nova tarefa adiconada com sucesso!', 'Tarefa Adicionada');
    
    this.todoForm.reset();
  }

  //edita a tarefa escolhida
  onEdit(item:ITask, i:number){
    //add o conteudo do item clicado no formulario para edição
    this.todoForm.controls['description'].setValue(item.description);
    this.todoForm.controls['startDate'].setValue(item.startDate);
    this.todoForm.controls['endDate'].setValue(item.endDate);
    
    this.updateTaskIndex = i;
    this.isEditEnabled = true;
  }

  updateTask(){
    //cria uma variavel que tera o conteudo do item que sera editado
    let indexItem = this.todo[this.updateTaskIndex];

    //add o novo conteudo do formulario no item
    indexItem.description = this.todoForm.value.description;
    indexItem.startDate = moment(this.todoForm.value.startDate).format('DD/MM/YYYY');
    indexItem.endDate = moment(this.todoForm.value.endDate).format('DD/MM/YYYY');
    indexItem.done = false;

    //ativa msg de editada com sucesso
    this.toastr.info('Tarefa atualizada com sucesso!', 'Tarefa Atualizada');

    //reseta o formulario e as propriedades do item
    this.todoForm.reset();
    this.updateTaskIndex = undefined;
    this.isEditEnabled = false;

  }

  //Exclui o item clicado de cada coluna
  deleteTodoTask(i: number){
    this.todo.splice(i,1);

    //Ativa mensagem de tarefa add com sucesso
    this.toastr.success('Tarefa removida com sucesso!', 'Tarefa Removida');
  }
  deleteInProgressTask(i: number){
    this.inProgress.splice(i,1);

    //Ativa mensagem de tarefa add com sucesso
    this.toastr.success('Tarefa removida com sucesso!', 'Tarefa Removida');
  }
  deleteDoneTask(i: number){
    this.done.splice(i,1);

    //Ativa mensagem de tarefa add com sucesso
    this.toastr.success('Tarefa removida com sucesso!', 'Tarefa Removida');
  }

  //Efeito de drag & drop (mover item)
  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
