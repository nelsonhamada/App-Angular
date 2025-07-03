import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Paciente {
  id: number;
  nomePaciente: string;
  planoDeSaude: string;
}

interface ApiResponse {
  success: boolean;
  data: Paciente[];
  total: number;
  message: string;
}

@Component({
  selector: 'app-pacientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  carregando = false;
  erro = '';
  searchId = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.buscarPacientes();
  }

  buscarPacientes() {
    this.carregando = true;
    this.erro = '';
    
    this.http.get<ApiResponse>('/api/pacientes').subscribe({
      next: (response) => {
        if (response.success) {
          this.pacientes = response.data;
        } else {
          this.erro = response.message;
        }
        this.carregando = false;
      },
      error: (error) => {
        this.erro = 'Erro ao buscar pacientes: ' + error.message;
        this.carregando = false;
        console.error('Erro:', error);
      }
    });
  }

  buscarPacientePorId() {
    if (!this.searchId) {
      this.buscarPacientes();
      return;
    }

    this.carregando = true;
    this.erro = '';
    
    this.http.get<{success: boolean, data: Paciente, message: string}>(`/api/pacientes/${this.searchId}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.pacientes = [response.data];
        } else {
          this.pacientes = [];
          this.erro = response.message;
        }
        this.carregando = false;
      },
      error: (error) => {
        this.pacientes = [];
        this.erro = 'Erro ao buscar paciente: ' + error.message;
        this.carregando = false;
        console.error('Erro:', error);
      }
    });
  }

  limparBusca() {
    this.searchId = '';
    this.buscarPacientes();
  }

  trackByPacienteId(index: number, paciente: Paciente): number {
    return paciente.id;
  }
}
