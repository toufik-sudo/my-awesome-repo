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

    async validate(payload: { sub: number; id: number; email: string; phoneNbr: string; roles: any; username: string }) {
        // Whatever you return here becomes req.user
        return {
            sub: payload.sub,         // ← this is the standard JWT subject claim, often used for user ID   
            id: payload.sub,        // ← this is what req.user.id reads
            email: payload.email,
            phoneNbr: payload.phoneNbr,
            roles: payload.roles,
            username: payload.username, // ← for convenience in payload, not used in validation but can be accessed as req.user.username
        };
    }
}
