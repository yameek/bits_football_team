import { Controller, Get, Put, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Setting } from '../entities/setting.entity';

class UpdateSettingDto {
  value: string;
}

class CreateSettingDto {
  key: string;
  value: string;
  description?: string;
}

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'Returns all system settings' })
  async findAll(): Promise<Setting[]> {
    return this.settingsService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get a specific setting by key' })
  @ApiParam({ name: 'key', description: 'Setting key', example: 'treasury_min_threshold' })
  @ApiResponse({ status: 200, description: 'Returns the setting' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async findOne(@Param('key') key: string): Promise<Setting> {
    return this.settingsService.findOne(key);
  }

  @Get(':key/value')
  @ApiOperation({ summary: 'Get setting value only' })
  @ApiParam({ name: 'key', description: 'Setting key', example: 'treasury_min_threshold' })
  @ApiResponse({ status: 200, description: 'Returns the setting value as string' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async getValue(@Param('key') key: string): Promise<{ value: string }> {
    const value = await this.settingsService.getValue(key);
    return { value };
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update a setting value' })
  @ApiParam({ name: 'key', description: 'Setting key', example: 'treasury_min_threshold' })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async update(
    @Param('key') key: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    return this.settingsService.update(key, updateSettingDto.value);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new setting' })
  @ApiResponse({ status: 201, description: 'Setting created successfully' })
  @ApiResponse({ status: 400, description: 'Setting already exists' })
  async create(@Body() createSettingDto: CreateSettingDto): Promise<Setting> {
    return this.settingsService.create(
      createSettingDto.key,
      createSettingDto.value,
      createSettingDto.description,
    );
  }

  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a setting' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  @ApiResponse({ status: 204, description: 'Setting deleted successfully' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async remove(@Param('key') key: string): Promise<void> {
    return this.settingsService.remove(key);
  }

  @Post('refresh-cache')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh settings cache' })
  @ApiResponse({ status: 200, description: 'Cache refreshed successfully' })
  async refreshCache(): Promise<{ message: string }> {
    await this.settingsService.refreshCache();
    return { message: 'Settings cache refreshed successfully' };
  }
}
