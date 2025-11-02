import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@ApiTags('fields')
@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new field/location' })
  @ApiResponse({
    status: 201,
    description: 'Field successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(createFieldDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fields' })
  @ApiResponse({
    status: 200,
    description: 'List of all fields',
  })
  findAll() {
    return this.fieldsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get field by ID' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({
    status: 200,
    description: 'Field details',
  })
  @ApiResponse({ status: 404, description: 'Field not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fieldsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update field' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({
    status: 200,
    description: 'Field successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Field not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    return this.fieldsService.update(id, updateFieldDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete field' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({
    status: 200,
    description: 'Field successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Field not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fieldsService.remove(id);
  }
}
