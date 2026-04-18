import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsOptional()
    @IsString()
    name?: string | null;
};

export class UserDto {
    @IsString()
    @IsUUID()
    id!: string;

    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsOptional()
    @IsString()
    name?: string | null;

    @IsString()
    createdAt!: Date;

    @IsString()
    updatedAt!: Date;
};

export class UserResponseDto {
    @IsString()
    @IsUUID()
    id!: string;

    @IsEmail()
    email!: string;

    @IsOptional()
    @IsString()
    name?: string | null;
};

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
};