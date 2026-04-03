import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: number; id: number; email: string; phoneNbr: string; role: string; username: string }) {
        return {
            sub: payload.sub,
            id: payload.sub,
            email: payload.email,
            phoneNbr: payload.phoneNbr,
            role: payload.role,
            username: payload.username,
        };
    }
}
