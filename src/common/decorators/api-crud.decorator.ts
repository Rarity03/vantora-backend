import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

interface IApiCrudOptions {
  entity: Type<any>;
  entityName: string;
  entityNamePlural?: string;
  example?: {
    findOne: object;
    findAll: object[];
  };
  createDto?: Type<any>;
  updateDto?: Type<any>;
  customMessages?: {
    summary?: string;
  };
}

export function ApiCrud(options: IApiCrudOptions) {
  const { entity, entityName, entityNamePlural = `${entityName}s` } = options;

  const ApiFindAll = () =>
    applyDecorators(
      ApiBearerAuth('access-token'),
      ApiOperation({ summary: `Obtener la lista de ${entityNamePlural}` }),
      ApiOkResponse({
        description: `Lista de ${entityNamePlural} obtenida exitosamente.`,
        type: [entity],
        schema: {
          example: {
            code: 200,
            status: 'OK',
            message: 'Success',
            timestamp: new Date().toISOString(),
            data: options.example?.findAll,
          },
        },
      }),
    );

  const ApiFindOne = (params?: { summary?: string; paramName?: string }) =>
    applyDecorators(
      ApiOperation({ summary: params?.summary ?? `Obtener un ${entityName} por su ID` }),
      ApiBearerAuth('access-token'),
      ApiParam({
        name: params?.paramName ?? 'id',
        description: `El UUID del ${entityName}`,
        type: 'string',
      }),
      ApiOkResponse({
        description: `${entityName} encontrado exitosamente.`,
        type: entity,
        schema: {
          example: {
            code: 200,
            status: 'OK',
            message: 'Success',
            timestamp: new Date().toISOString(),
            data: options.example?.findOne,
          },
        },
      }),
      ApiResponse({ status: 404, description: `${entityName} no encontrado.` }),
    );

  const ApiCreate = () =>
    applyDecorators(
      ApiOperation({ summary: `Crear un nuevo ${entityName}` }),
      ApiBearerAuth('access-token'),
      ApiCreatedResponse({
        description: `El ${entityName} ha sido creado exitosamente.`,
        type: entity,
        schema: {
          example: {
            code: 201,
            status: 'Created',
            message: 'Success',
            timestamp: new Date().toISOString(),
            data: options.example?.findOne,
          }
        }
      }),
      ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' }),
    );

  const ApiUpdate = (params?: { summary?: string; paramName?: string }) =>
    applyDecorators(
      ApiOperation({ summary: params?.summary ?? `Actualizar un ${entityName} existente` }),
      ApiBearerAuth('access-token'),
      ApiParam({
        name: params?.paramName ?? 'id',
        description: `El UUID del ${entityName}`,
        type: 'string',
      }),
      ApiOkResponse({
        description: `${entityName} actualizado exitosamente.`,
        type: entity,
        schema: {
          example: {
            code: 201,
            status: 'Updated',
            message: 'Success',
            timestamp: new Date().toISOString(),
            data: options.example?.findOne,
          }
        }
      }),
      ApiResponse({ status: 404, description: `${entityName} no encontrado.` }),
    );

  const ApiRemove = (params?: { summary?: string; paramName?: string }) =>
    applyDecorators(
      ApiOperation({ summary: params?.summary ?? `Eliminar un ${entityName}` }),
      ApiBearerAuth('access-token'),
      ApiParam({
        name: params?.paramName ?? 'id',
        description: `El UUID del ${entityName}`,
        type: 'string',
      }),
      ApiResponse({
        status: 204,
        description: `${entityName} eliminado exitosamente.`,
      }),
      ApiResponse({ status: 404, description: `${entityName} no encontrado.` }),
    );

  return {
    ApiFindAll,
    ApiFindOne,
    ApiCreate,
    ApiUpdate,
    ApiRemove,
  };
}