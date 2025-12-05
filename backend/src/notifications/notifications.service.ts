import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPushToken } from '../users/entities/user-push-token.entity';
import { User } from '../users/entities/user.entity';

/**
 * Služba pro správu push notifikací
 * V produkci použije Expo Push Notification API
 */
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(UserPushToken)
    private pushTokensRepository: Repository<UserPushToken>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Uloží/aktualizuje push token pro uživatele
   */
  async savePushToken(
    userId: string,
    deviceToken: string,
    platform: 'ios' | 'android' | 'web',
  ): Promise<void> {
    const existing = await this.pushTokensRepository.findOne({
      where: { userId, deviceToken },
    });

    if (existing) {
      existing.updatedAt = new Date();
      await this.pushTokensRepository.save(existing);
    } else {
      await this.pushTokensRepository.save({
        userId,
        deviceToken,
        platform,
      });
    }
  }

  /**
   * Získá všechny push tokeny pro uživatele
   */
  async getPushTokens(userId: string): Promise<UserPushToken[]> {
    return this.pushTokensRepository.find({
      where: { userId },
    });
  }

  /**
   * Odešle notifikaci uživateli
   * TODO: Integrace s Expo Push Notification API
   */
  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    const tokens = await this.getPushTokens(userId);
    
    // TODO: Implementovat odeslání přes Expo Push Notification API
    // Příklad:
    // const messages = tokens.map(token => ({
    //   to: token.deviceToken,
    //   sound: 'default',
    //   title,
    //   body,
    //   data,
    // }));
    // await fetch('https://exp.host/--/api/v2/push/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
    //   },
    //   body: JSON.stringify(messages),
    // });

    console.log(`[Notifications] Would send to user ${userId}:`, { title, body, data });
  }

  /**
   * Notifikace při potvrzení účasti na zápase
   */
  async notifyEventJoined(userId: string, eventTitle: string): Promise<void> {
    await this.sendPushNotification(
      userId,
      'Přihlášení potvrzeno',
      `Byl jsi potvrzen na zápas: ${eventTitle}`,
      { type: 'event_joined' },
    );
  }

  /**
   * Notifikace při přesunu z čekací listiny
   */
  async notifyPromotedFromWaiting(userId: string, eventTitle: string): Promise<void> {
    await this.sendPushNotification(
      userId,
      'Přesun z čekací listiny',
      `Byl jsi přesunut do účastníků zápasu: ${eventTitle}`,
      { type: 'promoted_from_waiting' },
    );
  }

  /**
   * Připomínka 2 hodiny před začátkem zápasu
   */
  async notifyEventReminder(userId: string, eventTitle: string, startTime: string): Promise<void> {
    await this.sendPushNotification(
      userId,
      'Připomínka zápasu',
      `Zápas "${eventTitle}" začíná za 2 hodiny (${startTime})`,
      { type: 'event_reminder' },
    );
  }
}


