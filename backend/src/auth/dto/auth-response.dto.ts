import { User } from '../../users/entities/user.entity';

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    photoUrl?: string;
    location: string;
    language: string;
  };

  static fromUser(user: User, token: string): AuthResponseDto {
    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
        location: user.location,
        language: user.language,
      },
    };
  }
}


