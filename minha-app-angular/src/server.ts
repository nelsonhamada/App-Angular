import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

// Dados mockados de pacientes
const pacientesMock = [
  {
    id: 1,
    nomePaciente: "Maria Silva Santos",
    planoDeSaude: "Unimed"
  },
  {
    id: 2,
    nomePaciente: "João Carlos Oliveira",
    planoDeSaude: "Bradesco Saúde"
  },
  {
    id: 3,
    nomePaciente: "Ana Paula Ferreira",
    planoDeSaude: "SulAmérica"
  },
  {
    id: 4,
    nomePaciente: "Pedro Henrique Costa",
    planoDeSaude: "Amil"
  }
];

// Endpoint para listar pacientes
app.get('/api/pacientes', (req, res) => {
  try {
    console.log('Buscando lista de pacientes...');
    
    // Simula delay de rede (opcional)
    setTimeout(() => {
      res.json({
        success: true,
        data: pacientesMock,
        total: pacientesMock.length,
        message: 'Pacientes encontrados com sucesso'
      });
    }, 500);
    
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para buscar paciente por ID
app.get('/api/pacientes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const paciente = pacientesMock.find(p => p.id === id);
    
    if (!paciente) {
      res.status(404).json({
        success: false,
        message: 'Paciente não encontrado'
      });
      return;
    }
    
    console.log(`Buscando paciente ID: ${id}`);
    
    res.json({
      success: true,
      data: paciente,
      message: 'Paciente encontrado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
