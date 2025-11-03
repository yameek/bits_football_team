import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from '../entities/field.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
  ) {}

  async create(createFieldDto: CreateFieldDto): Promise<Field> {
    const field = this.fieldsRepository.create({
      name: createFieldDto.name,
      address: createFieldDto.address,
      google_map_link: createFieldDto.googleMapLink,
      latitude: createFieldDto.latitude,
      longitude: createFieldDto.longitude,
    });
    return await this.fieldsRepository.save(field);
  }

  async findAll(): Promise<Field[]> {
    return await this.fieldsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Field> {
    const field = await this.fieldsRepository.findOne({ where: { id } });
    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }
    return field;
  }

  async update(id: number, updateFieldDto: UpdateFieldDto): Promise<Field> {
    const field = await this.findOne(id);
    
    if (updateFieldDto.name !== undefined) field.name = updateFieldDto.name;
    if (updateFieldDto.address !== undefined) field.address = updateFieldDto.address;
    if (updateFieldDto.googleMapLink !== undefined) field.google_map_link = updateFieldDto.googleMapLink;
    if (updateFieldDto.latitude !== undefined) field.latitude = updateFieldDto.latitude;
    if (updateFieldDto.longitude !== undefined) field.longitude = updateFieldDto.longitude;
    
    return await this.fieldsRepository.save(field);
  }

  async remove(id: number): Promise<{ message: string }> {
    const field = await this.findOne(id);
    await this.fieldsRepository.remove(field);
    return { message: `Field ${id} deleted successfully` };
  }
}
