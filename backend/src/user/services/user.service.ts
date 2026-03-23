import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from '../dtos/requests/create.user.request.dto';
import {
  DUPLICATE_ENTITY_CODE,
  USER_CREATED_KO_CODE,
} from '../../constants/exceptions.codes.constants';
import {
  USER_ACTIVATED,
  USER_ALREADY_ACTIVATED,
  USER_CREATED_KO,
  USER_CREATED_OK,
  USER_DUPLICATE,
  USER_EMAIL_KO,
  USER_NOT_FOUND,
  USER_OTP_EXPIRED,
  USER_OTP_NOT_FOUND,
  USER_PASSWORD_KO,
  USER_PHONE_NBR_KO,
} from '../constants/user.constants';
import * as process from 'node:process';
import { SaveUserResponseDto } from '../dtos/responses/save.user.response.dto';
import { ActivateUserRequestDto } from '../dtos/requests/activate.user.request.dto';
import { ActivateUserResponseDto } from '../dtos/responses/activate.user.response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private logger = new Logger(UserService.name);
  private pwdHash: string = process.env.PASSWORD_HASH;
  private pwdSalt: number[] = JSON.parse(process.env.PASSWORD_SALT);
  private EXP_TOKEN_DAYS = parseInt(process.env.EXP_TOKEN_DAYS || '1');
  private EXP_OTP_MINUTES = parseInt(process.env.EXP_OTP_MINUTES || '15');

  encodePassword = (password: string) => {
    let indexHash = 0;
    let indexPswd = 0;
    let pswd = '';
    for (let index = 0; index < this.pwdSalt.length; index++) {
      const element = this.pwdSalt[index];
      if (element % 2 === 0) {
        pswd += this.pwdHash.substring(indexHash, indexHash + element);
        indexHash += element;
      } else {
        if (indexPswd > password.length) {
          break;
        }
        const end =
          indexPswd + element > password.length
            ? password.length
            : indexPswd + element;
        pswd += password.substring(indexPswd, end);
        indexPswd += element;
        if (end >= password.length) {
          break;
        }
      }
    }
    return pswd;
  };

  decodePassword = (passwordDto: string) => {
    // let indexHash = 0;
    // let indexPswd = 0;
    let pswd = '';
    // let pswdHash = '';
    let pswdDto = passwordDto;
    for (let index = 0; index < this.pwdSalt.length; index++) {
      const element = this.pwdSalt[index];
      if (element % 2 === 0) {
        // pswdHash += pswdDto.substring(0, element);
        pswdDto = pswdDto.substring(element, pswdDto.length);
        // indexHash += element;
      } else {
        let end = 0;
        // if (indexHash > pswdDto.length) {
        //   end = indexHash - pswdDto.length + 1;
        // } else if (indexHash == pswdDto.length) {
        //   end = 1;
        // } else if (indexHash > element) {
        //   end = indexHash - element;
        // } else {
        //   end = element;
        // }
        end = element;
        pswd += pswdDto.substring(0, end);
        if (end > pswdDto.length) {
          break;
        }
        pswdDto = pswdDto.substring(element, pswdDto.length);
        // indexPswd += element;
      }
    }
    return pswd;
  };

  async checkCreateUserDto(createUserRequestDto: CreateUserRequestDto) {
    if (
      !createUserRequestDto.password ||
      createUserRequestDto.password?.length < 8
    ) {
      throw new UnauthorizedException(USER_PASSWORD_KO);
    }

    if (!createUserRequestDto.phoneNbr && !createUserRequestDto.email) {
      if (!createUserRequestDto.phoneNbr) {
        throw new UnauthorizedException(USER_PHONE_NBR_KO);
      } else {
        throw new UnauthorizedException(USER_EMAIL_KO);
      }
    }
    let user: User[];
    if (createUserRequestDto.phoneNbr) {
      user = await this.findUserByPhoneNbr(createUserRequestDto.phoneNbr);
    } else {
      user = await this.findUserByCreteria(createUserRequestDto.email, 'email');
    }
    if (user && user.length > 1) {
      throw new HttpException(USER_DUPLICATE, DUPLICATE_ENTITY_CODE);
    }
  }

  async createUserOtp(createUserRequestDto: CreateUserRequestDto){
    await this.checkCreateUserDto(createUserRequestDto);
    return Math.random().toString(36).substring(2);
  }

  async createUser(createUserRequestDto: CreateUserRequestDto) {
    const otp = await this.createUserOtp(createUserRequestDto);
    const userEntity = new User();
    // userEntity.firstName = createUserRequestDto.firstName;
    // userEntity.lastName = createUserRequestDto.lastName;
    // userEntity.phoneNbr = createUserRequestDto.phoneNbr;
    // userEntity.address = createUserRequestDto.address;
    // userEntity.zipcode = createUserRequestDto.zipcode;
    // userEntity.country = createUserRequestDto.country;
    // userEntity.cardId = createUserRequestDto.cardId;
    // userEntity.passportId = createUserRequestDto.passportId;
    // userEntity.secondPhoneNbr = createUserRequestDto.secondPhoneNbr;
    // userEntity.city = createUserRequestDto.city;
    // userEntity.title = createUserRequestDto.title;
    // userEntity.email = createUserRequestDto.email;
    Object.assign(userEntity, createUserRequestDto);
    userEntity.roles = createUserRequestDto.roles.toString();
    const pswd = this.decodePassword(createUserRequestDto.password);
    userEntity.password = await this.hashPassword(pswd);
    const today = new Date();
    const token =
      (createUserRequestDto.phoneNbr || Math.random().toString(36)) +
      '_' +
      today.getTime();
    const newToken = await this.createToken(token);
    userEntity.token = await this.hashPassword(newToken);
    // Set expiration token to 1 day
    userEntity.tokenExpirationDate = new Date(
      today.getTime() + this.EXP_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    );
    // Set expiration OTP to 15 minutes
    userEntity.otp = otp;
    userEntity.otpExpirationDate = new Date(
      today.getTime() + this.EXP_OTP_MINUTES * 60 * 1000,
    );
    // User is just created but not activated
    userEntity.isActive = false;
    // Save the created user
    await this.saveUser(userEntity, USER_CREATED_OK, USER_CREATED_KO);
  }

  async saveUser(user: User, userStatusOk: string, userStatusKo: string) {
    const saveUserResponseDto = new SaveUserResponseDto();
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    try {
      const newUser: User = this.usersRepository.create(user);
      await this.usersRepository.save(newUser);
      saveUserResponseDto.message = userStatusOk;
      saveUserResponseDto.code = HttpStatus.CREATED;
      return saveUserResponseDto;
    } catch (error) {
      throw new HttpException(userStatusKo, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
        description: USER_CREATED_KO_CODE.toString(),
      });
    }
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }
  
  async findUserByPhoneNbr(phoneNbr: string): Promise<User[] | undefined> {
    // Fetch user by username from the database
    const users: User[] = await this.usersRepository.findBy({
      phoneNbr: phoneNbr,
    });
    if (users) {
      return users;
    } else {
      return null;
    }
  }

  async findUserByEmail(email: string): Promise<User[] | undefined> {
    // Fetch user by username from the database
    const users: User[] = await this.usersRepository.findBy({
      email: email,
    });
    if (users) {
      return users;
    } else {
      return null;
    }
  }

  async findUserByPhoneNbrWithUsernameAndCardId(
    phoneNbr: string,
    username: string,
    cardId: string,
  ): Promise<User[] | undefined> {
    // Fetch user by username from the database
    const userQery = this.usersRepository
      .createQueryBuilder('user')
      .where("CONCAT(user.firstname, '_', user.lastname) = :username", {
        username,
      });
    //Add the condition by phone number if it is given for the users
    if (phoneNbr) {
      userQery.andWhere('user.phoneNbr = :phoneNbr', {
        phoneNbr,
      });
    }
    //Add the condition by Card ID if it is given for the users
    if (cardId) {
      userQery.andWhere('user.cardId = :cardId', {
        cardId,
      });
    }
    const users: User[] = await userQery.getMany(); // Use getMany() if you expect multiple results

    if (users && users.length >= 1) {
      return users;
    } else {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(
    enteredPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  async createToken(token: string): Promise<string> {
    const saltRounds = 8;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(token, salt);
  }

  async compareTokens(
    enteredToken: string,
    hashedToken: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredToken, hashedToken);
  }

  async activateUserDb(user: User) {
    user.isActive = true;
    user.otpExpirationDate = null;
    await this.usersRepository.save(user);
    const activateUserResponseDto = new ActivateUserResponseDto();
    activateUserResponseDto.message = USER_ACTIVATED;
    activateUserResponseDto.code = HttpStatus.OK;
    activateUserResponseDto.error = null;
    return activateUserResponseDto;
  }

  async activateUser(activateUserRequestDto: ActivateUserRequestDto) {
    if (!activateUserRequestDto.phoneNbr && !activateUserRequestDto.email) {
      if (!activateUserRequestDto.phoneNbr) {
        throw new UnauthorizedException(USER_PHONE_NBR_KO);
      } else {
        throw new UnauthorizedException(USER_EMAIL_KO);
      }
    }
    let users: User[];
    if (activateUserRequestDto.phoneNbr) {
      users = await this.findUserByPhoneNbr(activateUserRequestDto.phoneNbr);
    } else {
      users = await this.findUserByCreteria(
        activateUserRequestDto.email,
        'email',
      );
    }
    if (!users || (users && users.length == 0)) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }
    if (users && users.length > 1) {
      throw new HttpException(USER_DUPLICATE, HttpStatus.UNAUTHORIZED);
    }
    const user = users[0];
    if (user.isActive) {
      throw new HttpException(USER_ALREADY_ACTIVATED, HttpStatus.UNAUTHORIZED);
    }
    if (!activateUserRequestDto.otp || user.otp != activateUserRequestDto.otp) {
      throw new HttpException(USER_OTP_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }
    if (new Date(user.otpExpirationDate) < new Date()) {
      throw new HttpException(USER_OTP_EXPIRED, HttpStatus.UNAUTHORIZED);
    }
    return await this.activateUserDb(user);
  }

  private async findUserByCreteria(value: string, creteria: string) {
    // Fetch user by username from the database
    const users: User[] = await this.usersRepository.findBy({
      [creteria]: value,
    });
    if (users) {
      return users;
    } else {
      return null;
    }
  }
}
