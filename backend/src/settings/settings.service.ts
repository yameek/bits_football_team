import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';

@Injectable()
export class SettingsService {
  // In-memory cache for settings
  private settingsCache: Map<string, string> = new Map();
  private cacheInitialized = false;

  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  /**
   * Initialize cache from database
   */
  private async initializeCache(): Promise<void> {
    if (this.cacheInitialized) return;
    
    const settings = await this.settingRepository.find();
    settings.forEach(setting => {
      this.settingsCache.set(setting.key, setting.value);
    });
    this.cacheInitialized = true;
  }

  /**
   * Get all settings
   */
  async findAll(): Promise<Setting[]> {
    return this.settingRepository.find({
      order: { key: 'ASC' }
    });
  }

  /**
   * Get a specific setting by key
   */
  async findOne(key: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return setting;
  }

  /**
   * Get setting value by key (from cache)
   */
  async getValue(key: string): Promise<string> {
    await this.initializeCache();
    
    const value = this.settingsCache.get(key);
    if (value === undefined) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return value;
  }

  /**
   * Get setting value as number
   */
  async getNumberValue(key: string): Promise<number> {
    const value = await this.getValue(key);
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new Error(`Setting "${key}" is not a valid number`);
    }
    return num;
  }

  /**
   * Get setting value as boolean
   */
  async getBooleanValue(key: string): Promise<boolean> {
    const value = await this.getValue(key);
    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * Update a setting value
   */
  async update(key: string, value: string): Promise<Setting> {
    const setting = await this.findOne(key);
    setting.value = value;
    setting.updated_at = new Date();
    
    const updated = await this.settingRepository.save(setting);
    
    // Update cache
    this.settingsCache.set(key, value);
    
    return updated;
  }

  /**
   * Create a new setting
   */
  async create(key: string, value: string, description?: string): Promise<Setting> {
    const setting = this.settingRepository.create({
      key,
      value,
      description
    });
    
    const created = await this.settingRepository.save(setting);
    
    // Update cache
    this.settingsCache.set(key, value);
    
    return created;
  }

  /**
   * Delete a setting
   */
  async remove(key: string): Promise<void> {
    const setting = await this.findOne(key);
    await this.settingRepository.remove(setting);
    
    // Remove from cache
    this.settingsCache.delete(key);
  }

  /**
   * Refresh cache from database
   */
  async refreshCache(): Promise<void> {
    this.cacheInitialized = false;
    this.settingsCache.clear();
    await this.initializeCache();
  }
}
