
import { CreateUserDto } from "../dtos/create-user-dto";
import { UserCredentials } from "../entities/user-credentials.entity";
import { User } from "../entities/user.entity";

export abstract class UsersRepository {
    abstract createUser(dto: CreateUserDto): Promise<User>;

    abstract findUserByEmail(email: string): Promise<User | null>;

    abstract findCredentialsByEmail(
        email: string,
    ): Promise<UserCredentials | null>;

    abstract findAllUsers(): Promise<User[]>;

    abstract findOne(id: string, relations?: string[]): Promise<User | null>;
}