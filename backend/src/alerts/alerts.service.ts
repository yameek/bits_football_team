import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from '../entities/alert.entity';
import { CreateAlertDto } from './dto/alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  /**
   * Create a new alert
   */
  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    const alert = this.alertRepository.create({
      alert_type: createAlertDto.alert_type,
      member_id: createAlertDto.member_id,
      message: createAlertDto.message,
      is_resolved: false,
      triggered_at: new Date(),
    });
    return this.alertRepository.save(alert);
  }

  /**
   * Get all alerts with optional filtering
   */
  async findAll(options?: {
    isResolved?: boolean;
    alertType?: string;
  }): Promise<Alert[]> {
    const query = this.alertRepository.createQueryBuilder('alert')
      .leftJoinAndSelect('alert.member', 'member')
      .orderBy('alert.triggered_at', 'DESC');

    if (options?.isResolved !== undefined) {
      query.andWhere('alert.is_resolved = :isResolved', { isResolved: options.isResolved });
    }

    if (options?.alertType) {
      query.andWhere('alert.alert_type = :alertType', { alertType: options.alertType });
    }

    return query.getMany();
  }

  /**
   * Get all unresolved alerts
   */
  async findUnresolved(): Promise<Alert[]> {
    return this.findAll({ isResolved: false });
  }

  /**
   * Get alerts for a specific member
   */
  async findByMember(memberId: number): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { member_id: memberId },
      order: { triggered_at: 'DESC' },
    });
  }

  /**
   * Get a single alert by ID
   */
  async findOne(id: number): Promise<Alert> {
    const alert = await this.alertRepository.findOne({
      where: { id },
      relations: ['member'],
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  /**
   * Resolve an alert
   */
  async resolve(id: number, notes?: string): Promise<Alert> {
    const alert = await this.findOne(id);

    if (alert.is_resolved) {
      throw new Error('Alert is already resolved');
    }

    alert.is_resolved = true;
    alert.resolved_at = new Date();

    // If notes provided, append to message
    if (notes) {
      alert.message = `${alert.message}\n\nResolution: ${notes}`;
    }

    return this.alertRepository.save(alert);
  }

  /**
   * Delete an alert
   */
  async remove(id: number): Promise<void> {
    const alert = await this.findOne(id);
    await this.alertRepository.remove(alert);
  }

  /**
   * Get alert statistics
   */
  async getStats(): Promise<{
    total: number;
    unresolved: number;
    byType: Record<string, number>;
  }> {
    const alerts = await this.alertRepository.find();

    const stats = {
      total: alerts.length,
      unresolved: alerts.filter(a => !a.is_resolved).length,
      byType: {} as Record<string, number>,
    };

    // Count by type
    alerts.forEach(alert => {
      const type = alert.alert_type;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }
}
